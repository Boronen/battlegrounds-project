import {randomBytes,randomInt} from 'node:crypto';
import type {Server} from 'socket.io';
import {Session} from './session';
import type {Command} from '../shared/types';
export function attachRooms(io:Server){
 const rooms=new Map<string,{game:Session;started:boolean;members:{token:string;id:string;name:string}[];finished:Set<string>;touched:number}>();
 const clients=new Map<string,{code:string;token:string}>();
 const emit=(code:string)=>{const room=rooms.get(code);if(!room)return;for(const member of room.members){io.to(member.token).emit('onlineRoom',{code,started:room.started,host:member.id==='p0',members:room.members.map(({id,name})=>({id,name}))});if(room.started)io.to(member.token).emit('snapshot',room.game.snapshot(member.id));}};
 const connect=(socket:any,code:string,token:string)=>{clients.set(socket.id,{code,token});socket.join(token);};
 io.on('connection',socket=>{
  const auth=socket.handshake.auth?.token;for(const [code,r] of rooms)if(r.members.some(m=>m.token===auth)){connect(socket,code,auth);emit(code);break;}
  const limited=(()=>{let n=0,t=Date.now();return()=>{if(Date.now()-t>1000){n=0;t=Date.now();}return ++n>25;};})();
  socket.on('onlineJoin',(input,ack)=>{if(typeof ack!=='function'||limited())return;try{if(clients.has(socket.id))throw Error('Már szobában vagy.');const name=String(input?.name||'Játékos').trim().slice(0,30)||'Játékos';let code=String(input?.code||'').trim().toUpperCase();if(!code){if(rooms.size>=30)throw Error('A szerver megtelt.');do{code=randomBytes(5).toString('hex').slice(0,8).toUpperCase();}while(rooms.has(code));rooms.set(code,{game:new Session(randomInt(1,4294967296),'timed'),started:false,members:[],finished:new Set(),touched:Date.now()});}const room=rooms.get(code);if(!room||room.started||room.members.length>=8)throw Error('Nem létező, elindult vagy megtelt szoba.');const id=`p${room.members.length}`,token=randomBytes(32).toString('hex');room.members.push({id,token,name});const p=room.game.match.players.find(p=>p.id===id)!;p.bot=false;p.heroId=null;p.name=name;room.touched=Date.now();connect(socket,code,token);ack({ok:true,token});emit(code);}catch(e){ack({ok:false,message:(e as Error).message});}});
  socket.on('onlineLaunch',(_,ack)=>{const c=clients.get(socket.id),r=c&&rooms.get(c.code);if(!c||!r||typeof ack!=='function')return;const member=r.members.find(m=>m.token===c.token)!;if(member.id!=='p0'||r.started||r.members.length<2){ack({ok:false,message:'Csak a házigazda indíthat, legalább két játékossal.'});return;}r.started=true;ack({ok:true});emit(c.code);});
  socket.on('command',(cmd:Command,ack)=>{const c=clients.get(socket.id),r=c&&rooms.get(c.code);if(!c||!r||typeof ack!=='function'||limited())return;const member=r.members.find(m=>m.token===c.token)!;if(!r.started){ack({ok:false,message:'A szoba még nem indult.'});return;}ack(r.game.command(cmd,member.id,true));r.touched=Date.now();if(r.game.match.phase==='recruit'&&r.game.match.players.filter(p=>!p.bot&&p.hp>0).every(p=>p.ready))r.game.advance();emit(c.code);});
  socket.on('control',(control,ack)=>{const c=clients.get(socket.id),r=c&&rooms.get(c.code);if(!c||!r||typeof ack!=='function'||limited())return;if(control!=='finishCombat'||r.game.match.phase!=='combat'){ack({ok:false,message:'Online módban a tesztvezérlés tiltva van.'});return;}r.finished.add(c.token);if(r.members.every(m=>r.finished.has(m.token))){r.finished.clear();r.game.advance();}ack({ok:true});emit(c.code);});
  socket.on('export',ack=>{if(clients.has(socket.id)&&typeof ack==='function')ack({error:'Az online replay-export még nem támogatott.'});});
  socket.on('disconnect',()=>clients.delete(socket.id));
 });
 const timer=setInterval(()=>{for(const [code,r] of rooms){if(Date.now()-r.touched>3600000){rooms.delete(code);continue;}if(r.started&&r.game.deadline!==null&&Date.now()>=r.game.deadline){r.game.advance();emit(code);}}},200);
 return {has:(id:string)=>clients.has(id),close:()=>clearInterval(timer),rooms};
}
