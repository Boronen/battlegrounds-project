import { CHARACTERS, HEROES, character, hero } from './catalog';
import { fight } from './combat';
import { pick, random, shuffle } from './random';
import { damageCap, RULES } from './rules';
import type { Action, Battle, Match, Player, Unit } from './types';
export class RuleError extends Error { constructor(public code:string,message:string){super(message);} }
function ensure(ok:unknown,code:string,message:string):asserts ok{if(!ok)throw new RuleError(code,message);}
const alive=(p:Player)=>p.hp>0;
export function makeUnit(m:Match,id:number,golden=false):Unit{const c=character(id);return{uid:`u${m.nextUid++}`,characterId:id,attack:c.attack*(golden?2:1),health:c.health*(golden?2:1),golden,shield:false,taunt:c.ability.effect==='taunt',copies:golden?3:1};}
export function createMatch(seed=20261103,mode:Match['mode']='manual',allBots=false):Match{
 const m:Match={id:`match-${seed}`,seed,rng:(seed>>>0)||1,nextUid:1,version:0,phase:'hero',round:0,mode,players:[],pool:{},pairings:[],battles:[],log:[],pendingDamage:{},roundLimit:RULES.maxRounds};
 for(const c of CHARACTERS)m.pool[c.id]=RULES.poolCopies[c.tier];
 for(let i=0;i<8;i++)m.players.push({id:`p${i}`,name:i===0?'Te':['','A Hátsó Sor','Kávészünet','Ctrl + Alt','Krétapor','Késői Befutó','A Büfés','Utolsó Csengő'][i],bot:allBots||i>0,heroId:null,heroOffers:shuffle(m,HEROES).slice(0,2).map(h=>h.id),hp:RULES.startHealth,armor:0,tier:1,upgradeCost:RULES.upgradeCosts[1],gold:0,board:[],hand:[],shop:[],frozen:false,ready:false,powerUsed:false,discover:[],rewards:[],opponents:[],place:null,lastBoard:[]});
 for(const p of m.players.filter(p=>p.bot))assignHero(p,p.heroOffers[0]);
 if(allBots)beginRecruit(m);return m;
}
function assignHero(p:Player,id:string){p.heroId=id;p.armor=hero(id)!.armor;}
function release(m:Match,u:Unit|null){if(u&&!u.token)m.pool[u.characterId]+=u.copies;}
function draw(m:Match,tier:number,exact=false,exclude:number[]=[]):Unit|null{
 const choices=CHARACTERS.filter(c=>(exact?c.tier===tier:c.tier<=tier)&&m.pool[c.id]>0&&!exclude.includes(c.id));
 const total=choices.reduce((sum,c)=>sum+m.pool[c.id],0);if(!total)return null;
 let ticket=random(m)*total;const c=choices.find(c=>(ticket-=m.pool[c.id])<0)||choices[choices.length-1];m.pool[c.id]--;return makeUnit(m,c.id);
}
export function fillShop(m:Match,p:Player,keep=false){if(!keep){p.shop.forEach(u=>release(m,u));p.shop=[];}while(p.shop.length<RULES.shopSizes[p.tier])p.shop.push(null);p.shop=p.shop.map(u=>u||draw(m,p.tier));}
function discover(m:Match,p:Player){if(p.discover.length||!p.rewards.length)return;const tier=p.rewards.shift()!;for(let i=0;i<3;i++){const u=draw(m,tier,true,p.discover.map(u=>u.characterId));if(u)p.discover.push(u);}}
function merge(m:Match,p:Player){
 for(const c of CHARACTERS){const units=[...p.hand,...p.board].filter(u=>!u.golden&&u.characterId===c.id);if(units.length<3)continue;
  const group=units.slice(0,3),ids=new Set(group.map(u=>u.uid));p.hand=p.hand.filter(u=>!ids.has(u.uid));p.board=p.board.filter(u=>!ids.has(u.uid));
  const gold=makeUnit(m,c.id,true);gold.attack+=group.reduce((s,u)=>s+u.attack-c.attack,0);gold.health+=group.reduce((s,u)=>s+u.health-c.health,0);gold.shield=group.some(u=>u.shield);gold.rewardTier=1;p.hand.push(gold);m.log.push(`${p.name}: tripla – ${c.name}.`);merge(m,p);return;
 }
}
function beginRecruit(m:Match){
 m.round++;m.phase='recruit';m.battles=[];m.pendingDamage={};
 for(const p of m.players.filter(alive)){p.gold=Math.min(10,m.round+2);p.ready=false;p.powerUsed=false;p.upgradeCost=Math.max(0,p.upgradeCost-(m.round>1?1:0));for(const u of p.board)u.shield=false;fillShop(m,p,p.frozen);p.frozen=false;}
 m.pairings=pairPlayers(m);m.log.push(`${m.round}. kör: vásárlás.`);
}
function pairPlayers(m:Match):[string,string][]{
 const living=shuffle(m,m.players.filter(alive));let ghost:Player|undefined;
 if(living.length%2){const bottom=[...living].sort((a,b)=>(a.hp+a.armor)-(b.hp+b.armor)).slice(0,3);ghost=pick(m,bottom);living.splice(living.indexOf(ghost),1);}
 function pair(rest:Player[],avoid:boolean):[string,string][]|null{if(!rest.length)return[];const [a,...others]=rest;for(const b of others){if(avoid&&(a.opponents.slice(-2).includes(b.id)||b.opponents.slice(-2).includes(a.id)))continue;const tail=pair(others.filter(p=>p!==b),avoid);if(tail)return[[a.id,b.id],...tail];}return null;}
 const pairs=pair(living,true)||pair(living,false)||[];
 if(ghost){const dead=m.players.filter(p=>!alive(p)).sort((a,b)=>(a.place||8)-(b.place||8));if(dead[0])pairs.push([ghost.id,dead[0].id]);}
 return pairs;
}
function perform(m:Match,p:Player,a:Action){
 if(a.type==='chooseHero'){ensure(m.phase==='hero'&&!p.heroId,'PHASE','Most nem választhatsz hőst.');ensure(p.heroOffers.includes(a.heroId),'HERO','Ez a hős nincs az ajánlatban.');assignHero(p,a.heroId);if(m.players.every(p=>p.heroId))beginRecruit(m);return;}
 ensure(m.phase==='recruit'&&alive(p)&&!p.ready,'PHASE','Ez a művelet most nem elérhető.');
 if(a.type!=='discover'&&a.type!=='ready')ensure(!p.discover.length,'DISCOVER','Előbb válassz jutalmat.');
 switch(a.type){
  case 'buy':{const index=p.shop.findIndex(u=>u?.uid===a.uid);ensure(index>=0,'UNIT','Nincs ilyen bolti egység.');ensure(p.gold>=3,'GOLD','Nincs elég aranyad.');ensure(p.hand.length<RULES.handSize,'HAND','Megtelt a kezed.');p.gold-=3;p.hand.push(p.shop[index]!);p.shop[index]=null;merge(m,p);break;}
  case 'sell':{const i=p.board.findIndex(u=>u.uid===a.uid);ensure(i>=0,'UNIT','Csak táblán lévő egység adható el.');release(m,p.board[i]);p.board.splice(i,1);p.gold=Math.min(10,p.gold+1);break;}
  case 'play':{const i=p.hand.findIndex(u=>u.uid===a.uid);ensure(i>=0,'UNIT','Nincs ilyen egység a kezedben.');ensure(p.board.length<7,'BOARD','Legfeljebb 7 egység lehet a táblán.');const u=p.hand[i],c=character(u.characterId),ab=c.ability;const target=p.board.find(x=>x.uid===a.targetUid);if(ab.trigger==='play'&&ab.target==='other'&&p.board.length)ensure(target,'TARGET','Válassz egy saját egységet a képességhez.');const pos=a.position??p.board.length;ensure(Number.isInteger(pos)&&pos>=0&&pos<=p.board.length,'POSITION','Érvénytelen hely.');p.hand.splice(i,1);p.board.splice(pos,0,u);
   if(ab.trigger==='play'){let targets:Unit[]=ab.target==='self'?[u]:ab.target==='other'?(target?[target]:[]):ab.target==='allies'?p.board.filter(x=>x!==u):[p.board[pos-1],p.board[pos+1]].filter(Boolean);for(const t of targets){t.attack+=(ab.attack||0)*(u.golden?2:1);t.health+=(ab.health||0)*(u.golden?2:1);}}
   if(u.rewardTier){p.rewards.push(Math.min(6,p.tier+1));delete u.rewardTier;discover(m,p);}break;}
  case 'reorder':{ensure(a.uids.length===p.board.length&&new Set(a.uids).size===p.board.length&&a.uids.every(id=>p.board.some(u=>u.uid===id)),'ORDER','Az átrendezés minden egységet pontosan egyszer tartalmazzon.');p.board=a.uids.map(id=>p.board.find(u=>u.uid===id)!);break;}
  case 'refresh':ensure(p.gold>=1,'GOLD','A frissítéshez 1 arany kell.');p.gold--;fillShop(m,p);break;
  case 'freeze':p.frozen=!p.frozen;break;
  case 'upgrade':ensure(p.tier<6,'TIER','A bolt már 6. szintű.');ensure(p.gold>=p.upgradeCost,'GOLD','Nincs elég arany a fejlesztéshez.');p.gold-=p.upgradeCost;p.tier++;p.upgradeCost=RULES.upgradeCosts[p.tier];break;
  case 'discover':{const u=p.discover.find(u=>u.uid===a.uid);ensure(u,'DISCOVER','Nincs ilyen jutalom.');ensure(p.hand.length<10,'HAND','A jutalomhoz hely kell a kézben.');for(const other of p.discover)if(other!==u)release(m,other);p.hand.push(u);p.discover=[];merge(m,p);discover(m,p);break;}
  case 'power':{const h=hero(p.heroId)!;ensure(!p.powerUsed,'POWER','Ebben a körben már használtad.');ensure(p.gold>=h.cost,'GOLD','Nincs elég arany a hősképességhez.');const target=p.board.find(u=>u.uid===a.targetUid);if(h.power==='buff'||h.power==='shield')ensure(target,'TARGET','Válassz saját egységet.');p.gold-=h.cost;p.powerUsed=true;if(h.power==='buff'){target!.attack++;target!.health++;}if(h.power==='shield')target!.shield=true;if(h.power==='gold')p.gold=Math.min(10,p.gold+1);if(h.power==='refresh')fillShop(m,p);break;}
  case 'ready':p.ready=true;break;
 }
}
/** Transaction boundary: rejected commands cannot partially mutate match or RNG. */
export function act(m:Match,playerId:string,a:Action){const draft=structuredClone(m);const p=draft.players.find(p=>p.id===playerId);ensure(p,'PLAYER','Ismeretlen játékos.');perform(draft,p,a);draft.version++;Object.assign(m,draft);}
export function botTurn(m:Match,id:string){
 const run=(a:Action)=>{try{act(m,id,a);return true;}catch{return false;}};
 const get=()=>m.players.find(p=>p.id===id)!;
 if(m.phase==='hero'){const p=get();if(!p.heroId)run({type:'chooseHero',heroId:p.heroOffers[0]});return;}
 if(m.phase!=='recruit'||!alive(get())||get().ready)return;
 for(let n=0;n<50;n++){
  const p=get();
  if(p.discover.length){if(p.hand.length>=10)break;run({type:'discover',uid:[...p.discover].sort((a,b)=>score(b)-score(a))[0].uid});continue;}
  if(p.hand.length&&p.board.length<7){run({type:'play',uid:p.hand[0].uid,targetUid:p.board[0]?.uid});continue;}
  if(p.hand.length&&p.board.length===7){const weakest=[...p.board].sort((a,b)=>score(a)-score(b))[0];if(score(p.hand[0])>score(weakest)){run({type:'sell',uid:weakest.uid});continue;}}
  if(!p.powerUsed&&hero(p.heroId)?.power==='gold'){run({type:'power'});continue;}
  if(p.tier<6&&m.round>=p.tier*2&&p.gold>=p.upgradeCost&&(p.board.length>=Math.min(7,m.round-1)||m.round>10)){run({type:'upgrade'});continue;}
  const offers=p.shop.filter((u):u is Unit=>!!u).sort((a,b)=>score(b)-score(a));
  const best=offers.find(u=>p.board.length<7||[...p.hand,...p.board].filter(x=>!x.golden&&x.characterId===u.characterId).length>=2||score(u)>Math.min(...p.board.map(score)));
  if(p.gold>=3&&best&&p.hand.length<10){run({type:'buy',uid:best.uid});continue;}
  if(!p.powerUsed&&p.board.length&&p.gold>=hero(p.heroId)!.cost){run({type:'power',targetUid:p.board[0].uid});continue;}
  if(p.gold>=1){run({type:'refresh'});continue;}break;
 }
 const p=get();run({type:'reorder',uids:[...p.board].sort((a,b)=>score(b)-score(a)).map(u=>u.uid)});run({type:'ready'});
}
const score=(u:Unit)=>u.attack+u.health+(u.shield?6:0)+character(u.characterId).tier*2;
export function advance(m:Match){
 if(m.phase==='finished')return;
 if(m.phase==='hero'){for(const p of [...m.players])if(!p.heroId)act(m,p.id,{type:'chooseHero',heroId:p.heroOffers[0]});return;}
 if(m.phase==='recruit'){
  for(const p of [...m.players])if(p.bot)botTurn(m,p.id);
  for(const p of m.players){if(!alive(p))continue;p.lastBoard=structuredClone(p.board);p.ready=true;p.opponents.push(m.pairings.flat().includes(p.id)?m.pairings.find(pair=>pair.includes(p.id))!.find(id=>id!==p.id)!:'');}
  m.phase='combat';m.battles=[];m.pendingDamage={};const living=m.players.filter(alive).length;
  for(const [leftId,rightId] of m.pairings){const l=m.players.find(p=>p.id===leftId)!,r=m.players.find(p=>p.id===rightId)!;const result=fight(l.board,alive(r)?r.board:r.lastBoard,Math.floor(random(m)*4294967296));const winner=result.winner===0?l:result.winner===1?r:null;const loser=winner===l?r:l;const raw=winner?winner.tier+result.survivors.reduce((n,u)=>n+(u.token?1:character(u.characterId).tier),0):0;const damage=Math.min(raw,damageCap(m.round,living));if(winner&&alive(loser))m.pendingDamage[loser.id]=damage;const battle:Battle={leftId,rightId,ghost:!alive(r),events:result.events,winner:winner?.id||null,damage};m.battles.push(battle);}
 }else{
  const before=m.players.filter(alive).map(p=>({id:p.id,total:p.hp+p.armor}));
  for(const p of m.players){const dmg=m.pendingDamage[p.id]||0;const absorbed=Math.min(p.armor,dmg);p.armor-=absorbed;p.hp-=dmg-absorbed;}
  const eliminated=before.filter(b=>!alive(m.players.find(p=>p.id===b.id)!)).sort((a,b)=>a.total-b.total||b.id.localeCompare(a.id));
  let place=before.length;for(const {id} of eliminated){const p=m.players.find(p=>p.id===id)!;p.place=place--;p.shop.forEach(u=>release(m,u));p.shop=[];[...p.board,...p.hand,...p.discover].forEach(u=>release(m,u));p.board=[];p.hand=[];p.discover=[];m.log.push(`${p.name}: ${p.place}. hely.`);}
  const remaining=m.players.filter(alive);
  if(remaining.length<=1||m.round>=m.roundLimit){remaining.sort((a,b)=>(b.hp+b.armor)-(a.hp+a.armor)||a.id.localeCompare(b.id)).forEach((p,i)=>p.place=i+1);m.phase='finished';m.log.push('A mérkőzés véget ért.');}
  else beginRecruit(m);
 }
 m.version++;
}
export function autoplay(m:Match){if(m.phase==='recruit')for(const p of [...m.players])botTurn(m,p.id);advance(m);}
export function assertInvariants(m:Match){
 const ids=new Set<string>();for(const p of m.players){if(p.board.length>7||p.hand.length>10||p.gold<0||p.gold>10)throw new Error('Player limits');for(const u of [...p.board,...p.hand,...p.discover,...p.shop.filter((x):x is Unit=>!!x)]){if(ids.has(u.uid))throw new Error('Duplicate unit');ids.add(u.uid);}}
 for(const c of CHARACTERS){const held=m.players.flatMap(p=>[...p.board,...p.hand,...p.discover,...p.shop.filter((x):x is Unit=>!!x)]).filter(u=>u.characterId===c.id&&!u.token).reduce((n,u)=>n+u.copies,0);if(m.pool[c.id]<0||m.pool[c.id]+held!==RULES.poolCopies[c.tier])throw new Error(`Pool conservation ${c.id}: ${m.pool[c.id]} + ${held}`);}
}
