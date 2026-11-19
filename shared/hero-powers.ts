import type {Hero,Player,HeroState,Unit,SpellCard,Match} from './types';
import {pick,shuffle} from './random';
export const POWER_DEFS:Record<string,{name:string;cost:number;passive?:boolean;text:string}>={
 'original-2':{name:'Padlógáz',cost:1,text:'Körönként: egy saját minion tartósan +Tavern-szint támadást kap. A jobb oldali szomszédja +1 életerőt kap.'},
 'original-23':{name:'Második műszak',cost:0,passive:true,text:'Harc elején, ha van szabad hely: megidézi a legnagyobb életerejű saját minion pontos másolatát erre a harcra. Döntetlennél a bal szélsőt választja.'},
 'original-24':{name:'Összetartás',cost:1,text:'Körönként: egy saját minion és közvetlen szomszédai tartósan +2 életerőt kapnak.'},
 'original-25':{name:'Visszaszólás',cost:1,text:'Körönként: egy saját minion Tauntot és tartósan +2 támadást kap. Ha már Tauntos, további +3 életerőt kap.'},
 'original-27':{name:'Újratervezés',cost:1,text:'Körönként: felcseréli egy saját minion támadását és életerejét, majd tartósan +1/+1-et ad neki.'},
 'original-28':{name:'Páncélműhely',cost:2,text:'Körönként: egy saját minion pajzsot kap a következő harcra és tartósan +2 életerőt.'},
 'original-29':{name:'Turbófokozat',cost:2,text:'Körönként: egy saját minion Windfuryt kap. Ha már rendelkezik vele, helyette tartósan +3 támadást kap.'},
 'original-30':{name:'SIMON mondja',cost:1,text:'Körönként: egy saját minion tartósan +1 támadást kap minden más, vele azonos tierű saját minion után, és +1 életerőt.'},
 'original-32':{name:'Tövismásolat',cost:0,passive:true,text:'Harc elején, ha van szabad hely: megidézi a legnagyobb támadású saját minion pontos másolatát erre a harcra. Döntetlennél a bal szélsőt választja.'},
 'original-33':{name:'Korrepetálás',cost:1,text:'Körönként: egy saját minion tartósan +1/+1-et kap minden Tavern-szintért, amennyivel a boltod az ő tierje felett van. Legalább +1/+1.'},
 'original-35':{name:'Képzettársítás',cost:1,text:'Körönként: egy saját minion tartósan +1/+1-et kap minden, a tábládon jelen lévő különböző miniontier után.'},
 'original-21':{name:'Mértékletesség',cost:0,passive:true,text:'Minden boltban két részeg minion. Bárkit támadhatnak. Öt részeg saját minion egy harcban: innentől a részegek 2 aranyba kerülnek.'},
 'original-22':{name:'Rivalizálás',cost:0,passive:true,text:'Csolti jelenlétében +20 kezdő HP, nélküle +30. Ha Csolti is játszik, harconként minden minion tartósan +3 támadást kap, bárki ellen.'},
 'original-18':{name:'Tartalék',cost:0,passive:true,text:'El nem költött aranyból továbbvisz a következő körre: tier 1–6 esetén 1/2/4/5/7/9 aranyat.'},
 'original-19':{name:'Arany kezdet',cost:0,passive:true,text:'Az első két tripla-jutalom felfedezésből választott minion arany, de nem ad új tripla-jutalmat.'},
 'original-20':{name:'Emlékidézés',cost:2,text:'Körönként: felfedezel egy miniont, amely az előző harcodban meghalt, bármelyik oldalon. Sima alapmásolatot kapsz.'},
 'original-14':{name:'Olvasom a játékod',cost:0,text:'Körönként: tippeld meg a következő ellenfél egyik minionját két lap közül. Helyes tipp: +1 arany.'},
 'original-15':{name:'Visszavágó',cost:1,text:'Körönként: a boltot az előző ellenfél legutóbb látott minionjainak alapváltozataival töltöd fel.'},
 'original-16':{name:'Pontos másolat',cost:0,text:'Meccsenként egyszer: egy saját minion pontos másolatát idézed a táblára. Kell egy szabad hely; nem aktivál battlecryt.'},
 'original-17':{name:'Új szerep',cost:0,text:'Minden kör elején két újrahasználható aktív hősképességből választasz. A választott képesség a kör végéig tart.'},
 'original-26':{name:'Tanári tekintély',cost:2,text:'Passzív: 1 támadású, nem célozható nyolcadik harcos, ő üt először. Körönként 2 aranyért +Tavern-szint támadást tanul; a fejlesztés körében nem támad.'},
 'original-31':{name:'OIL',cost:3,text:'Körönként: tartósan +1 maximális és körkezdő arany, 10 fölött is.'},
 'original-1':{name:'Befektetés',cost:0,passive:true,text:'A minionok eladásakor nem kapsz azonnal aranyat. A következő kör elején eladott miniononként 2 aranyat kapsz, korlát nélkül.'},
 'original-10':{name:'Küldetés',cost:0,passive:true,text:'Véletlen küldetés: 25 saját minionhalál után dupla spellcast, vagy 7 battlecry után dupla battlecry. A jutalom a meccs végéig tart.'},
 'original-34':{name:'D6',cost:1,text:'Dobj D6-tal: annyi aranyat kapsz, és a következő ugyanennyi körben nem használhatod újra.'},
 'original-12':{name:'Battlecruiser',cost:0,passive:true,text:'Kezdéskor kapsz egy 2/2 Battlecruisert. A boltban mindig egy fejlesztő spell található.'},
 'original-3':{name:'Lopás',cost:2,text:'Körönként: egy kiválasztott bolti miniont a kezedbe veszel.'},
 'original-4':{name:'Renata',cost:0,passive:true,text:'Kezdéskor kapsz egy 2/2, minden típusú, Mérgező Renatát.'},
 'original-5':{name:'Hideg alku',cost:0,passive:true,text:'A minionok 2 aranyba kerülnek. A bolt minden kör végén automatikusan befagy.'},
 'original-6':{name:'Inspiráció',cost:0,passive:true,text:'Minden friss boltban két véletlen minion egy-egy új véletlen kulcsszót kap.'},
 'original-7':{name:'Védelem',cost:0,passive:true,text:'Elvesztett harcnál a Tavern-szinteddel csökken a kapott sebzés.'},
 'original-8':{name:'Aranyérintés',cost:0,text:'Meccsenként egyszer arannyá alakít egy saját miniont. Nem ad tripla felfedezést.'},
 'original-9':{name:'Elszívás',cost:2,text:'Körönként: elpusztít egy saját vagy bolti miniont; annak tierjével gyógyulsz, legfeljebb 30 HP-ra.'},
 'original-11':{name:'Felső polc',cost:0,text:'Körönként: ingyen frissít, két minion eggyel magasabb tierből érkezik (maximum 6).'},
 'original-13':{name:'Rajzasztal',cost:2,text:'A 3. körtől: két felkínált minion egyikének statjait és a másik képességét kombinálod.'},
};
export function configurePowers(heroes:Hero[]){for(const h of heroes){const d=POWER_DEFS[h.id];if(d){h.power=d.passive?'passive':'custom';h.cost=d.cost;h.text=d.text;}}}
export function powerState(p:Player):HeroState{return p.heroState??={maxGold:10,deferredGold:0,cooldownUntil:0,onceUsed:false,progress:0,completed:false,championAttack:1,championUpgradeRound:-1,spellShop:[],spellHand:[],combination:[]};}
export const minionPrice=(p:Player,u?:Unit)=>p.heroId==='original-21'&&u?.drunk&&powerState(p).drunkQuest?2:p.heroId==='original-5'?2:3;
export function powerStatus(p:Player,round:number){const s=powerState(p);if(p.heroId==='original-17')return s.borrowedId?'Erre a körre: '+POWER_DEFS[s.borrowedId].name:'Válassz egy képességet';if(p.heroId==='original-14')return s.guessResult===undefined?'Helyes tipp: +1 arany':s.guessResult?'Helyes tipp! +1 arany':'Ez most nem talált.';if(p.heroId==='original-16')return s.onceUsed?'Felhasználva':'Egyszer használható';if(p.heroId==='original-10')return `${s.quest==='deaths'?'Saját halál':'Battlecry'}: ${s.progress}/${s.quest==='deaths'?25:7}${s.completed?' · Teljesítve':''}`;if(p.heroId==='original-26')return `${s.championAttack} támadás${s.championUpgradeRound===round?' · Most tanul':' · Harcra kész'}`;if(p.heroId==='original-34')return `Dobás: ${s.lastRoll??'–'} · Várakozás: ${Math.max(0,s.cooldownUntil-round)} kör`;if(p.heroId==='original-1')return `Következő kör: +${s.deferredGold} arany`;if(p.heroId==='original-8')return s.onceUsed?'Felhasználva':'Egyszer használható';return '';}
export const UPGRADE_NAMES:Record<string,string>={attack:'Hyperflight Rotors',health:'Smart Servos',yamato:'Yamato Cannon',rally:'Advanced Ballistics',death:'Caduceus Reactor',free:'Advanced Construction',magnetic:'Fortified Bunker',missile:'Missile Pod',reborn:'Ultra-Capacitor',buff:'Erősítés',shield:'Védőpajzs'};
export function newSpellShop(m:Match,p:Player){const kinds=p.heroId!=='original-12'?['buff','shield']:['attack','health','yamato','rally','death',...(p.tier>=4?['free']:[]),...(p.tier>=5?['magnetic']:[]),...(p.tier>=6?['missile','reborn']:[])];powerState(p).spellShop=[{uid:`s${m.nextUid++}`,kind:pick(m,kinds),tier:p.tier,cost:2}];for(const spell of powerState(p).spellShop){if(['attack','health'].includes(spell.kind))spell.cost=1;if(spell.kind==='free')spell.cost=Math.max(1,7-p.tier);if(spell.kind==='magnetic')spell.cost=Math.max(3,9-p.tier);if(spell.kind==='missile')spell.cost=5;if(spell.kind==='reborn')spell.cost=6;}}
export function enchantShop(m:Match,p:Player,units:Unit[]){if(p.heroId==='original-21'){for(const u of shuffle(m,units).slice(0,2))u.drunk=true;}if(p.heroId!=='original-6')return;for(const u of shuffle(m,units).slice(0,2)){const available=(['stealth','windfury','venomous','reborn'] as const).filter(k=>!u.keywords?.includes(k));if(available.length)u.keywords=[...(u.keywords||[]),pick(m,available)];}}
export function completeQuest(p:Player,n:number,kind:'deaths'|'battlecries'){const s=powerState(p);if(p.heroId==='original-10'&&s.quest===kind&&!s.completed){s.progress=Math.min(kind==='deaths'?25:7,s.progress+n);s.completed=s.progress>=(kind==='deaths'?25:7);}}
export function applyUpgrade(u:Unit,spell:SpellCard){const n=spell.tier;const upgrades=u.spellUpgrades??={};if(spell.kind==='attack')u.attack+=n;if(spell.kind==='health')u.health+=n;if(['yamato','rally','death'].includes(spell.kind))upgrades[spell.kind]=(upgrades[spell.kind]||0)+n;if(spell.kind==='free'||spell.kind==='magnetic')upgrades[spell.kind]=1;if(spell.kind==='missile')upgrades.missile=2;if(spell.kind==='reborn'){u.fullReborn=true;u.keywords=[...new Set([...(u.keywords||[]),'reborn' as const])];}}

export function upgradeText(kind:string,n:number){return ({buff:`Saját minion +${n}/+${n}`,shield:'Pajzs egy saját minionnak',attack:`Battlecruiser +${n} támadás`,health:`Battlecruiser +${n} életerő`,yamato:`Harc elején ${n} sebzés a legnagyobb HP-jú ellenfélnek`,rally:`Minden támadásnál a többi szövetséges +${n} támadást kap`,death:`Halálkor a bal szélső minion +${n}/+${n}`,free:'Körönként az első megvett fejlesztés ingyenes',magnetic:'Kör végén egy véletlen Magnetic Mech a kézbe',missile:'A Yamato Cannon kétszer lő',reborn:'Egyszer újjászületik teljes HP-val és erősítésekkel'} as Record<string,string>)[kind]||kind;}

export function effectivePowerId(p:Player){return p.heroId==='original-17'?powerState(p).borrowedId:p.heroId;}
export const BORROWABLE_POWERS=Object.keys(POWER_DEFS).filter(id=>!POWER_DEFS[id].passive&&!['original-8','original-16','original-17','original-26'].includes(id));
export function currentPower(p:Player){const id=effectivePowerId(p);return id?POWER_DEFS[id]:undefined;}
