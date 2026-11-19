# A demó tényleges szabályprofilja

Profil: `bg-37.0.2-core-custom-10`. Katalógus: `franchise-360-heroes-35-v14`. Referencia: a 37.0.2 patch hivatalos kiadási jegyzete és az alapmechanikák korábbi hivatalos leírásai. Helyi szabályok frissítése: 2026. november 18.

Ez egy saját karakterkészlettel játszható alaploop. A teljes 37.0.2 szerverlogikával való azonosság nem igazolt. A saját hősök, az általános spellek és Kevin Battlecruiser-fejlesztései helyi szabályok; nem a teljes eredeti Hearthstone-készlet másolatai. Lásd: [hősképességek](hero-powers-spec.md).

## Működés

| Terület | Megvalósított működés | Bizonyíték / minősítés |
|---|---|---|
| Meccs | Nyolc résztvevő, egy ember és hét bot | Saját demókonfiguráció a Battlegrounds alapstruktúrájához |
| Hős | 35 karakter; három ajánlat, 3 teljes frissítés ismétlődő hősök nélkül, 30 HP, 0 páncél, 24 saját képesség | Saját, dokumentált képességek; a 360 kártya toborozható |
| Gazdaság | 3 kezdőarany, körönként +1, legfeljebb 10; alap vétel 3, eladás 1, frissítés 1; Villő vétele 2, OIL és Gergő jutalma 10 fölé mehet | A hivatalos bevezető igazolja a vételt/eladást/frissítést; az összes mai numerikus részlet élő ellenőrzése még hiányzik |
| Bolt | Szintenként 3/4/4/5/5/6 egység, csak elért szintig; egyedi példányok készletarányos sorsolása | Egy külön általános spellhely, Kevinnek helyette két fejlesztő spellhely; hősképességek módosíthatják a minionkínálatot |
| Fejlesztés | 1→2: 5; 2→3: 7; 3→4: 8; 4→5: 11; 5→6: 11; minden következő körben −1, minimum 0 | A 34.2 jegyzet igazolja a két felső lépés +1 módosítását; teljes mai ártábla független futásidejű ellenőrzése még hiányzik |
| Készlet | Szintenként 15/15/13/11/9/7 példány karakterenként | A 23.6 jegyzet igazolja az 1. szint 15-re csökkentését; a teljes sor verziózott demóérték, mai szerveroldali készlet nem hozzáférhető |
| Fagyasztás | Megmaradt ajánlatok következő körre megmaradnak, üres helyek feltöltődnek; kapcsoló visszaáll | Saját, egységboltra alkalmazott működés; a 34.2 teljes bolti limitje varázslathelyet is tartalmaz |
| Tábla és kéz | Legfeljebb 7 táblán és 10 kézben; tábláról kézbe nem vehető vissza egység | A bevezető táblalimitjéhez igazított demó |
| Tripla | Három normál példány kézből/tábláról arannyá egyesül; dupla alapstat és képességerő, állandó buffok összeadódnak | A hivatalos bevezető igazolja az egyesítést és a következő szintű jutalmat; saját képességek duplázása explicit katalógusszabály |
| Jutalom | Az arany egység kijátszásakor aktuális boltszint +1, maximum 6; három különböző elérhető karakterből választás | A hivatalos bevezető szerinti fő folyamat; külön jutalomsor, nem kézhelyet foglaló varázslatkártya |
| Párosítás | Lehetőség szerint az utolsó két ellenfél elkerülése; páratlan létszámnál az alsó három egyikének a legutóbb kiesett csapata | Saját dokumentált közelítés; az eredeti szerver pontos párosító algoritmusa nincs igazolva |
| Harc | Több egység kezd, egyenlő létszámnál magolt sorsolás; váltott oldali, balról induló támadás; véletlen célpont, őrző elsőbbséggel | Saját determinisztikus megvalósítás; nincs minden eredeti kulcsszó megvalósítva |
| Események | Harckezdet, első támadás előtti hatás, egyidejű sebzés, halálhatás, idézés; pajzs egy pozitív sebzést elnyel | A konkrét sorbarendezés saját motorválasztás; az összes eredeti összetett interakcióval nem validált |
| Hőssebzés | Győztes boltszintje + túlélők szintje; pajzs helyett előbb hőspáncél fogy | Saját motor a műfaji alaphoz |
| Sebzéskorlát | 1–3. kör: 5; 4–7.: 10; 8-tól: 15; legjobb négynél megszűnik | Hivatalos Season 9 bejelentés |
| Holtverseny | Ugyanazon körben kiesők előző HP+páncél szerint; azonosságnál ülésazonosító; egyedi helyezések | Saját tesztelhető szabály, az eredeti megosztott helyezés helyett |
| Biztonsági limitek | 500 támadásnál döntetlen, 60 körnél a hősök életereje és páncélja dönti el a sorrendet | A v14-es készlettel a 100 újrajátszott tesztmeccs 13–26 kör alatt ért véget |
| Időzítés | Az időzített toborzásnak határideje van. A harcból a következő kör gombbal lehet továbblépni. | A meghívókódos szobában az aktív emberi játékosok készenléte számít |

## Képességek és állapot

A törzsekre ható képességek a kártyával azonos törzsű többi élő szövetségest és a minden típusú szövetségeseket erősítik. A semleges egységek külön csoportot alkotnak. A kézből és a körhatárokon szerzett statok tartósak. A Rally és a Deathrattle harci erősítése a csata végéig él.

A Blizzard 37.0.2-es Battlegrounds-frissítésében a Battlecry és Deathrattle egy minion külön aktiválási eseménye lehet. A Rally az egyes támadásokhoz kötődik, a körhatások pedig a harcon kívüli fázishatárokhoz. A saját kártyák ezekből az időzítésekből, statbuffokból, idézésből és erőforrás-termelésből építkeznek. [37.0.2 kiadási jegyzet](https://hearthstone.blizzard.com/en-us/news/24307311), [Rally szabály](https://hearthstone.blizzard.com/en-us/news/24223019).

| Hatás | Aktiválás a játékban |
|---|---|
| Battlecry | Kézből kijátszáskor. A statbuff tartós, a választott célpont a megismételt aktiváláskor is ugyanaz. |
| Deathrattle | A halálcsoport eltávolítása után. Az adott oldalon még élő erősítők számítanak. |
| Rally | Minden támadáskor, Windfury mindkét ütésénél is. A Rally statbuffjai a harci másolatot módosítják. |
| Kör eleje | Az új kör alap aranya és boltja után. A szomszédbuff tartós, a Napidíj azonnal elkölthető. |
| Kör vége | A vásárlási szakasz lezárásakor, a harci másolat létrehozása előtt. Az Utánpótlás a véges készletből húz. |

Az arany változat megduplázza a számértéket vagy az idézett, húzott egységek számát. A pajzs egyszeri állapot. A műsorvezető a Battlecry-t, a Visszhangőr a Deathrattle-t, a Záróra mestere a kör végi hatásokat aktiválja kétszer, aranyként háromszor. Az azonos típusú erősítők és Mihály Battlecry-jutalma közül a legnagyobb szorzó érvényesül.

A nullára csökkent életerejű egységek egy halálcsoportként eltűnnek, majd a támadó oldal, utána a másik oldal balról jobbra sorrendjében lefutnak a halálhatások. Az idézett 2/2-es Segítő külön egység, és készleten kívül jön létre.

## Helyi kliensből származó megfigyelés

A helyi `Assembly-CSharp.dll` statikus PE/CLI vizsgálata Unity/Mono, CIL és AnyCPU besorolást eredményezett. SHA-256: `2408c5eae3d5ab083b8b290a7278147159e79a3c6e72e1d922ef44028ed16afb`.

Bizonyíték: `ev_c035be3eaf726fbc332c197851ff33c03db818102b88cce4bf9ce2e1495b3fa9`, a teljes helyi elemzési rekord külön fejlesztői mellékletként van tárolva. Ez azonosítást és metaadatvizsgálatot bizonyít; nem harcszimulációt vagy szerverkód-hozzáférést.

A 2026. november 3-i helyi Power-napló `BuildNumber=255790` sort tartalmaz. A kliens másik naplójában `hs_beta` indítási azonosító szerepel, ezért ezt nem azonosítjuk automatikusan az aktuális nyilvános szerverrel. A Unity `6000.3.11f1` verziója nem Hearthstone-patchszám.

## Szakmai források

- [Hivatalos 37.0 kiadási jegyzet](https://news.blizzard.com/en-us/article/24301454/37-0-patch-notes) – rögzített patchreferencia.
- [Introducing Hearthstone Battlegrounds](https://hearthstone.blizzard.com/en-us/news/23156373/introducing-hearthstone-battlegrounds) – vásárlás, bolt, csapatépítés, tripla és jutalom.
- [Announcing Battlegrounds Season 9](https://news.blizzard.com/en-us/article/24159389/announcing-battlegrounds-season-9) – 5/10/15-ös sebzéskorlát és top 4.
- [34.2 kiadási jegyzet](https://news.blizzard.com/en-us/article/24244423/34-2-patch-notes-battlegrounds-arena-and-gameplay-updates) – felső boltszintek költségmódosítása és fagyasztott kínálat teljes kártyalimitje.
- [23.6 kiadási jegyzet](https://hearthstone.blizzard.com/en-us/news/23817873) – az 1. szintű példánykészlet 15-re módosítása.

A következő referenciahűségi lépés egy azonos patchen megfigyelt játékmenettel való, esetenkénti összehasonlítás. A demó elkészült tesztjei a saját motor helyességét és következetességét vizsgálják, nem igazolják a teljes eredeti játék minden szabályát.

## Active tribes and match roster

A 360 lapos katalógusból meccsenként öt törzs sorsolódik. Törzsenként 12 különböző lap kerül be, szintenként kettő. Ehhez 12 forgó semleges, nyolc minden típusú és három mindig elérhető semleges hatáserősítő adódik. Így szintenként 14/14/13/13/15/14 különböző lap érhető el. A kártyánkénti 15/15/13/11/9/7 példány összesen 965 fizikai lapot jelent. A boltok és a tripla jutalmak a közös készletből húznak. A versenyegyensúlyhoz játékosadatokra van szükség.


## Combat keyword release

The custom rules now implement Stealth, Windfury, Venomous and Reborn on 24 recruitable cards. See [keyword rules and validation](keywords.md) and the [balance report](keyword-balance.md). These are explicitly documented custom semantics, not a claim of exact Hearthstone parity. Golden stats double; keyword charges do not.
