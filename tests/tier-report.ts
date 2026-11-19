import {writeFile} from 'node:fs/promises';
import {createMatch,autoplay,assertInvariants} from '../shared/engine';
import {HEROES,unitDefinition} from '../shared/catalog';
const results:Record<string,number[]>={};
const comps:Record<string,number[]>={};
for(let seed=1;seed<=140;seed++){
 const m=createMatch(seed,'manual',true);
 while(m.phase!=='finished'){autoplay(m);assertInvariants(m);}
 for(const p of m.players){
  const name=HEROES.find(h=>h.id===p.heroId)!.name;
  (results[name]??=[]).push(p.place!);
  const counts:Record<string,number>={};
  for(const u of p.lastBoard){const t=unitDefinition(u).ability.trigger;counts[t]=(counts[t]??0)+1;}
  const main=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  if(main)(comps[main[0]]??=[]).push(p.place!);
 }
}
const rank=(data:Record<string,number[]>)=>Object.entries(data).map(([name,places])=>({name,n:places.length,average:places.reduce((a,b)=>a+b,0)/places.length,top4:places.filter(p=>p<=4).length/places.length})).sort((a,b)=>a.average-b.average);
const report={matches:140,heroes:rank(results),compositions:rank(comps),limitation:'Autoplay bot performance; composition grouped by dominant final-board trigger, not optimized builds.'};
await writeFile('docs/tier-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
