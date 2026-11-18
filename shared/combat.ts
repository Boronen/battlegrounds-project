import { character,unitDefinition } from './catalog';
import { RULES } from './rules';
import { pick, random } from './random';
import {consumeKeyword, hasKeyword} from './keywords';
import type { Ability, Character, CombatEvent, Unit } from './types';

export function fight(leftInput:Unit[],rightInput:Unit[],seed:number,options:{recordEvents?:boolean;catalog?:(id:number)=>Character;champions?:number[]}={}){
 const card=options.catalog||character;
 const sides=[structuredClone(leftInput),structuredClone(rightInput)];
 const rng={rng:seed||1}; const events:CombatEvent[]=[];const attacked=new Set<string>();
 let current=sides[0].length===sides[1].length?(random(rng)<.5?0:1):sides[0].length>sides[1].length?0:1;
 const startingSide=current;
 const champions=(options.champions||[0,0]).map((attack,side):Unit=>({uid:'champion-'+side,characterId:-3,attack,health:1,golden:false,shield:false,taunt:false,copies:0,token:true,heroFighter:true}));
 const definition=(u:Unit)=>options.catalog?{...card(u.characterId),...(u.ability?{ability:u.ability}:{})}:unitDefinition(u);
 const emit=(type:CombatEvent['type'],text:string,actor?:string,target?:string,amount?:number)=>{if(options.recordEvents!==false)events.push({type,text,actor,target,amount,left:structuredClone([...sides[0],...champions.filter((u,i)=>i===0&&u.attack>0)]),right:structuredClone([...sides[1],...champions.filter((u,i)=>i===1&&u.attack>0)])});};
 const heroDamage=[0,0];const heroHitUsed=[[false,false],[false,false]];let spawnId=0;
 const hit=(u:Unit,n:number,source?:Unit,venom=false)=>{if(n<=0)return;if(u.shield){u.shield=false;emit('shield',`${definition(u).name} pajzsa eltört.`,undefined,u.uid);}else{u.health-=n;emit('damage',`${definition(u).name}: −${n} életerő`,source?.uid,u.uid,n);if(source&&venom){consumeKeyword(source,'venomous');u.health=0;emit('keyword','A méreg elfogyott: a célpont elpusztult.',source.uid,u.uid);}}};
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
  if(a.effect==='summon'&&sides[side].length<RULES.boardSize){const token:Unit={...source,uid:source.uid+'-token-'+spawnId++,attack:2*mult,health:2*mult,golden:false,shield:false,taunt:false,keywords:[],copies:0,token:true,generated:false,ability:undefined,spellUpgrades:undefined,fullReborn:false};sides[side].splice(Math.max(0,at),0,token);emit('summon','Egy 2/2 segítő csatlakozott.',source.uid);return;}
  for(const u of targets){
   if(a.effect==='damage')hit(u,(a.amount||0)*mult);
   else if(a.effect==='stealShield'){u.shield=false;source.shield=true;emit('shield',a.name,source.uid,u.uid);}
   else if(a.effect==='bread'){if(random(rng)<.25){source.attack+=(a.attack||0)*mult;emit('buff',a.name,source.uid,source.uid);}}
   else{u.attack+=(a.attack||0)*mult;u.health+=(a.health||0)*mult;if(a.effect==='shield')u.shield=true;if(a.effect==='taunt')u.taunt=true;emit('buff',a.name,source.uid,u.uid);}
  }
 }
 function trigger(side:number,u:Unit,index:number,target?:Unit){if(u.token&&!u.ability)return;const a=definition(u).ability;for(let r=0;r<(a.repeats||1);r++)effect(side,u,a,index,target);}
 function deaths(){
  for(let safety=0;safety<100;safety++){
   const dead=[current,1-current].flatMap(side=>sides[side].filter(u=>u.health<=0).map(u=>({side,u,index:sides[side].indexOf(u),following:sides[side].slice(sides[side].indexOf(u)+1).filter(x=>x.health>0).map(x=>x.uid)})));
   if(!dead.length)return;
   // A batch is removed before its deathrattles, in attacking-side then board order.
   for(const {side,u} of dead)sides[side]=sides[side].filter(x=>x.uid!==u.uid);
   for(const {side,u,index} of dead){emit('death',`${definition(u).name} kiesett a harcból.`,u.uid);if((!u.token||u.ability)&&definition(u).ability.trigger==='death')trigger(side,u,index);if(u.spellUpgrades?.death&&sides[side][0]){sides[side][0].attack+=u.spellUpgrades.death;sides[side][0].health+=u.spellUpgrades.death;emit('buff','Caduceus Reactor',u.uid,sides[side][0].uid);}}
   // Deathrattles resolve before resurrections; board capacity is shared.
   for(const {side,u,following} of dead)if(hasKeyword(u,'reborn')&&sides[side].length<RULES.boardSize){
    const revived:Unit={...u,uid:`${u.uid}-reborn-${spawnId++}`,attack:u.fullReborn?u.attack:definition(u).attack*(u.golden?2:1),health:u.fullReborn?Math.max(1,leftInput.concat(rightInput).find(x=>x.uid===u.uid)?.health||1):1,shield:false,taunt:u.fullReborn?u.taunt:false,keywords:u.fullReborn?(u.keywords||[]).filter(k=>k!=='reborn'):[]};
    const nextSurvivor=following.map(uid=>sides[side].findIndex(x=>x.uid===uid)).find(at=>at>=0);
    sides[side].splice(nextSurvivor??sides[side].length,0,revived);
    emit('summon',`${definition(u).name}: újjászületés, 1 életerő.`,u.uid,revived.uid);
   }
  }
 }
 emit('start','A harc elkezdődött.');
 for(const side of [current,1-current])for(const u of [...sides[side]])if(u.health>0&&(!u.token||u.ability)&&definition(u).ability.trigger==='start'){trigger(side,u,sides[side].indexOf(u));deaths();}
 function championStrike(side:number){const c=champions[side];if(!c?.attack||!sides[side].length||!sides[1-side].length)return;const enemies=sides[1-side].filter(u=>!hasKeyword(u,'stealth'));const eligible=enemies.length?enemies:sides[1-side];const guards=eligible.filter(u=>u.taunt);const target=pick(rng,guards.length?guards:eligible);emit('attack','Csefi támad.',c.uid,target.uid);hit(target,c.attack,c);deaths();}
 for(const side of [current,1-current]){for(const cruiser of [...sides[side]])if(cruiser.spellUpgrades?.yamato){for(let i=0;i<(cruiser.spellUpgrades.missile||1);i++){const target=[...sides[1-side]].sort((a,b)=>b.health-a.health)[0];if(target){hit(target,cruiser.spellUpgrades.yamato,cruiser);deaths();}}}championStrike(side);}
 const championTurns=[0,0];const next=[0,0];let attacks=0;
 while(sides[0].length&&sides[1].length&&attacks<RULES.maxAttacks){
  const own=sides[current];const foes=sides[1-current];let attacker:Unit|undefined;
  for(let i=0;i<own.length;i++){const at=(next[current]+i)%own.length;if(own[at].attack>0){attacker=own[at];break;}}
  if(!attacker){if(champions[current]?.attack){attacks++;championStrike(current);}else if(!foes.some(u=>u.attack>0)&&!champions[1-current]?.attack)break;current=1-current;continue;}
  const swings=hasKeyword(attacker,'windfury')?2:1;
  for(let swing=0;swing<swings&&attacks<RULES.maxAttacks;swing++){
   if(!sides[current].some(u=>u.uid===attacker!.uid&&u.health>0)||!sides[1-current].length)break;
   attacks++;
   const visible=sides[1-current].filter(u=>!hasKeyword(u,'stealth'));
   const eligible=visible.length?visible:sides[1-current];
   const guards=eligible.filter(u=>u.taunt);let target=pick(rng,guards.length?guards:eligible);
   if(attacker.drunk){
    const roll=random(rng),heroSide=roll<.02?current:roll<.03?1-current:-1,kind=heroSide===current?0:1;
    if(heroSide>=0&&!heroHitUsed[current][kind]){heroHitUsed[current][kind]=true;const amount=definition(attacker).tier;heroDamage[heroSide]+=amount;emit('keyword',`Részeg hőstámadás: ${heroSide===current?'saját':'ellenséges'} hős −${amount} HP`,attacker.uid,undefined,amount);next[current]=sides[current].indexOf(attacker)+1;continue;}
    target=pick(rng,[...sides[0],...sides[1]].filter(u=>u.uid!==attacker!.uid));
   }
   if(hasKeyword(attacker,'stealth')){consumeKeyword(attacker,'stealth');emit('keyword','A támadó felfedte magát.',attacker.uid);}
   if(!attacked.has(attacker.uid)){attacked.add(attacker.uid);if((!attacker.token||attacker.ability)&&definition(attacker).ability.trigger==='attack')trigger(current,attacker,sides[current].indexOf(attacker),target);}
   if(attacker.spellUpgrades?.rally)for(const ally of sides[current].filter(u=>u!==attacker)){ally.attack+=attacker.spellUpgrades.rally;emit('buff','Advanced Ballistics',attacker.uid,ally.uid);}
   emit('attack',`${definition(attacker).name} → ${definition(target).name}`,attacker.uid,target.uid);
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
 return {winner,survivors:winner===null?[]:sides[winner],events,startingSide,heroDamage};
}
