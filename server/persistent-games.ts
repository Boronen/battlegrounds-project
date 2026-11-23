import { randomUUID } from "node:crypto";
import type { Server, Socket } from "socket.io";
import type { Character, Command } from "../shared/types";
import { withCatalog } from "../shared/catalog";
import { RULES } from "../shared/rules";
import { Session } from "./session";

interface Bootstrap {
  id: number;
  seed: number;
  members: { id: number; name: string }[];
  catalog: { definition: Character }[];
}

async function internal<T>(path: string, body?: unknown): Promise<T> {
  const url = new URL(
    "/internal/" + path,
    process.env.LARAVEL_URL || "http://127.0.0.1:8000",
  );
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: "Bearer " + process.env.GAME_SERVER_SECRET,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok)
    throw Error("A játékszerver kérése sikertelen (" + response.status + ").");
  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}

class OnlineMatch {
  readonly cards: Character[];
  readonly session: Session;
  readonly sockets = new Map<Socket, number>();
  readonly finishedCombat = new Set<number>();
  phaseSince = Date.now();

  constructor(readonly data: Bootstrap) {
    this.cards = data.catalog.map((row) => row.definition);
    this.session = withCatalog(
      this.cards,
      () =>
        new Session(
          data.seed,
          "timed",
          data.members.map((member) => member.name),
        ),
    );
    const match = this.session.match;
    match.id = String(data.id);
  }

  broadcast() {
    for (const [socket, index] of this.sockets) {
      socket.emit(
        "snapshot",
        this.session.snapshot(this.session.match.players[index].id),
      );
    }
  }

  update(operation: () => void) {
    const match = this.session.match;
    const previous = match.phase;
    withCatalog(this.cards, operation);
    if (previous !== match.phase) {
      this.phaseSince = Date.now();
      this.finishedCombat.clear();
    }
    this.broadcast();
  }

  tick() {
    const { match, deadline } = this.session;
    const elapsed = Date.now() - this.phaseSince;
    const alive = match.players.filter((p) => p.hp > 0);
    const mayAdvance =
      (match.phase === "hero" && elapsed >= 60000) ||
      (match.phase === "recruit" &&
        (alive.every((p) => p.ready) ||
          (deadline !== null && Date.now() >= deadline))) ||
      (match.phase === "combat" &&
        (elapsed >= 60000 ||
          alive.every((p) =>
            this.finishedCombat.has(match.players.indexOf(p)),
          )));
    if (mayAdvance) this.update(() => this.session.advance());
  }
}

export function attachPersistentGames(io: Server) {
  const namespace = io.of("/matches");
  const instance = randomUUID();
  const games = new Map<number, OnlineMatch>();
  let syncing = false;
  let closed = false;
  async function sync() {
    if (syncing || closed || !process.env.GAME_SERVER_SECRET) return;
    syncing = true;
    try {
      const { ids } = await internal<{ ids: number[] }>("matches/claim", {
        instance,
      });
      if (closed) return;
      for (const [id, game] of games) {
        if (!ids.includes(id)) {
          for (const socket of game.sockets.keys()) {
            socket.emit("matchClosed");
            socket.disconnect();
          }
          games.delete(id);
        }
      }
      for (const id of ids) {
        const path = "matches/" + id;
        if (!games.has(id))
          games.set(
            id,
            new OnlineMatch(await internal<Bootstrap>(path + "/bootstrap")),
          );
        const game = games.get(id)!;
        const state = await internal<{ status: string; suspended: number[] }>(
          path + "/heartbeat",
          {},
        );
        for (const [socket, index] of game.sockets) {
          if (state.suspended.includes(game.data.members[index].id)) {
            socket.emit("matchClosed");
            socket.disconnect();
          }
        }
        if (
          state.status === "running" &&
          game.session.match.phase === "finished"
        ) {
          const placements = game.session.match.players.map((p, i) => ({
            userId: game.data.members[i].id,
            place: p.place,
          }));
          await internal(path + "/result", { ruleset: RULES.id, placements });
          for (const socket of game.sockets.keys())
            socket.emit("matchSaved", id);
        }
      }
    } catch (error) {
      if (!closed)
        console.error("Meccsek szinkronizálása:", (error as Error).message);
    } finally {
      syncing = false;
    }
  }

  namespace.use(async (socket, next) => {
    try {
      const identity = await internal<{ gameId: number; userId: number }>(
        "tickets/redeem",
        { ticket: socket.handshake.auth.ticket },
      );
      const game = games.get(identity.gameId);
      const index =
        game?.data.members.findIndex((m) => m.id === identity.userId) ?? -1;
      if (!game || index < 0) throw Error("A mérkőzés még nem elérhető.");
      socket.data.game = game;
      socket.data.index = index;
      next();
    } catch (e) {
      next(new Error((e as Error).message));
    }
  });
  namespace.on("connection", (socket) => {
    const game: OnlineMatch = socket.data.game;
    const index: number = socket.data.index;
    const player = game.session.match.players[index];
    game.sockets.set(socket, index);
    socket.emit("catalog", game.cards);
    game.broadcast();
    socket.on("command", async (cmd: Command, ack) => {
      if (typeof ack !== "function") return;
      try {
        const state = await internal<{ status: string; suspended: number[] }>(
          "matches/" + game.data.id + "/heartbeat",
          {},
        );
        if (
          !socket.connected ||
          state.status !== "running" ||
          state.suspended.includes(game.data.members[index].id)
        )
          throw Error();
        game.update(() => ack(game.session.command(cmd, player.id, true)));
        game.tick();
      } catch {
        ack({ ok: false, message: "A művelet jelenleg nem engedélyezett." });
      }
    });
    socket.on("control", (control, ack) => {
      if (typeof ack !== "function") return;
      if (control !== "finishCombat" || game.session.match.phase !== "combat")
        return ack({ ok: false });
      game.finishedCombat.add(index);
      game.tick();
      ack({ ok: true });
    });
    socket.on("disconnect", () => game.sockets.delete(socket));
  });
  void sync();
  const poll = setInterval(() => void sync(), 2000);
  const ticker = setInterval(() => {
    for (const game of games.values()) game.tick();
  }, 200);
  return () => {
    closed = true;
    clearInterval(poll);
    clearInterval(ticker);
  };
}
