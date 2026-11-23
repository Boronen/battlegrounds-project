import type {Snapshot} from '../shared/types';
interface OnlineRoom {members:{id:string;connected?:boolean}[]}
import {HeroPortrait} from './HeroPortrait';
import {HeroMediaBadges} from './HeroMediaBadges';

export function Standings({state,room}:{state:Snapshot;room:OnlineRoom|null}){
 const seats=[...state.standings].sort((a,b)=>(a.place||0)-(b.place||0)||(b.hp+b.armor)-(a.hp+a.armor));
 return <aside className="standings" aria-label="Tabella">
  <h2>Az asztalnál</h2>
  {seats.map((p,i)=>{
   const self=p.id===state.you.id;
   const bot=!self&&!room?.members.some(m=>m.id===p.id&&m.connected!==false);
   return <div key={p.id} className={`standing ${self?'self':''} ${p.hp<=0?'eliminated':''} ${state.opponent?.id===p.id?'opponent':''}`}>
    <span className="standing-rank">{p.place||i+1}</span>
    <div className="mini-portrait">{p.heroId?<HeroPortrait id={p.heroId}/>:<span>?</span>}</div>
    <div><strong>{p.name}<HeroMediaBadges id={p.heroId}/></strong><small>{p.place?`${p.place}. hely`:`${'★'.repeat(p.tier)}${bot?' · Bot':''}`}</small></div>
    <span className="standing-health">{Math.max(0,p.hp)}<small>{p.armor?`◈ ${p.armor}`:'♥'}</small></span>
   </div>;
  })}
  {state.opponent&&<p className="standings-note">Következő ellenfél<br/><strong>{state.opponent.name}</strong></p>}
 </aside>;
}
