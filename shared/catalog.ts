import type { Character,Unit } from './types';
import {applyKeywordDesigns} from './keyword-designs';
import { BACK_TO_THE_FUTURE } from './back-to-the-future';
import { AMERICAN_DRAGON } from './american-dragon';
import { FRANCHISE_EXPANSION } from './franchise-expansion';
import {configurePowers} from './hero-powers';
import { ORIGINAL_HEROES } from './original-heroes';
import { SHARED_CARDS, TRIBE_SUPPORT, TRIGGER_SUPPORT } from './shared-cards';

export let CHARACTERS:Character[] = [...BACK_TO_THE_FUTURE, ...AMERICAN_DRAGON, ...FRANCHISE_EXPANSION, ...SHARED_CARDS, ...TRIBE_SUPPORT, ...TRIGGER_SUPPORT];
applyKeywordDesigns(CHARACTERS);
export const HEROES = ORIGINAL_HEROES;
configurePowers(HEROES);
export const character=(id:number)=>{const c=CHARACTERS.find(c=>c.id===id)||SPECIAL_CARDS.find(c=>c.id===id);if(!c)throw new Error('Unknown character '+id);return c;};
export const hero=(id:string|null)=>HEROES.find(h=>h.id===id);

export const SPECIAL_CARDS:Character[]=[{id:-7,name:"Segítő",tags:[],tribe:"neutral",tier:1,attack:2,health:2,ability:{name:"Segítő",trigger:"passive",effect:"buff",target:"self"},text:"Idézett egység.",portrait:"/art/tribes/neutral.webp"},...([-5,-6].map((id):Character=>({id,name:id===-5?'Magnetic Őrző':'Magnetic Rohamgép',tags:['Kevin'],tribe:'technologists',tier:1,attack:id===-5?1:3,health:id===-5?3:1,ability:{name:'Magnetic',trigger:'passive',effect:'buff',target:'self'},text:'Célpontra kijátszva egyesül a saját minionnal.',portrait:'/portraits/sketch/12.png'}))),{id:-4,name:'Magnetic Mech',tags:['Kevin'],tribe:'technologists',tier:1,attack:2,health:2,ability:{name:'Magnetic',trigger:'passive',effect:'buff',target:'self'},text:'Saját célpontra kijátszva hozzáadja a statjait; célpont nélkül önálló minion.',portrait:'/portraits/sketch/12.png'},{id:-1,name:'Renata',tags:['Milán'],tier:1,attack:2,health:2,tribe:'all',keywords:['venomous'],ability:{name:'Renata',trigger:'passive',effect:'buff',target:'self'},text:'Minden típus. Méreg.',portrait:'/portraits/sketch/4.png'},{id:-2,name:'Battlecruiser',tags:['Kevin'],tribe:'technologists',tier:1,attack:2,health:2,ability:{name:'Battlecruiser',trigger:'passive',effect:'buff',target:'self'},text:'A fejlesztő spellek ezt az egységet erősítik.',portrait:'/portraits/sketch/12.png'},{id:-3,name:'Csefi',tags:['Hős'],tribe:'guardians',tier:1,attack:1,health:1,ability:{name:'Hős',trigger:'passive',effect:'buff',target:'self'},text:'Nem célozható nyolcadik harcos.',portrait:'/portraits/sketch/26.png'}];
export function unitDefinition(u:Unit):Character {return {...character(u.characterId),...(u.name?{name:u.name}:{}),...(u.text?{text:u.text}:{}),...(u.ability?{ability:u.ability}:{}),...(u.tier?{tier:u.tier}:{})};}


const builtInCards = CHARACTERS;
export function useCatalog(cards: Character[] = builtInCards) {
  CHARACTERS = cards;
}

// Engine operations are synchronous. Restore the previous match catalogue before yielding.
export function withCatalog<T>(cards: Character[], operation: () => T): T {
  const previous = CHARACTERS;
  try {
    useCatalog(cards);
    return operation();
  } finally {
    useCatalog(previous);
  }
}
