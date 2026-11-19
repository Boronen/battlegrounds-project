import assert from 'node:assert/strict';
import {CHARACTERS} from '../shared/catalog';
import {assertInvariants,autoplay,createMatch} from '../shared/engine';
import {tribeFor} from '../shared/tribes';
import {RULES} from '../shared/rules';

function percentile(values:number[], fraction:number) {
 const ordered=[...values].sort((a,b)=>a-b);
 return ordered[Math.ceil(fraction*ordered.length)-1];
}

const rounds:number[]=[], peakAttack:number[]=[], peakHealth:number[]=[], swings:number[]=[];
const lateTeamAttack:number[]=[], lateTeamHealth:number[]=[];
const rosterIds=new Set<number>(),playedIds=new Set<number>();
let battles=0, draws=0, limitHits=0;
for(let seed=1;seed<=40;seed++){
 const match=createMatch(seed,'manual',true);
 for(const id of match.activeCardIds)rosterIds.add(id);
 let attack=0, health=0;
 while(match.phase!=='finished'){
  autoplay(match);
  assertInvariants(match);
  if(match.phase!=='combat')continue;
  for(const player of match.players.filter(p=>p.hp>0)){
   for(const unit of player.board){
    if(unit.characterId>0)playedIds.add(unit.characterId);
    attack=Math.max(attack,unit.attack);
    health=Math.max(health,unit.health);
   }
   if(match.round===12){
    lateTeamAttack.push(player.board.reduce((total,u)=>total+u.attack,0));
    lateTeamHealth.push(player.board.reduce((total,u)=>total+u.health,0));
   }
  }
  for(const battle of match.battles){
   if(!battle.events[0]?.left.length||!battle.events[0]?.right.length)continue;
   const count=battle.events.filter(e=>e.type==='attack').length;
   swings.push(count);
   battles++;
   if(!battle.winner)draws++;
   if(count>=RULES.maxAttacks)limitHits++;
  }
 }
 assert.equal(new Set(match.players.map(p=>p.place)).size,8);
 rounds.push(match.round);
 peakAttack.push(attack);
 peakHealth.push(health);
}
function counts(group:(card:typeof CHARACTERS[number])=>string){
 const groups:Record<string,number>={};
 for(const card of CHARACTERS){const key=group(card);groups[key]=(groups[key]??0)+1;}
 return groups;
}
console.log(JSON.stringify({
 rules:RULES.id,cards:CHARACTERS.length,triggers:counts(c=>c.ability.trigger),
 distinctCardsOfferedInPools:rosterIds.size,distinctCardsOnSurvivingBoards:playedIds.size,
 tiers:counts(c=>String(c.tier)),types:counts(tribeFor),
 matches:rounds.length,roundRange:[Math.min(...rounds),Math.max(...rounds)],medianRounds:percentile(rounds,.5),
 medianPeakAttack:percentile(peakAttack,.5),medianPeakHealth:percentile(peakHealth,.5),
 maxAttack:Math.max(...peakAttack),maxHealth:Math.max(...peakHealth),
 matchesWithTripleDigitStat:rounds.filter((_,i)=>peakAttack[i]>=100||peakHealth[i]>=100).length,
 round12MedianTeamAttack:percentile(lateTeamAttack,.5),round12MedianTeamHealth:percentile(lateTeamHealth,.5),
 battles,drawPercent:Math.round(1000*draws/battles)/10,p95Swings:percentile(swings,.95),limitHits,
},null,2));
