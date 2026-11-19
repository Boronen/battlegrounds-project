import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMatch} from './fixtures';
import {act,makeUnit,assertInvariants} from '../shared/engine';
import {powerState} from '../shared/hero-powers';
function setup(){const m=createMatch(123);m.players[0].heroOffers=['original-20'];act(m,'p0',{type:'chooseHero',heroId:'original-20'});return m;}
function discover(m:ReturnType<typeof setup>){const p=m.players[0];p.gold=10;p.powerUsed=false;powerState(p).fallenLast=[35];act(m,'p0',{type:'power'});act(m,'p0',{type:'discover',uid:m.players[0].discover[0].uid});}
test('three Vanda-discovered copies triple into one golden with zero physical copies and a real reward',()=>{const m=setup();for(let i=0;i<3;i++){discover(m);assertInvariants(m);}const p=m.players[0];assert.equal(p.hand.length,1);const u=p.hand[0];assert.equal(u.golden,true);assert.equal(u.copies,0);assert.equal(u.rewardTier,1);act(m,'p0',{type:'play',uid:u.uid});assert.equal(m.players[0].discover.length,3);assertInvariants(m);});
test('mixed Vanda and physical copies merge and selling returns only real copies',()=>{const m=setup();for(let i=0;i<2;i++){m.pool[35]--;m.players[0].hand.push(makeUnit(m,35));}discover(m);const p=m.players[0],u=p.hand[0];assert.equal(p.hand.length,1);assert.equal(u.golden,true);assert.equal(u.copies,2);assertInvariants(m);p.board.push(p.hand.shift()!);const before=m.pool[35];act(m,'p0',{type:'sell',uid:u.uid});assert.equal(m.pool[35],before+2);assertInvariants(m);});
test('Vanda virtual units can also be goldenized without inventing pool copies',()=>{const m=setup();discover(m);const uid=m.players[0].hand[0].uid;act(m,'p0',{type:'play',uid});const p=m.players[0];p.heroId='original-8';p.powerUsed=false;act(m,'p0',{type:'power',targetUid:uid});assert.equal(m.players[0].board[0].golden,true);assert.equal(m.players[0].board[0].copies,0);assertInvariants(m);});
