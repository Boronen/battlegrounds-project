/** Run against an isolated, migrated and seeded instance with both services running. */
import assert from "node:assert/strict";
import { request, type APIRequestContext, chromium } from "@playwright/test";
import { io, type Socket } from "socket.io-client";
import type { Snapshot } from "../shared/types";

const base = process.env.PLATFORM_TEST_URL;
if (!base)
  throw Error(
    "Állítsd be a PLATFORM_TEST_URL értékét az elkülönített tesztpéldányra.",
  );
const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const clients: APIRequestContext[] = [];
const sockets: Socket[] = [];
const prefix = "test" + Date.now();
const browser = await chromium.launch({
  executablePath:
    process.env.BROWSER_EXECUTABLE ||
    (process.platform === "win32"
      ? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
      : undefined),
});
async function call(
  client: APIRequestContext,
  path: string,
  method = "GET",
  data?: unknown,
) {
  const cookies = (await client.storageState()).cookies;
  const token = cookies.find((c) => c.name === "XSRF-TOKEN");
  const res = await client.fetch(base + "/api/" + path, {
    method,
    data,
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(token?.value || ""),
    },
  });
  assert.ok(
    res.ok(),
    path + " " + res.status() + " " + (await res.text()).slice(0, 350),
  );
  return res.status() === 204 ? null : res.json();
}
async function complete(gameId: number, participants: APIRequestContext[]) {
  await pause(2400);
  const seats = await Promise.all(
    participants.map(async (client) => {
      const ticket = await call(client, "game-tickets", "POST", {
        game_id: gameId,
      });
      const socket = io(base + "/matches", {
        auth: ticket,
        autoConnect: false,
        reconnection: false,
      });
      sockets.push(socket);
      let state: Snapshot;
      socket.on("snapshot", (value) => {
        state = value;
      });
      await new Promise<void>((resolve, reject) => {
        socket.once("snapshot", () => resolve());
        socket.once("connect_error", reject);
        socket.connect();
      });
      return {
        socket,
        get state() {
          return state;
        },
      };
    }),
  );
  async function command(seat: (typeof seats)[number], action: unknown) {
    const reply = await seat.socket
      .timeout(10000)
      .emitWithAck("command", {
        commandId: crypto.randomUUID(),
        expectedVersion: seat.state.version,
        action,
      });
    assert.ok(reply.ok, reply.message);
  }
  for (const seat of seats)
    await command(seat, {
      type: "chooseHero",
      heroId: seat.state.you.heroOffers[0],
    });
  for (
    let turn = 0;
    turn < 150 && seats[0].state.phase !== "finished";
    turn++
  ) {
    const alive = seats.filter((s) => s.state.you.hp > 0);
    if (seats[0].state.phase === "recruit") {
      for (const seat of alive) await command(seat, { type: "ready" });
    } else if (seats[0].state.phase === "combat") {
      for (const seat of alive)
        await seat.socket.timeout(10000).emitWithAck("control", "finishCombat");
    }
    await pause(35);
  }
  assert.equal(seats[0].state.phase, "finished");
  await pause(2400);
  const summary = await call(participants[0], "matches/" + gameId);
  assert.equal(summary.players.length, participants.length);
  assert.deepEqual(
    summary.players.map((p: { place: number }) => p.place),
    participants.map((_, i) => i + 1),
  );
  seats.forEach((s) => s.socket.disconnect());
  return summary;
}
try {
  for (let i = 0; i < 8; i++) {
    const c = await request.newContext();
    clients.push(c);
    await c.get(base + "/sanctum/csrf-cookie");
    await call(c, "register", "POST", {
      name: prefix + i,
      email: prefix + i + "@example.test",
      password: "Test-password-123",
      password_confirmation: "Test-password-123",
    });
  }
  const room = await call(clients[0], "lobbies", "POST");
  await call(clients[1], "lobbies/join", "POST", { code: room.code });
  for (const c of clients.slice(0, 2))
    await call(c, "lobbies/" + room.id + "/ready", "POST", { ready: true });
  await call(clients[0], "lobbies/" + room.id + "/start", "POST");
  const priv = await complete(room.id, clients.slice(0, 2));
  assert.ok(priv.players.every((p: { delta: number }) => p.delta === 0));
  let ranked;
  for (const c of clients) ranked = await call(c, "queue", "POST");
  const result = await complete(ranked.id, clients);
  assert.deepEqual(
    result.players.map((p: { delta: number }) => p.delta),
    [70, 50, 30, 10, -10, -30, -50, -70],
  );
  for (const width of [1280, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 850 },
      storageState: await clients[0].storageState(),
    });
    const page = await context.newPage();
    await page.goto(base + "/#/ranglista");
    await page.getByLabel("Játékos keresése").fill(prefix);
    await page.getByRole("link", { name: prefix + "0", exact: true }).click();
    await page
      .getByRole("link", { name: ranked.id + ". mérkőzés", exact: true })
      .click();
    await page.reload();
    await page
      .getByRole("heading", { name: ranked.id + ". mérkőzés" })
      .waitFor();
    await page.goBack();
    await page.getByRole("heading", { name: "Meccselőzmények" }).waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await context.close();
  }
  console.log(
    "Privát és rangsorolt meccs, pontozás, asztali és mobil profilútvonalok sikeresek.",
  );
} finally {
  for (const s of sockets) s.disconnect();
  for (const c of clients) await c.dispose();
  await browser.close();
}
