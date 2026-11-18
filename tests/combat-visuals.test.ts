import {test} from 'node:test';
import assert from 'node:assert/strict';
import {combatBeats} from '../src/combat-presentation';
import {combatVisuals} from '../src/combat-visuals';
import {fight} from '../shared/combat';
import type {Unit,Character} from '../shared/types';

const unit=(uid:string,extra:Partial<Unit>={}):Unit=>({uid,characterId:1,attack:3,health:8,golden:false,shield:false,taunt:false,copies:1,...extra});
const catalog=():Character=>({id:1,name:'test',portrait:'',tags:[],tier:1,attack:3,health:8,text:'',ability:{name:'',trigger:'passive',effect:'buff',target:'self'}});
const effects=(left:Unit[],right:Unit[])=>combatBeats(fight(left,right,42,{catalog}).events).flatMap(combatVisuals);

test('shield absorbs a venomous strike without a venom burst; later consumption has a burst',()=>{
 const beats=combatBeats(fight([unit('a',{keywords:['venomous']})],[unit('b',{shield:true,attack:0,health:20})],42,{catalog}).events);
 const shield=beats.find(b=>b.events.some(e=>e.type==='shield'))!;
 assert.ok(combatVisuals(shield).some(v=>v.kind==='shield-break'));
 assert.ok(!combatVisuals(shield).some(v=>v.kind==='venom'));
 assert.ok(beats.flatMap(combatVisuals).some(v=>v.kind==='venom'&&v.uid==='b'));
});
test('reborn has its own effect and anchors to the dead source',()=>{
 const list=effects([unit('a',{attack:10})],[unit('b',{health:2,keywords:['reborn']})]);
 const reborn=list.find(v=>v.kind==='reborn');assert.ok(reborn);assert.equal(reborn.anchor,'b');assert.ok(reborn.uid.startsWith('b-reborn-'));
 assert.ok(list.some(v=>v.kind==='death'&&v.uid==='b'));
});
test('stealth reveal and windfury derive from keyword state without event text',()=>{
 const events=fight([unit('a',{keywords:['stealth','windfury'],health:40})],[unit('b',{health:30,attack:1})],42,{catalog}).events;
 events.forEach(e=>e.text='');
 const list=combatBeats(events).flatMap(combatVisuals);
 assert.ok(list.some(v=>v.kind==='stealth'));assert.ok(list.some(v=>v.kind==='windfury'));
});
test('shield gain, buffs and summons are detected from event snapshots',()=>{
 const a=unit('a'),b=unit('b');
 const start={type:'start' as const,text:'',left:[a],right:[]};
 const buff={...start,type:'buff' as const,target:'a',left:[{...a,shield:true,attack:4}]};
 const summon={...buff,type:'summon' as const,actor:'a',target:undefined,left:[...buff.left,b]};
 const list=combatBeats([start,buff,summon]).flatMap(combatVisuals);
 assert.ok(list.some(v=>v.kind==='shield-gain'));assert.ok(list.some(v=>v.kind==='buff'));assert.ok(list.some(v=>v.kind==='summon'&&v.uid==='b'));
});
