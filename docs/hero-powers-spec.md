# Hősképességek — 2026-11-18

Az első 19 hősképesség alább; az öt további képesség (Feri, Bea, Vanda, Dani, M. Geri) és az élő többjátékos mód leírása: [online tesztverzió](online-testing.md). Összesen 24 képesség implementálva. A többi hős képessége változatlanul később érkezik.

| Hős | Működés |
| --- | --- |
| Csefi | 1 alap támadású, nem célozható nyolcadik harcos. Mindig ő üti az első támadást; utána saját csapatciklusonként egyszer támad. Nem kap visszaütési sebzést. Nem foglal minionhelyet, nem számít túlélőnek, és a rendes minionok elvesztésekor véget ér a harca. Toborzáskor 2 aranyért +Tavern-szint tartós támadásra fejleszthető; ebben a körben nem harcol. A fejlesztés kihagyása a támadás választása. |
| OLAJOS | OIL: 3 arany, körönként egyszer, +1 tartós maximum és a következő köröktől +1 körkezdő arany. 10 fölé nőhet. |
| Gergő | 0 arany, egy körre aktiválható. A kör eladásai nem adnak azonnali aranyat; a következő kör kezdetén minden ilyen eladás után +2 arany jár, a normál kezdő aranyon felül, korlát nélkül. |
| Mihály | Hősválasztáskor véletlen quest: 25 saját harci minionhalál után minden spell kétszer castolódik; vagy 7 saját battlecry kijátszása után a további battlecryok duplázódnak. A teljesítő hetedik battlecry még egyszer fut. A jutalom tartós; a halálokba az újjászületett és segítő minionok halálai is számítanak. Bolti/board elszívás nem harci halál. |
| Ágoston | D6, 1 arany: a dobás értékét kapja meg aranyban. A következő N teljes körben nem használhatja, az N+1. következő körben újra elérhető. |
| Kevin | Kezdéskor egyszer egy 2/2 Battlecruiser a kézbe. Két saját Upgrade-spellhely minden boltban. A fejlesztések a boardon levő Battlecruiserekre hatnak, nem normál minionokra. |
| Vera | 2 arany, körönként egyszer: kiválasztott bolti miniont a kézbe lop. |
| Milán | Kezdéskor egyszer Renata: 2/2, minden típusú, Venomous, a kézbe. |
| Villő | Minden minionvásárlás 2 arany. Kör végén a bolt automatikusan befagy. |
| Viki | Friss boltban két véletlen új minion egy-egy még nem birtokolt véletlen kulcsszót kap: Stealth, Windfury, Venomous vagy Reborn. Befagyasztott, megtartott minionokra nem halmoz új bónuszt. |
| Nao | Passzív: elvesztett harc sebzését a Tavern-szintjével csökkenti, a kör sebzéskorlátjának alkalmazása után; minimum 0. |
| Levi | 0 arany, egyszer a meccsben: egy saját nem arany minion goldenizálása. Az alap statok duplázódnak, a korábbi bónuszok megmaradnak. Nem keletkezik két új fizikai poolpéldány vagy tripla felfedezés. |
| Giga | 2 arany, körönként egyszer: saját vagy bolti minion elszívása, annak tierjével gyógyul, legfeljebb 30 HP-ra. Nem aktivál halálsikolyt. Füstös eltűnés. |
| Márk | 0 arany, körönként egyszer: friss bolt, első két lap eggyel magasabb tierből, maximum 6. Ha az adott tier véges poolja elfogyott, nem generál ingyen fizikai példányokat. |
| Marci | 3. körtől, 2 arany, körönként egyszer: két véletlen, aktív és a Tavern-szintnél nem magasabb lap. Az egyik statjait, törzsét és kulcsszavait, a másik képességét kapja az új minion. A statforrást a játékos választja. A rajz a kézbe kerül. |
| Tibi | 0 arany, körönként egyszer: két név közül megtippeli a következő ellenfél egyik minionját. Pontosan egy helyes opció van; a másik az aktív kollekcióból az elérhető legközelebbi tierből jön, és nincs az ellenfél boardján. Helyes tipp: +1 arany. Üres ellenféltábla esetén később próbálható, a képesség nem fogy el. Szellem ellenfél esetén a legutóbbi táblája számít. A helyes válasz külön, csak szerveroldali állapotban marad. |
| Maja | 1 arany, körönként egyszer: az előző harci ellenfél legutóbb látott minionjainak alapváltozataival tölti fel a boltot. Nem másolja a statbónuszokat vagy arany állapotot. Az első harc előtt nem használható. |
| Balázs | 0 arany, egyszer a meccsben: saját minion pontos másolatát idézi mellé a boardra, új azonosítóval, megtartott statokkal, arany állapottal, kulcsszavakkal és fejlesztésekkel. Kell szabad minionhely. Nem aktivál battlecryt. |
| Fruzsi | Minden toborzás elején két újrahasználható aktív képességből választ. A választott képesség saját ára és körenkénti korlátja érvényes. A következő körben új választás jön. Passzív, egyszer használható, saját és passzív harcost is adó Csefi-képességet nem kaphat. A már megszerzett jutalom, tartós aranynövelés és halasztott jutalom megmarad; a régi képesség függő választásai lejárnak. |

## Spellek és Battlecruiser

A bolt és kéz külön spellnézetet kapott a tábla alatt. Minden hősnek van egy általános spellhelye (2 arany: +tier/+tier erősítés vagy pajzs); Kevin helyette két saját fejlesztő spellhelyet kap. Ez valódi castolható spelleket biztosít Mihály jutalmához. A minionok és spellek közös kézkorlátja 10. A befagyasztás a megtartott spellkínálatot is őrzi.

A Battlecruiser-spellek a linkelt Upgrade-család helyi, 1–6 Tavern-szintre alkalmazott változatai. A skálázódó érték a vásárláskori Tavern-szint; a későbbi fejlesztés nem változtatja a már megvett spell értékét.

- Hyperflight Rotors / Smart Servos: +tier támadás / életerő, 1 arany.
- Yamato Cannon: +tier felhalmozott, harc eleji sebzés a legnagyobb HP-jú ellenfélre, 2 arany.
- Advanced Ballistics: minden támadáskor +tier támadás a többi szövetségesnek, 2 arany.
- Caduceus Reactor: halálkor a bal szélső túlélő +tier/+tier, 2 arany.
- Advanced Construction: 4. tiertől; körönként az első megvett fejlesztés ingyenes. Ára 4/5/6. tierben 3/2/1.
- Fortified Bunker: 5. tiertől; kör végén véletlen helyi Magnetic Mech kerül kézbe, ha van hely. Három változat: 2/2, 1/3 vagy 3/1. Saját célpontra kijátszva hozzáadja a statjait, célpont nélkül önálló minion. Ár: 5. tierben 4, 6. tierben 3.
- Missile Pod: 6. tier, 5 arany; a Yamato kétszer lő. Nem halmozódik további lövésekre.
- Ultra-Capacitor: 6. tier, 6 arany; egyszer visszatér teljes kezdő HP-val és az erősítéseivel, a Reborn kivételével megtartott bónusz kulcsszavakkal.

Források: https://hearthstone.wiki.gg/wiki/Battlegrounds/Battlecruiser és https://www.hearthpwn.com/cards?filter-spell-school=13 . A felhasználó explicit 2/2-es kezdő Battlecruisere elsőbbséget élvez az aktuális külső balanszhoz képest. A helyi spellskála és Magnetic-mech készlet nem a teljes Hearthstone-katalógus másolata.

## Állapot, pool és felület

- Az idézett/generált lapok nem vesznek el fizikai lapot a véges poolból, és eladáskor nem teremtenek új poolpéldányt. Eltérnek az egyszerű harci segítő tokenektől: a saját tierjük szerint számítanak a hőssebzésbe, és a normál képességeik működnek. A generált, normál nevű kártyamásolatok (például Vanda jutalmai) triplázhatók egymással vagy valódi poolpéldányokkal. Az arany lap csak az összevont valódi példányszámot adja vissza a poolnak; a névvel és saját képességgel kombinált egyedi rajzok nem egyesülnek pusztán a forrásazonosítójuk alapján.
- A célpontválasztás, státusz, cooldown, quest, tipp, kombinálás és Fruzsi választása a tábla alatti képességpanelen található. Csefi harci támadásértékét a portréján is jelöljük.
- A botok használják az aktív képességeket és spelleket, illetve válaszolnak a függő választásokra. Ez alap AI, nem versenyszintű stratégia.
- Minden állapot és véletlen döntés szerveroldali, replayből reprodukálható. Hibás parancs atomikusan elutasított.
- Verzió: bg-37.0-core-custom-8 / franchise-357-heroes-35-v12. A fejlesztői szervert újra kell indítani, és új meccset kell kezdeni. A régi replayek nem kompatibilisek.
