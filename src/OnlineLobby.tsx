import {useState} from 'react';
import {UsersThree} from '@phosphor-icons/react';

interface RoomMember {id:string;name:string;connected?:boolean}
export interface OnlineRoom {code:string;members:RoomMember[];host:boolean}

export function OnlineLobby({room,join,launch}:{room:OnlineRoom|null;join:(name:string,code:string)=>void;launch:()=>void}){
 const [name,setName]=useState(''),[code,setCode]=useState('');
 return <section className="entry-card" aria-label="Online meghívás">
  <h2>Meghívókódos játék</h2>
  {room?<><strong>Szobakód: {room.code}</strong><p className="entry-members">{room.members.map(m=>m.name+(m.connected===false?' (lecsatlakozott)':'')).join(' · ')}</p>
   {room.host&&<button onClick={launch} disabled={!room.members.some(m=>m.connected!==false)}>Közös meccs indítása</button>}</>:
   <form onSubmit={event=>{event.preventDefault();join(name,code);}}>
    <p>Oszd meg a szobakódot, vagy csatlakozz a barátaidhoz.</p>
    <div className="entry-fields">
     <label>Név<input value={name} onChange={e=>setName(e.target.value)} maxLength={30}/></label>
     <label>Meghívókód<input aria-label="Meghívókód (üresen új szoba)" value={code} onChange={e=>setCode(e.target.value)} placeholder="Üresen új szoba" maxLength={8}/></label>
    </div>
    <button type="submit"><UsersThree size={18} aria-hidden="true"/> Szoba létrehozása / csatlakozás</button>
   </form>}
 </section>;
}
