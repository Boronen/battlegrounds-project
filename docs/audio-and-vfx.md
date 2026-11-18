# Hőszenék és hangbejátszások

A `src/hero-media.ts` tartalmazza az űrlapból párosított hőszenéket és a három támadástípust. A válaszadó e-mail-címek nem kerültek a projektbe. A munkafüzet tartalmát adatként olvastuk, az eredeti fájl változatlan.

- Kevin, Dani, Csefi és Ákos megfeleltetése a felhasználó explicit megadásából származik. Dani „nincs kedvenc” válasza nem indít zenét.
- Gergő, Dávid, Vera, Milán, Tomi, Marci, Mihály, Villő, Tibi és Fruzsi megfeleltetése a nevek alapján történt.
- Csefi előadót adott meg: Palya Bea hivatalos videóoldaláról a Szabadon (Kobuci, 2026) az alapértelmezés. Mihály teljes Risk of Rain soundtrack-gyűjteményt adott meg: a The Rain Formerly Known as Purple lett az alapértelmezett. Ezek szabadon átírhatók a konfigurációban.
- Ákos új, 35. hős. Az Amondó eredeti albumlistája indul nála. Saját, helyben rajzolt portréja a `35.svg`, ennek PNG-változatát a `scripts/render-akos.ts` készíti.

A YouTube-lejátszó látható, vezérelhető, és végig megmarad a toborzás/harc váltások között. A némítás szünetelteti, új mérkőzés/eredmény leválasztja. Ha a böngésző tiltja az automatikus indítást, a lejátszóban lehet elindítani; az oldal ezt jelzi. Régiós/korhatáros/beágyazási korlátozás és hálózati hiba esetén az eredeti forráslink is elérhető. A dalokhoz internet kell. A YouTube-dalokat nem másoltuk helyi fájlokba.

A rövid bejátszások helyi MP3-fájlok. Sikeres saját kijátszás ACK-ja után indulnak, legfeljebb 3,5 másodpercig; az új bejátszás leállítja az előzőt, és lehalkítja a hőszenét. Sérült vagy nem lejátszható fájl esetén a játék tovább használható. Kör-/fázisváltáskor a rövid hangok leállnak. A ♪ csak ténylegesen bekötött bejátszásnál jelenik meg a kártyán/katalógusban, a ♫ a hős saját zenéjét jelöli.

27/35 franchise kapott ellenőrzött forrású bejátszást. Még nincs megfelelő fájl ezekhez: The Chosen, Shutter Island, East of Eden (2008), Lord of Mysteries, Vintage Story, Hero (2002), The Residence, Dixit. Ezekhez nem kapcsoltunk más műből származó keresési találatot. Új bejátszás a `src/series-audio.json` konfigurációhoz adható; a fájlt a megadott `file` útvonalra kell tenni. A `scripts/download-series-audio.mjs` a már ellenőrzött forrásokat tölti újra.

A hat alap játékhang valódi OGG-minta a Kenney hivatalos Starter Kit 3D Platformer tárhelyéről (CC0): https://github.com/KenneyNL/Starter-Kit-3D-Platformer . Letöltés: `node scripts/fetch-game-audio.mjs`. Nincs oszcillátoros vagy zajgenerátoros fallback. Források: `public/audio/sfx-sources.json`.

Franchise-részletek forrásai: Myinstants és TelevisionTunes, fájlonkénti URL-ekkel a `public/audio/series-sources.json` manifestben. Ezen részletek jogai az eredeti jogosultaké; nincs állított újraterjesztési licenc. Publikálás/deployment nem történt.

A látványelemek SVG/CSS rétegek, az animációk az eredeti ütés-pillanathoz szinkronizálva futnak. A támadó egység oldalához tartozó hős határozza meg az effektet, ezért az ellenfél csapata is a saját hősének effektjét használja. Gergő röplabdát, Kevin súlyzót, Dávid guminyomot kap. Ezek kizárólag látványelemek, az értékeket és harci szabályokat nem módosítják.

A hőslista bővülése miatt a katalógusverzió `franchise-357-heroes-35-v8`. A régi visszajátszások nem kompatibilisek; a szervert újra kell indítani, és új mérkőzést indítani.
