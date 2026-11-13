# Hálózati szerződés

Azonos originről Socket.IO-kapcsolat, szerveroldali állapottal. A szerver a mérkőzés egyetlen hiteles állapota. A kliens csak saját műveletet kérhet, eredményt nem küldhet be.

| Esemény | Kérés / válasz |
|---|---|
| `start` | `{seed?: uint32 > 0, mode: "manual" | "timed"}` → ACK `{ok, token}`. Új demómeccs, egy ember és hét bot. |
| Kapcsolódás | Socket auth `{token}`. Létező munkamenet esetén azonnali saját snapshot. |
| `snapshot` | Szerver → kliens: `Snapshot` a közös TypeScript típus szerint. Saját kéz/bolt, nyilvános helyezéslista, saját harc, fázis, verzió és határidő. |
| `command` | `{commandId, expectedVersion, action}` → ACK `{ok, version, code?, message?}` és friss snapshot. |
| `control` | `step`, `pause`, `resume`, `finishCombat`, `autoplay` → ACK `{ok}` és snapshot. Demós tesztvezérlések. |
| `export` | ACK: verziózott `Replay` JSON. |
| `POST /api/replays/verify` | Replay JSON → `{ok, round, phase, placements}` vagy 422 `{ok:false,error}`. |
| `GET /api/health` | `{ok:true}`. |

A műveletváltozatok a `shared/types.ts` `Action` típusában találhatók. Minden bemenetet a szerver ellenőriz, a játékszabályokat tranzakciós másolaton futtatja: elutasításkor az RNG és a teljes állapot is változatlan.

Azonos `commandId` és azonos teljes kérés az eredeti ACK-ot adja. Eltérő tartalom ugyanazzal az azonosítóval `ID_REUSE`. Elavult verzió `STALE`, lejárt határidő `EXPIRED`; a friss snapshot érkezik. A kliens ACK-hiánykor ugyanazt a kérést legfeljebb kétszer ismétli. Új állapothoz nem ismétel automatikusan elutasított vásárlást.

Egy munkamenet legfeljebb 10 000 nyugtát tárol. Kapcsolatonként 30 kérés/másodperc korlát, Socket.IO-üzenetenként 100 KB, visszajátszásnál legfeljebb 2 MB és 10 000 lépés. Legfeljebb 30 aktív munkamenet; egyórás inaktivitás után törlődnek. Tartós tárolás ebben a változatban nincs.

A seed és a katalógus a demóban nyilvános a megismételhetőséghez. Egy éles versenyjátékban a seedet is el kell rejteni a mérkőzés végéig.

Hero selection: `you.heroOffers` contains three choices. `{type:"rerollHeroes"}` replaces all three with heroes absent from `you.heroSeen`, consumes one of `you.heroRerolls` (initially 3), and is accepted only before hero selection. History and remaining rerolls survive reconnect through the snapshot. Rerolls do not extend the timed hero deadline. Exhausted rerolls return `HERO_REROLLS`; choices discarded by reroll cannot be selected.

Omitting `seed` on `start` generates a random nonzero uint32 on the server, different from the preceding match on that connection. Explicit valid seeds remain supported for testing. The chosen seed is retained in snapshots and replay exports; reconnecting does not generate a new seed.

Active match pool: snapshots expose `activeTribes` (five tribe IDs) and `activeCardIds` (80 distinct card IDs). These describe the fixed roster, not remaining copy counts; private pool quantities are still excluded. Both fields persist through reconnect and are reconstructed deterministically for replays. Ruleset: `bg-37.0-core-custom-4`.

Card types: `activeTribes` still contains only five regular tribe IDs. `activeCardIds` additionally includes 12 Neutral and eight All-type designs, independent of tribe selection. Card type is resolved by `tribeFor`; membership checks use `hasTribe` so All-type cards match every tribe while Neutral matches none.
