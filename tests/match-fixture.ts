import express from "express";
import { once } from "node:events";
import { io } from "socket.io-client";
import type { AddressInfo } from "node:net";
import { CHARACTERS } from "../shared/catalog";
import type { Action, Snapshot } from "../shared/types";
import { createApp } from "../server/index";

export const delay = (ms = 40) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
export async function fixture() {
  const oldUrl = process.env.LARAVEL_URL,
    oldSecret = process.env.GAME_SERVER_SECRET;
  const api = express();
  api.use(express.json());
  const used = new Set<string>(),
    blocked = new Set<number>();
  api.post("/internal/matches/claim", (_, res) => res.json({ ids: [1] }));
  api.get("/internal/matches/1/bootstrap", (_, res) =>
    res.json({
      id: 1,
      seed: 62,
      members: [
        { id: 1, name: "Host" },
        { id: 2, name: "Guest" },
      ],
      catalog: CHARACTERS.map((definition) => ({ definition })),
    }),
  );
  api.post("/internal/tickets/redeem", (req, res) => {
    const ticket = String(req.body.ticket),
      userId = Number(ticket.split("-")[0]);
    if (used.has(ticket) || ![1, 2].includes(userId) || blocked.has(userId)) {
      res.sendStatus(403);
      return;
    }
    used.add(ticket);
    res.json({ gameId: 1, userId });
  });
  api.post("/internal/matches/1/heartbeat", (_, res) =>
    res.json({ status: "running", suspended: [...blocked] }),
  );
  const backend = api.listen(0, "127.0.0.1");
  await once(backend, "listening");
  process.env.LARAVEL_URL =
    "http://127.0.0.1:" + (backend.address() as AddressInfo).port;
  process.env.GAME_SERVER_SECRET = "fixture";
  const server = await createApp(true);
  server.http.listen(0, "127.0.0.1");
  await once(server.http, "listening");
  const url =
    "http://127.0.0.1:" +
    (server.http.address() as AddressInfo).port +
    "/matches";
  const sockets: ReturnType<typeof io>[] = [];
  async function seat(user: number, ticket = user + "-" + crypto.randomUUID()) {
    const socket = io(url, {
      auth: { ticket },
      autoConnect: false,
      reconnection: false,
    });
    sockets.push(socket);
    let state: Snapshot;
    socket.on("snapshot", (s) => (state = s));
    const snapshot = new Promise<void>((resolve, reject) => {
      socket.once("snapshot", () => resolve());
      socket.once("connect_error", reject);
    });
    socket.connect();
    await snapshot;
    return {
      socket,
      get state() {
        return state;
      },
      async command(action: Action) {
        const reply = await socket
          .timeout(3000)
          .emitWithAck("command", {
            commandId: crypto.randomUUID(),
            expectedVersion: state.version,
            action,
          });
        await delay();
        return reply;
      },
    };
  }
  await delay(150);
  return {
    seat,
    blocked,
    async close() {
      sockets.forEach((s) => s.disconnect());
      await server.close();
      backend.closeAllConnections();
      await new Promise<void>((resolve) => backend.close(() => resolve()));
      if (oldUrl) process.env.LARAVEL_URL = oldUrl;
      else delete process.env.LARAVEL_URL;
      if (oldSecret) process.env.GAME_SERVER_SECRET = oldSecret;
      else delete process.env.GAME_SERVER_SECRET;
    },
  };
}
