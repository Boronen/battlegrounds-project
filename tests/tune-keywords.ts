import {writeFile} from 'node:fs/promises';
import {CHARACTERS,character} from '../shared/catalog';
import {KEYWORD_BASELINES,KEYWORD_DESIGNS} from '../shared/keyword-designs';
import {fight} from '../shared/combat';
import {pick,random} from '../shared/random';
import type {Character,Unit} from '../shared/types';

// Development experiment only. Suggestions are reviewed and applied explicitly.
const baseline=(id:number)=>KEYWORD_BASELINES.get(id)||character(id);
const scenarios=[{size:3,buff:0,golden:false,shield:false},{size:7,buff:0,golden:false,shield:false},{size:7,buff:8,golden:false,shield:false},{size:7,buff:0,golden:true,shield:false},{size:7,buff:0,golden:false,shield:true}];
function build(cards:Character[],prefix:string,s:typeof scenarios[number]):Unit[]{
 const units=cards.map((c,i)=>({uid:prefix+i,characterId:c.id,attack:c.attack*(s.golden?2:1)+s.buff,health:c.health*(s.golden?2:1)+s.buff,golden:s.golden,shield:s.shield,taunt:c.ability.effect==='taunt',copies:1,keywords:[...(c.keywords||[])]}));
 cards.forEach((c,i)=>{const a=c.ability,m=s.golden?2:1;if(a.trigger==='play'&&a.effect==='buff'){
  const target=a.target==='self'?units[i]:units.find((_,j)=>j!==i);if(target){target.attack+=(a.attack||0)*m;target.health+=(a.health||0)*m;}
 }});return units;
}
const score=(winner:number|null)=>winner===0?1:winner===null?.5:0;
const suggestions=[];
for(const design of KEYWORD_DESIGNS){
 const c=CHARACTERS.find(c=>c.name===design.name)!;
 const peers=CHARACTERS.filter(x=>x.tier===c.tier&&x.id!==c.id).map(x=>baseline(x.id));
 const fixtures=scenarios.flatMap(s=>Array.from({length:48},(_,i)=>{
  const seed=i+1,rng={rng:Math.imul(seed+c.id*1000,2654435761)>>>0};
  const allies=Array.from({length:s.size},()=>pick(rng,peers)),foes=Array.from({length:s.size},()=>pick(rng,peers));
  const pos=seed%s.size;allies[pos]=baseline(c.id);
  const left=build(allies,'l',s),right=build(foes,'r',s);
  const combatSeed=Math.floor(random(rng)*4294967296)||1;
  return {s,seed:combatSeed,pos,left,right,old:score(fight(left,right,combatSeed,{recordEvents:false,catalog:baseline}).winner)};
 }));
 const initialAttack=c.attack,initialHealth=c.health;
 let best={attack:c.attack,health:c.health,loss:Infinity,delta:0};
 for(let attack=Math.max(1,initialAttack-1);attack<=initialAttack+6;attack++)for(let health=initialHealth;health<=initialHealth+8;health++){
  c.attack=attack;c.health=health;let change=0;
  for(const f of fixtures){const left=structuredClone(f.left);left[f.pos]=build([c],'candidate',f.s)[0];left[f.pos].uid='l'+f.pos;
   change+=score(fight(left,f.right,f.seed,{recordEvents:false,catalog:id=>id===c.id?c:baseline(id)}).winner)-f.old;
  }
  const delta=change/fixtures.length;
  // Aim at a 50% same-tier team score, not parity with an overpowered old effect.
  const teamScore=(change+fixtures.reduce((n,f)=>n+f.old,0))/fixtures.length;
  const loss=Math.abs(teamScore-.5)+.0004*(attack+health);
  if(loss<best.loss)best={attack,health,loss,delta};
 }
 c.attack=initialAttack;c.health=initialHealth;
 suggestions.push({name:c.name,keyword:design.keyword,tier:c.tier,original:`${initialAttack}/${initialHealth}`,...best});
 console.log(`${c.name}: ${best.attack}/${best.health}, training delta ${(best.delta*100).toFixed(1)}pp`);
}
await writeFile('test-results/keyword-tuning.json',JSON.stringify(suggestions,null,2));
