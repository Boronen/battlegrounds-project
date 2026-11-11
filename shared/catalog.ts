import type { Character, Hero } from './types';
export const CHARACTERS:Character[] = [
  {
    "id": 1,
    "name": "Gergő",
    "tags": [
      "sport",
      "magas",
      "késik",
      "Racist/Vegas"
    ],
    "tier": 1,
    "attack": 2,
    "health": 3,
    "ability": {
      "name": "Késői befutó",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 0,
      "health": 1,
      "amount": 0,
      "repeats": 1
    },
    "text": "Késői befutó: egy választott másik szövetséges véglegesen +1 életerőt kap.",
    "portrait": "/portraits/1.svg"
  },
  {
    "id": 2,
    "name": "Dávid",
    "tags": [
      "sport",
      "motoros",
      "Racist"
    ],
    "tier": 1,
    "attack": 3,
    "health": 2,
    "ability": {
      "name": "Motoros rajt",
      "trigger": "start",
      "effect": "buff",
      "target": "left",
      "attack": 1,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Motoros rajt: a bal oldali szomszéd +1 támadást kap erre a harcra.",
    "portrait": "/portraits/2.svg"
  },
  {
    "id": 3,
    "name": "Vera",
    "tags": [
      "Öreg!",
      "törpe",
      "müvész",
      "Melee"
    ],
    "tier": 1,
    "attack": 1,
    "health": 4,
    "ability": {
      "name": "Kazettás táska",
      "trigger": "death",
      "effect": "buff",
      "target": "other",
      "attack": 2,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Kazettás táska: egy véletlen szövetséges +2 támadást kap erre a harcra. Tárgyat nem termel.",
    "portrait": "/portraits/3.svg"
  },
  {
    "id": 4,
    "name": "Milán",
    "tags": [
      "linux",
      "Csendes",
      "Racist"
    ],
    "tier": 1,
    "attack": 2,
    "health": 4,
    "ability": {
      "name": "Renata ",
      "trigger": "start",
      "effect": "shield",
      "target": "self",
      "attack": 1,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Renata :3: védőpajzsot és +1 támadást kap erre a harcra.",
    "portrait": "/portraits/4.svg"
  },
  {
    "id": 5,
    "name": "Villő",
    "tags": [
      "törpe",
      "Hiperaktiv",
      "Racist"
    ],
    "tier": 1,
    "attack": 3,
    "health": 1,
    "ability": {
      "name": "Hiperaktív lendület",
      "trigger": "attack",
      "effect": "buff",
      "target": "self",
      "attack": 2,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Hiperaktív lendület: erre az egy támadásra +2 támadást kap.",
    "portrait": "/portraits/5.svg"
  },
  {
    "id": 6,
    "name": "Viki",
    "tags": [
      "müvész",
      "Csendes"
    ],
    "tier": 1,
    "attack": 2,
    "health": 2,
    "ability": {
      "name": "Csendes alkotás",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 1,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Csendes alkotás: egy másik szövetséges véglegesen +1 támadást kap.",
    "portrait": "/portraits/6.svg"
  },
  {
    "id": 7,
    "name": "Nao",
    "tags": [
      "törpe"
    ],
    "tier": 2,
    "attack": 3,
    "health": 5,
    "ability": {
      "name": "Kis célpont",
      "trigger": "start",
      "effect": "shield",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Kis célpont: egyszer használatos védőpajzsot kap erre a harcra.",
    "portrait": "/portraits/7.svg"
  },
  {
    "id": 8,
    "name": "Levi",
    "tags": [
      "handsome",
      "normal",
      "dök"
    ],
    "tier": 2,
    "attack": 2,
    "health": 4,
    "ability": {
      "name": "DÖK-védelem",
      "trigger": "start",
      "effect": "buff",
      "target": "neighbors",
      "attack": 0,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "DÖK-védelem: a közvetlen szomszédok +2 életerőt kapnak erre a harcra.",
    "portrait": "/portraits/8.svg"
  },
  {
    "id": 9,
    "name": "Giga",
    "tags": [
      "zenész",
      "művész",
      "Tömő",
      "Vegas"
    ],
    "tier": 2,
    "attack": 4,
    "health": 4,
    "ability": {
      "name": "Vegas-koncert",
      "trigger": "start",
      "effect": "buff",
      "target": "other",
      "attack": 3,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Vegas-koncert: egy véletlen másik szövetséges +3 támadást kap erre a harcra.",
    "portrait": "/portraits/9.svg"
  },
  {
    "id": 10,
    "name": "Mihály",
    "tags": [
      "linux",
      "magas",
      "Racist"
    ],
    "tier": 2,
    "attack": 3,
    "health": 4,
    "ability": {
      "name": "Pingvindobás",
      "trigger": "start",
      "effect": "damage",
      "target": "enemies",
      "attack": 0,
      "health": 0,
      "amount": 1,
      "repeats": 1
    },
    "text": "Pingvindobás: 1 sebzést okoz minden ellenséges egységnek.",
    "portrait": "/portraits/10.svg"
  },
  {
    "id": 11,
    "name": "Márk",
    "tags": [
      "Tömő",
      "törpe",
      "Csendes",
      "Racist"
    ],
    "tier": 2,
    "attack": 4,
    "health": 3,
    "ability": {
      "name": "Kenyeres meglepetés",
      "trigger": "attack",
      "effect": "bread",
      "target": "self",
      "attack": 6,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Kenyeres meglepetés: 25% eséllyel +6 támadás erre az egy támadásra; különben nincs bónusz.",
    "portrait": "/portraits/11.svg"
  },
  {
    "id": 12,
    "name": "Kevin",
    "tags": [
      "sport",
      "alkoholista",
      "be kell engedni",
      "Racist",
      "kinai"
    ],
    "tier": 2,
    "attack": 2,
    "health": 6,
    "ability": {
      "name": "Be kell engedni",
      "trigger": "passive",
      "effect": "taunt",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Be kell engedni: őrzőként magára vonja a támadásokat.",
    "portrait": "/portraits/12.svg"
  },
  {
    "id": 13,
    "name": "Marci",
    "tags": [
      "zenész",
      "müvész"
    ],
    "tier": 3,
    "attack": 6,
    "health": 4,
    "ability": {
      "name": "Némító akkord",
      "trigger": "attack",
      "effect": "stealShield",
      "target": "enemy",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Némító akkord: leveszi a célpont védőpajzsát, és maga pajzsot kap. Más képességet nem tilt le.",
    "portrait": "/portraits/13.svg"
  },
  {
    "id": 14,
    "name": "Tibi",
    "tags": [
      "linux",
      "magas",
      "Racist"
    ],
    "tier": 3,
    "attack": 4,
    "health": 5,
    "ability": {
      "name": "Linux-frissítés",
      "trigger": "play",
      "effect": "buff",
      "target": "self",
      "attack": 0,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "Linux-frissítés: véglegesen +2 életerőt kap. Az újraéledés későbbi bővítés.",
    "portrait": "/portraits/14.svg"
  },
  {
    "id": 15,
    "name": "Maja",
    "tags": [
      "törpe"
    ],
    "tier": 3,
    "attack": 3,
    "health": 6,
    "ability": {
      "name": "Apró lendület",
      "trigger": "start",
      "effect": "shield",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Apró lendület: védőpajzsot kap erre a harcra.",
    "portrait": "/portraits/15.svg"
  },
  {
    "id": 16,
    "name": "Balázs",
    "tags": [
      "magabiztosan hülye"
    ],
    "tier": 3,
    "attack": 4,
    "health": 7,
    "ability": {
      "name": "Hamburgerdobás",
      "trigger": "start",
      "effect": "buff",
      "target": "other",
      "attack": 2,
      "health": 2,
      "amount": 0,
      "repeats": 2
    },
    "text": "Hamburgerdobás: két sorsolásban +2/+2 értéket ad másik szövetségesnek erre a harcra; lehet azonos célpont.",
    "portrait": "/portraits/16.svg"
  },
  {
    "id": 17,
    "name": "Fruzsi",
    "tags": [
      "müvész"
    ],
    "tier": 3,
    "attack": 5,
    "health": 3,
    "ability": {
      "name": "Inspiráció",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 2,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Inspiráció: egy másik szövetséges véglegesen +2 támadást kap.",
    "portrait": "/portraits/17.svg"
  },
  {
    "id": 18,
    "name": "Feri",
    "tags": [
      "sport"
    ],
    "tier": 3,
    "attack": 3,
    "health": 6,
    "ability": {
      "name": "Sportos védelem",
      "trigger": "passive",
      "effect": "taunt",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Sportos védelem: őrző tulajdonsággal rendelkezik.",
    "portrait": "/portraits/18.svg"
  },
  {
    "id": 19,
    "name": "Bea",
    "tags": [
      "zenész",
      "Csendes"
    ],
    "tier": 4,
    "attack": 7,
    "health": 6,
    "ability": {
      "name": "Zongoradobás",
      "trigger": "start",
      "effect": "damage",
      "target": "enemy",
      "attack": 0,
      "health": 0,
      "amount": 4,
      "repeats": 1
    },
    "text": "Zongoradobás: 4 sebzést okoz egy véletlen ellenségnek; nem termel aranyat.",
    "portrait": "/portraits/19.svg"
  },
  {
    "id": 20,
    "name": "Vanda",
    "tags": [
      "dök"
    ],
    "tier": 4,
    "attack": 4,
    "health": 7,
    "ability": {
      "name": "DÖK-szervezés",
      "trigger": "start",
      "effect": "buff",
      "target": "neighbors",
      "attack": 0,
      "health": 3,
      "amount": 0,
      "repeats": 1
    },
    "text": "DÖK-szervezés: a közvetlen szomszédok +3 életerőt kapnak erre a harcra.",
    "portrait": "/portraits/20.svg"
  },
  {
    "id": 21,
    "name": "Dani",
    "tags": [
      "Alkoholista",
      "zenész",
      "predator"
    ],
    "tier": 4,
    "attack": 6,
    "health": 8,
    "ability": {
      "name": "Hajnali koncert",
      "trigger": "start",
      "effect": "buff",
      "target": "allies",
      "attack": 2,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Hajnali koncert: minden más szövetséges +2 támadást kap erre a harcra.",
    "portrait": "/portraits/21.svg"
  },
  {
    "id": 22,
    "name": "M. Geri",
    "tags": [
      "Monster",
      "Racist"
    ],
    "tier": 4,
    "attack": 5,
    "health": 5,
    "ability": {
      "name": "Monster-löket",
      "trigger": "attack",
      "effect": "buff",
      "target": "self",
      "attack": 4,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Monster-löket: erre az egy támadásra +4 támadást kap.",
    "portrait": "/portraits/22.svg"
  },
  {
    "id": 23,
    "name": "Tomi",
    "tags": [
      "magas",
      "Csendes"
    ],
    "tier": 4,
    "attack": 8,
    "health": 4,
    "ability": {
      "name": "Csendes fedezet",
      "trigger": "start",
      "effect": "shield",
      "target": "left",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Csendes fedezet: a bal oldali szomszéd védőpajzsot kap erre a harcra.",
    "portrait": "/portraits/23.svg"
  },
  {
    "id": 24,
    "name": "Brigi",
    "tags": [
      "müvész",
      "vörös"
    ],
    "tier": 4,
    "attack": 4,
    "health": 8,
    "ability": {
      "name": "Vörös ecsetvonás",
      "trigger": "death",
      "effect": "buff",
      "target": "allies",
      "attack": 2,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "Vörös ecsetvonás: minden élő szövetséges +2/+2 értéket kap erre a harcra.",
    "portrait": "/portraits/24.svg"
  },
  {
    "id": 25,
    "name": "Csolti",
    "tags": [
      "magas",
      "tanár",
      "NetBeans"
    ],
    "tier": 5,
    "attack": 8,
    "health": 9,
    "ability": {
      "name": "NetBeans-javítás",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 4,
      "health": 4,
      "amount": 0,
      "repeats": 1
    },
    "text": "NetBeans-javítás: egy másik szövetséges véglegesen +4/+4 értéket kap.",
    "portrait": "/portraits/25.svg"
  },
  {
    "id": 26,
    "name": "Csefi",
    "tags": [
      "tanár",
      "sport",
      "Testvér",
      "JavaScript"
    ],
    "tier": 5,
    "attack": 6,
    "health": 8,
    "ability": {
      "name": "JavaScript-gyorsítás",
      "trigger": "start",
      "effect": "buff",
      "target": "allies",
      "attack": 3,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "JavaScript-gyorsítás: minden más szövetséges +3 támadást kap erre a harcra.",
    "portrait": "/portraits/26.svg"
  },
  {
    "id": 27,
    "name": "Ági",
    "tags": [
      "sport",
      "tanár",
      "MySql"
    ],
    "tier": 5,
    "attack": 9,
    "health": 6,
    "ability": {
      "name": "MySql-frissítés",
      "trigger": "play",
      "effect": "buff",
      "target": "allies",
      "attack": 0,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "MySql-frissítés: minden más szövetséges véglegesen +2 életerőt kap.",
    "portrait": "/portraits/27.svg"
  },
  {
    "id": 28,
    "name": "Csabi",
    "tags": [
      "Csendes"
    ],
    "tier": 5,
    "attack": 5,
    "health": 10,
    "ability": {
      "name": "Csendes tartalék",
      "trigger": "start",
      "effect": "shield",
      "target": "self",
      "attack": 3,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Csendes tartalék: védőpajzsot és +3 támadást kap erre a harcra.",
    "portrait": "/portraits/28.svg"
  },
  {
    "id": 29,
    "name": "iSTI",
    "tags": [
      "magas",
      "tanár",
      "Testvér",
      "MySql"
    ],
    "tier": 5,
    "attack": 7,
    "health": 7,
    "ability": {
      "name": "MySql-tranzakció",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 4,
      "health": 4,
      "amount": 0,
      "repeats": 1
    },
    "text": "MySql-tranzakció: egy másik szövetséges véglegesen +4/+4 értéket kap.",
    "portrait": "/portraits/29.svg"
  },
  {
    "id": 30,
    "name": "SIMON",
    "tags": [
      "Goat",
      "tanár",
      "magas"
    ],
    "tier": 6,
    "attack": 10,
    "health": 12,
    "ability": {
      "name": "GOAT-óra",
      "trigger": "start",
      "effect": "buff",
      "target": "neighbors",
      "attack": 0,
      "health": 4,
      "amount": 0,
      "repeats": 1
    },
    "text": "GOAT-óra: őrző; a közvetlen szomszédok +4 életerőt kapnak erre a harcra.",
    "portrait": "/portraits/30.svg"
  },
  {
    "id": 31,
    "name": "OLAJOS",
    "tags": [
      "Goat",
      "tanár"
    ],
    "tier": 6,
    "attack": 8,
    "health": 10,
    "ability": {
      "name": "GOAT-magyarázat",
      "trigger": "play",
      "effect": "buff",
      "target": "allies",
      "attack": 2,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "GOAT-magyarázat: minden más szövetséges véglegesen +2/+2 értéket kap.",
    "portrait": "/portraits/31.svg"
  },
  {
    "id": 32,
    "name": "Rózsás",
    "tags": [
      "vörös",
      "tanár"
    ],
    "tier": 6,
    "attack": 12,
    "health": 8,
    "ability": {
      "name": "Vörös javítás",
      "trigger": "start",
      "effect": "buff",
      "target": "allies",
      "attack": 3,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Vörös javítás: minden más szövetséges +3 támadást kap erre a harcra.",
    "portrait": "/portraits/32.svg"
  },
  {
    "id": 33,
    "name": "Lendvai Katalin",
    "tags": [
      "törpe",
      "tanár"
    ],
    "tier": 6,
    "attack": 7,
    "health": 12,
    "ability": {
      "name": "Határozott feleltetés",
      "trigger": "start",
      "effect": "shield",
      "target": "neighbors",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Határozott feleltetés: a közvetlen szomszédok védőpajzsot kapnak erre a harcra.",
    "portrait": "/portraits/33.svg"
  },
  {
    "id": 34,
    "name": "Ágoston",
    "tags": [
      "Tömő",
      "Vegas"
    ],
    "tier": 6,
    "attack": 9,
    "health": 11,
    "ability": {
      "name": "Vegas-dobás",
      "trigger": "start",
      "effect": "buff",
      "target": "other",
      "attack": 4,
      "health": 4,
      "amount": 0,
      "repeats": 2
    },
    "text": "Vegas-dobás: két sorsolásban +4/+4 értéket ad másik szövetségesnek erre a harcra; lehet azonos célpont.",
    "portrait": "/portraits/34.svg"
  }
];
export const HEROES:Hero[] = [
  {
    "id": "mentor",
    "name": "A Mentor",
    "title": "Minden kör egy új lecke",
    "armor": 12,
    "cost": 1,
    "power": "buff",
    "text": "Egy választott egység véglegesen +1/+1 értéket kap."
  },
  {
    "id": "guardian",
    "name": "A Portás",
    "title": "Ezen a kapun át",
    "armor": 15,
    "cost": 2,
    "power": "shield",
    "text": "Egy egység védőpajzsot kap a következő harcra."
  },
  {
    "id": "treasurer",
    "name": "A Kasszás",
    "title": "Az apró is számít",
    "armor": 8,
    "cost": 0,
    "power": "gold",
    "text": "Kapsz 1 aranyat. Körönként egyszer."
  },
  {
    "id": "inventor",
    "name": "A Rendszergazda",
    "title": "Új kínálat, új esély",
    "armor": 10,
    "cost": 0,
    "power": "refresh",
    "text": "Ingyen frissíti a boltot. Körönként egyszer."
  }
];
export const character=(id:number)=>{const c=CHARACTERS.find(c=>c.id===id);if(!c)throw new Error('Unknown character '+id);return c;};
export const hero=(id:string|null)=>HEROES.find(h=>h.id===id);
