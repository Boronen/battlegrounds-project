import { createHash, randomUUID } from 'node:crypto';
import { act, advance, autoplay, createMatch, RuleError } from '../shared/engine';
import { RULES } from '../shared/rules';
import type { Ack, Command, Match, Replay, Snapshot } from '../shared/types';
export const digest=(m:Match)=>createHash('sha256').update(JSON.stringify(m)).digest('hex');
export class Session {
 token=randomUUID(); match:Match; entries:Replay['actions']=[]; receipts=new Map<string,{payload:string;ack:Ack}>();
 deadline:number|null=null; paused=false; touched=Date.now();
 constructor(seed:number,mode:Match['mode']){this.match=createMatch(seed,mode);this.match.id=`match-${randomUUID()}`;this.setDeadline();}
 setDeadline(){this.deadline=this.match.mode==='timed'&&!this.paused&&this.match.phase!=='finished'?Date.now()+(this.match.phase==='hero'?RULES.heroMs:this.match.phase==='recruit'?RULES.recruitMs:RULES.combatMs):null;}
 command(cmd:Command):Ack{
  const m=this.match;const payload=JSON.stringify(cmd);const existing=this.receipts.get(cmd?.commandId);
  if(existing)return existing.payload===payload?existing.ack:{ok:false,version:m.version,code:'ID_REUSE',message:'A parancsazonosító eltérő kéréssel már szerepel.'};
  let ack:Ack;
  try{
   if(!cmd||typeof cmd.commandId!=='string'||cmd.commandId.length<1||cmd.commandId.length>100||!Number.isInteger(cmd.expectedVersion)||!validAction(cmd.action))throw new RuleError('INVALID','Hibás parancs.');
   if(this.receipts.size>=10000)throw new RuleError('LIMIT','A demó parancskorlátja elfogyott.');
   if(cmd.expectedVersion!==m.version)throw new RuleError('STALE','Az állapot megváltozott. Frissítettük a táblát.');
   if(this.deadline!==null&&Date.now()>=this.deadline)throw new RuleError('EXPIRED','A szakasz ideje lejárt.');
   const previous=m.phase;act(m,'p0',cmd.action);this.entries.push({kind:'command',playerId:'p0',action:structuredClone(cmd.action)});
   if(previous!==m.phase)this.setDeadline();
   ack={ok:true,version:m.version};
  }catch(e){ack={ok:false,version:m.version,code:e instanceof RuleError?e.code:'INVALID',message:e instanceof Error?e.message:'Hibás kérés.'};}
  if(typeof cmd?.commandId==='string'&&cmd.commandId.length<=100&&this.receipts.size<10000)this.receipts.set(cmd.commandId,{payload,ack});
  this.touched=Date.now();return ack;
 }
 advance(auto=false){if(this.match.phase==='finished')return;if(auto){autoplay(this.match);this.entries.push({kind:'autoplay'});}else{advance(this.match);this.entries.push({kind:'advance'});}this.setDeadline();this.touched=Date.now();}
 snapshot():Snapshot{
  const m=this.match,p=m.players[0];const pair=m.pairings.find(pair=>pair.includes(p.id));const opponent=m.players.find(x=>x.id===pair?.find(id=>id!==p.id));
  const standing=(x:Match['players'][number])=>({id:x.id,name:x.name,heroId:x.heroId,hp:x.hp,armor:x.armor,tier:x.tier,place:x.place,boardCount:x.board.length});
  return {matchId:m.id,version:m.version,ruleset:RULES.id,seed:m.seed,round:m.round,phase:m.phase,mode:m.mode,deadline:this.deadline,paused:this.paused,you:structuredClone(p),standings:m.players.map(standing),opponent:opponent?standing(opponent):null,battle:m.phase==='combat'?structuredClone(m.battles.find(b=>b.leftId===p.id||b.rightId===p.id)||null):null,log:m.log.slice(-30)};
 }
 replay():Replay{return{format:1,matchId:this.match.id,ruleset:RULES.id,catalogVersion:RULES.catalogVersion,seed:this.match.seed,mode:this.match.mode,actions:structuredClone(this.entries),finalDigest:digest(this.match)};}
}
export function validAction(a:unknown):boolean{
 if(!a||typeof a!=='object')return false;const x=a as Record<string,unknown>;const id=(v:unknown)=>typeof v==='string'&&v.length>0&&v.length<100;
 switch(x.type){
  case 'chooseHero':return id(x.heroId);
  case 'buy':case 'sell':case 'discover':return id(x.uid);
  case 'play':return id(x.uid)&&(x.position===undefined||Number.isInteger(x.position))&&(x.targetUid===undefined||id(x.targetUid));
  case 'reorder':return Array.isArray(x.uids)&&x.uids.length<=7&&x.uids.every(id);
  case 'power':return x.targetUid===undefined||id(x.targetUid);
  case 'refresh':case 'freeze':case 'upgrade':case 'ready':return true;
  default:return false;
 }
}
export function replayMatch(input:unknown){
 const r=input as Replay;
 if(!r||r.format!==1||typeof r.matchId!=='string'||r.matchId.length>100||r.matchId.length<1||r.ruleset!==RULES.id||r.catalogVersion!==RULES.catalogVersion||!Number.isInteger(r.seed)||!['manual','timed'].includes(r.mode)||!Array.isArray(r.actions)||r.actions.length>10000)throw new Error('Nem támogatott vagy hibás visszajátszás.');
 const m=createMatch(r.seed,r.mode);m.id=r.matchId;
 for(const e of r.actions){if(e.kind==='advance')advance(m);else if(e.kind==='autoplay')autoplay(m);else if(e.kind==='command'&&e.playerId==='p0'&&validAction(e.action))act(m,'p0',e.action);else throw new Error('Hibás visszajátszási lépés.');}
 const actual=digest(m);if(actual!==r.finalDigest)throw new Error('Az eredmény ellenőrzőösszege eltér.');return m;
}
