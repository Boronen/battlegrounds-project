import {powerState,currentPower,effectivePowerId,BORROWABLE_POWERS,minionPrice,enchantShop,newSpellShop,completeQuest,applyUpgrade} from './hero-powers';
import { selectMatchPool } from './match-pool';
import { CHARACTERS, HEROES, character, hero,unitDefinition } from './catalog';
import { fight } from './combat';
import {hasKeyword} from './keywords';
import { pick, random, shuffle } from './random';
import { damageCap, RULES } from './rules';
import type { Action, Battle, Match, Player, Unit } from './types';
export class RuleError extends Error { constructor(public code:string,message:string){super(message);} }
function ensure(ok:unknown,code:string,message:string):asserts ok{if(!ok)throw new RuleError(code,message);}
const alive=(p:Player)=>p.hp>0;
export function makeUnit(m:Match,id:number,golden=false):Unit{const c=character(id);return{uid:`u${m.nextUid++}`,characterId:id,attack:c.attack*(golden?2:1),health:c.health*(golden?2:1),golden,keywords:[...(c.keywords||[])],shield:false,taunt:c.ability.effect==='taunt',copies:golden?3:1};}
export function createMatch(seed=20261103,mode:Match['mode']='manual',allBots=false):Match{
 const m:Match={id:`match-${seed}`,seed,rng:(seed>>>0)||1,nextUid:1,version:0,phase:'hero',round:0,mode,players:[],pool:{},activeTribes:[],activeCardIds:[],pairings:[],battles:[],log:[],pendingDamage:{},roundLimit:RULES.maxRounds};
 Object.assign(m,selectMatchPool(m));
 for(const c of CHARACTERS)m.pool[c.id]=m.activeCardIds.includes(c.id)?RULES.poolCopies[c.tier]:0;
 for(let i=0;i<8;i++)m.players.push({id:`p${i}`,name:i===0?'Te':['','A Hátsó Sor','Kávészünet','Ctrl + Alt','Krétapor','Késői Befutó','A Büfés','Utolsó Csengő'][i],bot:allBots||i>0,heroId:null,heroOffers:shuffle(m,HEROES).slice(0,RULES.heroChoices).map(h=>h.id),heroSeen:[],heroRerolls:RULES.heroRerolls,hp:RULES.startHealth,armor:0,tier:1,upgradeCost:RULES.upgradeCosts[1],gold:0,board:[],hand:[],shop:[],frozen:false,ready:false,powerUsed:false,discover:[],rewards:[],opponents:[],place:null,lastBoard:[]});
 for(const p of m.players)p.heroSeen=[...p.heroOffers];
 for(const p of m.players.filter(p=>p.bot))assignHero(p,p.heroOffers[0]);
 if(allBots)beginRecruit(m);return m;
}
function assignHero(p:Player,id:string){p.heroId=id;p.armor=hero(id)!.armor;powerState(p);}
function release(m:Match,u:Unit|null){if(u&&!u.token)m.pool[u.characterId]+=u.copies;}
function draw(m:Match,tier:number,exact=false,exclude:number[]=[]):Unit|null{
 const choices=CHARACTERS.filter(c=>(exact?c.tier===tier:c.tier<=tier)&&m.pool[c.id]>0&&!exclude.includes(c.id));
 const total=choices.reduce((sum,c)=>sum+m.pool[c.id],0);if(!total)return null;
 let ticket=random(m)*total;const c=choices.find(c=>(ticket-=m.pool[c.id])<0)||choices[choices.length-1];m.pool[c.id]--;return makeUnit(m,c.id);
}
export function fillShop(m:Match,p:Player,keep=false){if(!keep){p.shop.forEach(u=>release(m,u));p.shop=[];}while(p.shop.length<RULES.shopSizes[p.tier])p.shop.push(null);const fresh:Unit[]=[];p.shop=p.shop.map(u=>{if(u)return u;const next=draw(m,p.tier);if(next)fresh.push(next);return next;});if(p.heroId==='original-21'){for(const u of p.shop)if(u)u.drunk=false;enchantShop(m,p,p.shop.filter((u):u is Unit=>!!u));}else enchantShop(m,p,fresh);if(!keep||!powerState(p).spellShop.length)newSpellShop(m,p);}
function discover(m:Match,p:Player){if(p.discover.length||!p.rewards.length)return;const tier=p.rewards.shift()!;powerState(p).discoverKind='golden';for(let i=0;i<3;i++){const u=draw(m,tier,true,p.discover.map(u=>u.characterId));if(u)p.discover.push(u);}}
function merge(m:Match,p:Player){
 for(const c of CHARACTERS){const units=[...p.hand,...p.board].filter(u=>!u.golden&&(!u.token||u.generated)&&!u.name&&u.characterId===c.id);if(units.length<3)continue;
  const group=units.slice(0,3),ids=new Set(group.map(u=>u.uid));p.hand=p.hand.filter(u=>!ids.has(u.uid));p.board=p.board.filter(u=>!ids.has(u.uid));
  const gold=makeUnit(m,c.id,true);gold.copies=group.reduce((n,u)=>n+(u.token?0:u.copies),0);gold.token=gold.copies===0;gold.generated=group.some(u=>u.generated);if(gold.token)gold.ability=structuredClone(c.ability);gold.keywords=[...new Set(group.flatMap(u=>u.keywords||[]).concat(c.keywords||[]))];gold.attack+=group.reduce((s,u)=>s+u.attack-c.attack,0);gold.health+=group.reduce((s,u)=>s+u.health-c.health,0);gold.drunk=group.some(u=>u.drunk);gold.shield=group.some(u=>u.shield);gold.rewardTier=1;p.hand.push(gold);m.log.push(`${p.name}: tripla – ${c.name}.`);merge(m,p);return;
 }
}
function beginRecruit(m:Match){
 m.round++;m.phase='recruit';m.battles=[];m.pendingDamage={};
 for(const p of m.players.filter(alive)){const hs=powerState(p);hs.guessOptions=[];hs.guessResult=undefined;if(m.heroSecrets)delete m.heroSecrets[p.id];if(p.heroId==='original-17'){hs.borrowedId=undefined;hs.powerOffers=shuffle(m,BORROWABLE_POWERS.filter(id=>id!=='original-13'||m.round>=3)).slice(0,2);hs.cooldownUntil=0;hs.combination=[];}if(m.round===1&&p.heroId==='original-22'){hs.maxHp=30+(m.players.some(q=>q.heroId==='original-25')?20:30);p.hp=hs.maxHp;}hs.carriedGold=p.heroId==='original-18'?Math.min(p.gold,[0,1,2,4,5,7,9][p.tier]):0;p.gold=Math.min(10,m.round+2)+(hs.maxGold-10)+hs.deferredGold+hs.carriedGold;hs.deferredGold=0;hs.deferSales=false;hs.freeSpellUsed=false;if(m.round===1){if(p.heroId==='original-10')hs.quest=pick(m,['deaths','battlecries'] as const);if(p.heroId==='original-4'||p.heroId==='original-12'){const u=makeUnit(m,p.heroId==='original-4'?-1:-2);u.token=true;u.generated=true;u.copies=0;p.hand.push(u);}}p.ready=false;p.powerUsed=false;p.upgradeCost=Math.max(0,p.upgradeCost-(m.round>1?1:0));for(const u of p.board)u.shield=false;fillShop(m,p,p.frozen);p.frozen=false;}
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
 if(a.type==='rerollHeroes'){
  ensure(m.phase==='hero'&&!p.heroId,'PHASE','Most nem frissítheted a hősöket.');
  ensure(p.heroRerolls>0,'HERO_REROLLS','Elfogytak a hősfrissítések.');
  const unseen=HEROES.filter(h=>!p.heroSeen.includes(h.id));
  ensure(unseen.length>=RULES.heroChoices,'HERO_POOL','Nincs elég új hős.');
  p.heroOffers=shuffle(m,unseen).slice(0,RULES.heroChoices).map(h=>h.id);
  p.heroSeen.push(...p.heroOffers);p.heroRerolls--;return;
 }
 if(a.type==='chooseHero'){ensure(m.phase==='hero'&&!p.heroId,'PHASE','Most nem választhatsz hőst.');ensure(p.heroOffers.includes(a.heroId),'HERO','Ez a hős nincs az ajánlatban.');assignHero(p,a.heroId);if(m.players.every(p=>p.heroId))beginRecruit(m);return;}
 ensure(m.phase==='recruit'&&alive(p)&&!p.ready,'PHASE','Ez a művelet most nem elérhető.');
 if(a.type!=='discover'&&a.type!=='ready')ensure(!p.discover.length,'DISCOVER','Előbb válassz jutalmat.');
 if(a.type==='power'&&(a.mode==='buySpell'||a.mode==='castSpell')){const hs=powerState(p);if(a.mode==='buySpell'){const spell=hs.spellShop.find(s=>s.uid===a.spellUid);ensure(spell,'SPELL','Nincs ilyen spell.');ensure(p.hand.length+hs.spellHand.length<10,'HAND','Megtelt a kezed.');const free=p.board.some(u=>u.characterId===-2&&u.spellUpgrades?.free)&&!hs.freeSpellUsed;const cost=free?0:spell.cost;ensure(p.gold>=cost,'GOLD','Nincs elég arany.');p.gold-=cost;if(free)hs.freeSpellUsed=true;hs.spellHand.push(spell);hs.spellShop=hs.spellShop.filter(s=>s!==spell);}else{const spell=hs.spellHand.find(s=>s.uid===a.spellUid);ensure(spell,'SPELL','Nincs ilyen spell a kézben.');const upgrade=!['buff','shield'].includes(spell.kind);const targets=upgrade?p.board.filter(u=>u.characterId===-2):p.board.filter(u=>u.uid===a.targetUid);ensure(targets.length,'TARGET',upgrade?'Előbb játssz ki egy Battlecruisert.':'Válassz saját miniont.');for(let cast=0;cast<(hs.completed&&hs.quest==='deaths'?2:1);cast++)for(const target of targets){if(spell.kind==='buff'){target.attack+=spell.tier;target.health+=spell.tier;}else if(spell.kind==='shield')target.shield=true;else applyUpgrade(target,spell);}hs.spellHand=hs.spellHand.filter(s=>s!==spell);}return;}
 switch(a.type){
  case 'buy':{const index=p.shop.findIndex(u=>u?.uid===a.uid);ensure(index>=0,'UNIT','Nincs ilyen bolti egység.');ensure(p.gold>=minionPrice(p,p.shop[index]!),'GOLD','Nincs elég aranyad.');ensure(p.hand.length+powerState(p).spellHand.length<RULES.handSize,'HAND','Megtelt a kezed.');p.gold-=minionPrice(p,p.shop[index]!);p.hand.push(p.shop[index]!);p.shop[index]=null;merge(m,p);break;}
  case 'sell':{const i=p.board.findIndex(u=>u.uid===a.uid);ensure(i>=0,'UNIT','Csak táblán lévő egység adható el.');release(m,p.board[i]);p.board.splice(i,1);if(powerState(p).deferSales)powerState(p).deferredGold+=2;else p.gold=Math.max(p.gold,Math.min(powerState(p).maxGold,p.gold+1));break;}
  case 'play':{const i=p.hand.findIndex(u=>u.uid===a.uid);ensure(i>=0,'UNIT','Nincs ilyen egység a kezedben.');ensure(p.board.length<7||([-4,-5,-6].includes(p.hand[i].characterId)&&p.board.some(u=>u.uid===a.targetUid)),'BOARD','Legfeljebb 7 egység lehet a táblán.');const u=p.hand[i],c=unitDefinition(u),ab=c.ability;const target=p.board.find(x=>x.uid===a.targetUid);if(ab.trigger==='play'&&ab.target==='other'&&p.board.length)ensure(target,'TARGET','Válassz egy saját egységet a képességhez.');const pos=a.position??p.board.length;ensure(Number.isInteger(pos)&&pos>=0&&pos<=p.board.length,'POSITION','Érvénytelen hely.');p.hand.splice(i,1);if([-4,-5,-6].includes(u.characterId)&&target){target.attack+=u.attack;target.health+=u.health;break;}p.board.splice(pos,0,u);
   if(ab.trigger==='play'){const repeated=powerState(p).completed&&powerState(p).quest==='battlecries'?2:1;for(let cast=0;cast<repeated;cast++){let targets:Unit[]=ab.target==='self'?[u]:ab.target==='other'?(target?[target]:[]):ab.target==='allies'?p.board.filter(x=>x!==u):[p.board[pos-1],p.board[pos+1]].filter(Boolean);for(const t of targets){t.attack+=(ab.attack||0)*(u.golden?2:1);t.health+=(ab.health||0)*(u.golden?2:1);}}completeQuest(p,1,'battlecries');}
   if(u.rewardTier){p.rewards.push(Math.min(6,p.tier+1));delete u.rewardTier;discover(m,p);}break;}
  case 'reorder':{ensure(a.uids.length===p.board.length&&new Set(a.uids).size===p.board.length&&a.uids.every(id=>p.board.some(u=>u.uid===id)),'ORDER','Az átrendezés minden egységet pontosan egyszer tartalmazzon.');p.board=a.uids.map(id=>p.board.find(u=>u.uid===id)!);break;}
  case 'refresh':ensure(p.gold>=1,'GOLD','A frissítéshez 1 arany kell.');p.gold--;fillShop(m,p);break;
  case 'freeze':p.frozen=!p.frozen;break;
  case 'upgrade':ensure(p.tier<6,'TIER','A bolt már 6. szintű.');ensure(p.gold>=p.upgradeCost,'GOLD','Nincs elég arany a fejlesztéshez.');p.gold-=p.upgradeCost;p.tier++;p.upgradeCost=RULES.upgradeCosts[p.tier];break;
  case 'discover':{const u=p.discover.find(u=>u.uid===a.uid);ensure(u,'DISCOVER','Nincs ilyen jutalom.');ensure(p.hand.length+powerState(p).spellHand.length<10,'HAND','A jutalomhoz hely kell a kézben.');for(const other of p.discover)if(other!==u)release(m,other);if(p.heroId==='original-19'&&powerState(p).discoverKind==='golden'&&(powerState(p).goldenDiscovers||0)<2){u.golden=true;u.attack*=2;u.health*=2;delete u.rewardTier;powerState(p).goldenDiscovers=(powerState(p).goldenDiscovers||0)+1;}p.hand.push(u);p.discover=[];powerState(p).discoverKind=undefined;merge(m,p);discover(m,p);break;}
  case 'power':{
   const hs=powerState(p);if(a.mode==='choosePower'){ensure(p.heroId==='original-17'&&!hs.borrowedId&&!p.powerUsed,'CHOICE','Ebben a körben már választottál.');ensure((a.choice===0||a.choice===1)&&hs.powerOffers?.[a.choice],'CHOICE','Válassz a két felkínált képességből.');hs.borrowedId=hs.powerOffers![a.choice];break;}const powerId=effectivePowerId(p),h=currentPower(p);ensure(h&&!h.passive,'POWER_UNAVAILABLE','Ez a képesség passzív vagy még nem elérhető.');
   if(a.mode==='guess'){ensure(hs.guessOptions?.length===2&&m.heroSecrets?.[p.id],'GUESS','Nincs aktív tipp.');ensure(a.choice===0||a.choice===1,'CHOICE','Válassz egy lapot.');hs.guessResult=hs.guessOptions[a.choice].uid===m.heroSecrets[p.id].correctGuessUid;if(hs.guessResult)p.gold=Math.max(p.gold,Math.min(hs.maxGold,p.gold+1));hs.guessOptions=[];delete m.heroSecrets[p.id];break;}
   if(a.mode==='combine'){ensure(powerId==='original-13'&&hs.combination.length===2,'COMBINE','Nincs folyamatban rajz.');ensure(a.choice===0||a.choice===1,'CHOICE','Válassz statforrást.');ensure(p.hand.length+powerState(p).spellHand.length<10,'HAND','Megtelt a kezed.');const base=hs.combination[a.choice],ability=hs.combination[1-a.choice];const result:Unit={...base,uid:`u${m.nextUid++}`,name:unitDefinition(base).name+' × '+unitDefinition(ability).name,ability:structuredClone(unitDefinition(ability).ability),text:unitDefinition(ability).text,keywords:[...(base.keywords||[])],token:true,generated:true,copies:0};p.hand.push(result);hs.combination=[];break;}
   ensure(!p.powerUsed,'POWER','Ebben a körben már használtad.');ensure(m.round>=hs.cooldownUntil,'COOLDOWN','A dobókocka még töltődik.');ensure(p.gold>=h.cost,'GOLD','Nincs elég arany.');
   const own=p.board.find(u=>u.uid===a.targetUid),index=p.shop.findIndex(u=>u?.uid===a.targetUid);
   switch(powerId){
    case 'original-20':{const candidates=shuffle(m,[...new Set(hs.fallenLast||[])]).slice(0,3);ensure(candidates.length,'DISCOVER','Az előző harcodban nem halt meg minion.');ensure(p.hand.length+hs.spellHand.length<10,'HAND','Megtelt a kéz.');p.discover=candidates.map(id=>{const u=makeUnit(m,id);u.token=true;u.generated=true;u.copies=0;u.ability=structuredClone(character(id).ability);return u;});hs.discoverKind='death';break;}
    case 'original-14':{const opponentId=m.pairings.find(pair=>pair.includes(p.id))?.find(id=>id!==p.id);const opponent=m.players.find(q=>q.id===opponentId);const opponentBoard=opponent?(opponent.hp>0?opponent.board:opponent.lastBoard):[];ensure(opponentBoard.length,'OPPONENT','Az ellenfél táblája még üres; később próbáld.');const truth=pick(m,opponentBoard);const excluded=new Set(opponentBoard.map(u=>u.characterId));const choices=CHARACTERS.filter(c=>m.activeCardIds.includes(c.id)&&!excluded.has(c.id)).sort((a,b)=>Math.abs(a.tier-unitDefinition(truth).tier)-Math.abs(b.tier-unitDefinition(truth).tier));ensure(choices.length,'POOL','Nincs megfelelő téves válasz.');const nearest=choices.filter(c=>Math.abs(c.tier-unitDefinition(truth).tier)===Math.abs(choices[0].tier-unitDefinition(truth).tier));const decoy=makeUnit(m,pick(m,nearest).id);const answer=makeUnit(m,truth.characterId);answer.name=truth.name;hs.guessOptions=shuffle(m,[answer,decoy]);for(const option of hs.guessOptions)option.uid=`g${m.nextUid++}`;(m.heroSecrets??={})[p.id]={correctGuessUid:answer.uid};break;}
    case 'original-15':{const opponent=m.players.find(q=>q.id===p.opponents.at(-1));ensure(opponent,'OPPONENT','Előbb játssz le egy harcot.');p.shop.forEach(u=>release(m,u));p.shop=opponent.lastBoard.map(source=>{const u=makeUnit(m,source.characterId);u.token=true;u.generated=true;u.copies=0;u.ability=structuredClone(character(source.characterId).ability);return u;});break;}
    case 'original-16':ensure(!hs.onceUsed,'ONCE','Már felhasználtad.');ensure(own,'TARGET','Válassz saját miniont.');ensure(p.board.length<7,'BOARD','A másolathoz szabad hely kell.');{const clone={...structuredClone(own),uid:`u${m.nextUid++}`,token:true,generated:true,copies:0,ability:structuredClone(unitDefinition(own).ability)};p.board.splice(p.board.indexOf(own)+1,0,clone);}hs.onceUsed=true;break;
    case 'original-26':ensure(a.mode==='upgrade','CHOICE','Válaszd a fejlesztést, vagy hagyd Csefit harcolni.');hs.championAttack+=p.tier;hs.championUpgradeRound=m.round;break;
    case 'original-31':hs.maxGold++;break;
    case 'original-1':hs.deferSales=true;break;
    case 'original-34':{const roll=1+Math.floor(random(m)*6);hs.lastRoll=roll;hs.cooldownUntil=m.round+roll+1;p.gold+=roll;break;}
    case 'original-3':ensure(index>=0,'TARGET','Válassz bolti miniont.');ensure(p.hand.length+powerState(p).spellHand.length<10,'HAND','Megtelt a kezed.');p.hand.push(p.shop[index]!);p.shop[index]=null;merge(m,p);break;
    case 'original-8':ensure(!hs.onceUsed,'ONCE','Már felhasználtad.');ensure(own&&!own.golden,'TARGET','Válassz nem arany saját miniont.');own.attack+=unitDefinition(own).attack;own.health+=unitDefinition(own).health;own.golden=true;hs.onceUsed=true;break;
    case 'original-9':{const victim=own||(index>=0?p.shop[index]:null);ensure(victim,'TARGET','Válassz saját vagy bolti miniont.');p.hp=Math.min(powerState(p).maxHp||30,p.hp+unitDefinition(victim).tier);release(m,victim);if(own)p.board=p.board.filter(u=>u.uid!==own.uid);else p.shop[index]=null;m.log.push(`${p.name}: ${unitDefinition(victim).name} füstté vált.`);break;}
    case 'original-11':fillShop(m,p);for(let i=0;i<Math.min(2,p.shop.length);i++){release(m,p.shop[i]);p.shop[i]=draw(m,Math.min(6,p.tier+1),true);}enchantShop(m,p,p.shop.filter((u):u is Unit=>!!u));break;
    case 'original-13':{ensure(m.round>=3,'ROUND','A 3. körtől használható.');ensure(!hs.combination.length,'COMBINE','Előbb fejezd be a rajzot.');ensure(p.hand.length+powerState(p).spellHand.length<10,'HAND','Megtelt a kezed.');const options=shuffle(m,CHARACTERS.filter(c=>m.activeCardIds.includes(c.id)&&c.tier<=p.tier)).slice(0,2);ensure(options.length===2,'POOL','Nincs két rajzforrás.');hs.combination=options.map(c=>({...makeUnit(m,c.id),token:true,generated:true,copies:0}));break;}
    default:throw new RuleError('POWER_UNAVAILABLE','A hősképesség még nem elérhető.');
   }
   p.gold-=h.cost;p.powerUsed=true;break;
  }
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
  if(powerState(p).combination.length){run({type:'power',mode:'combine',choice:0});continue;}
  if(p.discover.length){if(p.hand.length>=10)break;run({type:'discover',uid:[...p.discover].sort((a,b)=>score(b)-score(a))[0].uid});continue;}
  if(p.hand.length&&p.board.length<7){run({type:'play',uid:p.hand[0].uid,targetUid:p.board[0]?.uid});continue;}
  if(p.hand.length&&p.board.length===7){const weakest=[...p.board].sort((a,b)=>score(a)-score(b))[0];if(score(p.hand[0])>score(weakest)){run({type:'sell',uid:weakest.uid});continue;}}
  if(!p.powerUsed&&currentPower(p)&&!currentPower(p)!.passive&&p.gold>=currentPower(p)!.cost){const target=effectivePowerId(p)==='original-3'?p.shop.find(Boolean)?.uid:p.board[0]?.uid;if(run({type:'power',targetUid:target,mode:effectivePowerId(p)==='original-26'?'upgrade':undefined}))continue;}
  const spell=powerState(p).spellHand[0];if(spell&&p.board.length&&run({type:'power',mode:'castSpell',spellUid:spell.uid,targetUid:p.board[0].uid}))continue;
  const offer=powerState(p).spellShop.find(s=>s.cost<=p.gold);if(offer&&p.board.length&&p.hand.length+powerState(p).spellHand.length<10&&(p.heroId!=='original-12'||p.board.some(u=>u.characterId===-2))&&run({type:'power',mode:'buySpell',spellUid:offer.uid}))continue;
  if(p.tier<6&&m.round>=p.tier*2&&p.gold>=p.upgradeCost&&(p.board.length>=Math.min(7,m.round-1)||m.round>10)){run({type:'upgrade'});continue;}
  const offers=p.shop.filter((u):u is Unit=>!!u).sort((a,b)=>score(b)-score(a));
  const best=offers.find(u=>p.board.length<7||[...p.hand,...p.board].filter(x=>!x.golden&&x.characterId===u.characterId).length>=2||score(u)>Math.min(...p.board.map(score)));
  if(best&&p.gold>=minionPrice(p,best)&&p.hand.length+powerState(p).spellHand.length<10){run({type:'buy',uid:best.uid});continue;}

  if(p.gold>=1){run({type:'refresh'});continue;}break;
 }
 const p=get();run({type:'reorder',uids:[...p.board].sort((a,b)=>score(b)-score(a)).map(u=>u.uid)});run({type:'ready'});
}
const score=(u:Unit)=>u.attack+u.health+(u.shield?6:0)+unitDefinition(u).tier*2
 +(hasKeyword(u,'windfury')?Math.min(u.attack,u.health)*.5:0)
 +(hasKeyword(u,'reborn')?character(u.characterId).attack*(u.golden?2:1):0)
 +(hasKeyword(u,'stealth')?2:0)+(hasKeyword(u,'venomous')?5:0);
export function advance(m:Match){
 if(m.phase==='finished')return;
 if(m.phase==='hero'){for(const p of [...m.players])if(!p.heroId)act(m,p.id,{type:'chooseHero',heroId:p.heroOffers[0]});return;}
 if(m.phase==='recruit'){
  for(const p of [...m.players])if(p.bot)botTurn(m,p.id);
  for(const p of m.players){if(!alive(p))continue;if(p.heroId==='original-22'&&m.players.some(q=>q.heroId==='original-25'))for(const u of p.board)u.attack+=3;if(p.heroId==='original-21'&&p.board.filter(u=>u.drunk).length>=5)powerState(p).drunkQuest=true;if(p.heroId==='original-5')p.frozen=true;for(const u of p.board.filter(u=>u.spellUpgrades?.magnetic)){if(p.hand.length+powerState(p).spellHand.length<10){const token=makeUnit(m,pick(m,[-4,-5,-6]));token.token=true;token.copies=0;p.hand.push(token);}}p.lastBoard=structuredClone(p.board);p.ready=true;p.opponents.push(m.pairings.flat().includes(p.id)?m.pairings.find(pair=>pair.includes(p.id))!.find(id=>id!==p.id)!:'');}
  m.phase='combat';m.battles=[];m.pendingDamage={};const living=m.players.filter(alive).length;
  for(const [leftId,rightId] of m.pairings){const l=m.players.find(p=>p.id===leftId)!,r=m.players.find(p=>p.id===rightId)!;const result=fight(l.board,alive(r)?r.board:r.lastBoard,Math.floor(random(m)*4294967296),{champions:[l,r].map(p=>p.heroId==='original-26'&&powerState(p).championUpgradeRound!==m.round?powerState(p).championAttack:0)});const combatUnits=new Map(result.events.flatMap(e=>[...e.left,...e.right]).map(u=>[u.uid,u]));for(const [side,p] of [[0,l],[1,r]] as const){if(!alive(p))continue;powerState(p).fallenLast=[];const ownIds=new Set((side===0?result.events[0]?.left:result.events[0]?.right)?.map(u=>u.uid)||[]);for(const e of result.events){for(const u of (side===0?e.left:e.right))ownIds.add(u.uid);if(e.type==='death'){const dead=combatUnits.get(e.actor||'');if(dead&&!dead.heroFighter)powerState(p).fallenLast!.push(dead.characterId);}if(e.type==='death'&&ownIds.has(e.actor||''))completeQuest(p,1,'deaths');}}const winner=result.winner===0?l:result.winner===1?r:null;const loser=winner===l?r:l;const raw=winner?winner.tier+result.survivors.reduce((n,u)=>n+(u.token&&!u.generated?1:unitDefinition(u).tier),0):0;const damage=Math.max(0,Math.min(raw,damageCap(m.round,living))-(loser.heroId==='original-7'?loser.tier:0));if(winner&&alive(loser))m.pendingDamage[loser.id]=(m.pendingDamage[loser.id]||0)+damage;for(const [side,p] of [[0,l],[1,r]] as const)if(alive(p))m.pendingDamage[p.id]=(m.pendingDamage[p.id]||0)+result.heroDamage[side];const battle:Battle={leftId,rightId,ghost:!alive(r),events:result.events,winner:winner?.id||null,damage};m.battles.push(battle);}
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
 const ids=new Set<string>();for(const p of m.players){if(p.board.length>7||p.hand.length>10||!Number.isFinite(p.gold)||p.gold<0)throw new Error('Player limits');for(const u of [...p.board,...p.hand,...p.discover,...p.shop.filter((x):x is Unit=>!!x)]){if(ids.has(u.uid))throw new Error('Duplicate unit');ids.add(u.uid);}}
 for(const c of CHARACTERS){const held=m.players.flatMap(p=>[...p.board,...p.hand,...p.discover,...p.shop.filter((x):x is Unit=>!!x)]).filter(u=>u.characterId===c.id&&!u.token).reduce((n,u)=>n+u.copies,0);if(m.pool[c.id]<0||m.pool[c.id]+held!==(m.activeCardIds.includes(c.id)?RULES.poolCopies[c.tier]:0))throw new Error(`Pool conservation ${c.id}: ${m.pool[c.id]} + ${held}`);}
}
