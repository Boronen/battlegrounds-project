import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as classes from '../shared/classes';
import {act,createMatch} from '../shared/engine';
import type {Action} from '../shared/types';

test('class API exposes exactly 21 classes',()=>{
  assert.equal(Object.keys(classes).length,21);
});
test('controller preserves gameplay results and rejected-command atomicity',()=>{
  const match=new classes.MatchFactory().create(123),reference=createMatch(123);
  const controller=new classes.MatchController();
  const choose:Action={type:'chooseHero',heroId:match.players[0].heroOffers[0]};
  controller.execute(match,'p0',choose);act(reference,'p0',choose);
  const buy:Action={type:'buy',uid:match.players[0].shop[0]!.uid};
  controller.execute(match,'p0',buy);act(reference,'p0',buy);
  const play:Action={type:'play',uid:match.players[0].hand[0].uid};
  controller.execute(match,'p0',play);act(reference,'p0',play);
  assert.deepEqual(match,reference);
  const before=structuredClone(match);
  assert.throws(()=>controller.execute(match,'p0',{type:'buy',uid:'missing'}));
  assert.deepEqual(match,before);
  new classes.MatchValidator().validate(match);
});
test('catalog callers cannot mutate the shared game definitions',()=>{
  const characters=new classes.CharacterCatalog(),heroes=new classes.HeroCatalog();
  const character=characters.all()[0],original=character.name;
  character.name='changed';assert.equal(characters.find(character.id).name,original);
  const hero=heroes.all()[0],heroName=hero.name;
  hero.name='changed';assert.equal(heroes.find(hero.id)!.name,heroName);
});
