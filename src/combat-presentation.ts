import type { CombatEvent, Unit } from '../shared/types';

export interface CombatBeat { events:CombatEvent[]; before:CombatEvent; after:CombatEvent; duration:number }
/** Presentation only: keep attack, retaliation and deaths together without changing the replay. */
export function combatBeats(events:CombatEvent[]):CombatBeat[]{
 const beats:CombatBeat[]=[];
 for(let i=0;i<events.length;i++){
  const first=events[i],group=[first],before=events[Math.max(0,i-1)];
  if(first.type==='attack')while(i+1<events.length&&['damage','shield','death'].includes(events[i+1].type))group.push(events[++i]);
  beats.push({events:group,before,after:group.at(-1)!,duration:first.type==='attack'?850:first.type==='start'?650:first.type==='result'?1000:500});
 }
 return beats;
}
export function displayedUnits(before:Unit[],after:Unit[],impact:boolean){
 if(!impact)return before;
 return [...before.map(u=>after.find(x=>x.uid===u.uid)||{...u,health:0}),...after.filter(u=>!before.some(x=>x.uid===u.uid))];
}
export function statLayers(unit:Unit,base:{attack:number;health:number},recruit:Unit|undefined,events:CombatEvent[]){
 const initial=events[0];const start=recruit||[...(initial?.left||[]),...(initial?.right||[])].find(u=>u.uid===unit.uid)||unit;
 let combatAttack=0,combatHealth=0;
 for(let i=1;i<events.length;i++){
  const e=events[i];if(e.type!=='buff'||e.target!==unit.uid)continue;
  const previous=[...events[i-1].left,...events[i-1].right].find(u=>u.uid===unit.uid),next=[...e.left,...e.right].find(u=>u.uid===unit.uid);
  if(previous&&next){combatAttack+=Math.max(0,next.attack-previous.attack);combatHealth+=Math.max(0,next.health-previous.health);}
 }
 return {permanentAttack:Math.max(0,start.attack-base.attack),permanentHealth:Math.max(0,start.health-base.health),combatAttack,combatHealth,damaged:unit.health<start.health+combatHealth};
}
