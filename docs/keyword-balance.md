# Keyword balance experiment

Paired same-tier boards and combat seeds; score = win + half draw. Both baseline and updated peer pools are tested. All play buffs applied. Six scenarios; one changed card per board. Aim for a 50% peer score rather than preserving unusually strong old effects. This is a combat diagnostic, not match win rate.

576000 combats; 1000 seeds per card/scenario/cohort; seed offset 50000.
Scores outside 40-60% in either peer pool are flagged. This is a broad diagnostic band, not a confidence interval.

| Card | Tier | Keyword | Stats | Baseline peers (%) | Updated peers (%) | Change vs old (pp) | Review |
|---|---:|---|---|---:|---:|---:|---|
| Selina Kyle / Catwoman | 3 | stealth | 4/8 | 50.4 | 48.1 | -5.4 |  |
| Gollum | 3 | stealth | 3/11 | 50.4 | 50.6 | -5.2 |  |
| Frodo Baggins | 3 | stealth | 5/6 | 46.5 | 45.4 | -2.5 |  |
| Haze | 3 | stealth | 3/11 | 48.5 | 49.7 | 1.6 |  |
| Greirat | 3 | stealth | 4/7 | 47.6 | 47.1 | 0.1 |  |
| Klein Moretti | 3 | stealth | 5/6 | 44.8 | 44.8 | -8.8 |  |
| General Grievous | 2 | windfury | 3/5 | 48.4 | 50.4 | 5.3 |  |
| Abyss Watcher | 2 | windfury | 3/5 | 46.5 | 48.5 | -11.1 |  |
| Gwen Stacy / Ghost-Spider | 2 | windfury | 4/4 | 51.0 | 51.5 | -6.8 |  |
| Flying Snow | 2 | windfury | 3/6 | 48.2 | 50.2 | -8.9 |  |
| Pontiff Sulyvahn | 3 | windfury | 3/10 | 48.1 | 47.8 | -6.0 |  |
| Darth Maul | 6 | windfury | 12/15 | 51.9 | 52.8 | 4.0 |  |
| Nameless | 3 | venomous | 3/6 | 47.1 | 48.0 | -6.3 |  |
| Jim Moriarty | 5 | venomous | 4/12 | 50.4 | 50.3 | -0.8 |  |
| Hazmat Scientist | 5 | venomous | 1/12 | 49.5 | 49.0 | -2.9 |  |
| Green Goblin | 5 | venomous | 8/11 | 49.1 | 49.3 | -1.2 |  |
| Venom | 6 | venomous | 9/13 | 47.4 | 47.9 | -14.2 |  |
| Yuria of Londor | 6 | venomous | 8/13 | 47.2 | 49.7 | -0.4 |  |
| Ashen One | 1 | reborn | 1/4 | 52.2 | 52.4 | -8.1 |  |
| Seraph | 1 | reborn | 1/3 | 46.2 | 46.5 | -13.9 |  |
| Kimiko | 2 | reborn | 2/3 | 54.8 | 54.7 | -5.7 |  |
| Kenny McCormick | 4 | reborn | 6/4 | 54.6 | 55.1 | -2.5 |  |
| The Doctor | 4 | reborn | 4/6 | 51.9 | 52.1 | 4.1 |  |
| Soul of Cinder | 6 | reborn | 6/9 | 48.7 | 49.1 | -12.6 |  |

Development used tuning seeds 1-48 and exploratory checks. Raw-seed starting-side bias was corrected before final validation; mixed combat seeds now have explicit starting-side sampling checks. The final seed range is independent of tuning. The midpoint target and 40-60% band were chosen before final validation.
Duels are diagnostic only: specialists and support cards are not expected to have equal solo strength. Team scores average three-unit, seven-unit, buffed, golden and shielded scenarios. Per-scenario and duel results are in the JSON report.
These experiments do not establish competitive balance, model player choices, or exhaust every synergy. Full-match soak tests verify termination, determinism and pool conservation, not equal card strength.
