import { character } from './catalog';
import { RULES } from './rules';
import { pick, random } from './random';
import type { Ability, CombatEvent, Unit } from './types';

export function fight(leftInput:Unit[],rightInput:Unit[],seed:number){
 const sides=[structuredClone(leftInput),structuredClone(rightInput)];
 const rng={rng:seed||1}; const events:CombatEvent[]=[];const attacked=new Set<string>();
 let current=sides[0].length===sides[1].length?(random(rng)<.5?0:1):sides[0].length>sides[1].length?0:1;
 const emit=(type:CombatEvent['type'],text:string,actor?:string,target?:string,amount?:number)=>events.push({type,text,actor,target,amount,left:structuredClone(sides[0]),right:structuredClone(sides[1])});
 const hit=(u:Unit,n:number)=>{if(n<=0)return;if(u.shield){u.shield=false;emit('shield',`${character(u.characterId).name} pajzsa eltört.`,undefined,u.uid);}else{u.health-=n;emit('damage',`${character(u.characterId).name}: −${n} életerő`,undefined,u.uid,n);}};
 function effect(side:number,source:Unit,a:Ability,index:number,target?:Unit){
  const allies=sides[side].filter(u=>u.health>0);const enemies=sides[1-side].filter(u=>u.health>0);const pos=sides[side].findIndex(u=>u.uid===source.uid);const at=pos<0?index:pos;
  let targets:Unit[]=[];
  if(a.target==='self')targets=[source];
  if(a.target==='allies')targets=allies.filter(u=>u.uid!==source.uid);
  if(a.target==='enemies')targets=enemies;
  if(a.target==='enemy')targets=target?[target]:enemies.length?[pick(rng,enemies)]:[];
  if(a.target==='other'){const other=allies.filter(u=>u.uid!==source.uid);targets=other.length?[pick(rng,other)]:[];}
  if(a.target==='left')targets=sides[side][at-1]?[sides[side][at-1]]:[];
  if(a.target==='neighbors')targets=[sides[side][at-1],sides[side][pos<0?at:at+1]].filter((u):u is Unit=>!!u&&u.health>0&&u.uid!==source.uid);
  const mult=source.golden?2:1;
  if(a.effect==='summon'&&sides[side].length<RULES.boardSize){const token:Unit={...source,uid:source.uid+'-token-'+events.length,attack:2*mult,health:2*mult,golden:false,shield:false,taunt:false,copies:0,token:true};sides[side].splice(Math.max(0,at),0,token);emit('summon','Egy 2/2 segítő csatlakozott.',source.uid);return;}
  for(const u of targets){
   if(a.effect==='damage')hit(u,(a.amount||0)*mult);
   else if(a.effect==='stealShield'){u.shield=false;source.shield=true;emit('shield',a.name,source.uid,u.uid);}
   else if(a.effect==='bread'){if(random(rng)<.25){source.attack+=(a.attack||0)*mult;emit('buff',a.name,source.uid,source.uid);}}
   else{u.attack+=(a.attack||0)*mult;u.health+=(a.health||0)*mult;if(a.effect==='shield')u.shield=true;if(a.effect==='taunt')u.taunt=true;emit('buff',a.name,source.uid,u.uid);}
  }
 }
 function trigger(side:number,u:Unit,index:number,target?:Unit){if(u.token)return;const a=character(u.characterId).ability;for(let r=0;r<(a.repeats||1);r++)effect(side,u,a,index,target);}
 function deaths(){
  for(let safety=0;safety<100;safety++){
   const dead=[current,1-current].flatMap(side=>sides[side].filter(u=>u.health<=0).map(u=>({side,u,index:sides[side].indexOf(u)})));
   if(!dead.length)return;
   // A batch is removed before its deathrattles, in attacking-side then board order.
   for(const {side,u} of dead)sides[side]=sides[side].filter(x=>x.uid!==u.uid);
   for(const {side,u,index} of dead){emit('death',`${character(u.characterId).name} kiesett a harcból.`,u.uid);if(!u.token&&character(u.characterId).ability.trigger==='death')trigger(side,u,index);}
  }
 }
 emit('start','A harc elkezdődött.');
 for(const side of [current,1-current])for(const u of [...sides[side]])if(u.health>0&&!u.token&&character(u.characterId).ability.trigger==='start'){trigger(side,u,sides[side].indexOf(u));deaths();}
 const next=[0,0];let attacks=0;
 while(sides[0].length&&sides[1].length&&attacks++<RULES.maxAttacks){
  const own=sides[current];const foes=sides[1-current];let attacker:Unit|undefined;
  for(let i=0;i<own.length;i++){const at=(next[current]+i)%own.length;if(own[at].attack>0){attacker=own[at];break;}}
  if(!attacker){if(!foes.some(u=>u.attack>0))break;current=1-current;continue;}
  const guards=foes.filter(u=>u.taunt);const target=pick(rng,guards.length?guards:foes);
  if(!attacked.has(attacker.uid)){attacked.add(attacker.uid);if(!attacker.token&&character(attacker.characterId).ability.trigger==='attack')trigger(current,attacker,own.indexOf(attacker),target);}
  emit('attack',`${character(attacker.characterId).name} → ${character(target.characterId).name}`,attacker.uid,target.uid);
  // Both attack values are captured before either damage is applied.
  const outgoing=attacker.attack,incoming=target.attack;const oldIndex=own.indexOf(attacker);
  hit(target,outgoing);hit(attacker,incoming);deaths();
  const still=sides[current].findIndex(u=>u.uid===attacker!.uid);next[current]=still>=0?still+1:oldIndex;
  current=1-current;
 }
 const winner=sides[0].length&&!sides[1].length?0:sides[1].length&&!sides[0].length?1:null;
 emit('result',winner===null?'Döntetlen.':`${winner===0?'Bal':'Jobb'} oldal nyert.`);
 return {winner,survivors:winner===null?[]:sides[winner],events};
}
