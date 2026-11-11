import express from 'express';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { Server } from 'socket.io';
import { createServer as createVite } from 'vite';
import { Session, replayMatch } from './session';
import type { Command, Control } from '../shared/types';

export async function createApp(production=false){
 const app=express();const http=createServer(app);const io=new Server(http,{maxHttpBufferSize:100000,serveClient:false});const sessions=new Map<string,Session>();
 app.use(express.json({limit:'2mb'}));app.get('/api/health',(_,res)=>res.json({ok:true}));
 app.post('/api/replays/verify',(req,res)=>{try{const m=replayMatch(req.body);res.json({ok:true,round:m.round,phase:m.phase,placements:m.players.map(p=>({name:p.name,place:p.place}))});}catch(e){res.status(422).json({ok:false,error:e instanceof Error?e.message:'Hibás fájl.'});}});
 const emit=(s:Session)=>io.to(s.token).emit('snapshot',s.snapshot());
 io.on('connection',socket=>{
  let session:Session|undefined;let requests=0;let windowStart=Date.now();
  const limited=()=>{if(Date.now()-windowStart>1000){windowStart=Date.now();requests=0;}return ++requests>30;};
  const resume=socket.handshake.auth?.token;if(typeof resume==='string'&&sessions.has(resume)){session=sessions.get(resume)!;session.touched=Date.now();socket.join(resume);socket.emit('snapshot',session.snapshot());}
  socket.on('start',(input,ack)=>{
   if(typeof ack!=='function'||limited())return;
   if(sessions.size>=30){ack({ok:false,message:'A demószerver megtelt. Próbáld később.'});return;}
   const seed=Number(input?.seed);if(!Number.isInteger(seed)||seed<1||seed>4294967295||!['manual','timed'].includes(input?.mode)){ack({ok:false,message:'Hibás kezdőérték vagy mód.'});return;}
   if(session){socket.leave(session.token);sessions.delete(session.token);}
   session=new Session(seed,input.mode);sessions.set(session.token,session);socket.join(session.token);ack({ok:true,token:session.token});emit(session);
  });
  socket.on('command',(cmd:Command,ack)=>{if(typeof ack!=='function')return;if(!session||limited()){ack({ok:false,code:'SESSION',message:'Nincs aktív kapcsolat.'});return;}ack(session.command(cmd));emit(session);});
  socket.on('control',(control:Control,ack)=>{
   if(typeof ack!=='function')return;if(!session||limited()){ack({ok:false});return;}
   if(control==='pause'){session.paused=true;session.deadline=null;}
   else if(control==='resume'){session.paused=false;session.setDeadline();}
   else if(control==='step'||control==='finishCombat'||control==='autoplay'){
    if(control==='finishCombat'&&session.match.phase!=='combat'){ack({ok:false});return;}
    if(session.match.mode!=='manual'&&control==='step'){ack({ok:false,message:'Kézi léptetés tesztmódban használható.'});return;}
    session.advance(control==='autoplay');
   }else{ack({ok:false});return;}
   ack({ok:true});emit(session);
  });
  socket.on('export',ack=>{if(typeof ack==='function'&&session)ack(session.replay());});
 });
 const ticker=setInterval(()=>{for(const [token,s] of sessions){if(Date.now()-s.touched>3600000){sessions.delete(token);continue;}if(s.deadline!==null&&Date.now()>=s.deadline){s.advance();emit(s);}}},200);
 let vite:Awaited<ReturnType<typeof createVite>>|undefined;
 if(production)app.use(express.static(resolve('dist')));else{vite=await createVite({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
 return {http,io,sessions,close:async()=>{clearInterval(ticker);await vite?.close();await new Promise<void>(r=>io.close(()=>r()));}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const server=await createApp(process.env.NODE_ENV==='production');const port=Number(process.env.PORT||5173);server.http.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Csatatér: http://localhost:${port}`));
 const stop=async()=>{await server.close();process.exit(0);};process.once('SIGINT',stop);process.once('SIGTERM',stop);
}
