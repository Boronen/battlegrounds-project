import { createMatch, autoplay, assertInvariants } from '../shared/engine';
import { digest } from '../server/session';
const results=[];const start=Date.now();
for(let seed=1;seed<=100;seed++){
 const m=createMatch(seed,'manual',true);let steps=0;assertInvariants(m);
 while(m.phase!=='finished'&&steps++<125){autoplay(m);assertInvariants(m);}
 if(m.phase!=='finished')throw new Error(`Stuck seed ${seed}`);
 if(new Set(m.players.map(p=>p.place)).size!==8||!m.players.some(p=>p.place===1))throw new Error(`Placements seed ${seed}`);
 const again=createMatch(seed,'manual',true);while(again.phase!=='finished')autoplay(again);
 if(digest(m)!==digest(again))throw new Error(`Nondeterministic seed ${seed}`);
 results.push({seed,rounds:m.round});
}
console.log(JSON.stringify({matches:100,repeatedMatches:100,elapsedMs:Date.now()-start,minRounds:Math.min(...results.map(r=>r.rounds)),maxRounds:Math.max(...results.map(r=>r.rounds)),allFinished:true,deterministic:true,poolConserved:true},null,2));
