import { CHARACTERS } from './catalog';
import { shuffle } from './random';
import { TRIBES, tribeFor, type CardType } from './tribes';

export function selectMatchPool(rng:{rng:number}) {
 const activeTribes=shuffle(rng,[...TRIBES]).slice(0,5).map(t=>t.id);
 const activeCardIds:number[]=[];
 function select(type:CardType,quotas:number[]){
  for(let tier=1;tier<=6;tier++){
   const candidates=CHARACTERS.filter(c=>tribeFor(c)===type&&c.tier===tier);
   const amount=quotas[tier-1];
   if(candidates.length<amount)throw new Error(`Insufficient ${type} cards at tier ${tier}`);
   activeCardIds.push(...shuffle(rng,candidates).slice(0,amount).map(c=>c.id));
  }
 }
 // Equal tribe coverage at every tier; shared cards occupy separate slots.
 for(const tribe of activeTribes)select(tribe,[2,2,2,2,2,2]);
 select('neutral',[2,2,2,2,2,2]);
 select('all',[2,2,1,1,1,1]);
 return {activeTribes,activeCardIds:activeCardIds.sort((a,b)=>a-b)};
}
