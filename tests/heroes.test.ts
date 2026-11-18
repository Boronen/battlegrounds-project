import {POWER_DEFS} from '../shared/hero-powers';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { HEROES, CHARACTERS, character, hero } from '../shared/catalog';
import { act, assertInvariants, autoplay, createMatch, RuleError } from '../shared/engine';
import { Session, digest, replayMatch } from '../server/session';

test('three rerolls offer twelve distinct heroes and reject exhausted or outdated choices atomically',()=>{
 for(let seed=1;seed<=50;seed++) {
  const m=createMatch(seed),seen=new Set(m.players[0].heroOffers);
  assert.equal(seen.size,3);
  const old=m.players[0].heroOffers[0];
  for(let remaining=3;remaining>0;remaining--) {
   assert.equal(m.players[0].heroRerolls,remaining);
   act(m,'p0',{type:'rerollHeroes'});
   const p=m.players[0];
   assert.equal(p.heroOffers.length,3);
   for(const id of p.heroOffers){assert.ok(!seen.has(id));seen.add(id);}
   assert.equal(p.heroSeen.length,seen.size);
   assert.deepEqual(new Set(p.heroSeen),seen);
  }
  assert.equal(seen.size,12);
  assert.equal(m.players[0].heroRerolls,0);
  const before=structuredClone(m);
  assert.throws(()=>act(m,'p0',{type:'rerollHeroes'}),(e:unknown)=>e instanceof RuleError&&e.code==='HERO_REROLLS');
  assert.throws(()=>act(m,'p0',{type:'chooseHero',heroId:old}));
  assert.deepEqual(m,before);
  act(m,'p0',{type:'chooseHero',heroId:m.players[0].heroOffers[0]});
  const selected=structuredClone(m);
  assert.throws(()=>act(m,'p0',{type:'rerollHeroes'}));
  assert.deepEqual(m,selected);
 }
});

test('reroll commands are idempotent, preserve deadlines, survive snapshots and replay deterministically',()=>{
 const s=new Session(123,'timed'),deadline=s.deadline;
 const cmd={commandId:'reroll-1',expectedVersion:0,action:{type:'rerollHeroes' as const}};
 const ack=s.command(cmd);
 assert.equal(ack.ok,true);
 const after=digest(s.match);
 assert.deepEqual(s.command(cmd),ack);
 assert.equal(digest(s.match),after);
 assert.equal(s.deadline,deadline);
 assert.equal(s.snapshot().you.heroRerolls,2);
 assert.deepEqual(s.snapshot().you.heroSeen,s.match.players[0].heroSeen);
 const stale=s.command({commandId:'stale-reroll',expectedVersion:0,action:{type:'rerollHeroes'}});
 assert.equal(stale.code,'STALE');
 assert.equal(digest(s.match),after);
 assert.equal(digest(replayMatch(s.replay())),after);
 s.advance();
 assert.ok(s.match.players[0].heroOffers.includes(s.match.players[0].heroId!));
 assert.equal(s.match.phase,'recruit');
 assert.equal(digest(replayMatch(s.replay())),digest(s.match));
});

test('35 original characters have configured powers, excluded from the recruitable pool',()=>{
 assert.equal(HEROES.length,35);
 assert.equal(CHARACTERS.length,357);
 assert.equal(new Set(HEROES.map(h=>h.id)).size,35);
 for(let id=1;id<=34;id++) {
  const h=hero(`original-${id}`)!;
  assert.ok(h);
  assert.equal(h.power,POWER_DEFS[h.id]?(POWER_DEFS[h.id].passive?'passive':'custom'):null);
  assert.equal(h.armor,0);
  assert.equal(h.portrait,`/portraits/sketch/${id}.png`);
  assert.ok(existsSync(new URL('../public'+h.portrait,import.meta.url)));
  assert.throws(()=>character(id));
 }
 for(const retired of ['mentor','guardian','treasurer','inventor']) assert.equal(hero(retired),undefined);
 assert.ok(CHARACTERS.every(c=>c.id>=35));
 const portraits=HEROES.map(h=>readFileSync(new URL('../public'+h.portrait,import.meta.url)).toString('base64'));
 assert.equal(new Set(portraits).size,35);
 assert.ok(portraits.every(png=>png.startsWith('iVBORw0KGgo')), 'Every hero uses a PNG sketch portrait');
});

test('every original hero can be selected and unavailable powers reject atomically',()=>{
 for(const h of HEROES) {
  const m=createMatch(42);
  const player=m.players[0];
  player.heroOffers=[h.id];
  act(m,'p0',{type:'chooseHero',heroId:h.id});
  assert.equal(m.players[0].heroId,h.id);
  assert.equal(m.players[0].armor,0);
  const before=structuredClone(m);
  for(const action of (!h.power||h.power==='passive'?[{type:'power'},{type:'power',targetUid:'missing'}]:[]) as {type:'power';targetUid?:string}[]) {
   assert.throws(()=>act(m,'p0',action),(error:unknown)=>error instanceof RuleError&&error.code==='POWER_UNAVAILABLE');
   assert.deepEqual(m,before);
  }
  assertInvariants(m);
 }
});

test('hero offers and bot turns preserve hero and pool invariants',()=>{
 const offered=new Set<string>();
 for(let seed=1;seed<=20;seed++) {
  const m=createMatch(seed,'manual',true);
  for(const player of m.players) {
   assert.equal(player.heroOffers.length,3);
   assert.equal(new Set(player.heroOffers).size,3);
   player.heroOffers.forEach(id=>{assert.ok(hero(id));offered.add(id);});
   assert.ok(hero(player.heroId));
  }
  autoplay(m);
  assert.ok(m.players.every(p=>typeof p.powerUsed==='boolean'));
  assert.ok(Object.keys(m.pool).every(id=>Number(id)>=35));
  assertInvariants(m);
 }
 assert.equal(offered.size,35);
});
