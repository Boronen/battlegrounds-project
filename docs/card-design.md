# Card template, first pass

All minions share one layout. Tribe identity comes from the frame silhouette, palette, surface pattern, and printed tribe name. There are no minion-specific icons or illustrations. Hero portraits remain separate.

| Tribe | Material and pattern |
| --- | --- |
| Warriors | Copper, diagonal bands, angular frame |
| Guardians | Blue steel, vertical lines, shield curves |
| Mystics | Amethyst, concentric rings, rounded opposing corners |
| Technologists | Teal alloy, circuit grid, square corners |
| Survivors | Worn brass, paper grain, restrained frame |
| Beasts | Moss green, organic lines, leaf curves |
| Undead | Aged bone, weathered lines, gothic arch |
| Tricksters | Mulberry, diamond pattern, asymmetric corners |
| Neutral | Slate, silver trim, subtle horizontal grain |
| All-type | Prismatic surface, gold trim, rounded frame |

The catalog uses the full template: tier at the top, decorative surface, nameplate, franchise, ability text, tribe label, and fixed attack/health badges. Shops, boards, combat, and hands use a compact version of the same surface and frame. Gold cards retain a gold frame; shields, Taunt, and buff indicators remain separate game-state overlays.

Implementation: `src/card-templates.css` and `src/TribeSurface.tsx`. Colors use shared CSS variables; changing a tribe updates every card of that tribe.

Run `npm run test:card-templates` to generate `test-results/card-templates.html` and `test-results/card-templates.png`, a side-by-side design sheet for all eight tribes. Run `npm run test:card-pool` to check the templates in the actual catalog and compact game layout.
