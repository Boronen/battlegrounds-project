# Meghívókódos online tesztverzió

1. Név megadása, üres kóddal szoba létrehozása.
2. A kapott nyolcjegyű szobakódot meg kell osztani a többiekkel. Másik böngészőben/eszközön a kóddal lehet csatlakozni.
3. A házigazda egyedül is indíthat: ilyenkor hét bot tölti fel a többi helyet. Maximum nyolc ember, a megmaradó helyeket botok töltik fel. Indítás után nincs új belépő.
4. Minden ember saját hőst, boltot és kezet vezérel. Ha minden élő ember kész, indul a harc; a toborzás 120 másodperc után is továbblép. Harc után csak a csatlakozott, élő emberi játékosok szavazata szükséges a Következő kör gombbal. Ha nincs élő ember, a csatlakozott nézők léptethetnek. A lecsatlakozott helyet bot veszi át, és nem blokkolja a szavazást.
5. Oldalfrissítés után az adott lap sessionStorage-tokenjével visszacsatlakozik a saját helyére. Megszakadt játékos a saját böngészőlapjából térjen vissza; új eszközre tokenátvitel nincs.

A tesztverzió egyetlen Node.js folyamatban, memóriában tárol. Szerver-újraindításkor elvesznek a szobák. Egyórás inaktivitás után törlődnek. A Kilépés a szobából gomb megszünteti a tagságot; a játékhelyet bot veszi át. Kapcsolatszakadáskor a token megmarad a visszatéréshez. Hősválasztásnál 10 másodperc türelmi idő után a bot választ, hogy a meccs ne akadjon el. Az online tesztvezérlés és online replay-export tiltott; nincs fiókrendszer vagy nyilvános meccskereső.

A Railway projekt: 5c3f1569-ec7e-4041-84b9-5c01c27ebfe8, production környezet: 1c5720ed-07de-4e54-9370-890eaffa42a5. A Dockerfile Node 22-t, production szervert és 0.0.0.0 kötést használ. Egy replika szükséges; több replika külön szobamemóriát hozna létre.

## Öt új képesség

- Feri: a fel nem használt aranyból Tavern-szintenként 1/2/4/5/7/9 aranyat hozzáad a következő kör kezdő aranyához.
- Bea: az első két golden rewardból választott felfedezés arany; a fizikai poolból továbbra is egy példányt foglal, és nem ad új tripla-jutalmat.
- Vanda: 2 aranyért legfeljebb három különböző, az előző saját harc bármely oldalán meghalt minionból választ. Az eredmény sima alapmásolat.
- Dani: két részeg bolti minion. A részegek barátot vagy ellenfelet is célozhatnak, taunt/stealth figyelmen kívül hagyásával. Saját hőst 2%, ellenségeset 1% eséllyel támadnak, minion-tiernyi sebzésért. A két ritka hatás külön-külön egyszer történhet meg egy oldalnál csatánként. Öt részeg saját boardon a harc kezdetén teljesíti a questet; ezután a részeg minionok 2 aranyba kerülnek.
- M. Geri: a hős 50 kezdő HP-t kap, ha Csolti is a meccsben van, egyébként 60-at. Csolti jelenlétében minden harc elején tartós +3 támadást kapnak a saját boardminionok, bármelyik ellenfél ellen.

Verzió: bg-37.0-core-custom-8 / franchise-357-heroes-35-v12.

Élő játék: https://utolso-pad-production.up.railway.app . Railway deployment: ed5a56e9-c6c2-4d33-9e22-aeafed173687; rögzített forráscommit: 8ee0cd795c3dd57f75aaa81670a44fd2da47d83e (codex/invite-multiplayer). Az élő címet két külön böngészős meccsel is ellenőriztük.
