# Utolsó pad – Csatatér

Az Utolsó pad böngészős stratégiai kártyajáték. Egyedül hét bot ellen vagy meghívókódos szobában játszható. A katalógusban 360 toborozható lap és 35 hős van, közülük 24 saját képességgel. A hősöket ceruzarajzok, a minionok törzsét színes kártyakeretek, a képességük időzítését ikonok jelölik. [Hősképességek](docs/hero-powers-spec.md) · [Kártyakatalógus és balanszmérés](docs/card-pool.md)

## Indítás Windows alatt

Node.js 22.12+ vagy 24 szükséges. A projektmappában:

```powershell
.\Start-Demo.ps1
```

Ez szükség esetén telepíti a függőségeket, majd elindítja a demót: **http://localhost:5173**. Leállítás: Ctrl+C.

Szokásos npm-parancsokkal is működik:

```sh
npm install
npm run dev
```

Ha a gépen az npm PowerShell-indítója hibás, a mellékelt indítószkript közvetlenül a Node mellett található npm-programot használja.

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

Online teszt: https://utolso-pad-production.up.railway.app — [meghívókódos használat és korlátok](docs/online-testing.md).
