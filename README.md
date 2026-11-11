# Utolsó pad – Csatatér

Böngészős, szerver által vezérelt stratégiai játékmenetdemó. Egy ember és hét bot, 34 saját karakter, négy hős. A karakterképek saját, helyi SVG-placeholderek.

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

1. Válassz kezdőértéket és játékmódot. Azonos kezdőérték és azonos műveletsor azonos eredményt ad.
2. Válassz a felajánlott két hős közül.
3. A bolti kártyára kattintva 3 aranyért megveszed. A kézben lévő kártyára kattintva kijátszod.
4. Célzott kijátszási képességnél előbb válaszd ki a kézben lévő kártyát, majd a célpontot a táblán.
5. Egy táblán lévő kártya kijelölése után Balra/Jobbra gombbal rendezheted vagy eladhatod. Egérrel húzás is használható.
6. Fejlesztheted a boltot, frissítheted a kínálatot, vagy befagyaszthatod a következő körre. A hősképesség célpontja a kijelölt saját egység.
7. Három azonos normál egység arany példánnyá egyesül a kézben. Kijátszásakor a boltodnál eggyel magasabb szintről választhatsz jutalmat, legfeljebb a 6. szintről.
8. A Harc indítása tesztmódban lezárja a vásárlást. A harc szerveren számított eseménysorát a kliens lejátssza. A Következő kör feldolgozza az eredményt.
9. Kiesés után nézőként folytathatod a meccset a Harc megtekintése gombbal.

## Tesztpad

A támadások célpont felé történő nekilendüléssel, rövid találati rázkódással és lebegő sebzésszámokkal jelennek meg. A zöld stat és ↑ jel végleges, a kék stat és ✦ jel csak az adott harcra szóló erősítést mutat. A sérült életerő piros; a kártya részletei az alapértéket és a bónuszokat külön felsorolják. A csökkentett mozgás rendszerbeállítás kikapcsolja az utazó animációkat és a rázkódást.

A fejlécben nyitható meg. Harcszünet, eseményenkénti léptetés és 0,5–8× animációs sebesség áll rendelkezésre. A szünet az időzített szakaszváltást is megállítja; folytatáskor a szakasz teljes ideje újraindul.

A **Bot lépés a saját helyemen is** egy szakaszt játszik le automatikusan. A **Teljes meccs lefuttatása** ugyanezt ismétli az eredményig; leállítható.

A JSON-export tartalmazza a seedet, szabály- és katalógusverziót, az elfogadott parancsokat, a szakaszváltásokat és az eredmény SHA-256 lenyomatát. A fájl betöltése szerveren újrafuttatja a meccset, és ellenőrzi a lenyomatot. Ez ellenőrzött újraszimulálás; a múltbeli körökhöz külön vizuális idővonal még nem tartozik.

## Ellenőrzés

```sh
npm test
npm run test:soak
npm run test:browser
npm run test:polish
npm run test:board-audio
npm run build
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

A játék a `public/boards/classroom-arena.png` képet használja, 1024×559-es arányban. A hősök portréi a kép felső és alsó keretébe illeszkednek; a jelenlegi portrék továbbra is placeholderek. A 34 bolti egység a központi területen jelenik meg. A karakterképek a későbbiekben a katalógus `portrait` mezőjében, a hősképek a `HeroPortrait.tsx` leképezésében cserélhetők.

Keskeny kijelzőn a tábla megtartja az arányait és oldalra görgethető, a kéz külön, a képernyő szélességén belül marad. A teljes arénához a fekvő nézet kényelmesebb.

A rövid suhintás-, találat-, pajzs-, buff-, vásárlás- és kijátszáshangok Web Audio-val előállított saját effektek. Nincs háttérzene vagy külső hangletöltés. A hang az első kattintás vagy billentyűleütés után használható; a fejléc némítógombja megjegyzi a beállítást. A hangrendszer hibája nem akadályozza a játékot.

A támadó a célpont közepéig mozdul, majd visszatér a saját helyére. Az ütközéshez irányított visszalökés, rövid rázkódás, szikrák és sebzésszámok tartoznak. A mozgás sebessége a tesztpadon állítható, a csökkentett mozgás beállítása továbbra is támogatott.

A betűtípusok helyben vannak a `public/fonts/` mappában, a hozzájuk tartozó OFL-licencekkel. Az SVG-kezelőikonokat a Phosphor biztosítja.

## Projektterv

Készítők: **Kovács Kevin és Csillag Gergő Zsolt**.

- [Szerkeszthető projektterv](documentation/Online_strategiai_kartyajatek_projektterv.docx)
- [Projektterv PDF](documentation/Online_strategiai_kartyajatek_projektterv.pdf)
