import {type ReactNode} from 'react';
import {GameIcon} from "./GameIcon";

interface LobbyProps {
 seed:string;
 setSeed:(value:string)=>void;
 mode:'manual'|'timed';
 setMode:(value:'manual'|'timed')=>void;
 connected:boolean;
 start:()=>void;
 online:ReactNode;
}

export function Lobby({seed,setSeed,mode,setMode,connected,start,online}:LobbyProps){
 return <section className="entry-lobby" aria-labelledby="lobby-title">
  <div className="entry-content">
   <header className="entry-heading"><h1 id="lobby-title">Játék indítása</h1><span className={`connection ${connected?'online':''}`}>{connected?'Szerver online':'Kapcsolódás…'}</span></header>
   <div className="entry-modes">
    <section className="entry-card">
     <h2>Egyjátékos mérkőzés</h2>
     <p>Válassz hőst, és építs csapatot hét bot ellen.</p>
     <div className="entry-fields">
      <label>Játékmód<select value={mode} onChange={e=>setMode(e.target.value as typeof mode)}><option value="manual">Kézi körök</option><option value="timed">Időzített körök</option></select></label>
      <label>Kezdőérték (opcionális)<input value={seed} onChange={e=>setSeed(e.target.value)} placeholder="Véletlen" inputMode="numeric"/></label>
     </div>
     <button className="primary start-button" onClick={start} disabled={!connected}><GameIcon name="swords" size={17} /> Mérkőzés indítása</button>
    </section>
    {online}
   </div>
  </div>
 </section>;
}
