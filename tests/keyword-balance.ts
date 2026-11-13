import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CHARACTERS,character} from '../shared/catalog';
import {KEYWORD_BASELINES,KEYWORD_DESIGNS} from '../shared/keyword-designs';
import {fight} from '../shared/combat';
import {pick,random} from '../shared/random';
import type {Character,Unit} from '../shared/types';

const samples=Number(process.env.BALANCE_SAMPLES||1000);
const seedOffset=Number(process.env.BALANCE_SEED_OFFSET||50000);
const baseline=(id:number)=>KEYWORD_BASELINES.get(id)||character(id);
const scenarios=[
 {name:'duel',size:1,buff:0,golden:false,shield:false},
 {name:'three',size:3,buff:0,golden:false,shield:false},
 {name:'seven',size:7,buff:0,golden:false,shield:false},
 {name:'buffed',size:7,buff:8,golden:false,shield:false},
 {name:'golden',size:7,buff:0,golden:true,shield:false},
 {name:'shielded',size:7,buff:0,golden:false,shield:true},
];
function build(cards:Character[],prefix:string,s:typeof scenarios[number]):Unit[]{
 const units=cards.map((c,i)=>({uid:prefix+i,characterId:c.id,attack:c.attack*(s.golden?2:1)+s.buff,health:c.health*(s.golden?2:1)+s.buff,golden:s.golden,shield:s.shield,taunt:c.ability.effect==='taunt',copies:s.golden?3:1,keywords:[...(c.keywords||[])]}));
 // Include recruitment value: permanent play buffs have already happened.
 cards.forEach((c,i)=>{const a=c.ability,m=s.golden?2:1;if(a.trigger==='play'&&a.effect==='buff'){
  const target=a.target==='self'?units[i]:units.find((_,j)=>j!==i);
  if(target){target.attack+=(a.attack||0)*m;target.health+=(a.health||0)*m;}
 }});
 return units;
}
const rows=[];
for(const design of KEYWORD_DESIGNS){
 const c=CHARACTERS.find(c=>c.name===design.name)!;
 const results=[];
 for(const cohort of ['baseline','updated'] as const)for(const scenario of scenarios){
  const peer=(id:number)=>cohort==='baseline'?baseline(id):character(id);
  const opponents=CHARACTERS.filter(x=>x.tier===c.tier&&x.id!==c.id).map(x=>peer(x.id));
  let oldScore=0,newScore=0,changed=0,leftStarts=0;
  for(let sample=1;sample<=samples;sample++){
   const seed=sample+seedOffset;
   const rng={rng:Math.imul(seed+c.id*1000,2654435761)>>>0};
   const allies=Array.from({length:scenario.size},()=>pick(rng,opponents));
   const foes=Array.from({length:scenario.size},()=>pick(rng,opponents));
   const position=seed%scenario.size;
   const previous=[...allies];previous[position]=baseline(c.id);
   const proposed=[...allies];proposed[position]=c;
   const right=build(foes,'r',scenario);
   const combatSeed=Math.floor(random(rng)*4294967296)||1;
   const old=fight(build(previous,'l',scenario),right,combatSeed,{recordEvents:false,catalog:id=>id===c.id?baseline(id):peer(id)});
   // Only this card changes within a pair; test both old and updated peer pools.
   const current=fight(build(proposed,'l',scenario),right,combatSeed,{recordEvents:false,catalog:id=>id===c.id?c:peer(id)});
   if(current.startingSide===0)leftStarts++;
   const score=(winner:number|null)=>winner===0?1:winner===null?.5:0;
   oldScore+=score(old.winner);newScore+=score(current.winner);if(old.winner!==current.winner)changed++;
  }
  assert.ok(leftStarts/samples>.35&&leftStarts/samples<.65,'Balanced starting-side sampling');
  results.push({cohort,scenario:scenario.name,samples,leftStarts,oldScore:oldScore/samples,newScore:newScore/samples,delta:(newScore-oldScore)/samples,changed});
 }
 const team=results.filter(r=>r.scenario!=='duel');
 const delta=team.reduce((n,r)=>n+r.delta,0)/team.length;
 const teamScore=team.reduce((n,r)=>n+r.newScore,0)/team.length;
 const cohortScores=['baseline','updated'].map(cohort=>({cohort,score:team.filter(r=>r.cohort===cohort).reduce((n,r)=>n+r.newScore,0)/5}));
 rows.push({name:c.name,tier:c.tier,keyword:design.keyword,stats:`${c.attack}/${c.health}`,teamScore,teamDelta:delta,cohortScores,review:cohortScores.some(r=>r.score<.4||r.score>.6),results});
}
const report={samplesPerScenario:samples,seedOffset,cards:rows.length,combats:rows.length*scenarios.length*samples*2*2,method:'Paired same-tier boards and combat seeds; score = win + half draw. Both baseline and updated peer pools are tested. All play buffs applied. Six scenarios; one changed card per board. Aim for a 50% peer score rather than preserving unusually strong old effects. This is a combat diagnostic, not match win rate.',reviewScoreBand:[.4,.6],rows};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/keyword-balance.json',JSON.stringify(report,null,2));
const pct=(n:number)=>(n*100).toFixed(1);
await writeFile('test-results/keyword-balance.md',[
 '# Keyword balance experiment','',report.method,'',
 report.combats+' combats; '+samples+' seeds per card/scenario/cohort; seed offset '+seedOffset+'.',
 'Scores outside 40-60% in either peer pool are flagged. This is a broad diagnostic band, not a confidence interval.','',
 '| Card | Tier | Keyword | Stats | Baseline peers (%) | Updated peers (%) | Change vs old (pp) | Review |',
 '|---|---:|---|---|---:|---:|---:|---|',
 ...rows.map(r=>'| '+[r.name,r.tier,r.keyword,r.stats,...r.cohortScores.map(s=>pct(s.score)),pct(r.teamDelta),r.review?'YES':''].join(' | ')+' |'),'',
 'Development used tuning seeds 1-48 and exploratory checks. Raw-seed starting-side bias was corrected before final validation; mixed combat seeds now have explicit starting-side sampling checks. The final seed range is independent of tuning. The midpoint target and 40-60% band were chosen before final validation.',
 'Duels are diagnostic only: specialists and support cards are not expected to have equal solo strength. Team scores average three-unit, seven-unit, buffed, golden and shielded scenarios. Per-scenario and duel results are in the JSON report.',
 'These experiments do not establish competitive balance, model player choices, or exhaust every synergy. Full-match soak tests verify termination, determinism and pool conservation, not equal card strength.',''
].join('\n'));
assert.ok(rows.every(r=>r.results.every(s=>Number.isFinite(s.newScore))));
console.log(JSON.stringify({combats:report.combats,review:rows.filter(r=>r.review).map(r=>({name:r.name,score:pct(r.teamScore)})),rows:rows.map(r=>({name:r.name,score:pct(r.teamScore),delta:pct(r.teamDelta),duel:pct(r.results[0].newScore)}))},null,2));

assert.equal(rows.filter(r=>r.review).length,0,'Keyword team score outside the declared 40-60% diagnostic band; inspect the generated report.');
