import {ARENAS} from './arenas';

export function Lobby({seed,setSeed,mode,setMode,connected,start}:{seed:string;setSeed:(value:string)=>void;mode:'manual'|'timed';setMode:(value:'manual'|'timed')=>void;connected:boolean;start:()=>void}) {
 return <section className="lobby" aria-labelledby="lobby-title">
  <div className="lobby-copy"><span className="eyebrow"><i/> NYOLC JÁTÉKOS. EGY GYŐZTES.</span>
   <h1 id="lobby-title">Az utolsó padból<br/><span>az első helyre.</span></h1>
   <p>Állítsd össze a csapatod. Találd meg a váratlan párosításokat. A következő nagy fordulat a te kezedben van.</p>
   <button className="primary start-button" onClick={start} disabled={!connected}>Mérkőzés indítása <span aria-hidden="true">↗</span></button>
   <div className="start-settings"><label>Játékmód<select value={mode} onChange={e=>setMode(e.target.value as typeof mode)}><option value="manual">Tesztmód • kézi körök</option><option value="timed">Normál • időzített körök</option></select></label><label>Kezdőérték (opcionális)<input aria-label="Kezdőérték" value={seed} onChange={e=>setSeed(e.target.value)} placeholder="Minden meccsen új" inputMode="numeric"/></label></div>
   <small>1 játékos + 7 bot <span>·</span> Saját karakterek <span>·</span> Ingyenes demó</small>
  </div>
  <div className="lobby-art"><img src="/boards/tribes/dragons.webp" alt="Sárkányokkal és arannyal szegélyezett festett játékaréna"/><div className="lobby-art-caption"><span>TERVEZZ. ALKALMAZKODJ. GYŐZZ.</span><strong>Minden kör új lehetőség.</strong><small>Tíz világ. Számtalan csapat.</small></div><span className="art-index">01 / 10 — DRAGONS</span></div>
  <div className="lobby-details"><div><b>35</b><span>egyedi hős</span></div><div><b>357</b><span>kártyaterv</span></div><div><b>10</b><span>festett aréna</span></div><p>A jó stratégia egyetlen döntéssel kezdődik.<br/><span>Válassz hőst, és foglald el a helyed az asztalnál.</span></p></div>
  <div className="arena-gallery" aria-label="Arénavilágok">{ARENAS.slice(0,4).map(a=><figure key={a.id}><img src={a.image} alt="" loading="lazy"/><figcaption>{a.name}<span>Arénavilág</span></figcaption></figure>)}</div>
 </section>;
}
