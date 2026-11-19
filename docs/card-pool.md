# Card pool

360 recruitable cards: 280 franchise cards, 35 Neutral franchise cards, 35 All-type cards, seven tribe support cards and three Neutral trigger amplifiers. The 35 heroes are documented separately in [the hero power specification](hero-powers-spec.md).

## Active matches

Each match uses five random tribes and 83 distinct cards: 12 per active tribe, 15 Neutral cards and eight All-type cards. The total tier counts are 14/14/13/13/15/14, giving 965 physical copies at the start of a match. The three trigger amplifiers are always in the roster. See [the rules](rules.md) for the effect timing and pool mechanics.

## A szett egyensúlya

Az első két boltszinten az olcsó Battlecry, a minden ütéskor erősödő Rally és a 2/2-es Segítőt idéző Deathrattle ad korai tempót. A harmadik és negyedik szinten már érdemes helyet hagyni a támogatóknak. A szomszédokra osztott kör végi bónusz és a célzott +4/+4-es Battlecry későbbi harcokra is megmarad.

Az ötödik szinttől Yoda például minden kör elején +3/+3-at ad a többi Misztikusnak és a minden típusú szövetségeseknek. A hatodik szintű Renoir kör végén +7/+7-et ad a tőle balra álló lapnak. Arany Renoir és arany Záróra mestere együtt ezt +42/+42-re emeli. A harci Rally és Deathrattle a csatában segít. A pozicionálás, a pajzs és a Méreg a már nagyra nőtt ellenfelek ellen is számít.

| A lapon szereplő fő képesség | Előző készlet | Új készlet |
|---|---:|---:|
| Battlecry | 62 | 75 |
| Rally | 35 | 66 |
| Kör vége | 14 | 44 |
| Kör eleje | 18 | 34 |
| Deathrattle | 14 | 29 |
| Harc eleje | 116 | 45 |
| Első támadás | 40 | 14 |
| Passzív | 61 | 53 |

Ugyanaz a nyolc bot játszotta az 1–40-es kezdőértékeket a két szabályprofillal. A 12. körös számok az életben lévő csapatok összesített támadásának és életerejének külön mediánjai. A csúcsértékeknél először minden mérkőzésben megkerestük az egy minionon elért legnagyobb tartós támadást és életerőt, majd ezek mediánját vettük.

| Mérőszám | Előző készlet | Új készlet |
|---|---:|---:|
| 12. körös csapat támadása / életereje | 50 / 62 | 59 / 72 |
| Egy minion csúcstámadása / csúcséletereje | 67 / 62 | 73 / 72 |
| Meccshossz mediánja | 16 kör | 18 kör |
| Támadások száma a harcok 95. percentilisénél | 16 | 15 |
| Döntetlen két nem üres csapat között | 16,5% | 16,0% |

A 40 új meccsből 12-ben legalább egy minion támadása vagy életereje elérte a százat. A mintában mért legnagyobb tartós támadás 197, a legnagyobb tartós életerő 200 volt.

Az új profil 40 meccsén 332 különböző lap került a kisorsolt készletekbe. Mind a 360 lapot külön is ellenőrzi a teszt normál és arany változatban. A 24 kulcsszavas lap külön próbájában Gwen Stacy / Ghost-Spider 4/3-ra, Flying Snow 2/6-ra változott. A teljes meccsek mérése az `npm run test:set-balance`, a kulcsszavas csapatpróba az `npm run test:keyword-balance` paranccsal ismételhető meg. [Kulcsszavas lapok mérése](keyword-balance.md)

## Source and interpretations

- [Source survey](https://docs.google.com/spreadsheets/d/12-yiKDrUfcKbvt3uSmqeaNBMDTqcgJeUYipqaQk9R_c/edit), read November 13, 2026. Only title columns are represented; no respondent details are copied.
- Back to the Future and Jake Long retain their approved cards and IDs. Star Wars combines the general and Revenge of the Sith answers into one roster.
- Avatar means James Cameron’s films. Spider-Man uses a broad franchise roster. The two South Park games share one roster.
- Multiple titles in one response are split: Friends / East of Eden and The Residence / Fawlty Towers.
- East of Eden is provisionally interpreted as the 2008 Korean series, not the 1955 film. The Batman means the 2022 film; Sherlock means the BBC series; 911 means 9-1-1.
- Rocket League uses vehicles; Rust and Vintage Story use roles and creatures. Hero includes Qin Archer and Qin Palace Guard alongside six named characters.
- Dixit has no canonical named cast: its eight cards are explicitly invented, game-inspired roles and motifs, not official characters.
- Mr. Voice and Morgo are one card; Shutter Island aliases are combined rather than counted twice. Doctor Who uses one Doctor card across incarnations.
- Empty/no-game answers and the apparent joke response are excluded; music answers are outside this card expansion.
- Minions use shared CSS card templates, including Neutral and All-type frames. Legacy portrait fields remain for compatibility. Stats and effects are custom game adaptations, not claims about canonical powers.
- Catalog version is franchise-360-heroes-35-v14. Older replay files use a different pool and are rejected by the existing version check.

## Additional roster references

- [Expedition 33 official characters](https://www.expedition33.com/overview/characters)
- [The Residence official cast guide](https://www.netflix.com/tudum/articles/residence-cast-guide)
- [East of Eden cast](https://en.wikipedia.org/wiki/East_of_Eden_(South_Korean_TV_series))
- [Little Misfortune overview](https://en.wikipedia.org/wiki/Little_Misfortune) and [Hiro](https://littlemisfortune.fandom.com/wiki/Hiro)
- [Vintage Story entity list](https://wiki.vintagestory.at/Entity_codes)
- [Lord of Mysteries characters](https://lordofmysteriesgame.com/novel/characters/)
- [Hero cast and plot](https://en.wikipedia.org/wiki/Hero_(2002_film))
- [Dixit Odyssey publisher rules](https://cdn.svc.asmodee.net/production-asmodeeca/uploads/2023/07/DIXIT_ODYSSEY_RULES_EN_BD.pdf)

## Shared-card roster references

- [Little Misfortune Unicorn](https://littlemisfortune.fandom.com/wiki/Unicorn)
- [Sophie](https://clairobscur.wiki.gg/wiki/Sophie)
- [Truman Show screenplay](https://thescriptsavant.com/movies/Truman_Show.pdf)

## Franchise cards

### Back to the Future

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 35 | Marty McFly | 1 | Technológusok | 3 / 2 | Első támadás · Gördeszkás lendület: Az első támadásától +2 támadást kap erre a harcra. |
| 36 | Doc Brown | 6 | Technológusok | 7 / 10 | Harc eleje · Időpajzs: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 37 | Biff Tannen | 2 | Technológusok | 2 / 6 | Passzív · Útban vagy!: Őrző: magára vonja az ellenséges támadásokat. |
| 38 | George McFly | 1 | Technológusok | 1 / 3 | Battlecry · Bátorságpróba: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 39 | Lorraine Baines McFly | 3 | Technológusok | 3 / 5 | Battlecry · Bátorító szó: Egy választott másik szövetséges véglegesen +2/+2 értéket kap. |
| 40 | Jennifer Parker | 4 | Technológusok | 4 / 7 | Harc eleje · Közös jövő: A közvetlen szomszédok +3 életerőt kapnak erre a harcra. |
| 41 | Clara Clayton | 3 | Technológusok | 3 / 6 | Harc eleje · Biztonságos utazás: Védőpajzsot kap erre a harcra. |
| 42 | Buford “Mad Dog” Tannen | 5 | Technológusok | 7 / 7 | Harc eleje · Párbaj délben: 4 sebzést okoz egy véletlen ellenségnek. |
| 315 | Einstein | 1 | Semleges | 2 / 3 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 316 | Verne Brown | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |
| 388 | Dave McFly | 6 | Túlélők | 8 / 9 | Battlecry · Kijátszáskor a közvetlen szomszédai tartósan +5/+5-öt kapnak. |
| 389 | Linda McFly | 6 | Túlélők | 8 / 9 | Battlecry · Kijátszáskor a közvetlen szomszédai tartósan +5/+5-öt kapnak. |

### Jake Long: American Dragon

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 43 | Jake Long | 2 | Harcosok | 3 / 4 | Első támadás · Sárkányerő: Az első támadásától +3 támadást kap erre a harcra. |
| 44 | Rose | 4 | Harcosok | 6 / 5 | Harc eleje · Vadászcsapás: 3 sebzést okoz egy véletlen ellenségnek a harc kezdetén. |
| 45 | Lao Shi | 5 | Harcosok | 5 / 9 | Kör vége · A mester tanítása: A köröd végén a bal oldali szomszédja tartósan +4/+4-et kap. |
| 46 | Fu Dog | 4 | Vadak | 4 / 6 | Harc eleje · Mágikus védelem: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 47 | Trixie Carter | 1 | Harcosok | 2 / 2 | Battlecry · Baráti biztatás: Egy választott másik szövetséges véglegesen +1 támadást kap. |
| 48 | Arthur “Spud” Spudinski | 1 | Harcosok | 1 / 3 | Harc eleje · Szerencsés kitérés: Védőpajzsot kap erre a harcra. |
| 49 | Huntsman | 3 | Harcosok | 6 / 4 | Passzív · A vadászat vezetője: Őrző: magára vonja az ellenséges támadásokat. |
| 50 | Dark Dragon | 6 | Vadak | 8 / 10 | Harc eleje · Sötét sárkánytűz: 3 sebzést okoz minden ellenséges egységnek a harc kezdetén. |
| 317 | Susan Long | 2 | Semleges | 3 / 4 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 318 | Haley Long | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Clair Obscur: Expedition 33

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 51 | Gustave | 2 | Misztikusok | 3 / 4 | Rally · Overcharge: Minden támadásakor +2 támadást kap erre a harcra. |
| 52 | Maelle | 1 | Misztikusok | 1 / 3 | Battlecry · Virtuose: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 53 | Lune | 4 | Misztikusok | 5 / 5 | Harc eleje · Elemental Genesis: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 54 | Sciel | 1 | Misztikusok | 2 / 2 | Battlecry · Foretell: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 55 | Verso | 3 | Misztikusok | 4 / 5 | Rally · Perfection: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 56 | Monoco | 2 | Misztikusok | 2 / 6 | Passzív · Bestial Wheel: Őrző: magára vonja az ellenséges támadásokat. |
| 57 | Esquie | 4 | Misztikusok | 4 / 6 | Kör vége · Expedition Guide: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 58 | Renoir | 6 | Misztikusok | 6 / 10 | Kör vége · Chroma Surge: A köröd végén a bal oldali szomszédja tartósan +7/+7-et kap. |
| 319 | Sophie | 3 | Semleges | 4 / 5 | Kör eleje · A köröd elején 1 extra aranyat kapsz. |
| 320 | The Paintress | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Star Wars

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 59 | Anakin Skywalker | 2 | Harcosok | 3 / 4 | Rally · Chosen One: Minden támadásakor +2 támadást kap erre a harcra. |
| 60 | Obi-Wan Kenobi | 4 | Harcosok | 5 / 5 | Harc eleje · High Ground: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 61 | Padme Amidala | 1 | Harcosok | 2 / 2 | Battlecry · Senate Appeal: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 62 | Yoda | 5 | Misztikusok | 5 / 8 | Kör eleje · Jedi Wisdom: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 63 | Mace Windu | 3 | Harcosok | 4 / 5 | Rally · Vaapad: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 64 | Ahsoka Tano | 1 | Harcosok | 1 / 3 | Battlecry · Padawan Courage: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 65 | General Grievous | 2 | Technológusok | 3 / 5 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |
| 66 | Darth Sidious | 6 | Misztikusok | 10 / 11 | Harc eleje · Force Lightning: Harc elején 5 sebzést okoz minden ellenségnek. |
| 321 | R2-D2 | 4 | Semleges | 5 / 6 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 322 | Luke Skywalker | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |
| 385 | Darth Maul | 6 | Harcosok | 12 / 15 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |

### Solo Leveling

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 67 | Sung Jinwoo | 5 | Élőholtak | 6 / 9 | Rally · Shadow Monarch: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 68 | Cha Hae-In | 2 | Élőholtak | 2 / 3 | Kör eleje · Sword Dance: A köröd elején tartósan +1/+2-t kap. |
| 69 | Yoo Jinho | 1 | Őrzők | 2 / 2 | Battlecry · Loyal Companion: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 70 | Sung Jinah | 1 | Túlélők | 1 / 3 | Battlecry · Family Resolve: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 71 | Igris | 3 | Élőholtak | 3 / 6 | Harc eleje · Blood-Red Commander: Védőpajzsot kap erre a harcra. |
| 72 | Iron | 2 | Élőholtak | 2 / 2 | Deathrattle · Iron Wall: Halálakor megidéz egy 2/2-es Segítőt. |
| 73 | Beru | 5 | Élőholtak | 8 / 8 | Harc eleje · Ant King: Harc elején 7 sebzést okoz egy véletlen ellenségnek. |
| 74 | Go Gunhee | 4 | Őrzők | 4 / 6 | Kör vége · Hunters Association: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 323 | Song Chi-Yul | 5 | Semleges | 6 / 7 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 324 | Sung Il-Hwan | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Hearthstone Battlegrounds

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 75 | Bob the Bartender | 1 | Technológusok | 2 / 2 | Battlecry · Friendly Advice: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 76 | Patches the Pirate | 2 | Technológusok | 3 / 4 | Rally · Pirate Charge: Minden támadásakor +2 támadást kap erre a harcra. |
| 77 | The Curator | 2 | Technológusok | 2 / 6 | Passzív · Menagerie Keeper: Őrző: magára vonja az ellenséges támadásokat. |
| 78 | George the Fallen | 4 | Technológusok | 5 / 5 | Harc eleje · Divine Protection: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 79 | A. F. Kay | 1 | Technológusok | 1 / 3 | Battlecry · Patient Return: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 80 | Millhouse Manastorm | 3 | Technológusok | 5 / 4 | Első támadás · Arcane Trick: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 81 | Ragnaros the Firelord | 5 | Misztikusok | 8 / 8 | Harc eleje · By Fire Be Purged: Harc elején 7 sebzést okoz egy véletlen ellenségnek. |
| 82 | The Lich King | 4 | Élőholtak | 5 / 7 | Deathrattle · Frozen Legacy: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 325 | Brann Bronzebeard | 6 | Semleges | 7 / 8 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 326 | Reno Jackson | 3 | Minden típus | 3 / 5 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### The Hitchhiker's Guide to the Galaxy

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 83 | Arthur Dent | 1 | Bajkeverők | 1 / 3 | Battlecry · Do Not Panic: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 84 | Ford Prefect | 1 | Bajkeverők | 2 / 2 | Battlecry · Guide Entry: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 85 | Zaphod Beeblebrox | 2 | Bajkeverők | 3 / 4 | Rally · Two Heads: Minden támadásakor +2 támadást kap erre a harcra. |
| 86 | Trillian | 4 | Bajkeverők | 5 / 5 | Battlecry · Astrophysics: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 87 | Marvin | 2 | Technológusok | 2 / 6 | Passzív · Brain the Size of a Planet: Őrző: magára vonja az ellenséges támadásokat. |
| 88 | Slartibartfast | 4 | Bajkeverők | 4 / 6 | Kör vége · Award-Winning Fjords: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 89 | Humma Kavula | 3 | Bajkeverők | 5 / 4 | Első támadás · Point of View: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 90 | Deep Thought | 5 | Technológusok | 5 / 8 | Kör eleje · Forty-Two: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 327 | Eddie the Computer | 1 | Semleges | 2 / 3 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 328 | Heart of Gold | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Doctor Who

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 91 | The Doctor | 4 | Őrzők | 4 / 6 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 92 | Rose Tyler | 1 | Őrzők | 1 / 3 | Battlecry · Bad Wolf: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 93 | Martha Jones | 1 | Őrzők | 2 / 2 | Battlecry · Medical Training: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 94 | Donna Noble | 4 | Őrzők | 4 / 6 | Kör vége · Best Friend: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 95 | Amy Pond | 3 | Őrzők | 3 / 4 | Kör vége · The Girl Who Waited: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 96 | Rory Williams | 2 | Őrzők | 2 / 3 | Kör eleje · Last Centurion: A köröd elején tartósan +1/+2-t kap. |
| 97 | River Song | 5 | Őrzők | 7 / 6 | Deathrattle · Hello Sweetie: Halálakor 5 sebzést okoz minden ellenségnek. |
| 98 | The Master | 6 | Őrzők | 6 / 10 | Kör vége · Time Lord Scheme: A köröd végén a bal oldali szomszédja tartósan +7/+7-et kap. |
| 329 | Wilfred Mott | 2 | Semleges | 3 / 4 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 330 | Captain Jack Harkness | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Little Misfortune

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 99 | Misfortune Ramirez Hernandez | 1 | Túlélők | 2 / 2 | Battlecry · Glitter of Happiness: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 100 | Benjamin | 4 | Vadak | 5 / 5 | Battlecry · Protector: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 101 | Mr. Voice (Morgo) | 5 | Élőholtak | 7 / 6 | Deathrattle · Deceptive Narration: Halálakor 5 sebzést okoz minden ellenségnek. |
| 102 | Hiro | 4 | Élőholtak | 5 / 7 | Deathrattle · Lost Friend: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 103 | Misfortune’s Mother | 4 | Túlélők | 4 / 6 | Kör vége · Eternal Happiness: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 104 | Puppy | 1 | Vadak | 1 / 3 | Battlecry · Playful Companion: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 105 | Hamster | 2 | Vadak | 2 / 2 | Deathrattle · Underground Party: Halálakor megidéz egy 2/2-es Segítőt. |
| 106 | Death | 2 | Élőholtak | 2 / 6 | Passzív · Fourth Reality: Őrző: magára vonja az ellenséges támadásokat. |
| 331 | Stone (Misfortune’s Toy) | 3 | Semleges | 4 / 5 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 332 | Unicorn (Misfortune’s Toy) | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### The Batman (2022)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 107 | Bruce Wayne / Batman | 3 | Őrzők | 4 / 5 | Rally · Armored Vigilante: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 108 | Selina Kyle / Catwoman | 3 | Bajkeverők | 4 / 8 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 109 | James Gordon | 4 | Őrzők | 5 / 5 | Harc eleje · Trusted Signal: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 110 | Alfred Pennyworth | 1 | Őrzők | 2 / 2 | Battlecry · Faithful Butler: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 111 | Oswald Cobblepot / Penguin | 2 | Bajkeverők | 2 / 6 | Passzív · Iceberg Lounge: Őrző: magára vonja az ellenséges támadásokat. |
| 112 | Edward Nashton / Riddler | 5 | Bajkeverők | 7 / 6 | Deathrattle · Riddle Trap: Halálakor 5 sebzést okoz minden ellenségnek. |
| 113 | Carmine Falcone | 5 | Bajkeverők | 5 / 8 | Kör eleje · Gotham Connections: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 114 | Bella Real | 1 | Túlélők | 1 / 3 | Battlecry · Renewal: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 333 | Gil Colson | 4 | Semleges | 5 / 6 | Deathrattle · Ha meghal, megidéz egy 2/2-es Segítőt. |
| 334 | The Joker (The Batman) | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Squid Game

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 115 | Seong Gi-hun | 1 | Túlélők | 1 / 3 | Battlecry · Player 456: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 116 | Cho Sang-woo | 3 | Bajkeverők | 5 / 4 | Első támadás · Calculated Risk: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 117 | Kang Sae-byeok | 3 | Túlélők | 3 / 4 | Kör vége · Quiet Survivor: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 118 | Abdul Ali | 2 | Őrzők | 2 / 6 | Passzív · Helping Hand: Őrző: magára vonja az ellenséges támadásokat. |
| 119 | Oh Il-nam | 5 | Bajkeverők | 5 / 8 | Kör eleje · Old Friends: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 120 | Jang Deok-su | 2 | Bajkeverők | 3 / 4 | Rally · Intimidation: Minden támadásakor +2 támadást kap erre a harcra. |
| 121 | Han Mi-nyeo | 4 | Bajkeverők | 5 / 7 | Deathrattle · Last Bargain: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 122 | Hwang Jun-ho | 1 | Bajkeverők | 2 / 2 | Battlecry · Undercover Officer: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 335 | The Recruiter | 5 | Semleges | 6 / 7 | Kör vége · A köröd végén egy véletlen 1. szintű miniont kapsz a közös készletből, ha elfér a kezedben. |
| 336 | The Front Man | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Rocket League

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 123 | Octane | 2 | Technológusok | 3 / 4 | Rally · Aerial Shot: Minden támadásakor +2 támadást kap erre a harcra. |
| 124 | Dominus | 5 | Technológusok | 8 / 8 | Harc eleje · Power Shot: Harc elején 7 sebzést okoz egy véletlen ellenségnek. |
| 125 | Breakout | 3 | Technológusok | 5 / 4 | Első támadás · Wall Pinch: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 126 | Merc | 2 | Technológusok | 2 / 2 | Deathrattle · Goal Line Defense: Halálakor megidéz egy 2/2-es Segítőt. |
| 127 | Venom (Rocket League) | 1 | Technológusok | 1 / 3 | Battlecry · Kickoff Boost: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 128 | X-Devil | 3 | Technológusok | 3 / 6 | Harc eleje · Midair Recovery: Védőpajzsot kap erre a harcra. |
| 129 | Paladin | 4 | Technológusok | 5 / 5 | Battlecry · Defensive Rotation: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 130 | Backfire | 1 | Technológusok | 2 / 2 | Battlecry · Centering Pass: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 337 | Fennec | 6 | Semleges | 7 / 8 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +2/+3-t kapnak. |
| 338 | Takumi | 3 | Minden típus | 3 / 5 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### The Matrix

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 131 | Neo | 3 | Technológusok | 3 / 6 | Harc eleje · Bullet Dodge: Védőpajzsot kap erre a harcra. |
| 132 | Trinity | 2 | Technológusok | 2 / 3 | Kör eleje · Rooftop Leap: A köröd elején tartósan +1/+2-t kap. |
| 133 | Morpheus | 5 | Technológusok | 6 / 9 | Rally · Free Your Mind: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 134 | Agent Smith | 6 | Technológusok | 6 / 10 | Kör vége · System Override: A köröd végén a bal oldali szomszédja tartósan +7/+7-et kap. |
| 135 | The Oracle | 1 | Technológusok | 2 / 2 | Battlecry · Know Thyself: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 136 | Cypher | 3 | Technológusok | 5 / 4 | Első támadás · Betrayal: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 137 | Tank | 4 | Technológusok | 5 / 5 | Harc eleje · Operator Support: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 138 | Niobe | 2 | Technológusok | 2 / 6 | Passzív · Captain of the Logos: Őrző: magára vonja az ellenséges támadásokat. |
| 339 | Mouse | 1 | Semleges | 2 / 3 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 340 | The Architect | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### The Chosen

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 139 | Jesus | 5 | Őrzők | 5 / 8 | Kör eleje · Follow Me: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 140 | Simon Peter | 2 | Őrzők | 2 / 6 | Passzív · Fisherman’s Resolve: Őrző: magára vonja az ellenséges támadásokat. |
| 141 | Matthew | 1 | Őrzők | 2 / 2 | Battlecry · Careful Record: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 142 | Mary Magdalene | 1 | Őrzők | 1 / 3 | Battlecry · New Beginning: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 143 | Nicodemus | 4 | Őrzők | 5 / 5 | Battlecry · Night Conversation: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 144 | Andrew | 4 | Őrzők | 4 / 6 | Kör vége · Bring a Friend: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 145 | John | 4 | Őrzők | 5 / 7 | Deathrattle · Faithful Witness: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 146 | Thomas | 3 | Őrzők | 3 / 6 | Harc eleje · Steadfast Faith: Védőpajzsot kap erre a harcra. |
| 341 | Zebedee | 2 | Semleges | 3 / 4 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 342 | Philip | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Rust

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 147 | Naked Survivor | 1 | Vadak | 1 / 3 | Battlecry · Fresh Spawn: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 148 | Hazmat Scientist | 5 | Technológusok | 1 / 12 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |
| 149 | Heavy Scientist | 2 | Technológusok | 2 / 6 | Passzív · Heavy Armor: Őrző: magára vonja az ellenséges támadásokat. |
| 150 | Bandit Camp Guard | 4 | Őrzők | 5 / 5 | Harc eleje · Safe Zone: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 151 | Outpost Scientist | 1 | Technológusok | 2 / 2 | Battlecry · Outpost Supplies: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 152 | Bear | 2 | Vadak | 3 / 4 | Rally · Territorial Charge: Minden támadásakor +2 támadást kap erre a harcra. |
| 153 | Wolf | 3 | Vadak | 3 / 4 | Kör vége · Pack Instinct: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 154 | Patrol Helicopter | 6 | Technológusok | 10 / 11 | Harc eleje · Rocket Barrage: Harc elején 5 sebzést okoz minden ellenségnek. |
| 343 | Boar | 3 | Semleges | 4 / 5 | Kör eleje · A köröd elején 1 extra aranyat kapsz. |
| 344 | Bradley APC | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Sherlock (BBC)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 155 | Sherlock Holmes | 3 | Bajkeverők | 5 / 4 | Első támadás · Deduction: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 156 | John Watson | 4 | Bajkeverők | 5 / 5 | Harc eleje · Army Doctor: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 157 | Mycroft Holmes | 5 | Bajkeverők | 5 / 8 | Kör eleje · Government Connections: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 158 | Jim Moriarty | 5 | Bajkeverők | 4 / 12 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |
| 159 | Irene Adler | 3 | Bajkeverők | 3 / 4 | Kör vége · The Woman: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 160 | Mrs. Hudson | 1 | Bajkeverők | 2 / 2 | Battlecry · Baker Street Hospitality: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 161 | Greg Lestrade | 2 | Bajkeverők | 2 / 2 | Deathrattle · Scotland Yard: Halálakor megidéz egy 2/2-es Segítőt. |
| 162 | Molly Hooper | 1 | Bajkeverők | 1 / 3 | Battlecry · Quiet Courage: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 345 | Philip Anderson | 4 | Semleges | 5 / 6 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 346 | Mary Morstan | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Dark Souls III

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 163 | Ashen One | 1 | Élőholtak | 1 / 4 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 164 | Fire Keeper | 1 | Élőholtak | 2 / 2 | Battlecry · Touch the Darkness: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 165 | Siegward of Catarina | 2 | Élőholtak | 2 / 6 | Passzív · Onion Armor: Őrző: magára vonja az ellenséges támadásokat. |
| 166 | Anri of Astora | 4 | Élőholtak | 5 / 5 | Battlecry · Shared Quest: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 167 | Greirat | 3 | Élőholtak | 4 / 7 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 168 | Abyss Watcher | 2 | Élőholtak | 3 / 5 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |
| 169 | Pontiff Sulyvahn | 3 | Élőholtak | 3 / 10 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |
| 170 | Soul of Cinder | 6 | Élőholtak | 6 / 9 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 347 | Andre of Astora | 5 | Semleges | 6 / 7 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 348 | Unbreakable Patches | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |
| 391 | Yuria of Londor | 6 | Élőholtak | 8 / 13 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |

### Avatar (James Cameron)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 171 | Jake Sully | 2 | Vadak | 3 / 4 | Rally · Toruk Makto: Minden támadásakor +2 támadást kap erre a harcra. |
| 172 | Neytiri | 5 | Vadak | 6 / 9 | Rally · Forest Archer: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 173 | Grace Augustine | 1 | Technológusok | 2 / 2 | Battlecry · Botanical Knowledge: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 174 | Norm Spellman | 1 | Technológusok | 1 / 3 | Battlecry · Avatar Training: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 175 | Trudy Chacon | 4 | Technológusok | 5 / 5 | Battlecry · Air Support: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 176 | Tsu’tey | 2 | Harcosok | 2 / 6 | Passzív · Clan Warrior: Őrző: magára vonja az ellenséges támadásokat. |
| 177 | Mo’at | 4 | Misztikusok | 4 / 6 | Kör vége · Voice of Eywa: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 178 | Miles Quaritch | 6 | Technológusok | 10 / 11 | Harc eleje · AMP Assault: Harc elején 5 sebzést okoz minden ellenségnek. |
| 349 | Tuktirey | 6 | Semleges | 7 / 8 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 350 | Kiri | 3 | Minden típus | 3 / 5 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |
| 390 | Thanator | 3 | Vadak | 5 / 6 | Rally · Minden támadásakor a többi Vad és minden típusú szövetséges +2/+1-et kap erre a harcra. |

### The Boys

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 179 | Billy Butcher | 3 | Bajkeverők | 4 / 5 | Rally · Supe Hunter: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 180 | Hughie Campbell | 1 | Bajkeverők | 1 / 3 | Battlecry · Unexpected Courage: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 181 | Annie January / Starlight | 4 | Bajkeverők | 5 / 5 | Harc eleje · Guiding Light: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 182 | Mother’s Milk | 2 | Bajkeverők | 2 / 6 | Passzív · Hold the Line: Őrző: magára vonja az ellenséges támadásokat. |
| 183 | Frenchie | 1 | Bajkeverők | 2 / 2 | Battlecry · Improvised Gear: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 184 | Kimiko | 2 | Harcosok | 2 / 3 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 185 | Homelander | 6 | Bajkeverők | 10 / 11 | Harc eleje · Heat Vision: Harc elején 5 sebzést okoz minden ellenségnek. |
| 186 | Queen Maeve | 3 | Őrzők | 3 / 6 | Harc eleje · Warrior’s Resolve: Védőpajzsot kap erre a harcra. |
| 351 | Ashley Barrett | 1 | Semleges | 2 / 3 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 352 | Soldier Boy | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### South Park: The Stick of Truth / The Fractured But Whole

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 187 | The New Kid | 1 | Bajkeverők | 1 / 3 | Battlecry · Choose Your Class: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 188 | Eric Cartman | 5 | Bajkeverők | 8 / 8 | Harc eleje · Grand Wizard: Harc elején 7 sebzést okoz egy véletlen ellenségnek. |
| 189 | Stan Marsh | 2 | Bajkeverők | 2 / 6 | Passzív · Toolshed: Őrző: magára vonja az ellenséges támadásokat. |
| 190 | Kyle Broflovski | 4 | Bajkeverők | 5 / 5 | Harc eleje · Human Kite: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 191 | Kenny McCormick | 4 | Élőholtak | 6 / 4 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 192 | Butters Stotch | 1 | Bajkeverők | 2 / 2 | Battlecry · Paladin’s Blessing: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 193 | Craig Tucker | 2 | Bajkeverők | 3 / 4 | Rally · Super Craig: Minden támadásakor +2 támadást kap erre a harcra. |
| 194 | Tweek Tweak | 6 | Bajkeverők | 6 / 10 | Kör vége · Wonder Tweek: A köröd végén a bal oldali szomszédja tartósan +7/+7-et kap. |
| 353 | Jimmy Valmer | 2 | Semleges | 3 / 4 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 354 | Timmy Burch | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### The Truman Show

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 195 | Truman Burbank | 1 | Túlélők | 1 / 3 | Battlecry · Good Morning: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 196 | Christof | 5 | Túlélők | 5 / 8 | Kör eleje · Cue the Sun: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 197 | Sylvia / Lauren Garland | 4 | Túlélők | 5 / 5 | Harc eleje · Truth Beyond the Set: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 198 | Meryl Burbank | 1 | Túlélők | 2 / 2 | Battlecry · Product Placement: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 199 | Marlon | 2 | Túlélők | 2 / 2 | Deathrattle · Best Friend: Halálakor megidéz egy 2/2-es Segítőt. |
| 200 | Kirk Burbank | 4 | Túlélők | 5 / 7 | Deathrattle · Father’s Return: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 201 | Angela Burbank | 4 | Túlélők | 4 / 6 | Kör vége · Family Album: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 202 | Lawrence | 3 | Túlélők | 3 / 4 | Kör vége · Control Room: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 355 | Vivian | 3 | Semleges | 4 / 5 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 356 | Mike Michaelson | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Chernobyl (2019)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 203 | Valery Legasov | 1 | Túlélők | 2 / 2 | Battlecry · Tell the Truth: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 204 | Boris Shcherbina | 5 | Túlélők | 5 / 8 | Kör eleje · Emergency Coordination: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 205 | Ulana Khomyuk | 3 | Túlélők | 5 / 4 | Első támadás · Reactor Analysis: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 206 | Anatoly Dyatlov | 2 | Túlélők | 2 / 6 | Passzív · Control Room Orders: Őrző: magára vonja az ellenséges támadásokat. |
| 207 | Vasily Ignatenko | 4 | Túlélők | 5 / 7 | Deathrattle · First Responder: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 208 | Lyudmilla Ignatenko | 1 | Túlélők | 1 / 3 | Battlecry · Unwavering Devotion: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 209 | General Pikalov | 3 | Túlélők | 4 / 5 | Rally · Radiation Reconnaissance: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 210 | Mikhail Shchadov | 4 | Túlélők | 4 / 6 | Kör vége · Mobilize the Miners: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 357 | Andrei Glukhov | 4 | Semleges | 5 / 6 | Deathrattle · Ha meghal, megidéz egy 2/2-es Segítőt. |
| 358 | Nikolai Tarakanov | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Deadlock

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 211 | Ivy | 4 | Vadak | 5 / 5 | Harc eleje · Stone Form: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 212 | Abrams | 2 | Őrzők | 2 / 6 | Passzív · Shoulder Charge: Őrző: magára vonja az ellenséges támadásokat. |
| 213 | Bebop | 5 | Technológusok | 7 / 6 | Deathrattle · Exploding Uppercut: Halálakor 5 sebzést okoz minden ellenségnek. |
| 214 | Dynamo | 4 | Technológusok | 4 / 6 | Kör vége · Rejuvenating Aurora: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 215 | Infernus | 2 | Misztikusok | 3 / 4 | Rally · Flame Dash: Minden támadásakor +2 támadást kap erre a harcra. |
| 216 | Haze | 3 | Bajkeverők | 3 / 11 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 217 | Seven | 6 | Misztikusok | 10 / 11 | Harc eleje · Storm Cloud: Harc elején 5 sebzést okoz minden ellenségnek. |
| 218 | Vindicta | 1 | Élőholtak | 2 / 2 | Battlecry · Spotter: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 359 | Kelvin | 5 | Semleges | 6 / 7 | Kör vége · A köröd végén egy véletlen 1. szintű miniont kapsz a közös készletből, ha elfér a kezedben. |
| 360 | Paradox | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Shutter Island

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 219 | Edward “Teddy” Daniels | 1 | Túlélők | 1 / 3 | Battlecry · Marshal’s Investigation: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 220 | Chuck Aule / Dr. Sheehan | 4 | Túlélők | 5 / 5 | Harc eleje · Trusted Partner: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 221 | Dr. John Cawley | 1 | Túlélők | 2 / 2 | Battlecry · Role-Play Therapy: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 222 | Dr. Jeremiah Naehring | 3 | Túlélők | 4 / 5 | Rally · Clinical Interview: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 223 | Dolores Chanal | 4 | Túlélők | 5 / 7 | Deathrattle · Haunting Memory: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 224 | Rachel Solando | 3 | Túlélők | 3 / 6 | Harc eleje · Missing Patient: Védőpajzsot kap erre a harcra. |
| 225 | George Noyce | 4 | Túlélők | 4 / 6 | Kör vége · Warning from Ward C: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 226 | The Warden | 2 | Túlélők | 2 / 6 | Passzív · Island Security: Őrző: magára vonja az ellenséges támadásokat. |
| 361 | Ashecliffe Orderly | 6 | Semleges | 7 / 8 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +2/+3-t kapnak. |
| 362 | Deputy Warden McPherson | 3 | Minden típus | 3 / 5 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Friends

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 227 | Rachel Green | 1 | Túlélők | 1 / 3 | Battlecry · Fresh Start: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 228 | Monica Geller | 2 | Túlélők | 2 / 3 | Kör eleje · Competitive Spirit: A köröd elején tartósan +1/+2-t kap. |
| 229 | Phoebe Buffay | 4 | Túlélők | 5 / 7 | Deathrattle · Smelly Cat: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 230 | Joey Tribbiani | 2 | Túlélők | 3 / 4 | Rally · How You Doin: Minden támadásakor +2 támadást kap erre a harcra. |
| 231 | Chandler Bing | 3 | Túlélők | 5 / 4 | Első támadás · Could I Be Any More: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 232 | Ross Geller | 4 | Túlélők | 4 / 6 | Kör vége · Unagi: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 233 | Gunther | 1 | Túlélők | 2 / 2 | Battlecry · Central Perk: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 234 | Janice Hosenstein | 3 | Túlélők | 3 / 6 | Harc eleje · Oh My God: Védőpajzsot kap erre a harcra. |
| 363 | Mike Hannigan | 1 | Semleges | 2 / 3 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 364 | Richard Burke | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### East of Eden (2008)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 235 | Lee Dong-chul | 2 | Túlélők | 2 / 6 | Passzív · Protective Brother: Őrző: magára vonja az ellenséges támadásokat. |
| 236 | Lee Dong-wook | 3 | Túlélők | 5 / 4 | Első támadás · Prosecutor’s Case: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 237 | Min Hye-rin | 1 | Túlélők | 2 / 2 | Battlecry · Careful Counsel: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 238 | Kim Ji-hyun | 1 | Túlélők | 1 / 3 | Battlecry · Unbroken Resolve: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 239 | Shin Myung-hoon | 2 | Túlélők | 3 / 4 | Rally · Rival Heir: Minden támadásakor +2 támadást kap erre a harcra. |
| 240 | Gook Young-ran | 4 | Túlélők | 5 / 5 | Battlecry · Loyal Heart: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 241 | Shin Tae-hwan | 5 | Túlélők | 6 / 9 | Rally · Taesung Influence: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 242 | Yang Chun-hee | 4 | Túlélők | 4 / 6 | Kör vége · Family Bonds: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 365 | Lee Ki-chul | 2 | Semleges | 3 / 4 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +1/+0-t kapnak. |
| 366 | Gook Dae-hwa | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### The Lord of the Rings

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 243 | Frodo Baggins | 3 | Harcosok | 5 / 6 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 244 | Samwise Gamgee | 1 | Őrzők | 2 / 2 | Battlecry · Carry You: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 245 | Aragorn | 5 | Harcosok | 6 / 9 | Rally · Return of the King: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 246 | Legolas | 5 | Harcosok | 8 / 8 | Harc eleje · Elven Bow: Harc elején 7 sebzést okoz egy véletlen ellenségnek. |
| 247 | Gimli | 2 | Harcosok | 2 / 6 | Passzív · Dwarven Defense: Őrző: magára vonja az ellenséges támadásokat. |
| 248 | Gandalf | 4 | Misztikusok | 5 / 5 | Battlecry · You Shall Not Pass: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 249 | Boromir | 4 | Harcosok | 5 / 7 | Deathrattle · Last Stand: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 250 | Gollum | 3 | Bajkeverők | 3 / 11 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 367 | Bilbo Baggins | 3 | Semleges | 4 / 5 | Kör eleje · A köröd elején 1 extra aranyat kapsz. |
| 368 | Galadriel | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |
| 386 | Eomer | 6 | Harcosok | 8 / 9 | Battlecry · Kijátszáskor a közvetlen szomszédai tartósan +5/+5-öt kapnak. |

### Lord of Mysteries

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 251 | Klein Moretti | 3 | Misztikusok | 5 / 6 | Passzív · Lopakodás: Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak. |
| 252 | Audrey Hall | 1 | Misztikusok | 2 / 2 | Battlecry · Spectator: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 253 | Alger Wilson | 2 | Misztikusok | 2 / 3 | Kör eleje · The Hanged Man: A köröd elején tartósan +1/+2-t kap. |
| 254 | Derrick Berg | 2 | Misztikusok | 2 / 6 | Passzív · The Sun: Őrző: magára vonja az ellenséges támadásokat. |
| 255 | Fors Wall | 3 | Misztikusok | 3 / 4 | Kör vége · The Magician: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 256 | Xio Derecha | 4 | Misztikusok | 5 / 5 | Harc eleje · Judgement: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 257 | Leonard Mitchell | 4 | Misztikusok | 4 / 6 | Kör vége · The Star: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 258 | Amon | 5 | Misztikusok | 7 / 6 | Deathrattle · Error: Halálakor 5 sebzést okoz minden ellenségnek. |
| 369 | Melissa Moretti | 4 | Semleges | 5 / 6 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 370 | Azik Eggers | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Vintage Story

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 259 | Seraph | 1 | Túlélők | 1 / 3 | Passzív · Újjászületés: Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely. |
| 260 | Surface Drifter | 2 | Élőholtak | 2 / 2 | Deathrattle · Rusty Claws: Halálakor megidéz egy 2/2-es Segítőt. |
| 261 | Corrupt Drifter | 2 | Élőholtak | 2 / 6 | Passzív · Deep Cave Horror: Őrző: magára vonja az ellenséges támadásokat. |
| 262 | Locust | 3 | Technológusok | 3 / 4 | Kör vége · Clockwork Skitter: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 263 | Sawblade Locust | 3 | Technológusok | 4 / 5 | Rally · Spinning Blade: Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra. |
| 264 | Bell | 5 | Technológusok | 5 / 8 | Kör eleje · Cave Alarm: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 265 | Wolf (Vintage Story) | 5 | Vadak | 7 / 6 | Deathrattle · Forest Ambush: Halálakor 5 sebzést okoz minden ellenségnek. |
| 266 | Trader | 1 | Túlélők | 2 / 2 | Battlecry · Wagon Supplies: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 371 | Raccoon | 5 | Semleges | 6 / 7 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 372 | Temporal Storm Drifter | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Spider-Man

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 267 | Peter Parker / Spider-Man | 3 | Őrzők | 3 / 6 | Harc eleje · Spider-Sense: Védőpajzsot kap erre a harcra. |
| 268 | Miles Morales | 3 | Őrzők | 5 / 4 | Első támadás · Venom Strike: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 269 | Gwen Stacy / Ghost-Spider | 2 | Őrzők | 4 / 3 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |
| 270 | Mary Jane Watson | 1 | Túlélők | 2 / 2 | Battlecry · Face It Tiger: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 271 | May Parker | 4 | Túlélők | 4 / 6 | Kör vége · Great Responsibility: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 272 | Green Goblin | 5 | Bajkeverők | 8 / 11 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |
| 273 | Doctor Octopus | 2 | Technológusok | 2 / 6 | Passzív · Mechanical Arms: Őrző: magára vonja az ellenséges támadásokat. |
| 274 | Venom | 6 | Vadak | 9 / 13 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |
| 373 | J. Jonah Jameson | 6 | Semleges | 7 / 8 | Kör eleje · A köröd elején a közvetlen szomszédai tartósan +3/+2-t kapnak. |
| 374 | Felicia Hardy / Black Cat | 3 | Minden típus | 3 / 5 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |
| 387 | Ned Leeds | 6 | Őrzők | 8 / 9 | Battlecry · Kijátszáskor a közvetlen szomszédai tartósan +5/+5-öt kapnak. |

### 9-1-1

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 275 | Bobby Nash | 5 | Őrzők | 6 / 9 | Rally · Captain of the 118: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 276 | Athena Grant | 2 | Őrzők | 2 / 6 | Passzív · Police Sergeant: Őrző: magára vonja az ellenséges támadásokat. |
| 277 | Evan “Buck” Buckley | 2 | Őrzők | 3 / 4 | Rally · Ladder Rescue: Minden támadásakor +2 támadást kap erre a harcra. |
| 278 | Henrietta Wilson | 1 | Őrzők | 2 / 2 | Battlecry · Paramedic Care: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 279 | Howard “Chimney” Han | 4 | Őrzők | 5 / 5 | Harc eleje · Emergency Support: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 280 | Eddie Diaz | 3 | Őrzők | 3 / 6 | Harc eleje · Rescue Training: Védőpajzsot kap erre a harcra. |
| 281 | Maddie Buckley | 4 | Őrzők | 4 / 6 | Kör vége · Dispatch Coordination: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 282 | Christopher Diaz | 1 | Őrzők | 1 / 3 | Battlecry · Brave Steps: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 375 | Josh Russo | 1 | Semleges | 2 / 3 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 376 | Karen Wilson | 4 | Minden típus | 4 / 6 | Rally · Minden támadásakor +2 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Hero (2002)

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 283 | Nameless | 3 | Harcosok | 3 / 6 | Passzív · Méreg: Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el. |
| 284 | Broken Sword | 1 | Harcosok | 2 / 2 | Battlecry · Calligraphy of Peace: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 285 | Flying Snow | 2 | Harcosok | 2 / 6 | Passzív · Szélvész: Kétszer támad a saját támadási körében, ha túléli az első támadást. |
| 286 | Long Sky | 3 | Harcosok | 3 / 4 | Kör vége · Courtyard Duel: A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap. |
| 287 | Moon | 1 | Harcosok | 1 / 3 | Battlecry · Apprentice’s Resolve: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 288 | King of Qin | 5 | Harcosok | 5 / 8 | Kör eleje · All Under Heaven: A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap. |
| 289 | Qin Archer | 5 | Harcosok | 7 / 6 | Deathrattle · Arrow Volley: Halálakor 5 sebzést okoz minden ellenségnek. |
| 290 | Qin Palace Guard | 2 | Harcosok | 2 / 2 | Deathrattle · Palace Formation: Halálakor megidéz egy 2/2-es Segítőt. |
| 377 | Court Musician | 2 | Semleges | 3 / 4 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +0/+1-t kapnak. |
| 378 | Qin Cavalry Rider | 5 | Minden típus | 5 / 7 | Rally · Minden támadásakor a közvetlen szomszédai +4 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### The Residence

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 291 | Cordelia Cupp | 3 | Bajkeverők | 5 / 4 | Első támadás · Birdwatcher’s Eye: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 292 | Edwin Park | 4 | Bajkeverők | 5 / 5 | Harc eleje · Federal Partner: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 293 | A.B. Wynter | 4 | Bajkeverők | 5 / 7 | Deathrattle · Household Protocol: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 294 | Jasmine Haney | 1 | Bajkeverők | 2 / 2 | Battlecry · Assistant Usher: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 295 | Lilly Schumacher | 2 | Bajkeverők | 2 / 3 | Kör eleje · State Dinner Pressure: A köröd elején tartósan +1/+2-t kap. |
| 296 | Harry Hollinger | 2 | Bajkeverők | 2 / 6 | Passzív · Chief Adviser: Őrző: magára vonja az ellenséges támadásokat. |
| 297 | Perry Morgan | 5 | Bajkeverők | 6 / 9 | Rally · Presidential Address: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 298 | David Rylance | 1 | Bajkeverők | 1 / 3 | Battlecry · Diplomatic Guest: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 379 | Nan Cox | 3 | Semleges | 4 / 5 | Kör vége · A köröd végén a közvetlen szomszédai tartósan +2/+2-t kapnak. |
| 380 | Didier Gotthard | 6 | Minden típus | 6 / 8 | Rally · Minden támadásakor a közvetlen szomszédai +5 támadást kapnak erre a harcra. Minden törzs tagjának számít. |

### Fawlty Towers

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 299 | Basil Fawlty | 2 | Bajkeverők | 3 / 4 | Rally · Hotel Tantrum: Minden támadásakor +2 támadást kap erre a harcra. |
| 300 | Sybil Fawlty | 2 | Bajkeverők | 2 / 6 | Passzív · Front Desk Authority: Őrző: magára vonja az ellenséges támadásokat. |
| 301 | Polly Sherman | 4 | Bajkeverők | 5 / 5 | Harc eleje · Quick Cover Story: A bal oldali szomszéd védőpajzsot kap erre a harcra. |
| 302 | Manuel | 1 | Bajkeverők | 1 / 3 | Battlecry · Learning the Ropes: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 303 | Major Gowen | 4 | Bajkeverők | 4 / 6 | Kör vége · Lobby Regular: A köröd végén mindkét szomszédja tartósan +2/+2-t kap. |
| 304 | Terry Hughes | 1 | Bajkeverők | 2 / 2 | Battlecry · Kitchen Service: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 305 | Miss Tibbs | 3 | Bajkeverők | 3 / 6 | Harc eleje · Familiar Routine: Védőpajzsot kap erre a harcra. |
| 306 | Miss Gatsby | 4 | Bajkeverők | 5 / 7 | Deathrattle · Long-Term Guest: Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra. |
| 381 | Mr. Hutchinson | 4 | Semleges | 5 / 6 | Deathrattle · Ha meghal, megidéz egy 2/2-es Segítőt. |
| 382 | Mr. O’Reilly | 1 | Minden típus | 1 / 3 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

### Dixit

| ID | Character / role | Tier | Tribe | Attack / health | Ability |
| --- | --- | --- | --- | --- | --- |
| 307 | Dixit Storyteller | 1 | Misztikusok | 2 / 2 | Battlecry · One Cryptic Clue: Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap. |
| 308 | Dixit Dreamer | 1 | Misztikusok | 1 / 3 | Battlecry · Dream Journey: Kijátszáskor véglegesen +2/+1 értéket kap. |
| 309 | Dixit Rabbit | 2 | Misztikusok | 3 / 4 | Rally · Scoring Track Hop: Minden támadásakor +2 támadást kap erre a harcra. |
| 310 | Dixit Guardian | 2 | Misztikusok | 2 / 2 | Deathrattle · Protect the Tale: Halálakor megidéz egy 2/2-es Segítőt. |
| 311 | Dixit Wanderer | 3 | Misztikusok | 3 / 6 | Harc eleje · Unknown Path: Védőpajzsot kap erre a harcra. |
| 312 | Dixit Illusionist | 3 | Misztikusok | 5 / 4 | Első támadás · Misleading Image: Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap. |
| 313 | Dixit Stargazer | 4 | Misztikusok | 5 / 5 | Battlecry · Guiding Constellation: Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap. |
| 314 | Dixit Muse | 5 | Misztikusok | 6 / 9 | Rally · Shared Imagination: Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra. |
| 383 | Dixit Voting Rabbit | 5 | Semleges | 6 / 7 | Kör vége · A köröd végén egy véletlen 1. szintű miniont kapsz a közös készletből, ha elfér a kezedben. |
| 384 | Dixit Dreamweaver | 2 | Minden típus | 2 / 4 | Rally · Minden támadásakor +1 támadást kap erre a harcra. Minden törzs tagjának számít. |

## Neutral trigger amplifiers

| ID | Minion | Tier | Type | Attack / Health | Effect |
|---|---|---|---|---|---|
| 392 | A műsorvezető | 5 | Semleges | 3 / 7 | Passzív · Amíg a tábládon van, a saját Battlecry hatásaid kétszer futnak le. Arany változatban háromszor. |
| 393 | Visszhangőr | 5 | Semleges | 2 / 9 | Passzív · Amíg a tábládon van, a saját Deathrattle hatásaid kétszer futnak le. Arany változatban háromszor. |
| 394 | Záróra mestere | 6 | Semleges | 5 / 7 | Passzív · Amíg a tábládon van, a saját kör végi hatásaid kétszer futnak le. Arany változatban háromszor. |

## Original character heroes

The 35 playable heroes use their own character portraits. Their powers and starting-health modifiers are listed in [the hero power specification](hero-powers-spec.md).

| Hero ID | Name | Portrait |
| --- | --- | --- |
| original-1 | Gergő | /portraits/sketch/1.png |
| original-2 | Dávid | /portraits/sketch/2.png |
| original-3 | Vera | /portraits/sketch/3.png |
| original-4 | Milán | /portraits/sketch/4.png |
| original-5 | Villő | /portraits/sketch/5.png |
| original-6 | Viki | /portraits/sketch/6.png |
| original-7 | Nao | /portraits/sketch/7.png |
| original-8 | Levi | /portraits/sketch/8.png |
| original-9 | Giga | /portraits/sketch/9.png |
| original-10 | Mihály | /portraits/sketch/10.png |
| original-11 | Márk | /portraits/sketch/11.png |
| original-12 | Kevin | /portraits/sketch/12.png |
| original-13 | Marci | /portraits/sketch/13.png |
| original-14 | Tibi | /portraits/sketch/14.png |
| original-15 | Maja | /portraits/sketch/15.png |
| original-16 | Balázs | /portraits/sketch/16.png |
| original-17 | Fruzsi | /portraits/sketch/17.png |
| original-18 | Feri | /portraits/sketch/18.png |
| original-19 | Bea | /portraits/sketch/19.png |
| original-20 | Vanda | /portraits/sketch/20.png |
| original-21 | Dani | /portraits/sketch/21.png |
| original-22 | M. Geri | /portraits/sketch/22.png |
| original-23 | Tomi | /portraits/sketch/23.png |
| original-24 | Brigi | /portraits/sketch/24.png |
| original-25 | Csolti | /portraits/sketch/25.png |
| original-26 | Csefi | /portraits/sketch/26.png |
| original-27 | Ági | /portraits/sketch/27.png |
| original-28 | Csabi | /portraits/sketch/28.png |
| original-29 | iSTI | /portraits/sketch/29.png |
| original-30 | SIMON | /portraits/sketch/30.png |
| original-31 | OLAJOS | /portraits/sketch/31.png |
| original-32 | Rózsás | /portraits/sketch/32.png |
| original-33 | Lendvai Katalin | /portraits/sketch/33.png |
| original-34 | Ágoston | /portraits/sketch/34.png |
| original-35 | Ákos | /portraits/sketch/35.png |
