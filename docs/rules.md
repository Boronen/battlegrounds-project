# A demó tényleges szabályprofilja

Profil: `bg-37.0-core-custom-1`. Katalógus: `classroom-34-v1`. Referencia: a 37.0 patch hivatalos kiadási jegyzete és az alapmechanikák korábbi hivatalos leírásai. Ellenőrzés: 2026. november 3.

Ez egy saját karakterkészlettel játszható alaploop. A teljes 37.0 szerverlogikával való azonosság nem igazolt. Szezonális mechanikák, eredeti hősök, bolti varázslatok és az eredeti teljes egységkészlet nem szerepelnek benne.

## Működés

| Terület | Megvalósított működés | Bizonyíték / minősítés |
|---|---|---|
| Meccs | Nyolc résztvevő, egy ember és hét bot | Saját demókonfiguráció a Battlegrounds alapstruktúrájához |
| Hős | Négy saját hős; két ajánlat, 30 HP és hősfüggő páncél | Saját hőskészlet és páncélértékek |
| Gazdaság | 3 kezdőarany, körönként +1, legfeljebb 10; vétel 3, eladás 1, frissítés 1 | A hivatalos bevezető igazolja a vételt/eladást/frissítést; az összes mai numerikus részlet élő ellenőrzése még hiányzik |
| Bolt | Szintenként 3/4/4/5/5/6 egység, csak elért szintig; egyedi példányok készletarányos sorsolása | Egységekre korlátozott profil, bolti varázslatok nélkül |
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
| Biztonsági limitek | Harconként 500 támadás után döntetlen; 60 kör után HP+páncél szerinti lezárás | Saját védőkorlát; a végleges profil első 100 tesztmeccse mind 13–21 kör között végzett |
| Időzítés | Hősválasztás 30 s, vásárlás 60 s, harc 18 s; kézi módban explicit továbbhaladás | Saját demóidőzítők |

## Képességek és állapot

A 34 egység saját, módosítható értékeket kapott. A stíluscímkék megmaradtak, de nem adnak külön szinergiabónuszt. Rejtett tulajdonságokhoz nem tartozik háromkörös aktiválás. Tárgy-, mana-, támadási sebesség- és hexarácsrendszer nincs.

A kijátszási buff végleges, a harckezdeti, támadáskori és halálhatás csak a harci másolatokra hat. Harc után a toborzási csapat sértetlenül tér vissza. A Portás hőspajzsa a következő toborzás elején törlődik. Az arany példány az effektus numerikus erejét duplázza; a pajzs nem halmozódik. A kenyeres hatás esélye 25%, arany változatnál a bónusz kétszeres. A szomszédság az esemény pillanatában érvényes táblasorrendet használja.

A nullára csökkent életerejű egységek egy halálcsoportként eltűnnek, majd a támadó oldal, utána a másik oldal balról jobbra sorrendjében lefutnak a halálhatások. Az idézett demótoken 2/2-es, nem örökli az idéző képességét, és nem fogyaszt példányt a boltból.

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
