import { createMatch as createRealMatch } from '../shared/engine';
import { CHARACTERS } from '../shared/catalog';
import { RULES } from '../shared/rules';

// Mechanics tests deliberately need specific cards independent of the random roster.
// Production pool selection is exercised separately in match-pool.test.ts and soak.ts.
export const createMatch:typeof createRealMatch = (...args)=>{
 const m=createRealMatch(...args);
 for(const c of CHARACTERS)if(!m.activeCardIds.includes(c.id))m.pool[c.id]=RULES.poolCopies[c.tier];
 m.activeCardIds=CHARACTERS.map(c=>c.id);
 return m;
};
