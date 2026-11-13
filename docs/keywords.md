# Combat keywords

The first keyword release assigns one keyword to each of 24 existing recruitable cards, six per keyword. Their previous abilities are replaced, not stacked. Tiers, tribes, finite copy counts and the 80-card match selection remain unchanged. Hero powers are still unavailable.

| Keyword | In-game label | Custom game rule |
|---|---|---|
| Stealth | Lopakodás | Cannot be chosen as an attack target until attacking. Area damage still works. Hidden Taunt does not draw attacks. If all enemies are hidden, attacks may target them to prevent a stall. |
| Windfury | Szélvész | Two consecutive attacks on its turn, selecting a target separately each time. Death stops the second attack; a resurrected copy does not inherit that turn. |
| Venomous | Méreg | The first positive attack or retaliation damage destroys its target and consumes the charge. Shields and zero damage do not consume it. Ability/area damage does not apply venom. Retaliation remains simultaneous even when the defender dies. |
| Reborn | Újjászületés | After deathrattles, returns once if there is space, with 1 health and printed attack (doubled when golden). Buffs, shield, Taunt and keywords are removed. Its position stays relative to surviving neighbors. |

Golden cards double printed stats, not the number of attacks, venom charges or resurrections. Keywords are copied into combat and consumed only on combat copies. Summoned helper tokens inherit none of their source's keywords. Existing first-attack abilities still trigger once per combat.

Small badges on shop, hand and board cards show current keyword state; the catalog and card tooltips show full names. Badge tooltips explain each rule. Catalog search also accepts `stealth`, `windfury`, `venomous` and `reborn`.

## Balancing and verification

The final card values and measured scores are in [the balance report](keyword-balance.md). Definitions live in `shared/keyword-designs.ts`.

- `npm test`: existing mechanics and keyword edge cases, including simultaneous venom, shielding, deathrattle capacity, resurrection position, mixed boards and combat-copy isolation.
- `npm run test:keyword-balance`: reproducible paired comparisons on six scenarios, 1,000 seeds per scenario, both baseline and updated peer catalogs. Draws count as half a win. Every card must stay within the declared 40–60% average team-score band in both peer pools. Detailed JSON and Markdown reports are written to `test-results/`.
- `npm run test:soak`: 100 complete eight-player matches, each repeated once; checks determinism, placement, completion and finite-pool conservation.
- `npm run test:keywords-browser`: badges, keyword search, mobile overflow and reconnect.

Combat seeds are mixed separately from fixture seeds and checked for balanced first-attack sampling. Consecutive raw xorshift seeds bias the starting side, so they are unsuitable for this experiment. Tuning and final validation use separate fixture seed ranges.

The benchmark is an initial balance diagnostic, not proof of competitive balance. It uses random same-tier teams and fixed buff/shield scenarios; it does not model optimal buying, repeated scaling, all tribe combinations or human choices. Duel scores are reported separately because support and specialist cards have different solo roles. Full-match soak tests establish correctness, not equal card strength.

Restart the development server and start a new match after updating. The rules/catalog versions were bumped, so old replays are intentionally incompatible.
