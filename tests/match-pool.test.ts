import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS, character} from '../shared/catalog';
import {TRIBES, tribeFor, hasTribe} from '../shared/tribes';
import {SHARED_ROSTERS, SHARED_CARDS, TRIBE_SUPPORT, TRIGGER_SUPPORT} from '../shared/shared-cards';
import {createMatch, act, assertInvariants, fillShop, makeUnit} from '../shared/engine';
import {Session, digest, replayMatch} from '../server/session';

test('random rosters have five tribes, eighty-three unique cards and every tier',()=>{
 const combinations=new Set<string>();
 for(let seed=1;seed<=500;seed++) {
  const mixedSeed=(Math.imul(seed,2654435761)>>>0)||1;
  const m=createMatch(mixedSeed);
  assert.equal(m.activeTribes.length,5);
  assert.equal(new Set(m.activeTribes).size,5);
  assert.equal(m.activeCardIds.length,83);
  assert.equal(new Set(m.activeCardIds).size,83);
  combinations.add([...m.activeTribes].sort().join(','));
  const cards=m.activeCardIds.map(character);
  assert.ok(cards.every(c=>tribeFor(c)==='neutral'||tribeFor(c)==='all'||m.activeTribes.some(t=>tribeFor(c)===t)));
  assert.equal(cards.filter(c=>tribeFor(c)==='neutral').length,15);
  assert.equal(cards.filter(c=>tribeFor(c)==='all').length,8);
  for(const tribe of m.activeTribes){
   assert.equal(cards.filter(c=>tribeFor(c)===tribe).length,12);
   for(let tier=1;tier<=6;tier++)assert.equal(cards.filter(c=>tribeFor(c)===tribe&&c.tier===tier).length,2);
   assert.equal(cards.filter(c=>hasTribe(c,tribe)).length,20);
  }
  assert.deepEqual([1,2,3,4,5,6].map(t=>cards.filter(c=>c.tier===t).length),[14,14,13,13,15,14]);
  assert.ok(TRIGGER_SUPPORT.every(c=>m.activeCardIds.includes(c.id)));
  for(const trigger of ['play','death','rally','turnStart','turnEnd'])assert.ok(cards.some(c=>c.ability.trigger===trigger),trigger);
  assert.equal(Object.values(m.pool).reduce((a,b)=>a+b,0),965);
  for(const c of CHARACTERS)if(!m.activeCardIds.includes(c.id))assert.equal(m.pool[c.id],0);
  assert.deepEqual(m,createMatch(mixedSeed));
  assertInvariants(m);
 }
 assert.equal(combinations.size,56);
 assert.equal(TRIBES.length,8);
});

test('every franchise gains Neutral and All-type cards and every tribe has two designs per tier',()=>{
 assert.equal(SHARED_ROSTERS.length,35);
 assert.equal(SHARED_CARDS.length,70);
 assert.equal(TRIBE_SUPPORT.length,7);
 const franchises=new Set(CHARACTERS.filter(c=>!TRIGGER_SUPPORT.includes(c)).map(c=>c.tags[0]));
 assert.equal(franchises.size,35);
 for(const franchise of franchises)for(const type of ['neutral','all']){
  assert.equal(SHARED_CARDS.filter(c=>c.tags[0]===franchise&&tribeFor(c)===type).length,1);
 }
 for(const tribe of TRIBES)for(let tier=1;tier<=6;tier++){
  assert.ok(CHARACTERS.filter(c=>tribeFor(c)===tribe.id&&c.tier===tier).length>=2,`${tribe.id} tier ${tier}`);
 }
 for(const c of SHARED_CARDS)for(const tribe of TRIBES){
  assert.equal(hasTribe(c,tribe.id),tribeFor(c)==='all');
 }
});

test('shops and triple rewards draw only active cards, while catalog IDs survive depletion',()=>{
 const m=createMatch(42);
 m.players[0].heroOffers=['original-15'];
 act(m,'p0',{type:'chooseHero',heroId:m.players[0].heroOffers[0]});
 const p=m.players[0];
 for(let tier=1;tier<=6;tier++) {
  p.tier=tier;
  for(let n=0;n<10;n++) {
   fillShop(m,p);
   assert.ok(p.shop.every(u=>u&&m.activeCardIds.includes(u.characterId)&&character(u.characterId).tier<=tier));
   assertInvariants(m);
  }
 }
 // Three copies of an active tier-1 card trigger a real discover from tier 2.
 p.shop.forEach(u=>{if(u)m.pool[u.characterId]++;});p.shop=[];
 p.tier=1;p.gold=9;
 const id=m.activeCardIds.find(id=>character(id).tier===1)!;
 for(let n=0;n<3;n++) {
  const current=m.players[0];
  m.pool[id]--;current.shop=[makeUnit(m,id)];
  act(m,'p0',{type:'buy',uid:current.shop[0]!.uid});
 }
 const current=m.players[0];
 act(m,'p0',{type:'play',uid:current.hand[0].uid});
 assert.equal(m.players[0].discover.length,3);
 assert.ok(m.players[0].discover.every(u=>m.activeCardIds.includes(u.characterId)&&character(u.characterId).tier===2));
 assertInvariants(m);
 const s=new Session(42,'manual'),active=[...s.match.activeCardIds];
 s.match.pool[active[0]]=0;
 assert.deepEqual(s.snapshot().activeCardIds,active);
 assert.equal('pool' in s.snapshot(),false);
});

test('snapshots and replays preserve the active roster',()=>{
 const s=new Session(73,'manual');
 const snap=s.snapshot();
 assert.deepEqual(snap.activeCardIds,s.match.activeCardIds);
 assert.deepEqual(snap.activeTribes,s.match.activeTribes);
 snap.activeCardIds.pop();
 assert.equal(s.match.activeCardIds.length,83);
 s.command({commandId:'pick',expectedVersion:0,action:{type:'chooseHero',heroId:s.match.players[0].heroOffers[0]}});
 for(let n=0;n<4;n++)s.advance(true);
 assert.equal(digest(replayMatch(s.replay())),digest(s.match));
});
