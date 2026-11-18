import type {CombatBeat} from './combat-presentation';
import type {Unit} from '../shared/types';

export type VisualKind='impact'|'shield-break'|'shield-gain'|'venom'|'reborn'|'stealth'|'windfury'|'buff'|'summon'|'death';
export interface CombatVisual {kind:VisualKind;uid:string;anchor?:string}
const units=(frame:{left:Unit[];right:Unit[]})=>[...frame.left,...frame.right];

/** Derive presentation from state transitions, never from localized event text. */
export function combatVisuals(beat:CombatBeat):CombatVisual[]{
 const result:CombatVisual[]=[];
 const add=(kind:VisualKind,uid?:string,anchor?:string)=>{if(uid&&!result.some(v=>v.kind===kind&&v.uid===uid))result.push({kind,uid,anchor});};
 let previous=units(beat.before);
 for(const e of beat.events){
  const next=units(e),source=previous.find(u=>u.uid===e.actor);
  if(e.type==='attack'){
   add('impact',e.target);
   if(source?.keywords?.includes('windfury'))add('windfury',e.actor);
  }
  if(e.type==='shield')add('shield-break',e.target);
  if(e.type==='damage'&&!beat.events.some(a=>a.type==='attack'))add('impact',e.target);
  if(e.type==='buff')add('buff',e.target);
  if(e.type==='death')add('death',e.actor);
  if(e.type==='summon'){
   const added=next.filter(u=>!previous.some(p=>p.uid===u.uid));
   for(const u of added)add(e.target===u.uid&&u.uid.startsWith(`${e.actor}-reborn-`)?'reborn':'summon',u.uid,e.actor);
  }
  for(const u of next){
   const before=previous.find(p=>p.uid===u.uid);
   if(before&&!before.shield&&u.shield)add('shield-gain',u.uid);
   if(before?.keywords?.includes('stealth')&&!u.keywords?.includes('stealth'))add('stealth',u.uid);
   if(before?.keywords?.includes('venomous')&&!u.keywords?.includes('venomous')&&e.type==='keyword')add('venom',e.target,u.uid);
  }
  previous=next;
 }
 return result;
}
