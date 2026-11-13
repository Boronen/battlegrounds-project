import type { Character } from './types';

// Initial balance pass; original character IDs remain stable.
export const BACK_TO_THE_FUTURE: Character[] = [
  {
    "id": 35,
    "name": "Marty McFly",
    "tags": [
      "Back to the Future"
    ],
    "tier": 1,
    "attack": 3,
    "health": 2,
    "ability": {
      "name": "Gördeszkás lendület",
      "trigger": "attack",
      "effect": "buff",
      "target": "self",
      "attack": 2,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Gördeszkás lendület: Az első támadásától +2 támadást kap erre a harcra.",
    "portrait": "/portraits/35.svg"
  },
  {
    "id": 36,
    "name": "Doc Brown",
    "tags": [
      "Back to the Future"
    ],
    "tier": 6,
    "attack": 7,
    "health": 10,
    "ability": {
      "name": "Időpajzs",
      "trigger": "start",
      "effect": "shield",
      "target": "left",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Időpajzs: A bal oldali szomszéd védőpajzsot kap erre a harcra.",
    "portrait": "/portraits/36.svg"
  },
  {
    "id": 37,
    "name": "Biff Tannen",
    "tags": [
      "Back to the Future"
    ],
    "tier": 2,
    "attack": 2,
    "health": 6,
    "ability": {
      "name": "Útban vagy!",
      "trigger": "passive",
      "effect": "taunt",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Útban vagy!: Őrző: magára vonja az ellenséges támadásokat.",
    "portrait": "/portraits/37.svg"
  },
  {
    "id": 38,
    "name": "George McFly",
    "tags": [
      "Back to the Future"
    ],
    "tier": 1,
    "attack": 1,
    "health": 3,
    "ability": {
      "name": "Bátorságpróba",
      "trigger": "play",
      "effect": "buff",
      "target": "self",
      "attack": 2,
      "health": 1,
      "amount": 0,
      "repeats": 1
    },
    "text": "Bátorságpróba: Kijátszáskor véglegesen +2/+1 értéket kap.",
    "portrait": "/portraits/38.svg"
  },
  {
    "id": 39,
    "name": "Lorraine Baines McFly",
    "tags": [
      "Back to the Future"
    ],
    "tier": 3,
    "attack": 3,
    "health": 5,
    "ability": {
      "name": "Bátorító szó",
      "trigger": "play",
      "effect": "buff",
      "target": "other",
      "attack": 2,
      "health": 2,
      "amount": 0,
      "repeats": 1
    },
    "text": "Bátorító szó: Egy választott másik szövetséges véglegesen +2/+2 értéket kap.",
    "portrait": "/portraits/39.svg"
  },
  {
    "id": 40,
    "name": "Jennifer Parker",
    "tags": [
      "Back to the Future"
    ],
    "tier": 4,
    "attack": 4,
    "health": 7,
    "ability": {
      "name": "Közös jövő",
      "trigger": "start",
      "effect": "buff",
      "target": "neighbors",
      "attack": 0,
      "health": 3,
      "amount": 0,
      "repeats": 1
    },
    "text": "Közös jövő: A közvetlen szomszédok +3 életerőt kapnak erre a harcra.",
    "portrait": "/portraits/40.svg"
  },
  {
    "id": 41,
    "name": "Clara Clayton",
    "tags": [
      "Back to the Future"
    ],
    "tier": 3,
    "attack": 3,
    "health": 6,
    "ability": {
      "name": "Biztonságos utazás",
      "trigger": "start",
      "effect": "shield",
      "target": "self",
      "attack": 0,
      "health": 0,
      "amount": 0,
      "repeats": 1
    },
    "text": "Biztonságos utazás: Védőpajzsot kap erre a harcra.",
    "portrait": "/portraits/41.svg"
  },
  {
    "id": 42,
    "name": "Buford “Mad Dog” Tannen",
    "tags": [
      "Back to the Future"
    ],
    "tier": 5,
    "attack": 7,
    "health": 7,
    "ability": {
      "name": "Párbaj délben",
      "trigger": "start",
      "effect": "damage",
      "target": "enemy",
      "attack": 0,
      "health": 0,
      "amount": 4,
      "repeats": 1
    },
    "text": "Párbaj délben: 4 sebzést okoz egy véletlen ellenségnek.",
    "portrait": "/portraits/42.svg"
  }
];
