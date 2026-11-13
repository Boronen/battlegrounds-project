# Original hero card artwork

The numbered PNG files map directly to `original-1` through `original-34` in `shared/original-heroes.ts`. Each illustration is a fictional character design inspired by the roster's hobbies and roles, not a likeness of a real person.

Style: graphite pencil on ivory paper, expressive comic anatomy, crosshatching and visible construction lines. Faces, hair, clothing and props distinguish each character. The first four portraits were created in the preceding design pass; the remaining thirty complete the same set.

`atlas.png` contains heroes 1–4 in two columns and two rows. The other source atlases contain six heroes each in three columns and two rows, ordered left to right, top to bottom. They are preserved alongside the extracted portraits.

To extract a six-portrait atlas again, run from the repository root:

```powershell
./scripts/split-hero-atlas.ps1 -AtlasPath public/portraits/sketch/atlas-5-10.png -FirstHero 5
```

Run `npm run preview:hero-cards` to render a labeled preview of every hero card to `test-results/hero-cards.html` and `test-results/hero-cards.png`. The preview uses the same card frame CSS as hero selection. Original SVG assets remain available in the parent directory.

Csefi (`26.png`) is a woman. Her portrait was corrected as a standalone image after the initial atlas generation. The historical `atlas-23-28.png` contains her earlier incorrect design; do not restore its fourth cell over the corrected portrait.

Rózsás (`32.png`) is a woman. Her corrected standalone portrait replaces the initial male design. The historical `atlas-29-34.png` retains that earlier design; atlas extraction preserves the corrected standalone portrait through the manifest override.
