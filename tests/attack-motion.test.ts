import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attackMotion} from '../src/attack-motion';
test('attacks reach the actual opposing unit center in both directions',()=>{
 for(const [from,to] of [[{x:10,y:20},{x:210,y:320}],[{x:210,y:320},{x:10,y:20}]]){
  const m=attackMotion(from,to);assert.equal(from.x+m.dx,to.x);assert.equal(from.y+m.dy,to.y);assert.ok(m.recoilX*m.dx>=0);assert.ok(m.recoilY*m.dy>=0);
 }
});
