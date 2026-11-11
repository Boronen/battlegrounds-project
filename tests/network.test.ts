import {test} from 'node:test';
import assert from 'node:assert/strict';
import {io as client} from 'socket.io-client';
import {createApp} from '../server/index';
import type {Snapshot} from '../shared/types';
test('Socket command ACK, isolation, conflicting IDs and authenticated resume',async()=>{
 const server=await createApp(true);await new Promise<void>(r=>server.http.listen(0,'127.0.0.1',r));const addr=server.http.address() as {port:number};const url=`http://127.0.0.1:${addr.port}`;const sockets:ReturnType<typeof client>[]=[];
 const connect=async(token?:string)=>{const socket=client(url,{auth:{token},transports:['websocket'],autoConnect:false});sockets.push(socket);const ready=new Promise<void>(r=>socket.once('connect',()=>r()));socket.connect();await ready;return socket;};
 try{
  const a=await connect();let state:Snapshot;const stateReady=new Promise<void>(r=>a.once('snapshot',s=>{state=s;r();}));const start=await a.timeout(3000).emitWithAck('start',{seed:123,mode:'manual'});await stateReady;
  const cmd={commandId:'hero',expectedVersion:state!.version,action:{type:'chooseHero',heroId:state!.you.heroOffers[0]}};
  const snapReady=new Promise<Snapshot>(r=>a.once('snapshot',r));const ack=await a.timeout(3000).emitWithAck('command',cmd);assert.equal(ack.ok,true);const recruit=await snapReady;assert.equal(recruit.phase,'recruit');
  assert.deepEqual(await a.timeout(3000).emitWithAck('command',cmd),ack);
  assert.equal((await a.timeout(3000).emitWithAck('command',{...cmd,expectedVersion:100})).code,'ID_REUSE');
  assert.equal((await a.timeout(3000).emitWithAck('command',{commandId:'stale',expectedVersion:0,action:{type:'refresh'}})).code,'STALE');
  const outsider=await connect('not-the-token');assert.equal((await outsider.timeout(3000).emitWithAck('command',cmd)).code,'SESSION');
  a.disconnect();const resume=client(url,{auth:{token:start.token},transports:['websocket'],autoConnect:false});sockets.push(resume);const snapshot=new Promise<Snapshot>(r=>resume.once('snapshot',r));resume.connect();const restored=await snapshot;assert.equal(restored.version,recruit.version);assert.equal(restored.you.shop[0]!.uid,recruit.you.shop[0]!.uid);assert.equal('pool' in restored,false);assert.ok(restored.standings.every(p=>!('hand' in p)));
  const replay=await resume.timeout(3000).emitWithAck('export');const response=await fetch(`${url}/api/replays/verify`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(replay)});assert.equal(response.status,200);assert.equal((await response.json() as {ok:boolean}).ok,true);
 }finally{sockets.forEach(s=>s.disconnect());await server.close();}
});
test('timed phases advance on the server and pause survives reconnect snapshot',async()=>{
 const server=await createApp(true);await new Promise<void>(r=>server.http.listen(0,'127.0.0.1',r));const addr=server.http.address() as {port:number};const socket=client(`http://127.0.0.1:${addr.port}`,{transports:['websocket'],autoConnect:false});
 const next=(phase:string)=>new Promise<Snapshot>((resolve,reject)=>{const timeout=setTimeout(()=>{socket.off('snapshot',receive);reject(new Error('Timed phase did not advance'));},3000);const receive=(s:Snapshot)=>{if(s.phase===phase){clearTimeout(timeout);socket.off('snapshot',receive);resolve(s);}};socket.on('snapshot',receive);});
 try{
  const ready=new Promise<void>(r=>socket.once('connect',()=>r()));socket.connect();await ready;
  const ack=await socket.timeout(3000).emitWithAck('start',{seed:555,mode:'timed'});const session=server.sessions.get(ack.token)!;
  const recruit=next('recruit');session.deadline=Date.now()-1;await recruit;
  const paused=new Promise<Snapshot>(r=>socket.once('snapshot',r));await socket.timeout(3000).emitWithAck('control','pause');const snap=await paused;assert.equal(snap.paused,true);assert.equal(snap.deadline,null);
  await socket.timeout(3000).emitWithAck('control','resume');const combat=next('combat');session.deadline=Date.now()-1;await combat;
  const roundTwo=next('recruit');session.deadline=Date.now()-1;assert.equal((await roundTwo).round,2);
  assert.equal(session.replay().actions.filter(e=>e.kind==='advance').length,3);
 }finally{socket.disconnect();await server.close();}
});
