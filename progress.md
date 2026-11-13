# Session progress

Date: November 13, 2026

## Current state

- 357 recruitable card designs across 35 franchises.
- 34 heroes based on the original characters, with their original names and portraits.
- Hero powers are unavailable for now. Every hero starts with 30 health and 0 armor.
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
