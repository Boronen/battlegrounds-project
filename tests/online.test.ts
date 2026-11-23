import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, delay } from "./match-fixture";

test("authenticated seats share a match, retain independent choices and advance after both votes", async () => {
  const f = await fixture();
  try {
    const a = await f.seat(1),
      b = await f.seat(2);
    assert.equal(a.state.matchId, b.state.matchId);
    assert.equal(b.state.you.id, "p1");
    for (const seat of [a, b]) {
      const offers = seat.state.you.heroOffers;
      assert.ok((await seat.command({ type: "rerollHeroes" })).ok);
      assert.ok(seat.state.you.heroOffers.every((id) => !offers.includes(id)));
      assert.ok(
        (
          await seat.command({
            type: "chooseHero",
            heroId: seat.state.you.heroOffers[0],
          })
        ).ok,
      );
    }
    assert.equal(a.state.phase, "recruit");
    assert.equal(
      (await a.command({ type: "buy", uid: b.state.you.shop[0]!.uid })).ok,
      false,
    );
    assert.equal((await a.socket.emitWithAck("control", "autoplay")).ok, false);
    await a.command({ type: "ready" });
    await b.command({ type: "ready" });
    assert.equal(a.state.phase, "combat");
    await a.socket.emitWithAck("control", "finishCombat");
    assert.equal(a.state.phase, "combat");
    await b.socket.emitWithAck("control", "finishCombat");
    await delay();
    assert.equal(b.state.phase, "recruit");
  } finally {
    await f.close();
  }
});
