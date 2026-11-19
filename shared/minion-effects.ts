import {character} from './catalog';
import {tribeFor} from './tribes';
import type {Ability,Character,Trigger,Unit} from './types';

export const TRIGGER_LABELS: Record<Trigger,string> = {
 play:'Battlecry', death:'Deathrattle', rally:'Rally', turnStart:'Kör eleje',
 turnEnd:'Kör vége', start:'Harc eleje', attack:'Első támadás', passive:'Passzív',
};

export function minionAbility(unit:Unit):Ability|undefined {
 if(unit.token&&!unit.ability)return;
 return unit.ability??character(unit.characterId).ability;
}

export function effectSize(unit:Unit) {
 return unit.golden?2:1;
}

export function tribalAllies(board:Unit[],source:Unit,definition:(u:Unit)=>Character=u=>character(u.characterId)){
 const tribe=tribeFor(definition(source));
 if(tribe==='neutral')return [];
 return board.filter(unit=>{
  if(unit===source||unit.health<=0)return false;
  const other=tribeFor(definition(unit));
  return other!=='neutral'&&(other===tribe||other==='all'||tribe==='all');
 });
}

export function triggerCount(board:Unit[], trigger:Trigger, minimum=1, abilityFor=minionAbility) {
 let count=minimum;
 for(const unit of board) {
  if(unit.health<=0)continue;
  const aura=abilityFor(unit);
  if(aura?.effect==='amplify'&&aura.amplifies===trigger)count=Math.max(count,unit.golden?3:2);
 }
 return count;
}

export function changeStats(unit:Unit, ability:Ability, multiplier:number) {
 unit.attack+=(ability.attack||0)*multiplier;
 unit.health+=(ability.health||0)*multiplier;
 if(ability.effect==='shield')unit.shield=true;
 if(ability.effect==='taunt')unit.taunt=true;
}
