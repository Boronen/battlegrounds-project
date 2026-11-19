# Keyword balance experiment

Paired same-tier boards and combat seeds; score = win + half draw. Both baseline and updated peer pools are tested. All play buffs applied. Six scenarios; one changed card per board. Aim for a 50% peer score rather than preserving unusually strong old effects. This is a combat diagnostic, not match win rate.

576000 combats; 1000 seeds per card/scenario/cohort; seed offset 50000.
Scores outside 40-60% in either peer pool are flagged. This is a broad diagnostic band, not a confidence interval.

| Card | Tier | Keyword | Stats | Baseline peers (%) | Updated peers (%) | Change vs old (pp) | Review |
|---|---:|---|---|---:|---:|---:|---|
| Selina Kyle / Catwoman | 3 | stealth | 4/8 | 53.1 | 52.6 | -5.2 |  |
| Gollum | 3 | stealth | 3/11 | 52.6 | 52.7 | -5.6 |  |
| Frodo Baggins | 3 | stealth | 5/6 | 50.0 | 49.6 | 0.5 |  |
| Haze | 3 | stealth | 3/11 | 51.3 | 52.1 | 1.4 |  |
| Greirat | 3 | stealth | 4/7 | 50.2 | 49.7 | -1.2 |  |
| Klein Moretti | 3 | stealth | 5/6 | 51.3 | 51.5 | -6.5 |  |
| General Grievous | 2 | windfury | 3/5 | 55.0 | 57.2 | 2.4 |  |
| Abyss Watcher | 2 | windfury | 3/5 | 55.9 | 57.7 | -0.7 |  |
| Gwen Stacy / Ghost-Spider | 2 | windfury | 4/3 | 55.7 | 55.1 | -2.4 |  |
| Flying Snow | 2 | windfury | 2/6 | 54.3 | 54.5 | -3.2 |  |
| Pontiff Sulyvahn | 3 | windfury | 3/10 | 49.3 | 49.7 | -7.6 |  |
| Darth Maul | 6 | windfury | 12/15 | 47.8 | 50.0 | -4.4 |  |
| Nameless | 3 | venomous | 3/6 | 51.5 | 54.0 | -4.2 |  |
| Jim Moriarty | 5 | venomous | 4/12 | 50.9 | 51.7 | -1.6 |  |
| Hazmat Scientist | 5 | venomous | 1/12 | 50.5 | 49.8 | -6.8 |  |
| Green Goblin | 5 | venomous | 8/11 | 51.8 | 52.4 | -1.7 |  |
| Venom | 6 | venomous | 9/13 | 47.8 | 49.5 | -21.5 |  |
| Yuria of Londor | 6 | venomous | 8/13 | 49.3 | 51.8 | -5.8 |  |
| Ashen One | 1 | reborn | 1/4 | 47.4 | 47.1 | -10.7 |  |
| Seraph | 1 | reborn | 1/3 | 40.8 | 40.6 | -16.0 |  |
| Kimiko | 2 | reborn | 2/3 | 59.1 | 58.2 | 1.3 |  |
| Kenny McCormick | 4 | reborn | 6/4 | 55.0 | 55.3 | -10.6 |  |
| The Doctor | 4 | reborn | 4/6 | 52.0 | 52.2 | 5.0 |  |
| Soul of Cinder | 6 | reborn | 6/9 | 51.0 | 51.4 | -19.0 |  |

Each paired comparison uses the same combat seed and teammates. Both cohorts include the current tier roster. Baseline peers use their pre-keyword card definitions. Starting-side sampling is checked for each scenario.
Duels are diagnostic only: specialists and support cards are not expected to have equal solo strength. Team scores average three-unit, seven-unit, buffed, golden and shielded scenarios. Per-scenario and duel results are in the JSON report.
These experiments do not establish competitive balance, model player choices, or exhaust every synergy. Full-match soak tests verify termination, determinism and pool conservation, not equal card strength.
