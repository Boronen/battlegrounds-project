import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMatch} from './fixtures';
import {act,advance,assertInvariants,makeUnit} from '../shared/engine';
import {CHARACTERS} from '../shared/catalog';
import {fight} from '../shared/combat';
import {completeQuest,powerState} from '../shared/hero-powers';
import {TRIGGER_SUPPORT} from '../shared/shared-cards';
import {tribeFor} from '../shared/tribes';
import type {Match} from '../shared/types';

function setup(heroId='original-15'){
 const match=createMatch(52);
 match.players[0].heroOffers=[heroId];
 act(match,'p0',{type:'chooseHero',heroId});
 for(const player of match.players)player.bot=false;
 return match;
}

function grant(match:Match,id:number,golden=false,zone:'board'|'hand'='board'){
 const unit=makeUnit(match,id,golden);
 match.pool[id]-=unit.copies;
 match.players[0][zone].push(unit);
 return unit;
}

test('Battlecry uses the strongest aura, doubles golden magnitude and counts one quest action',()=>{
 const match=setup('original-10');
 const state=powerState(match.players[0]);
 state.quest='battlecries';
 completeQuest(match.players[0],7,'battlecries');
 const [echo]=TRIGGER_SUPPORT;
 grant(match,echo.id);
 grant(match,echo.id,true);
 const card=CHARACTERS.find(c=>c.ability.trigger==='play'&&c.ability.target==='self'&&c.ability.attack)!;
 const source=grant(match,card.id,true,'hand');
 act(match,'p0',{type:'play',uid:source.uid});
 assert.equal(match.players[0].board.at(-1)?.attack,source.attack+6*card.ability.attack!);
 assert.equal(powerState(match.players[0]).progress,7);
 assertInvariants(match);
});

test('turn-end and turn-start fire once at their own boundary and persist past combat',()=>{
 const match=setup();
 const start=CHARACTERS.find(c=>c.ability.trigger==='turnStart'&&c.ability.target==='neighbors')!;
 const end=CHARACTERS.find(c=>c.ability.trigger==='turnEnd'&&c.ability.target==='neighbors')!;
 grant(match,start.id,true);
 const target=grant(match,47);
 grant(match,end.id,true);
 grant(match,TRIGGER_SUPPORT[2].id,true);
 act(match,'p0',{type:'ready'});
 assert.equal(match.players[0].board[1].health,target.health);
 advance(match);
 const health=target.health+6*end.ability.health!;
 assert.equal(match.players[0].lastBoard[1].health,health);
 const endAttack=target.attack+6*(end.ability.attack??0);
 assert.equal(match.players[0].board[1].attack,endAttack);
 advance(match);
 assert.equal(match.players[0].board[1].health,health+2*(start.ability.health??0));
 assert.equal(match.players[0].board[1].attack,endAttack+2*start.ability.attack!);
 assertInvariants(match);
});

test('turn-end recruits share the finite pool and a full spell hand also blocks them',()=>{
 for(const handSize of [0,10]){
  const match=setup();
  const card=CHARACTERS.find(c=>c.ability.effect==='recruit')!;
  grant(match,card.id,true);
  grant(match,TRIGGER_SUPPORT[2].id);
  const player=match.players[0];
  powerState(player).spellHand=Array.from({length:handSize},(_,i)=>({uid:'spell'+i,kind:'buff',tier:1,cost:2}));
  advance(match);
  assert.equal(player.hand.reduce((sum,u)=>sum+u.copies,0),handSize?0:4);
  assert.ok(player.hand.every(u=>!u.token&&u.characterId>0));
  assertInvariants(match);
 }
});

test('a golden Deathrattle summons two tokens per activation and respects the board cap',()=>{
 const match=setup();
 const summoner=CHARACTERS.find(c=>c.ability.effect==='summon')!;
 const source={...makeUnit(match,summoner.id,true),health:1};
 const aura=makeUnit(match,TRIGGER_SUPPORT[1].id,true);
 const enemy={...makeUnit(match,47),attack:5,health:500};
 for(const allies of [[],Array.from({length:5},()=>({...makeUnit(match,47),attack:0}))]){
  const result=fight([source,aura,...allies],[enemy],1);
  assert.equal(result.events.filter(e=>e.type==='summon'&&e.actor===source.uid).length,allies.length?1:6);
  assert.ok(result.events.every(e=>e.left.length<=7));
 }
});

test('a pending discovery stays reserved while the player makes room after an end-of-turn draw',()=>{
 const match=setup();
 const player=match.players[0];
 const recruit=CHARACTERS.find(c=>c.ability.effect==='recruit')!;
 grant(match,recruit.id);
 const chosen=makeUnit(match,47);
 match.pool[47]--;
 player.discover=[chosen];
 powerState(player).spellHand=Array.from({length:9},(_,i)=>({uid:'buff'+i,kind:'buff',tier:1,cost:2}));
 advance(match);advance(match);
 const p=match.players[0],waiting=p.discover[0];
 assert.equal(p.hand.length+powerState(p).spellHand.length,10);
 assert.throws(()=>act(match,p.id,{type:'discover',uid:waiting.uid}));
 act(match,p.id,{type:'play',uid:p.hand[0].uid,targetUid:p.board[0].uid});
 act(match,p.id,{type:'discover',uid:waiting.uid});
 assert.equal(match.players[0].hand[0].uid,chosen.uid);
 assertInvariants(match);
});

test('Rally resolves twice during a Windfury swing pair and once per subsequent swing',()=>{
 const match=setup();
 const card=CHARACTERS.find(c=>c.ability.trigger==='rally'&&c.ability.target==='self')!;
 const source={...makeUnit(match,card.id,true),health:2,keywords:['windfury' as const]};
 const enemy={...makeUnit(match,47),attack:0,health:100};
 const result=fight([source,makeUnit(match,47)],[enemy],1);
 const hits=result.events.filter(e=>e.type==='attack'&&e.actor===source.uid);
 const rallies=result.events.filter(e=>e.type==='buff'&&e.actor===source.uid);
 assert.ok(hits.length>=2);
 assert.equal(rallies.length,hits.length);
 assert.equal(rallies[1].left.find(u=>u.uid===source.uid)?.attack,source.attack+4*card.ability.attack!);
});

test('tribal growth buffs matching and All-type allies, including golden scaling, and excludes its source',()=>{
 const match=setup();
 const leader=CHARACTERS.find(c=>c.ability.trigger==='turnStart'&&c.ability.target==='tribe')!;
 const family=tribeFor(leader);
 const same=CHARACTERS.find(c=>tribeFor(c)===family&&c.ability.trigger==='play')!;
 const leaderUnit=grant(match,leader.id,true);
 const allies=[same,CHARACTERS.find(c=>tribeFor(c)==='all')!,TRIGGER_SUPPORT[0]].map(c=>grant(match,c.id));
 const initial=allies.map(u=>[u.attack,u.health]);
 advance(match);advance(match);
 const board=match.players[0].board;
 assert.equal(board[0].attack,leaderUnit.attack);
 for(const [i,unit] of board.slice(1).entries()){
  const multiplier=i<2?2:0;
  assert.equal(unit.attack,initial[i][0]+multiplier*leader.ability.attack!);
  assert.equal(unit.health,initial[i][1]+multiplier*leader.ability.health!);
 }
 assertInvariants(match);
});

test('tribal Rally protects its own living family during combat and leaves the recruited board intact',()=>{
 const match=setup();
 const leader=CHARACTERS.find(c=>c.ability.trigger==='rally'&&c.ability.target==='tribe')!;
 const kin=CHARACTERS.find(c=>tribeFor(c)===tribeFor(leader)&&c.ability.trigger==='play')!;
 const all=CHARACTERS.find(c=>tribeFor(c)==='all')!;
 const other=CHARACTERS.find(c=>tribeFor(c)!==tribeFor(leader)&&c.ability.trigger==='play')!;
 const board=[leader,kin,all,other,TRIGGER_SUPPORT[0]].map((c,i)=>makeUnit(match,c.id,i===0));
 const initial=structuredClone(board);
 const foe={...makeUnit(match,47),attack:0,health:85};
 const {events}=fight(board,[foe],33);
 const rally=events.filter(e=>e.type==='buff'&&e.actor===board[0].uid);
 assert.deepEqual(rally.slice(0,2).map(e=>e.target),[board[1].uid,board[2].uid]);
 assert.ok(rally.every(e=>e.target===board[1].uid||e.target===board[2].uid));
 const boosted=rally[1].left.find(u=>u.uid===board[2].uid)!;
 assert.equal(boosted.attack,board[2].attack+2*leader.ability.attack!);
 assert.equal(boosted.health,board[2].health+2*leader.ability.health!);
 assert.deepEqual(board,initial);
});
