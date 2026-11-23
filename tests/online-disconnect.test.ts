import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture } from "./match-fixture";

test("reconnection requires a fresh ticket and restores the original seat and hero", async () => {
  const f = await fixture();
  try {
    const a = await f.seat(1, "1-original");
    const heroId = a.state.you.heroOffers[0];
    await a.command({ type: "chooseHero", heroId });
    a.socket.disconnect();
    await assert.rejects(f.seat(1, "1-original"));
    const resumed = await f.seat(1);
    assert.equal(resumed.state.you.id, "p0");
    assert.equal(resumed.state.you.heroId, heroId);
  } finally {
    await f.close();
  }
});
test("suspension rejects commands on open sockets and new tickets", async () => {
  const f = await fixture();
  try {
    const b = await f.seat(2);
    f.blocked.add(2);
    assert.equal((await b.command({ type: "rerollHeroes" })).ok, false);
    await assert.rejects(f.seat(2));
  } finally {
    await f.close();
  }
});
