import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,character} from '../shared/catalog';
import {fight} from '../shared/combat';
import {makeUnit,createMatch,act,assertInvariants} from '../shared/engine';
import {KEYWORD_DESIGNS} from '../shared/keyword-designs';
import type {Character,Unit} from '../shared/types';
import {pick,random} from '../shared/random';
const dummy=CHARACTERS.find(c=>c.name==='Padme Amidala')!;
function unit(uid:string,props:Partial<Unit>={}):Unit{return {uid,characterId:dummy.id,attack:2,health:10,golden:false,shield:false,taunt:false,copies:1,keywords:[],...props};}
const attacks=(r:ReturnType<typeof fight>)=>r.events.filter(e=>e.type==='attack');

test('24 distinct keyword cards replace old effects without moving tiers or tribes',()=>{
 assert.equal(KEYWORD_DESIGNS.length,24);
 for(const key of (['stealth','windfury','venomous','reborn'] as const))assert.equal(CHARACTERS.filter(c=>c.keywords?.includes(key)).length,6);
 for(const d of KEYWORD_DESIGNS){const c=CHARACTERS.find(c=>c.name===d.name)!;assert.deepEqual(c.keywords,[d.keyword]);assert.equal(c.ability.trigger,'passive');}
});

test('stealth ignores taunt until revealed, survives area targeting and cannot deadlock combat',()=>{
 for(let seed=1;seed<=30;seed++){
  const r=fight([unit('a'),unit('b'),unit('c')],[unit('hidden',{taunt:true,keywords:['stealth']}),unit('visible')],seed);
  assert.equal(attacks(r)[0].target,'visible');
 }
 const r=fight([unit('a',{keywords:['stealth']})],[unit('b',{keywords:['stealth']})],3);
 assert.ok(attacks(r).length>0);assert.ok(r.events.some(e=>e.type==='keyword'));
 const storm=CHARACTERS.find(c=>c.name==='Dark Dragon')!;
 const area=fight([unit('storm',{characterId:storm.id})],[unit('hidden',{keywords:['stealth']})],1);
 assert.ok(area.events.some(e=>e.type==='damage'&&e.target==='hidden'));
});

test('windfury attacks consecutively, retargets, and stops when the original attacker dies',()=>{
 const r=fight([unit('wind',{attack:10,health:100,keywords:['windfury']}),unit('support',{attack:0})],[unit('x',{attack:0,health:5}),unit('y',{attack:0,health:5})],1);
 const turns=attacks(r);assert.equal(turns.length,2);assert.equal(turns[0].actor,'wind');assert.equal(turns[1].actor,'wind');assert.notEqual(turns[0].target,turns[1].target);
 const dead=fight([unit('wind',{health:1,keywords:['windfury']}),unit('support')],[unit('x',{attack:20,health:100})],1);
 assert.equal(attacks(dead).filter(e=>e.actor==='wind').length,1);
});

test('venom is spent once, works on retaliation, and shields and zero damage preserve it',()=>{
 const r=fight([unit('v',{attack:1,health:100,keywords:['venomous']}),unit('idle',{attack:0})],[unit('x',{attack:0,health:100,shield:true})],1);
 const shield=r.events.find(e=>e.type==='shield')!;assert.ok(shield.left.find(u=>u.uid==='v')?.keywords?.includes('venomous'));
 assert.equal(r.events.filter(e=>e.type==='keyword'&&e.actor==='v').length,1);
 const retaliate=fight([unit('attacker',{attack:1,health:100}),unit('idle',{attack:0})],[unit('v',{attack:1,health:100,keywords:['venomous']})],1);
 assert.ok(retaliate.events.some(e=>e.type==='keyword'&&e.actor==='v'&&e.target==='attacker'));
 const both=fight([unit('a',{attack:1,health:100,keywords:['venomous']})],[unit('b',{attack:1,health:100,keywords:['venomous']})],1);
 assert.equal(both.winner,null);assert.equal(both.events.filter(e=>e.type==='keyword').length,2);
 const zero=fight([unit('zero',{attack:0,keywords:['venomous']})],[unit('b',{attack:1,health:100})],1);
 assert.equal(zero.events.filter(e=>e.type==='keyword').length,0);
});

test('reborn returns once with base golden attack, 1 health, no buffs or other keywords',()=>{
 const r=fight([unit('r',{attack:99,health:1,golden:true,keywords:['reborn','windfury','venomous','stealth']})],[unit('enemy',{attack:100,health:1000})],1);
 const e=r.events.find(e=>e.type==='summon'&&e.actor==='r')!;assert.ok(e);
 const revived=e.left.find(u=>u.uid===e.target)!;
 assert.equal(revived.attack,dummy.attack*2);assert.equal(revived.health,1);assert.deepEqual(revived.keywords,[]);assert.equal(revived.shield,false);assert.equal(revived.taunt,false);
 assert.equal(r.events.filter(e=>e.type==='summon').length,1);
});

test('reborn shares capacity with deathrattles and does not carry the original windfury turn',()=>{
 const summoned:Character={...dummy,ability:{name:'test',trigger:'death',effect:'summon',target:'self'}};
 const r=fight([unit('r',{health:1,keywords:['reborn','windfury'] }),...Array.from({length:6},(_,i)=>unit('ally'+i,{attack:0}))],[unit('enemy',{attack:100,health:100})],1,{catalog:id=>id===dummy.id?summoned:character(id)});
 assert.ok(r.events.every(e=>e.left.length<=7&&e.right.length<=7));
 assert.equal(r.events.filter(e=>e.type==='summon'&&e.text.includes('1 életerő')).length,0);
 const normal=fight([unit('r',{health:1,keywords:['reborn','windfury']}),unit('support')],[unit('enemy',{attack:100,health:100})],1);
 const turns=attacks(normal);assert.equal(turns[0].actor,'r');assert.equal(turns[1].actor,'enemy');
});

test('keyword combats are deterministic, recording does not affect outcomes, recruitment is unchanged',()=>{
 for(let seed=1;seed<=40;seed++){
  const left=[unit('a',{keywords:['windfury']}),unit('b',{keywords:['reborn']}),unit('c',{keywords:['stealth']})],right=[unit('d',{keywords:['venomous']}),unit('e',{shield:true})];
  const before=structuredClone([left,right]);const a=fight(left,right,seed),b=fight(left,right,seed,{recordEvents:false});
  assert.deepEqual(a,fight(left,right,seed));assert.equal(a.winner,b.winner);assert.deepEqual(a.survivors,b.survivors);assert.deepEqual([left,right],before);
 }
 const m=createMatch(5);act(m,'p0',{type:'chooseHero',heroId:m.players[0].heroOffers[0]});
 const c=CHARACTERS.find(c=>c.name==='Ashen One')!;const u=makeUnit(m,c.id,true);assert.deepEqual(u.keywords,['reborn']);
 assertInvariants(m);
});

test('reborn keeps its position relative to surviving neighbors after a simultaneous death batch',()=>{
 const storm=CHARACTERS.find(c=>c.name==='Dark Dragon')!;
 const r=fight([unit('first',{health:1}),unit('reborn',{health:1,keywords:['reborn']}),unit('survivor',{health:30,attack:0})],[unit('storm',{characterId:storm.id,attack:0})],1);
 const e=r.events.find(e=>e.type==='summon'&&e.actor==='reborn')!;
 assert.ok(e);assert.equal(e.left[0].uid,e.target);assert.equal(e.left[1].uid,'survivor');
});

test('mixed keyword boards remain bounded and deterministic with golden cards, buffs, shields and taunts',()=>{
 const cards=CHARACTERS.filter(c=>c.keywords?.length);
 for(let seed=1;seed<=120;seed++){
  const rng={rng:Math.imul(seed,2654435761)>>>0};
  const board=(side:string)=>Array.from({length:7},(_,i)=>{
   const c=pick(rng,cards),golden=random(rng)<.3,m=golden?2:1;
   return unit(side+i,{characterId:c.id,attack:c.attack*m+Math.floor(random(rng)*10),health:c.health*m+Math.floor(random(rng)*10),golden,keywords:[...c.keywords!],shield:random(rng)<.25,taunt:random(rng)<.2});
  });
  const left=board('l'),right=board('r'),before=structuredClone([left,right]);
  const result=fight(left,right,seed);
  assert.ok(attacks(result).length<=500);
  for(const event of result.events)for(const side of [event.left,event.right]){
   assert.ok(side.length<=7);assert.equal(new Set(side.map(u=>u.uid)).size,side.length);
   assert.ok(side.every(u=>Number.isFinite(u.attack)&&Number.isFinite(u.health)));
  }
  const again=fight(left,right,seed,{recordEvents:false});assert.equal(result.winner,again.winner);assert.deepEqual(result.survivors,again.survivors);assert.deepEqual([left,right],before);
 }
});
