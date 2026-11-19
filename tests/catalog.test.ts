import { createMatch } from './fixtures';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CHARACTERS } from '../shared/catalog';
import { BACK_TO_THE_FUTURE } from '../shared/back-to-the-future';
import { AMERICAN_DRAGON } from '../shared/american-dragon';
import { FRANCHISE_EXPANSION, REMAINING_ROSTERS } from '../shared/franchise-expansion';
import { act, makeUnit, assertInvariants } from '../shared/engine';
import { fight } from '../shared/combat';
import { RULES } from '../shared/rules';

test('franchise cards join the finite pool with unique IDs and local portraits', () => {
 const m = createMatch(42);
 assert.equal(BACK_TO_THE_FUTURE.length, 8);
 assert.equal(AMERICAN_DRAGON.length, 8);
 assert.equal(REMAINING_ROSTERS.length, 33);
 assert.ok(REMAINING_ROSTERS.every(roster=>roster.entries.length===8));
 assert.equal(FRANCHISE_EXPANSION.length,264);
 assert.equal(new Set(CHARACTERS.map(c => c.id)).size, CHARACTERS.length);
 for (const c of CHARACTERS) {
  assert.ok(CHARACTERS.includes(c));
  assert.equal(m.pool[c.id], RULES.poolCopies[c.tier]);
  assert.ok(existsSync(new URL('../public' + c.portrait, import.meta.url)));
  assert.ok(!c.text.includes('?'));
 }
 assertInvariants(m);
});

test('all 360 cards support normal and golden recruitment and deterministic combat', () => {
 for (const c of CHARACTERS) for (const golden of [false,true]) {
  const m=createMatch(7);
  act(m,'p0',{type:'chooseHero',heroId:m.players[0].heroOffers[0]});
  const leftNeighbor=makeUnit(m,47),rightNeighbor=makeUnit(m,47),u=makeUnit(m,c.id,golden);
  m.pool[47]-=2;
  m.pool[c.id]-=u.copies;
  m.players[0].board.push(leftNeighbor,rightNeighbor);
  m.players[0].hand.push(u);
  act(m,'p0',{type:'play',uid:u.uid,position:1,targetUid:leftNeighbor.uid});
  assertInvariants(m);
  const mult=golden?2:1;
  const played=m.players[0].board[1];
  if(c.ability.trigger==='play') {
   const target=c.ability.target==='self'?played:m.players[0].board[0];
   assert.equal(target.attack,(c.ability.target==='self'?c.attack*mult:leftNeighbor.attack)+(c.ability.attack||0)*mult,c.name);
   assert.equal(target.health,(c.ability.target==='self'?c.health*mult:leftNeighbor.health)+(c.ability.health||0)*mult,c.name);
  }
  if(c.ability.effect==='taunt') assert.equal(played.taunt,true,c.name);
  const enemies=[makeUnit(m,47),makeUnit(m,47)];
  enemies.forEach(enemy=>{enemy.attack=15;enemy.health=50;});
  const before=structuredClone(m.players[0].board);
  const result=fight(m.players[0].board,enemies,73);
  assert.deepEqual(result,fight(m.players[0].board,enemies,73),c.name);
  assert.deepEqual(m.players[0].board,before,c.name);
  assert.ok(result.events.every(e=>[...e.left,...e.right].every(unit=>Number.isFinite(unit.attack)&&Number.isFinite(unit.health))),c.name);
 }
});

test('Dark Dragon damages every enemy at combat start and golden damage doubles', () => {
 for (const golden of [false,true]) {
  const m=createMatch(42);
  const dragon=makeUnit(m,50,golden);
  const enemies=[makeUnit(m,47),makeUnit(m,47),makeUnit(m,47)];
  enemies.forEach(u=>{u.health=40;});
  const result=fight([dragon],enemies,42);
  const beforeAttack=result.events.slice(0,result.events.findIndex(e=>e.type==='attack'));
  for (const enemy of enemies) {
   assert.ok(beforeAttack.some(e=>e.type==='damage' && e.target===enemy.uid && e.amount===(golden?6:3)));
   assert.equal(enemy.health,40);
  }
 }
});

test('Trixie buffs the chosen ally and Fu Dog shields only the left neighbor', () => {
 const m=createMatch(42);
 act(m,'p0',{type:'chooseHero',heroId:m.players[0].heroOffers[0]});
 const target=makeUnit(m,49),trixie=makeUnit(m,47);
 m.pool[49]--; m.pool[47]--;
 m.players[0].board.push(target);
 m.players[0].hand.push(trixie);
 act(m,'p0',{type:'play',uid:trixie.uid,targetUid:target.uid});
 assert.equal(m.players[0].board[0].attack,7);
 assertInvariants(m);
 const fuDog=makeUnit(m,46),right=makeUnit(m,43),enemy=makeUnit(m,47);
 enemy.health=100;
 const result=fight([target,fuDog,right],[enemy],42);
 const shieldEvent=result.events.find(e=>e.type==='buff' && e.actor===fuDog.uid)!;
 assert.equal(shieldEvent.target,target.uid);
 assert.equal(shieldEvent.left.find(u=>u.uid===target.uid)!.shield,true);
 assert.equal(shieldEvent.left.find(u=>u.uid===right.uid)!.shield,false);
 assert.equal(target.shield,false);
});

test('George and Lorraine apply permanent play buffs, doubled for golden cards', () => {
 for (const golden of [false, true]) {
  const m = createMatch(42);
  act(m, 'p0', {type:'chooseHero', heroId:m.players[0].heroOffers[0]});
  const george = makeUnit(m, 38, golden);
  m.pool[38] -= george.copies;
  m.players[0].hand.push(george);
  act(m, 'p0', {type:'play', uid:george.uid});
  const mult = golden ? 2 : 1;
  assert.equal(m.players[0].board[0].attack, 3 * mult);
  assert.equal(m.players[0].board[0].health, 4 * mult);
  const lorraine = makeUnit(m, 39, golden);
  m.pool[39] -= lorraine.copies;
  m.players[0].hand.push(lorraine);
  act(m, 'p0', {type:'play', uid:lorraine.uid, targetUid:george.uid});
  assert.equal(m.players[0].board[0].attack, 5 * mult);
  assert.equal(m.players[0].board[0].health, 6 * mult);
  assertInvariants(m);
 }
});

test('new start abilities produce combat effects without changing recruitment stats', () => {
 const m = createMatch(42);
 const left = [35,36,37,40,41,42].map(id => makeUnit(m,id));
 assert.equal(left[2].taunt,true);
 const enemy = makeUnit(m,47);
 enemy.attack=1; enemy.health=200;
 const before=structuredClone(left);
 const result=fight(left,[enemy],42);
 for (const id of [35,36,40,41]) {
  const source=left.find(u=>u.characterId===id)!;
  assert.ok(result.events.some(e=>e.type==='buff' && e.actor===source.uid));
 }
 assert.ok(result.events.some(e=>e.type==='damage' && e.target===enemy.uid && e.amount===4));
 assert.deepEqual(left,before);
});
