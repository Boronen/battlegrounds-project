import { character } from './catalog';
import { RULES } from './rules';
import { pick, random } from './random';
import {consumeKeyword, hasKeyword} from './keywords';
import type { Ability, Character, CombatEvent, Unit } from './types';

export function fight(leftInput:Unit[],rightInput:Unit[],seed:number,options:{recordEvents?:boolean;catalog?:(id:number)=>Character}={}){
 const card=options.catalog||character;
 const sides=[structuredClone(leftInput),structuredClone(rightInput)];
 const rng={rng:seed||1}; const events:CombatEvent[]=[];const attacked=new Set<string>();
 let current=sides[0].length===sides[1].length?(random(rng)<.5?0:1):sides[0].length>sides[1].length?0:1;
 const startingSide=current;
 const emit=(type:CombatEvent['type'],text:string,actor?:string,target?:string,amount?:number)=>{if(options.recordEvents!==false)events.push({type,text,actor,target,amount,left:structuredClone(sides[0]),right:structuredClone(sides[1])});};
 let spawnId=0;
 const hit=(u:Unit,n:number,source?:Unit,venom=false)=>{if(n<=0)return;if(u.shield){u.shield=false;emit('shield',`${card(u.characterId).name} pajzsa eltört.`,undefined,u.uid);}else{u.health-=n;emit('damage',`${card(u.characterId).name}: −${n} életerő`,source?.uid,u.uid,n);if(source&&venom){consumeKeyword(source,'venomous');u.health=0;emit('keyword','A méreg elfogyott: a célpont elpusztult.',source.uid,u.uid);}}};
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
  if(a.effect==='summon'&&sides[side].length<RULES.boardSize){const token:Unit={...source,uid:source.uid+'-token-'+spawnId++,attack:2*mult,health:2*mult,golden:false,shield:false,taunt:false,keywords:[],copies:0,token:true};sides[side].splice(Math.max(0,at),0,token);emit('summon','Egy 2/2 segítő csatlakozott.',source.uid);return;}
  for(const u of targets){
   if(a.effect==='damage')hit(u,(a.amount||0)*mult);
   else if(a.effect==='stealShield'){u.shield=false;source.shield=true;emit('shield',a.name,source.uid,u.uid);}
   else if(a.effect==='bread'){if(random(rng)<.25){source.attack+=(a.attack||0)*mult;emit('buff',a.name,source.uid,source.uid);}}
   else{u.attack+=(a.attack||0)*mult;u.health+=(a.health||0)*mult;if(a.effect==='shield')u.shield=true;if(a.effect==='taunt')u.taunt=true;emit('buff',a.name,source.uid,u.uid);}
  }
 }
 function trigger(side:number,u:Unit,index:number,target?:Unit){if(u.token)return;const a=card(u.characterId).ability;for(let r=0;r<(a.repeats||1);r++)effect(side,u,a,index,target);}
 function deaths(){
  for(let safety=0;safety<100;safety++){
   const dead=[current,1-current].flatMap(side=>sides[side].filter(u=>u.health<=0).map(u=>({side,u,index:sides[side].indexOf(u),following:sides[side].slice(sides[side].indexOf(u)+1).filter(x=>x.health>0).map(x=>x.uid)})));
   if(!dead.length)return;
   // A batch is removed before its deathrattles, in attacking-side then board order.
   for(const {side,u} of dead)sides[side]=sides[side].filter(x=>x.uid!==u.uid);
   for(const {side,u,index} of dead){emit('death',`${card(u.characterId).name} kiesett a harcból.`,u.uid);if(!u.token&&card(u.characterId).ability.trigger==='death')trigger(side,u,index);}
   // Deathrattles resolve before resurrections; board capacity is shared.
   for(const {side,u,following} of dead)if(hasKeyword(u,'reborn')&&sides[side].length<RULES.boardSize){
    const revived:Unit={...u,uid:`${u.uid}-reborn-${spawnId++}`,attack:card(u.characterId).attack*(u.golden?2:1),health:1,shield:false,taunt:false,keywords:[]};
    const nextSurvivor=following.map(uid=>sides[side].findIndex(x=>x.uid===uid)).find(at=>at>=0);
    sides[side].splice(nextSurvivor??sides[side].length,0,revived);
    emit('summon',`${card(u.characterId).name}: újjászületés, 1 életerő.`,u.uid,revived.uid);
   }
  }
 }
 emit('start','A harc elkezdődött.');
 for(const side of [current,1-current])for(const u of [...sides[side]])if(u.health>0&&!u.token&&card(u.characterId).ability.trigger==='start'){trigger(side,u,sides[side].indexOf(u));deaths();}
 const next=[0,0];let attacks=0;
 while(sides[0].length&&sides[1].length&&attacks<RULES.maxAttacks){
  const own=sides[current];const foes=sides[1-current];let attacker:Unit|undefined;
  for(let i=0;i<own.length;i++){const at=(next[current]+i)%own.length;if(own[at].attack>0){attacker=own[at];break;}}
  if(!attacker){if(!foes.some(u=>u.attack>0))break;current=1-current;continue;}
  const swings=hasKeyword(attacker,'windfury')?2:1;
  for(let swing=0;swing<swings&&attacks<RULES.maxAttacks;swing++){
   if(!sides[current].some(u=>u.uid===attacker!.uid&&u.health>0)||!sides[1-current].length)break;
   attacks++;
   const visible=sides[1-current].filter(u=>!hasKeyword(u,'stealth'));
   const eligible=visible.length?visible:sides[1-current];
   const guards=eligible.filter(u=>u.taunt);const target=pick(rng,guards.length?guards:eligible);
   if(hasKeyword(attacker,'stealth')){consumeKeyword(attacker,'stealth');emit('keyword','A támadó felfedte magát.',attacker.uid);}
   if(!attacked.has(attacker.uid)){attacked.add(attacker.uid);if(!attacker.token&&card(attacker.characterId).ability.trigger==='attack')trigger(current,attacker,sides[current].indexOf(attacker),target);}
   emit('attack',`${card(attacker.characterId).name} → ${card(target.characterId).name}`,attacker.uid,target.uid);
   // Capture both attack values and venom charges before simultaneous damage.
   const outgoing=attacker.attack,incoming=target.attack,venomOut=hasKeyword(attacker,'venomous'),venomIn=hasKeyword(target,'venomous');
   const oldIndex=sides[current].indexOf(attacker);
   hit(target,outgoing,attacker,venomOut);hit(attacker,incoming,target,venomIn);deaths();
   const still=sides[current].findIndex(u=>u.uid===attacker!.uid);next[current]=still>=0?still+1:oldIndex;
  }
  current=1-current;
 }
 const winner=sides[0].length&&!sides[1].length?0:sides[1].length&&!sides[0].length?1:null;
 emit('result',winner===null?'Döntetlen.':`${winner===0?'Bal':'Jobb'} oldal nyert.`);
 return {winner,survivors:winner===null?[]:sides[winner],events,startingSide};
}
