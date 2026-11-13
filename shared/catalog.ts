import type { Character } from './types';
import {applyKeywordDesigns} from './keyword-designs';
import { BACK_TO_THE_FUTURE } from './back-to-the-future';
import { AMERICAN_DRAGON } from './american-dragon';
import { FRANCHISE_EXPANSION } from './franchise-expansion';
import { ORIGINAL_HEROES } from './original-heroes';
import { SHARED_CARDS, TRIBE_SUPPORT } from './shared-cards';

export const CHARACTERS:Character[] = [...BACK_TO_THE_FUTURE, ...AMERICAN_DRAGON, ...FRANCHISE_EXPANSION, ...SHARED_CARDS, ...TRIBE_SUPPORT];
applyKeywordDesigns(CHARACTERS);
export const HEROES = ORIGINAL_HEROES;
export const character=(id:number)=>{const c=CHARACTERS.find(c=>c.id===id);if(!c)throw new Error('Unknown character '+id);return c;};
export const hero=(id:string|null)=>HEROES.find(h=>h.id===id);
