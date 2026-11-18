# Session progress

Date: November 13, 2026

## Current state

- 357 recruitable card designs across 35 franchises.
- 35 heroes: the original 34 characters plus Ákos, added on November 17. Music/VFX details and the remaining eight franchise clips are recorded in the latest section.
- 24 heroes have implemented powers; the other 11 remain unavailable. Invite-code online play is live; see the latest deployment section. Every hero starts with 30 health and 0 armor. Current behavior is documented in `docs/hero-powers-spec.md`.
- Hero selection offers three choices and three full rerolls. Previously offered heroes cannot reappear during that player's selection.
- New games receive random seeds automatically; explicit seeds remain available for testing.
- Each match selects five of eight tribes and uses exactly 80 card designs.
- The in-game catalog shows only the current match's roster and supports tier, tribe, and text filters.
- Shared card templates distinguish the eight tribes, Neutral cards, and All-type cards without individual minion illustrations.

## Work completed

### Source review and franchise expansion

- Read the existing project, catalog, rules, engine, UI, and tests.
- Read the supplied Google Sheet through the Google Drive/Sheets connector:
  https://docs.google.com/spreadsheets/d/12-yiKDrUfcKbvt3uSmqeaNBMDTqcgJeUYipqaQk9R_c/edit
- Used the survey's movie, series, and game columns to identify franchises. Respondent email addresses were not copied into project artifacts.
- Initially worked through Back to the Future and Jake Long: American Dragon with user approval, then expanded the remaining franchises in one batch at the user's request.
- Added eight cards per franchise, with initial tiers, stats, ability names, and effects supported by the existing engine.
- Preserved the original card IDs when expanding the collection.
- Documented interpretations: merged Star Wars entries, combined the two South Park games, used James Cameron's Avatar, used a broad Spider-Man roster, and split responses containing multiple titles.
- Used creatures, vehicles, or roles where appropriate. Dixit cards are explicitly custom game-inspired roles rather than an official named cast.
- Added roster documentation and a generation script for the roster document and legacy placeholder assets.

### Hero migration

- Moved the 34 original characters out of the recruitable pool and into the hero roster.
- Replaced the four previous heroes.
- Added hero portrait fields and updated portrait rendering.
- Represented unavailable powers explicitly, disabled their UI control, and rejected power commands on the server without changing game state or spending gold.
- Updated bots so unavailable powers do not interfere with their turns.

### Hero choices and rerolls

- Increased offers from two heroes to three.
- Added three rerolls, each replacing all three offers.
- Tracked offered hero IDs and remaining rerolls per player.
- Prevented repeated offers, selection of discarded offers, and rerolls after selection or after the allowance is exhausted.
- Preserved selection history through snapshots, reconnects, and replay reconstruction.
- Kept timed selection deadlines unchanged when rerolling.

### Random seeds and local server troubleshooting

- Removed the fixed seed from the default startup flow.
- Added random nonzero 32-bit seeds on the server when no seed is supplied.
- Added browser-side seed generation so ordinary starts also send an explicit valid random seed.
- Prevented the immediately preceding seed from being reused on automatic starts within the same connection/browser flow.
- Preserved explicit test seeds and recorded seeds in snapshots and replay exports.
- Reproduced the reported invalid-seed error against the running localhost server. The backend was still running older code while the browser had updated.
- Restarted that stale server and verified starting with an empty seed field in the browser.
- Subsequently stopped my verification server when it conflicted with the user's own `npm run dev`, and confirmed ports 5173 and 24678 were free.

### In-game card catalog

- Added the Kártyakatalógus button and an accessible modal browser.
- Added grouping and filters for tiers 1–6, plus search by name, franchise, and ability.
- Displayed names, stats, ability text, franchise, and tribe.
- Added Escape dismissal, focus return, empty results, and mobile layout support.
- Changed the catalog from the entire collection to server-provided active match card IDs.
- Kept active designs visible even when their remaining copies run out.
- Added active tribe filters, Neutral and All-type filters, and combined tribe/tier filtering.
- All-type cards appear in each active tribe's filter; Neutral cards appear in the Neutral filter.

### Tribes and active match pools

- Added eight thematic tribes: Warriors, Guardians, Mystics, Technologists, Survivors, Beasts, Undead, and Tricksters.
- Kept tribe identity separate from franchise tags and added individual assignment exceptions.
- Added deterministic selection of five random tribes using the match seed.
- Added public active tribe/card IDs to snapshots without exposing private remaining copy counts.
- Restricted shops and triple discoveries to the selected active roster.
- Updated pool conservation checks and versioned the changed rules and catalog for replay compatibility.
- Introduced an initial 80-card selection scheme, then replaced it with exact per-tribe quotas when Neutral and All-type cards were added.

### Card template design

- Created a shared CSS frame and abstract surface component for catalog and compact in-game cards.
- Added tribe-specific palettes, surface patterns, and frame geometry.
- Kept tier, name, ability, attack, and health positions consistent.
- Removed individual minion portraits from the current card rendering; hero portraits remain separate.
- Preserved gold-card treatment and existing combat-state indicators.
- Added Neutral and All-type frame variants.
- Generated a standalone HTML design sheet and PNG preview under `test-results/` and inspected screenshots.

### Neutral, All-type, and tribe coverage expansion

- Added one Neutral and one All-type adaptation from every franchise: 70 new cards.
- Added seven support cards to fill specific tribe/tier shortages: Darth Maul, Eomer, Ned Leeds, Dave McFly, Linda McFly, Thanator, and Yuria of Londor.
- Added a shared membership helper: All-type cards match every tribe; Neutral cards match none.
- Established the current fixed match composition:

| Category | Designs per match | Tier distribution, 1–6 |
| --- | --- | --- |
| Each of five active tribes | 12 each, 60 total | 2 / 2 / 2 / 2 / 2 / 2 per tribe |
| Neutral | 12 | 2 / 2 / 2 / 2 / 2 / 2 |
| All-type | 8 | 2 / 2 / 1 / 1 / 1 / 1 |
| Total | 80 | 14 / 14 / 13 / 13 / 13 / 13 |

- Shared cards occupy separate slots and are counted once in the 80-card roster.
- Retained finite copy counts of 15 / 15 / 13 / 11 / 9 / 7 by tier.

## Validation

The final implementation passed:

- `npm test`: 43 tests.
- `npm run build`: TypeScript checking and Vite production build.
- `npm run test:card-pool`: active roster filtering, Neutral/All-type membership, search, tier combinations, reconnect, keyboard dismissal, and mobile fit.
- `npm run test:card-templates`: ten distinct card template variants, no individual character artwork, and mobile overflow checks.
- `npm run test:soak`: 100 matches, each repeated once; all finished, results were deterministic, and pool conservation held. The final run finished between rounds 12 and 16.

Earlier browser checks also covered hero selection, all three rerolls, disabled powers, portraits, buying/playing cards, and reconnect behavior.

Mechanics tests that require specific cards use a full-collection test fixture. Separate production-pool tests exercise the actual 80-card selection, including coverage across all 56 possible five-tribe combinations.

The sandbox initially prevented Node worker/esbuild processes from launching (`spawn EPERM`). Required test and build commands were rerun successfully with tool-managed escalation.

## Main files and artifacts

| Area | Files |
| --- | --- |
| Card and hero definitions | `shared/catalog.ts`, `shared/original-heroes.ts`, `shared/back-to-the-future.ts`, `shared/american-dragon.ts`, `shared/franchise-expansion.ts`, `shared/shared-cards.ts` |
| Tribes and match selection | `shared/tribes.ts`, `shared/match-pool.ts` |
| Engine, state, and protocol | `shared/engine.ts`, `shared/types.ts`, `shared/rules.ts`, `server/session.ts`, `server/index.ts` |
| Hero command routing | `shared/classes/ChooseHeroCommand.ts`, `shared/classes/MatchController.ts` |
| UI | `src/main.tsx`, `src/HeroPortrait.tsx`, `src/CardPool.tsx`, `src/TribeSurface.tsx` |
| Styling | `src/card-pool.css`, `src/card-templates.css`, `src/classroom-theme.css` |
| Documentation | `README.md`, `docs/card-pool.md`, `docs/card-design.md`, `docs/rules.md`, `docs/protocol.md` |
| Generation | `scripts/generate-franchise-assets.ts` |
| Tests | `tests/catalog.test.ts`, `tests/heroes.test.ts`, `tests/match-pool.test.ts`, `tests/network.test.ts`, `tests/engine.test.ts`, `tests/fixtures.ts`, `tests/heroes-browser.ts`, `tests/card-pool-browser.ts`, `tests/card-templates-browser.tsx` |
| Design previews | `test-results/card-templates.html`, `test-results/card-templates.png`, `test-results/catalog-templates.png`, `test-results/game-templates.png` |

## Tools used

| Tool or capability | Use during this session |
| --- | --- |
| `functions.exec` | Coordinated tool calls and independent checks. |
| `exec_command` with PowerShell | Read project files, ran scripts, inspected processes/ports, and ran development and validation commands. |
| `rg` / `rg --files` | Located definitions, call sites, tests, and outdated references. |
| `apply_patch` | Created and edited source files, tests, styles, and documentation. |
| Node.js scripts | Generated structured card definitions, updated files, counted tier/tribe coverage, and generated documentation/assets. |
| npm and tsx | Ran TypeScript scripts, the server, tests, and generation commands. |
| TypeScript and Vite | Checked types and built production bundles. |
| Google Sheets skill | Followed the spreadsheet metadata and bounded-read workflow for the source survey. |
| Google Drive/Sheets connector | Used `get_spreadsheet_metadata` and `get_spreadsheet_range` to read the provided source. The source spreadsheet was not edited. |
| `web.run` | Checked uncertain franchise/cast details and recorded roster reference links. |
| `request_user_input_async` | Collected guidance on franchise scope and ambiguous source entries. |
| Playwright with Microsoft Edge | Tested the real UI, reconnect behavior, filters, accessibility interactions, and mobile layouts; generated screenshots. |
| React server rendering | Built the standalone card-template design sheet from the shared surface component. |
| `view_image` | Visually inspected generated template and game screenshots. |
| `write_stdin` / tool wait | Collected results from running commands and stopped temporary verification servers. |
| Windows process/network cmdlets | Identified the stale local server, diagnosed port conflicts, stopped the identified server, and confirmed ports were released. |

No image-generation tool or sub-agents were used. Card templates are CSS/component-based. Legacy SVG placeholders were adapted locally rather than downloaded as individual minion artwork.

## Remaining work and limits

- Design and implement hero powers later, as requested.
- Playtest and tune card stats, tiers, and effects. Equal card availability does not prove equal combat strength.
- Add tribe-specific combat synergies if desired. Membership and filtering exist, but tribe labels currently grant no automatic combat bonuses.
- Review provisional tribe assignments and custom All-type adaptations, especially for franchises without conventional combat casts.
- Refine the first-pass card templates as needed.
- Restart `npm run dev` and start a new match after backend/rules changes. Browser hot reload alone does not reload this server's TypeScript game logic.
- Older replay files use earlier rules/catalog versions and are rejected by the existing compatibility checks.

This file records the work and checks performed during this session; no deployment or publication was performed.

## Hero icon and layout follow-up

- Reworked all 34 hero SVGs with distinct illustrative silhouettes, hairstyles, accessories, clothing colors, and backgrounds. These are stylized avatars, not likenesses of the real people.
- Added `scripts/generate-hero-portraits.ts` to reproduce the assets.
- Replaced the standings' initial letters with the corresponding hero portraits.
- Moved the player's entire hero dock out of the arena into a separate strip between the arena and hand. Health, armor, unavailable power, and gold remain together.
- Verified a full seven-card warband at 1440px, 1000px, and 390px widths: the hero dock stays below the arena and above the hand, without page overflow.
- Validation: 43 unit/integration tests, production build, and `npm run test:hero-layout` passed.
- Review artifacts: `test-results/hero-portraits.png`, `test-results/hero-dock-desktop.png`, and `test-results/hero-dock-mobile.png`.

## Portrait restoration and pencil-sketch artwork

- Restored the player hero dock inside the arena, using the original portrait, health, armor, power and gold positions.
- Raised the shop/opponent row by 6px. Raised the placed-card row by 4% of arena height plus 6px so a full seven-card board clears the restored portrait.
- Generated four graphite pencil portraits with the built-in image generator and wired them to the first four original heroes. Other heroes retain their existing artwork. Assets and source atlas are in `public/portraits/sketch/`; existing SVGs are preserved.
- Higgsfield generation was unavailable because the account requires Basic plan or higher; no image job was started there.
- Updated the existing hero layout check for the restored arena placement and mixed PNG/SVG portraits.
- Validation: production build and hero layout browser check passed at 1440px, 1000px and 390px; full-board portrait separation, page overflow and browser errors checked. Reviewed `test-results/hero-dock-desktop.png`.

## Complete illustrated hero card set

- Completed the pencil-sketch artwork for all 34 original heroes. Thirty new illustrations join the first four, each with individual clothing, hair, facial features and role-specific props.
- Mapped every hero to `public/portraits/sketch/1.png` through `34.png`; the merchant and fallback also use sketch portraits. Existing SVG assets are preserved.
- Added ivory paper and graphite card framing in `src/hero-cards.css` for hero selection, with larger desktop artwork and responsive mobile sizing.
- Preserved five six-character source atlases and their descriptions in `public/portraits/sketch/manifest.json`. Added `scripts/split-hero-atlas.ps1` for deterministic extraction.
- Added `npm run preview:hero-cards`, producing a labeled full-roster card gallery at `test-results/hero-cards.html` and `test-results/hero-cards.png`.
- Updated existing hero tests to validate 34 distinct PNG portraits. Extended hero layout verification to decode selection images and check desktop/mobile selection overflow.
- Validation: all 43 tests passed, production build passed, all 34 cards rendered in Edge, and hero selection/board layout checks passed at desktop/mobile widths. Reviewed the full card gallery and mobile hero selection screenshots.
- Generation used the built-in image generator, following the existing imagegen skill; no additional Higgsfield generation was attempted because the account's plan limitation was already established.

## Csefi portrait correction

- Corrected Csefi (`original-26`) to a woman, preserving the graphite style, leather jacket, rolled sleeves, wristwatch and coding scroll.
- Replaced `public/portraits/sketch/26.png` and corrected the artwork manifest. Atlas extraction preserves this standalone correction.
- Refreshed the full hero-card preview and production build.

## Rózsás portrait correction

- Corrected Rózsás (`original-32`) to a woman, preserving the graphite style, rectangular glasses, patterned waistcoat and teacher outfit.
- Updated `public/portraits/sketch/32.png` and the manifest override, so historical atlas extraction preserves the correction.
- Refreshed the full hero-card preview; production build passed.

## Board-integrated hero frames

- Added a shared `HeroFrame` component around the player and upper keeper/opponent portraits. The carved dark socket, beveled gold arch, crest gem and pedestal make portraits part of the board in both recruitment and combat.
- Preserved existing hero positions and external health/armor badges. Recessed portrait windows retain the pencil artwork; decorative SVGs are hidden from accessibility tools.
- Amber tavern gems become blue in combat, with a subtle cool rim on the pedestal. Frames use local SVG/CSS and work with every arena background.
- Validation: production build passed. The hero layout browser check passed at 1440px, 1000px and 390px, checked card clearance and page overflow, and verified both frames remain present with their phase-specific crest colors during combat. Reviewed recruitment and combat screenshots.
- Preview: `test-results/hero-dock-desktop.png` and `test-results/hero-frames-combat.png`.

## Combat keywords and balance pass

- Implemented Stealth, Windfury, Venomous and Reborn on 24 existing recruitable cards, six of each. Replaced old effects and tuned stats while preserving tiers, tribes, the 357-card collection and 80-design match roster.
- Added keyword state to units and combat snapshots. Golden cards double stats, not keyword charges. Windfury retargets and stops on death; stealth ignores attack targeting but not area damage; venom triggers on successful attack/retaliation damage; Reborn resolves after deathrattles with capacity and position checks.
- Combat-only consumption leaves recruitment units unchanged. Summoned helper tokens inherit no keywords. Updated bot evaluations to account for the new mechanics.
- Added visible keyword badges and translated explanations to shop/hand/board cards and the catalog. Catalog search accepts English keyword names as well as the translated text.
- Added nine mechanics/stress tests, keyword browser coverage and a reproducible balance benchmark. The benchmark compares each changed card against both baseline and updated same-tier peer teams, using six scenarios: duel, three units, seven units, +8/+8 buffs, golden cards and shields.
- Initial stat cuts were too harsh. Values were tuned and retested on fresh seeds. A raw xorshift-seed first-attack bias in the exploratory benchmark was identified and corrected; final comparisons use mixed combat seeds with an explicit side-sampling check. Exploratory reports are not the final evidence.
- Final benchmark: 576,000 paired-arm combats, 1,000 seeds per card/scenario/peer pool. Average team scores ranged from 44.81% to 55.11% across the two peer pools. Every card stayed within the predeclared 40–60% diagnostic band. First-attack proportions ranged from 46.8% to 54.7%.
- Validation: all 52 unit/integration tests passed; production build passed; keyword browser and hero layout checks passed. Full-match soak: 100 matches, each repeated once, finished in rounds 12–17 with deterministic results and pool conservation.
- Durable rules and measured results: `docs/keywords.md`, `docs/keyword-balance.md`, `docs/keyword-balance.json`. Detailed generated results remain in `test-results/keyword-balance.json`; UI previews include `test-results/keyword-board.png` and `test-results/keyword-catalog.png`.
- Limits: benchmark team score is win plus half a draw, not card or match win rate. Random same-tier boards and fixed buffs/shields do not prove competitive balance or cover every human strategy. Duel results are reported separately. Further playtesting remains necessary.
- Rules/catalog versions bumped to `bg-37.0-core-custom-5` / `franchise-357-heroes-34-v7`. Restart the development server and start a new match; older replays are incompatible.

## Arena furniture, modern lobby and combat visuals — November 17, 2026

- Replaced the welcome overlay with a responsive dark lobby, using the local `design-md/linear.app` and `design-md/playstation` references for typography, spacing, surfaces and image-led composition. Added arena previews, compact match settings and an explicit start action. Updated the header, catalog, test panel and results styling.
- Preserved all ten existing painted arena backgrounds and stable match-based selection. Added typed arena materials, palette tokens, emblems and normalized furniture anchors. Each theme has matching SVG details: chitin, foliage, shells, scales, bone, obsidian, coral, rope, tusks or crystals.
- Mounted upgrade, refresh and freeze controls on a continuous rim rail; placed the combat/next-round action in a bracketed plaque. SVG sockets provide bevels, fasteners, recessed faces, contact shadows and themed ornament. Labels, costs and icons remain HTML within semantic buttons. Disabled controls retain their structure; freezing has an explicit pressed state.
- Integrated hero trim, gold, timer, standings and the hand tray with the arena materials. Added a keyboard/click sell slot alongside drag/drop selling. Preserved all 34 pencil portraits and shared tribe card artwork. Rebalanced seven-unit rows and hero sockets, moved tablet standings beneath the full board, and retained horizontal scrolling on phones. Corrected mobile hero art cropping and background scaling.
- Added snapshot-derived visual descriptors for hits, shield gain/break, venom consumption, reborn, stealth reveal, windfury, buffs, summons and death. Effects use SVG/CSS and existing animation/audio timing; localized event text is never parsed. Empty-side summons use their side's row as a position fallback. Timers and animations cancel on beat/phase changes, and reduced motion retains static feedback.
- Kept command controls focusable while awaiting acknowledgment; the existing send guard prevents duplicate actions. Added busy semantics and keyboard/touch checks. No server protocol, gameplay rules, balance, replay versions or portrait assets changed.
- Replaced the obsolete `classroom-theme.css` with scoped arena, webpage and effects styles. Added `npm run test:arena-redesign` and four visual-transition tests. The expanded unit/integration suite has 56 passing tests.
- Validation includes production build; hero-layout, catalog, keyword, combat-polish and board/audio browser checks; and an isolated all-arena browser suite covering 40 recruitment/combat views at 1440px and 1000px, seven-unit teams, control hit areas, actual buy/play/sell drag/drop, freeze, keyboard focus/activation, touch, 390px lobby/selection/board layouts, reconnect, missing background artwork, shield-blocked venom, reborn and effect cleanup. Browser checks reported no page errors.
- Review artifacts: `test-results/arena-redesign/lobby-desktop.png`, `lobby-mobile.png`, `hero-mobile.png`, `board-mobile.png`, `venom-impact.png`, individual arena/phase/width screenshots, `all-arenas-contact-sheet.jpg` and `report.json`. Generated artifacts remain gitignored. Existing browser checks also refreshed their screenshots.
- All new graphics are local SVG/CSS. No Higgsfield/PixelLab generations, paid calls, credentials in source, installations, external publication or deployment were used. The user's existing `design-md/` directory was read and left intact.

## Animáció és köridő javítása — November 17, 2026

- Külön, megjegyzett animációkapcsoló került a fejlécbe, alapból bekapcsolva; a rendszer csökkentett mozgás beállítása nem tiltja felül a kifejezett választást.
- Normál módban csak a felkészülés időzített: 120 másodperc. Hősválasztás és harc időkorlát nélkül; a következő kör a meglévő gombbal indítható. A tesztmód kézi marad.
- Az alapértelmezett mód normál/időzített lett. A szervermódosításhoz újra kell indítani a fejlesztői szervert.

## Nagyobb VFX, valódi hangok és hőszenék — November 17, 2026

- Folytatás a fenti állapotból. Az új XLSX-válaszokat adatként olvastuk, az eredeti munkafüzet változatlan. E-mail-címeket nem másoltunk a projektbe.
- Nagyobb, többrétegű ütésvillanás, két lökéshullám, hosszabb szikrák, fényesebb támadási ív és nagyobb kulcsszóeffektek kerültek a harcba. Megmaradt az eredeti becsapódási időzítés és a csökkentett mozgás kapcsoló.
- Dávid csapatának támadásai motoros guminyomot és porfüstöt hagynak. Kevin csapata forgó súlyzót, Gergőé rajzolt röplabdát dob. A támadó oldal hőse választja az effektet, mindkét félre. A hőskártyák, saját hős és álláslista jelzik az egyedi effektet.
- Az összes procedurális hanggenerálást eltávolítottuk. Hat letöltött Kenney OGG-minta szól az alap műveleteknél; a hangkezelő korlátozza az átfedést és némításkor az aktív mintákat is leállítja.
- 27 franchise-hoz helyi, letöltött MP3-bejátszás kapcsolódik. Sikeres minion-kijátszás indítja, legfeljebb 3,5 másodpercig; új idézet megszakítja a régit. A ♪ jelzés csak ilyen kártyákon/katalógusbejegyzéseken jelenik meg. A hőszene az idézet alatt lehalkul.
- 13 hőshöz tartozik űrlap szerinti zene: Kevin, Gergő, Vera, Milán, Dávid, Tomi, Marci, Villő, Fruzsi, Csefi, Mihály, Tibi és Ákos. Dani „nincs kedvenc” válasza nem indít zenét. Az explicit négy megfeleltetést használtuk; a többit nevekből párosítottuk.
- Csefi előadói válaszához Palya Bea – Szabadon (Live, Kobuci, 2026), Mihály soundtrack-gyűjteményéhez Chris Christodoulou – The Rain Formerly Known as Purple lett dokumentált alapértelmezés. A megadott 12 videóazonosító mind feloldódott a YouTube oEmbed végpontján; Ákos az eredeti Amondó albumlistát használja.
- A látható YouTube-lejátszó toborzás és harc között folyamatos marad; a globális némítás szünetelteti. Hibás/elérhetetlen beágyazás és automatikus lejátszási tiltás külön visszajelzést kap. Élő YouTube-lejátszás régiós/böngészős viselkedése nem garantált; a célzott böngészőteszt a YouTube API-szerződést stubbal ellenőrzi, nem teljes külső streaminget.
- A felhasználó külön kérésére Ákos új, 35. hős lett, külön helyben rajzolt SVG/PNG-portréval. Az eredeti 34 hős neve és portréja megmaradt. A katalógusverzió `franchise-357-heroes-35-v8`; a régi replayek nem kompatibilisek. Újra kell indítani a szervert és új meccset indítani.
- Forrásjegyzékek: `public/audio/sfx-sources.json`, `public/audio/series-sources.json`. Dokumentáció és hiánylista: `docs/audio-and-vfx.md`. A franchise-hangokhoz nem állítunk újraterjesztési licencet. Publikálás nem történt.
- Nyitott: még nincs megfelelő bejátszás a The Chosen, Shutter Island, East of Eden (2008), Lord of Mysteries, Vintage Story, Hero (2002), The Residence és Dixit franchise-okhoz. A hasonló nevű, más művekből származó találatokat nem kötöttük be.
- A kért find-skills keresés megtörtént (game audio); új skillt nem telepítettünk. A Higgsfield eszközeit felderítettük; a valós idejű VFX helyi SVG/CSS-elemekből készült, új generálás vagy fizetős hívás nélkül.
- Ellenőrzés: 56/56 unit/integrációs teszt és production build sikeres. `npm run test:media` izolált valós szerveren mind a 33 helyi hangfájl dekódolását, sikeres kijátszás hangját, a három támadáseffektet, hőszene-párosítást, albumlistát, némítást és 390px-es túlcsordulásmentes nézetet ellenőrzött. YouTube API stubbal; helyi audio tényleges dekódolással. Előnézetek: `test-results/media/`.
- További végső ellenőrzés: a hőselrendezés tesztje desktop/tablet/mobil méreten sikeres; a 35 hős galériája frissült. A kézi léptetést használó elrendezésteszt saját fixture-je kézi módot kapott az időzített alapmód helyett.

## Hősképességek specifikációja — November 18, 2026

- A 15 hőshöz megadott képességeket és a szükséges engine/protokoll/UI-bővítéseket rögzítettük: docs/hero-powers-spec.md.
- Még nincs implementáció. Csefi pontos működése, a maximális arany szabályai és több meg nem adott költség/skála egyeztetés alatt van; a felhasználónak elküldött kérdésekre várunk.
- Kevin linkelt Upgrade-spellcsaládját átnéztük; a specifikáció szerinti 2/2 a követendő, nem az aktuális külső balansz.

## Hősképességek implementálása — November 18, 2026

- Elkészült a 19 kért hős képessége: Csefi, OLAJOS, Gergő, Mihály, Ágoston, Kevin, Vera, Milán, Villő, Viki, Nao, Levi, Giga, Márk, Marci, Tibi, Maja, Balázs és Fruzsi. A többi hős maradt képesség nélkül.
- A pontosított Csefi 1 támadású, nem célozható nyolcadik harcos, első támadással és csapatciklusonként további ütéssel. A hét rendes minion elvesztésekor véget ér a harca. A 2 aranyas fejlesztés +Tavern-szint tartós támadást ad, és arra a körre kihagyja a harcot. A portré támadásjelzőt kapott.
- OIL tartós maximumot és következő köröktől kezdő aranyat növel. Gergő elhalasztott jutalma korlátlanul hozzáadódik a következő kör kezdő aranyához. Az aranykezelés és a felület 10 fölötti értékeket is kezel.
- Új spellkínálat és külön spellkéz került a tábla alá; minionokkal közös 10-es kézkorlát. Kevin két saját Upgrade-spellhelyet kapott, a többi hős egy általános spellhelyet, így Mihály dupla cast jutalma valóban használható. A Battlecruiser fejlesztések helyi, 1–6 tierre skálázott adaptációk, nem a teljes külső Hearthstone-katalógus másolatai. A Magnetic-mech készlet három helyi statváltozatot tartalmaz.
- Küldetésszámlálás, cooldown, egyszeri képességek, generált lapok, kombinált minionképességek és megmaradó fejlesztések szerveroldali, replay-kompatibilis állapotban. A generált minionok nem módosítják a véges fizikai poolt; a saját tierjük számít a hőssebzésbe. Nem váltanak ki fizikai triplaegyesítést. Levi goldenizálása sem hoz létre két új poolmásolatot vagy tripla felfedezést.
- Tibi helyes tippje +1 arany (felhasználói pontosítás). Pontosan egy helyes opció; a másik a legközelebbi elérhető tierből, az ellenfél boardján nem szereplő lap. A helyes válasz csak a Match privát heroSecrets mezőjében van, nem kerül snapshotba; az opcióazonosítók nem árulják el. Üres boardnál később próbálható.
- Maja az előző ellenfél legutóbbi táblájának alaplapjait kínálja 1 aranyért. Balázs 0 aranyért egyszer, szabad boardhelyre idéz pontos saját másolatot, megtartott erősítésekkel, battlecry nélkül. Fruzsi körönként két újrahasználható aktív képesség közül választ; a passzívak, egyszeriek, önmaga és a passzív harcost is adó Csefi ki vannak zárva. A választott képesség saját ára érvényes, a már megszerzett jutalom megmarad.
- Képességpanel célpontválasztással, tippel, Fruzsi-választással, Marci-kombinálással, quest/cooldown státusszal és olvasható spellhatásokkal. Giga elszívásához helyi füstanimáció készült. A túl hosszú leírások kikerültek a portrédokkból; teljes szövegük a panelben van.
- Az alap botok is használják az új aktív képességeket/spelleket és a függő választásokat. A régi általános mechanikatesztek fix, kezdő miniont nem adó hőst használnak; az új tesztek külön ellenőrzik a passzív kezdő lapokat.
- Fő új fájlok: shared/hero-powers.ts, src/HeroPowerPanel.tsx, tests/hero-powers.test.ts, tests/hero-powers-browser.ts. A végleges működést a docs/hero-powers-spec.md írja le; ez felülírja a korábbi „még nincs implementáció” állapotot.
- Verzió: bg-37.0-core-custom-6 / franchise-357-heroes-35-v10. Szerver-újraindítás és új mérkőzés szükséges; régi replayek nem kompatibilisek.
- Végső ellenőrzés: 83/83 egység-/integrációs teszt, TypeScript+Vite production build, 19 hős izolált, valós parancsokat használó böngészőtesztje és a desktop/tablet/mobil hőselrendezés tesztje sikeres. Böngészős JavaScript-hiba nem volt. A külső YouTube a képességtesztben le van tiltva; a teszt a helyi játékot ellenőrzi.
- Előnézetek és böngészőjelentés: test-results/hero-powers/. A 15 hősös köztes változat 100 megismételt teljes meccse már sikeres volt (13–26 kör), determinisztikusan és poolmegmaradással; a végleges 19 hősös változat szimulációja külön ellenőrzés alatt.
- Korlát: a tesztek a helyes működést ellenőrzik, versenyegyensúlyt nem bizonyítanak. Publikálás/deployment nem történt.
- A végleges 19 hősös változat teljes szimulációja is sikeres: 100 meccs, mindegyik megismételve; minden meccs befejeződött 13–24 kör között, determinisztikusan, megőrzött poollal (175766 ms).
- Csefi külön harci böngészőellenőrzése is sikeres: hét rendes minion mellett a portréja animálva támad, támadásjelzővel, nyolcadik kártyahely elfoglalása nélkül. Előnézet: test-results/hero-powers/csefi-combat.png. README, szabályprofil és protokoll dokumentáció frissítve.
- Végső képi javítás: Csefi kis támadásjelzője nem örökli a régi portré-iniciálé nagy betűméretét. A harci böngészőteszt fix, harckezdeti buff nélküli csapatot használ, és a tényleges portréanimáció kezdetére vár; a 19 hősös böngészőteszt ezen is sikeres.

## Online meghívókódos teszt és öt további hős — November 18, 2026

- A 24 megadott hősképesség bekötve: Feri, Bea, Vanda, Dani és M. Geri új. Dani két ritka hőstámadására külön csatánkénti limit van. M. Geri HP-ja a hősé, +3 támadása Csolti jelenlétében minden ellenfél ellen tartós.
- Meghívókódos szobák 2–8 emberrel, maradék helyeken botokkal. Játékosonként hitelesített seat, saját snapshot, közös szimuláció, készre jelentkezés, visszacsatlakozás. Online tesztvezérlés és replay-export tiltva.
- 90/90 teszt és build sikeres. Két valódi Socket.IO-klienssel és két külön böngészővel tesztelt csatlakozás, közös match, saját board, parancsizoláció, újracsatlakozás és mobilnézet. Részletek: docs/online-testing.md.
- Railway csatlakoztatva, projekt és production környezet létrehozva. A felhasználó megerősítette a csillageri05-spec/Battlegrounds_project tárolót a deployhoz. Publikálás folyamatban; élő URL még nincs igazolva.
- Új verzió: bg-37.0-core-custom-7 / franchise-357-heroes-35-v11. Memóriában tárolt, egyreplikás tesztüzem; restart elveszíti a szobákat.

## Élő publikálás — November 18, 2026

- Élő URL: https://utolso-pad-production.up.railway.app
- Railway service: 9cd200a0-0977-4918-a6a9-7f9cb32cb66e; sikeres deployment: 21821f4e-6417-4a7e-859c-704755c7b493.
- Pontosan a 3388f5e16290ad794c611c6ddcd995cabd72bee7 commitra rögzítve a codex/invite-multiplayer ágról. A main ág változatlan. Az első Railway create művelet átmenetileg a main ággal indított buildet; a forrás ezután explicit a tesztelt commitra lett rögzítve, és ennek sikerét ellenőriztük.
- Az élő oldalon két külön böngészőmunkamenet szobakódos csatlakozása, közös hősválasztása, saját boardja, újratöltés utáni visszacsatlakozása és 390px-es túlcsordulásmentes nézete is sikeres. JavaScript-hiba nem volt. Előnézet: test-results/online/mobile.png.
- A későbbi kódmódosítások nem deployolnak automatikusan, amíg a Railway-forrás commit-rögzítése él. Új verzióhoz a forrást a következő ellenőrzött commitra kell átállítani.
- Végső javított publikáció: 2af21d762566764015b155cc39a84eef24cd821d, Railway b3888e3e-ee6e-4fe1-805d-d713390815c0, SUCCESS. Vanda minden egyidejű harci halált megőriz, Csefi a csapatciklusok után ismét támad. 92/92 teszt és build sikeres. Az online változat 100 megismételt meccse 13–24 kör alatt befejeződött (155313 ms; ez a két végső harci javítás előtti futás).

## Négy online hibajavítás — November 18, 2026

- Vanda generált lapjai triplázhatók, vegyes fizikai/virtuális példányokkal is. A golden lap valós másolatszáma pontosan megmarad; eladáskor nem kerül fiktív lap a poolba. Külön goldenizálás is tesztelve.
- A hősfrissítő a kártyák elé, jól látható, tapadó sávba került; mindhárom frissítés új ajánlatot ad és 0/3-nál tiltott.
- A hangok letöltött felvételekből dekódolt Web Audio-mintákon szólalnak meg. A kattintás/billentyű szinkronban hozza létre/feloldja az AudioContextet; előtöltés, némítás, maximális átfedés és megszakított függő lejátszás kezelve. Nincs oszcillátoros hanggenerálás. Hibánál látható visszajelzés van.
- A szavazás csak a csatlakozott, élő emberi helyekre vár; a kilépett helyet bot veszi át. A megszakadt kapcsolat visszatérhet a régi tokennel. Külön szobából kilépés, token-visszavonás és házigazda-átadás van. Hősválasztásnál 10 másodperc után a lecsatlakozott bot automatikusan választ. Több azonos tokenű lap közül egy bezárása nem jelenti az egész játékos kilépését.
- Ellenőrzés: 98 teszt, production build, kétböngészős hibaregresszió sikeres. Három online reroll desktop/mobil, valódi nemnéma dekódolt hangminták szigorú autoplay-szabállyal (7 forrás, mind running állapotban, 0 oszcillátor), némítás, disconnect utáni továbblépés és explicit kilépés. Előnézet/jelentés: test-results/bugfixes/.
- Verzió: bg-37.0-core-custom-8 / franchise-357-heroes-35-v12. Publikálás a meglévő Railway szolgáltatásra folyamatban.
- További kapcsolat-regressziók is sikeresek: az egyik böngészőlap bezárása nem állít botra egy másik lapon még csatlakozott játékost; hősválasztás közbeni kapcsolatvesztés 10 másodperc után automatikusan feloldódik. Végső teszteredmény: 100/100.
- Élő hibajavító release: 2f75bb9c425bec3cc6aab81b0dead571e6237237; Railway 32653859-9687-40e5-ab9d-7898845a24d6, SUCCESS. A korábbi 606e9edf-6bd0-4fb1-b8cb-bf736b96db22 build két utólag hozzáadott teszt TS-típusszűkítésén megállt; a tesztek javítva, teljes build és az öt kilépési teszt ismét sikeres. Az élő oldalon is lefutott a tests/bugfixes-browser.ts két böngészővel: 3 reroll, 7 nemnéma dekódolt felvételforrás running állapotban, 0 oszcillátor, működő némítás, disconnect utáni körváltás, explicit kilépés; böngészős hibák nélkül. Az új verzióhoz oldalfrissítés és új szoba szükséges.
