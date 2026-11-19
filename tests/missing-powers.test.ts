import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMatch} from './fixtures';
import {act,makeUnit,assertInvariants} from '../shared/engine';
import {HEROES} from '../shared/catalog';
import {POWER_DEFS,powerState} from '../shared/hero-powers';

test('every hero has a configured ability',()=>{
 for(const hero of HEROES)assert.ok(POWER_DEFS[hero.id],hero.name);
});
for(const number of [2,24,25,27,28,29,30,33,35]){
 test('new power executes and limits repeat use: '+number,()=>{
  const m=createMatch(123),id='original-'+number;
  m.players[0].heroOffers=[id];
  act(m,'p0',{type:'chooseHero',heroId:id});
  const p=m.players[0];
  const u=makeUnit(m,35);u.generated=true;u.token=true;u.copies=0;u.taunt=true;
  p.board.push(u);p.gold=10;
  const before=JSON.stringify(p.board);
  act(m,'p0',{type:'power',targetUid:u.uid});
  assert.notEqual(JSON.stringify(m.players[0].board),before);
  assert.equal(m.players[0].gold,10-POWER_DEFS[id].cost);
  assert.equal(m.players[0].powerUsed,true);
  assert.throws(()=>act(m,'p0',{type:'power',targetUid:u.uid}));
  assertInvariants(m);
  assert.equal(powerState(m.players[0]).spellShop.length,1);
 });
}
