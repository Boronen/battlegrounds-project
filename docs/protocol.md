# Hálózati szerződés

Azonos originről Socket.IO-kapcsolat, szerveroldali állapottal. A szerver a mérkőzés egyetlen hiteles állapota. A kliens csak saját műveletet kérhet, eredményt nem küldhet be.

| Esemény | Kérés / válasz |
|---|---|
| `start` | `{seed: uint32 > 0, mode: "manual" | "timed"}` → ACK `{ok, token}`. Új demómeccs, egy ember és hét bot. |
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
