import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fight} from '../shared/combat';
import type {Unit} from '../shared/types';

const unit=(uid:string,attack:number,health:number):Unit=>({uid,characterId:35,attack,health,golden:true,taunt:true,shield:true,keywords:['reborn'],copies:3});
for(const stat of ['health','attack'] as const){
 test('opening copy selects '+stat+' and leaves recruitment board intact',()=>{
  const board=[unit('a',2,20),unit('b',9,4),unit('c',9,20)];
  const before=structuredClone(board);
  const result=fight(board,[unit('enemy',1,1)],42,{openingCopies:[stat]});
  const summon=result.events.find(e=>e.type==='summon')!;
  const source=stat==='health'?board[0]:board[1];
  assert.equal(summon.actor,source.uid);
  const copy=summon.left.at(-1)!;
  assert.deepEqual({...copy,uid:source.uid,copies:3},source);
  assert.deepEqual(board,before);
 });
}
test('full and empty boards do not summon opening copies',()=>{
 for(const size of [0,7]){
  const board=Array.from({length:size},(_,i)=>unit('u'+i,1,1));
  const result=fight(board,[],42,{openingCopies:['health']});
  assert.equal(result.events.filter(e=>e.type==='summon').length,0);
 }
});
test('both sides summon at combat start',()=>{
 const result=fight([unit('a',1,2)],[unit('b',2,1)],42,{openingCopies:['health','attack']});
 assert.equal(result.events.filter(e=>e.type==='summon'&&e.text==='A hősképesség másolatot idézett erre a harcra.').length,2);
});
