import {test} from 'node:test';
import assert from 'node:assert/strict';
import {combatBeats,displayedUnits,statLayers} from '../src/combat-presentation';
import type {CombatEvent,Unit} from '../shared/types';
const unit:Unit={uid:'a',characterId:1,attack:3,health:5,golden:false,shield:false,taunt:false,copies:1};
const event=(type:CombatEvent['type'],left:Unit[],extra:Partial<CombatEvent>={}):CombatEvent=>({type,text:'test',left,right:[],...extra});
test('one attack beat retains simultaneous damage and both deaths',()=>{
 const events=[event('start',[unit]),event('attack',[unit],{actor:'a',target:'b'}),event('damage',[{...unit,health:0}],{target:'a',amount:5}),event('death',[],{actor:'a'}),event('result',[])];
 const beats=combatBeats(events);assert.equal(beats.length,3);assert.equal(beats[1].events.length,3);assert.equal(beats[1].before.left[0].health,5);assert.equal(beats[1].after.left.length,0);
 assert.equal(displayedUnits(beats[1].before.left,[],false)[0].health,5);assert.equal(displayedUnits(beats[1].before.left,[],true)[0].health,0);assert.deepEqual(events[0].left,[unit]);
});
test('permanent, temporary buffs and damage stay distinguishable',()=>{
 const boosted={...unit,attack:5,health:8};const hurt={...boosted,health:3};
 const events=[event('start',[unit]),event('buff',[boosted],{target:'a'}),event('damage',[hurt],{target:'a',amount:5})];
 assert.deepEqual(statLayers(hurt,{attack:2,health:3},unit,events),{permanentAttack:1,permanentHealth:2,combatAttack:2,combatHealth:3,damaged:true});
 // Opponents use their revealed opening board, not the damaged current snapshot.
 assert.deepEqual(statLayers(hurt,{attack:2,health:3},undefined,events),statLayers(hurt,{attack:2,health:3},unit,events));
});
