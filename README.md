# Utolsó pad – Csatatér

Az Utolsó pad böngészős stratégiai kártyajáték. Egyedül hét bot ellen vagy meghívókódos szobában játszható. A katalógusban 360 toborozható lap és 35 hős van, közülük 24 saját képességgel. A hősöket ceruzarajzok, a minionok törzsét színes kártyakeretek, a képességük időzítését ikonok jelölik. [Hősképességek](docs/hero-powers-spec.md) · [Kártyakatalógus és balanszmérés](docs/card-pool.md)

## Helyi indítás

A React kliens és a Socket.IO játékszerver Node.js 22.12+ alatt fut. A fiókokat, szobákat és eredményeket a Laravel 13 kezeli. A backendhez PHP 8.4, Composer 2, PDO MySQL és egy üres, utf8mb4 kódolású MySQL vagy MariaDB adatbázis szükséges.

1. A projekt gyökerében futtasd az npm ci parancsot. A backend könyvtárban futtasd a composer install parancsot, majd másold a .env.example fájlt .env néven.
2. A backend/.env fájlban állítsd be a DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME és DB_PASSWORD értékeket. Az alapértelmezett adatbázisnév battleground. Az első adminhoz ugyanitt add meg az ADMIN_EMAIL és ADMIN_PASSWORD értékeket (legalább 12 karakter).
3. A GAME_SERVER_SECRET értéke mindkét szerveren egyezzen. Generáld a projekt gyökerében a Node paranccsal, majd másold az értéket a backend/.env és a gyökérben létrehozott .env fájlba. A gyökérben a LARAVEL_URL alapértelmezése http://127.0.0.1:8000.

~~~sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
~~~

A backend könyvtárban inicializáld az alkalmazáskulcsot, a táblákat és a kezdő karakterkatalógust.

~~~sh
php artisan key:generate
php artisan migrate --seed
~~~

Három külön terminálban indítsd a Laravel API-t, a megszakadt meccseket lezáró ütemezőt és a játékszervert.

| Könyvtár | Parancs |
| --- | --- |
| backend | php artisan serve --host=127.0.0.1 --port=8000 |
| backend | php artisan schedule:work |
| Projektgyökér | npm run dev |

Nyisd meg a [kezdőlapot](http://127.0.0.1:5173). Ugyanezen a címen működik a kliens, az API-proxy és a socketkapcsolat. A Windowsos Start-Demo.ps1 a Node folyamatot indítja, és a botok elleni gyakorlás önállóan is használható.

## A kód felépítése

- A src/App.tsx útvonalfája a regisztrációt, belépést, profilokat, ranglistát, lobbit, játékot és az admin gyermekoldalait kapcsolja össze. A src/pages könyvtár tartalmazza az oldalakat, a src/api.ts a közös HTTP-klienst.
- A backend/routes/web.php a böngésző session- és CSRF-védett API-ja. A controllerek a backend/app/Http/Controllers mappában találhatók. A backend/routes/internal.php végpontjait a Node játékszerver használja.
- A server/persistent-games.ts az adatbázisban elindított meccsekhez rendeli a játékmotort és a hitelesített játékoshelyeket. A szerver meccsenként külön karakterkatalógust kap. A shared könyvtárban vannak a közös játékszabályok.
- A privát szobában 2–8 játékos jelzi a készenlétét. A rangsorolt várólistáról a nyolcadik ember érkezésekor indul a meccs. Csak a lezárt rangsorolt meccsek módosítanak pontot. Frissítés után a játékos új egyszer használható jeggyel kapja vissza a saját helyét.

## Ellenőrzés

A gyökérben az npm test futtatja a motor- és socketteszteket, az npm run build ellenőrzi a TypeScriptet és elkészíti a klienst. A backend könyvtárban a php artisan test futtatja az API-teszteket SQLite memóriában (pdo_sqlite szükséges).

A teljes integrációs próba nyolc tesztfiókot és két meccset hoz létre az általad megadott elkülönített helyi adatbázisban. A PLATFORM_TEST_URL legyen a futó Node szerver címe. Az npm run test:online végigjátssza a privát és rangsorolt meccset, ellenőrzi az eredményeket és két képernyőméretben megnyitja a profilokat. A BROWSER_EXECUTABLE változóval választhatsz Chromium-alapú böngészőt.

## Egy mérkőzés

1. Válassz játékmódot. Minden új meccs automatikusan véletlen kezdőértéket kap; teszteléshez opcionálisan megadhatsz sajátot. Azonos kezdőérték és azonos műveletsor azonos eredményt ad.
2. Válassz a felajánlott három hős közül. Háromszor frissítheted a teljes ajánlatot; minden frissítés három olyan hőst ad, akit még nem láttál ebben a hősválasztásban.
3. A bolti kártyára kattintva a jelzett áron megveszed. A kézben lévő lapra kattintva kijátszod.
4. Célzott kijátszási képességnél előbb válaszd ki a kézben lévő kártyát, majd a célpontot a táblán.
5. Egy táblán lévő kártya kijelölése után Balra/Jobbra gombbal rendezheted vagy eladhatod. Egérrel húzás is használható.
6. Fejlesztheted, frissítheted vagy befagyaszthatod a boltot. A hősöd mellett nyílik a képesség- és varázspanel. Itt választhatsz célpontot és követheted a küldetésedet is.
7. Három azonos normál egység arany példánnyá egyesül a kézben. Kijátszásakor a boltodnál eggyel magasabb szintről választhatsz jutalmat, legfeljebb a 6. szintről.
8. A Harc indítása gombbal készre jelölöd magad. Egyedül azonnal indul a harc. Meghívókódos meccsen a csatlakozott játékosok készenléte indítja. A Következő kör gombbal léphetsz tovább az eredmény után.
9. Kiesés után nézőként folytathatod a meccset a Harc megtekintése gombbal.

## Tesztpad

A fejléc **Kártyakatalógus** gombja csak az aktuális meccs 80 aktív kártyáját mutatja, szintek szerint. Minden meccs 8 törzsből 5 véletlen törzset választ; a bolt és a tripla jutalma ugyanebből a rögzített készletből dolgozik. Törzsre és szintre szűrhetsz, valamint névre, franchise-ra vagy képességre kereshetsz. A katalógus a kifogyott kártyatípusokat is megtartja. Bezárás: Bezárás gomb vagy Escape. Meccs előtt a katalógus indítást kér.

A támadások célpont felé történő nekilendüléssel, rövid találati rázkódással és lebegő sebzésszámokkal jelennek meg. A zöld stat és ↑ jel végleges, a kék stat és ✦ jel csak az adott harcra szóló erősítést mutat. A sérült életerő piros; a kártya részletei az alapértéket és a bónuszokat külön felsorolják. A csökkentett mozgás rendszerbeállítás kikapcsolja az utazó animációkat és a rázkódást.

A fejlécben nyitható meg. Harcszünet, eseményenkénti léptetés és 0,5–8× animációs sebesség áll rendelkezésre. A szünet az időzített szakaszváltást is megállítja; folytatáskor a szakasz teljes ideje újraindul.

A **Bot lépés a saját helyemen is** egy szakaszt játszik le automatikusan. A **Teljes meccs lefuttatása** ugyanezt ismétli az eredményig; leállítható.

A JSON-export tartalmazza a seedet, szabály- és katalógusverziót, az elfogadott parancsokat, a szakaszváltásokat és az eredmény SHA-256 lenyomatát. A fájl betöltése szerveren újrafuttatja a meccset, és ellenőrzi a lenyomatot. Ez ellenőrzött újraszimulálás; a múltbeli körökhöz külön vizuális idővonal még nem tartozik.

## Ellenőrzés

```sh
npm test
npm run test:soak
npm run test:set-balance
npm run test:browser
npm run test:polish
npm run test:board-audio
npm run build
npm run test:viewport
```

A böngészős teszthez fusson a demó az 5173-as porton. Windows alatt a telepített Edge-et használja; más böngésző útvonala `BROWSER_EXECUTABLE` környezeti változóval adható meg. Más rendszeren a Playwright Chromium telepítése szükséges (`npx playwright install chromium`). Képernyőképek és eredmények: `test-results/`.

## Felépítés és későbbi online játék

- `shared/`: típusok, magolt véletlengenerátor, adatvezérelt karakterek, gazdaság, botok és harcmotor. Nincs DOM- vagy Socket.IO-függősége.
- `server/`: Socket.IO, parancsellenőrzés, nyugták, ismétléskezelés, időzítés, munkamenetek és visszajátszás.
- `src/`: React aréna, interakciók, animációs lejátszás és tesztvezérlés.

A saját játékos állapotát a szerver teljesen, az ellenfelekét csak nyilvános összesítésként küldi. A harcban kizárólag a saját összecsapásod látható. A véletlengenerátor és a teljes készlet nem kerül a kliensre. Újratöltéskor a tabhoz tartozó véletlen munkamenetkulcs állítja helyre a kapcsolatot. Szerver-újraindításkor az aktív demómeccsek elvesznek.

A jelenlegi szerver minden munkamenethez egy embert és hét botot hoz létre; több ember közös szobába csatlakozása még nincs bekötve. A Laravel-játékjegy és idempotens eredménymentés illesztési pontjai a `server/adapters.ts` fájlban találhatók. Az adapterek szerződések, még nem működő Laravel-integrációk.

Kiadási build: `npm run build`; kiszolgálás: `NODE_ENV=production npm start` (PowerShellben előbb `$env:NODE_ENV='production'`). A szerver alapból csak a helyi gépen érhető el. A `PORT` és `HOST` környezeti változók felülírhatók. A tesztvezérléseket egy későbbi nyilvános szolgáltatás előtt külön jogosultsághoz kell kötni.

A tényleges szabályok, források és eltérések: [docs/rules.md](docs/rules.md). A hálózati felület: [docs/protocol.md](docs/protocol.md).

## Tábla, hang és megjelenítés

A játék tíz felülnézetes tribe-arénát használ a `public/boards/tribes/` mappából, 16:9 arányban: Aberration, Beasts, Naga, Dragons, Undead, Demon, Murlocs, Pirate, Quilboar és Elementals. A képek a korábban generált arénák WebP-változatai. Minden új mérkőzés véletlen szerveroldali azonosítót kap; ebből a `src/arenas.ts` választ hátteret. A választás független a játékmenet seedjétől és a csapat tribe-jától, és körváltás, újracsatlakozás vagy oldalfrissítés után is megmarad. Egymást követő meccseken ismétlődés lehetséges. A korábbi tantermes kép megmarad az assetek között, de nem része a sorsolásnak. A karakterképek a katalógus `portrait` mezőjében, a hősképek a `HeroPortrait.tsx` leképezésében cserélhetők.

Álló telefonon a fogadó és a csapat egymás alá kerül. Öt vagy több minion két sorban látszik. A kéz, a körváltás és a bolt vezérlői végig a képernyőn maradnak. A tele kezet oldalra lehet húzni. A Lapinfó gomb után egy kártyára koppintva olvasható a teljes képesség. A tabella, a hősképesség és a beállítások külön megnyithatók.

A rövid harci hangok és a sorozatokhoz tartozó bejátszások helyi hangfájlokból szólnak. A hőshöz beállított zene a YouTube-lejátszóval érhető el a meccs alatt. A fejlécben található a némítás, a beállítások között a lejátszó.

A támadó a célpont közepéig mozdul, majd visszatér a saját helyére. Az ütközéshez irányított visszalökés, rövid rázkódás, szikrák és sebzésszámok tartoznak. A mozgás sebessége a tesztpadon állítható, a csökkentett mozgás beállítása továbbra is támogatott.

A betűtípusok helyben vannak a `public/fonts/` mappában, a hozzájuk tartozó OFL-licencekkel. Az SVG-kezelőikonokat a Phosphor biztosítja.

## Projektterv

Készítők: **Kovács Kevin és Csillag Gergő Zsolt**.

- [Szerkeszthető projektterv](documentation/Online_strategiai_kartyajatek_projektterv.docx)
- [Projektterv PDF](documentation/Online_strategiai_kartyajatek_projektterv.pdf)

A 360 lapos katalógusból egy meccsben 83 különböző lap és 965 fizikai példány érhető el. Öt aktív törzs egyenként 12 lapot ad. A készlethez 12 forgó semleges, három állandó semleges erősítő és nyolc minden típusú lap tartozik. A teljes készlet szövegeit és az egyensúlymérést a [kártyakatalógus](docs/card-pool.md) tartalmazza.

Combat keywords: 24 recruitable cards now use Stealth, Windfury, Venomous or Reborn. See [keyword rules](docs/keywords.md) and the [measured balance report](docs/keyword-balance.md). Run `npm run test:keyword-balance` to reproduce the benchmark. Restart the development server and begin a new match after this rules/catalog update.
