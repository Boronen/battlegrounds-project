import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {ARENAS,arenaForMatch} from '../src/arenas';

test('all ten tribe arenas have local assets',()=>{
  assert.equal(ARENAS.length,10);
  assert.equal(new Set(ARENAS.map(a=>a.id)).size,10);
  for(const arena of ARENAS) assert.ok(existsSync(`public${arena.image}`),arena.image);
});
test('random match IDs reach all arenas and remain stable when resumed',()=>{
  const seen=new Set<string>();
  for(let i=0;i<1000;i++){
    const id=`match-${randomUUID()}`;
    const arena=arenaForMatch(id);
    seen.add(arena.id);
    assert.equal(arenaForMatch(id),arena);
  }
  assert.equal(seen.size,10);
});
