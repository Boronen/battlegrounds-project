# Végrehajtott ellenőrzések

Dátum: 2026. november 3. Környezet: Windows, Node.js 24.14.0; headless Microsoft Edge a böngészős teszthez.

| Ellenőrzés | Tényleges eredmény |
|---|---|
| TypeScript `tsc --noEmit` | Sikeres |
| Vite kiadási build | Sikeres, 58 modul; kliens JavaScript körülbelül 295 KB, gzip körülbelül 91 KB |
| Motor és hálózat | 22 teszt sikeres, 0 hibás |
| Nyolcbotos szimuláció | 100 külön seed, mind befejeződött; 13–21 kör |
| Azonos szimulációk ismétlése | Újabb 100 meccs; azonos állapotlenyomat minden seednél |
| Készlet és állapot invariánsai | A szimulációk minden fázisában ellenőrizve; nem volt negatív vagy elveszett példány |
| Böngészős végigjátszás | Indítás, hős, vétel, kijátszás, fagyasztás, újratöltés/visszacsatlakozás, harc, kézi esemény, következő kör, export és újrafuttatás, teljes automatikus meccs sikeres |
| Konzol | 0 JavaScript-oldalhiba a böngészős tesztben |
| Mobil | 390×844 nézet ellenőrizve; teljes, 7 egységes saját és ellenfélcsapattal is 390 px dokumentumszélesség, nincs oldalsó túlcsordulás |
| Időzített mód | Szerveroldali ticker tesztben automatikus hősválasztás, vásárlás → harc → következő kör; szünet és folytatás ellenőrizve |

Géppel olvasható szimulációs eredmény: `test-results/soak.json`. Böngészős eredmény: `test-results/browser.json`. A képernyőképek ugyanebben a mappában találhatók; a mappa helyi ellenőrzési eredmény, nincs verziókezelésbe véve.

A tesztek a saját demó szabályainak következetességét igazolják. Valós többemberes terhelési teszt, Laravel-integrációs teszt és az eredeti Battlegrounds minden interakciójával végzett összehasonlítás még nem történt. A karakterek kiegyensúlyozottságát ezekből a tesztekből nem állítjuk.

## Harci megjelenítés frissítése

A `test:polish` böngészős ellenőrzés a célpont irányába mozgó támadót, a találati számokat és a harci buffjelzést valódi szerveres meccsben ellenőrizte. Az asztali és 390×844 mobilnézeten nem volt vízszintes túlcsordulás; a csökkentett mozgás mellett nem futott utazó vagy rázó animáció. Konzolhiba: 0. A teljes böngészős játékmenetteszt ismét sikeres.

A harc eredményét továbbra is a szerver határozza meg. A felület az összetartozó támadás, viszontsebzés és halálesemények csoportjait animálja; az exportált események és a játékszabályok változatlanok. Az aréna saját CSS- és SVG-rajz, a mozgások saját prezentációs időzítések; eredeti kliensanimációk kinyerése nem történt.

## Képes tábla és hang ellenőrzése

Az új böngészős teszt betöltötte a táblaképet, ellenőrizte mindkét portréhely képét, és tényleges Web Audio oszcillátor- és zajforrás-létrehozást észlelt felhasználói interakció után. Némítás után az animált harc nem hozott létre új hangforrásokat. A célpontig tartó teljes elmozdulást külön teszt ellenőrzi mindkét támadási irányban. A mobilos tábla görgethető, a dokumentum nem lóg ki vízszintesen; a kéz külön területen marad. A teljes böngészős meccs- és visszajátszási teszt, valamint a csökkentett mozgás ellenőrzése ismét sikeres. Konzolhiba: 0.

A hang kimenetét a fej nélküli böngészős teszt nem hallás alapján értékeli; a hangforrások működését és a némítást ellenőrzi. Eredmény: `test-results/board-audio.json`. Új képernyőképek: `classroom-board-desktop.png` és `classroom-board-mobile.png`.
