import { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '../shared/catalog';
import { tribeFor, tribeName, hasTribe, type CardType } from '../shared/tribes';
import type { Snapshot } from '../shared/types';
import './card-pool.css';
import { TribeSurface } from './TribeSurface';
import {KeywordBadges} from './KeywordBadges';

export function CardPool({match,onClose}:{match:Pick<Snapshot,'activeCardIds'|'activeTribes'>|null;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 const [tier,setTier]=useState(0),[query,setQuery]=useState('');
 const [tribe,setTribe]=useState<CardType|''>('');
 useEffect(()=>{dialog.current?.showModal();},[]);
 const search=query.trim().toLocaleLowerCase('hu');
 const cards=CHARACTERS.filter(c=>match?.activeCardIds?.includes(c.id));
 const matches=cards.filter(c=>(!tribe||(tribe==='all'||tribe==='neutral'?tribeFor(c)===tribe:hasTribe(c,tribe)))&&(!search||[c.name,c.text,...(c.keywords||[]),...c.tags,tribeName(tribeFor(c))].join(' ').toLocaleLowerCase('hu').includes(search)));
 const tiers=[1,2,3,4,5,6];
 const visible=matches.filter(c=>!tier||c.tier===tier);
 return <dialog ref={dialog} className="card-pool" aria-labelledby="card-pool-title" onClose={onClose} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();dialog.current?.close();}}}>
  <header className="pool-header"><div><h2 id="card-pool-title">Kártyakatalógus</h2><p>{cards.length} kártya az aktuális mérkőzésben · Szintek szerint</p></div><button type="button" onClick={()=>dialog.current?.close()} aria-label="Kártyakatalógus bezárása">Bezárás ×</button></header>
  {match?<>
  <div className="pool-filters">
   <label>Törzs<select value={tribe} onChange={e=>setTribe(e.target.value as CardType|'')}><option value="">Összes aktív törzs</option>{match.activeTribes.map(id=><option key={id} value={id}>{tribeName(id)} ({cards.filter(c=>hasTribe(c,id)).length})</option>)}<option value="neutral">Semleges (12)</option><option value="all">Minden típus (8)</option></select></label>
   <p className="pool-type-help">A minden típusú kártyák mind az öt aktív törzs szűrőjében megjelennek. A semlegesek egyik törzsnek sem tagjai.</p>
   <label>Keresés<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Név, franchise vagy képesség"/></label>
   <nav aria-label="Kártyaszint"><button type="button" aria-pressed={tier===0} onClick={()=>setTier(0)}>Összes ({matches.length})</button>{tiers.map(t=><button type="button" key={t} aria-pressed={tier===t} onClick={()=>setTier(t)}>{t}. szint ({matches.filter(c=>c.tier===t).length})</button>)}</nav>
  </div>
  <div className="pool-results" aria-live="polite"><p className="pool-count">{visible.length} kártya</p>
   {!visible.length&&<p className="pool-empty">Nincs a keresésnek megfelelő kártya ezen a szinten.</p>}
   {tiers.filter(t=>!tier||tier===t).map(t=>{
    const tierCards=matches.filter(c=>c.tier===t).sort((a,b)=>a.name.localeCompare(b.name,'hu'));
    if(!tierCards.length)return null;
    return <section key={t} className="pool-tier" aria-labelledby={`pool-tier-${t}`}><h3 id={`pool-tier-${t}`}>{t}. szint <span>{tierCards.length} kártya</span></h3><div className="pool-grid">{tierCards.map(c=><article key={c.id} className="pool-card" data-card-id={c.id} data-tier={c.tier} data-tribe={tribeFor(c)}>
     <div className="template-tier"><span>{c.tier}. szint</span><span aria-hidden="true">{'★'.repeat(c.tier)}</span></div><TribeSurface tribe={tribeFor(c)}/><div className="pool-card-content"><h4>{c.name}</h4><p className="pool-tribe">{tribeName(tribeFor(c))}</p><p className="pool-franchise">{c.tags.join(' · ')}</p><dl className="pool-stats"><div><dt>Támadás</dt><dd>{c.attack}</dd></div><div><dt>Életerő</dt><dd>{c.health}</dd></div></dl><KeywordBadges keywords={c.keywords}/><p className="pool-ability">{c.text}</p></div>
    </article>)}</div></section>;
   })}
  </div>
  </>:<p className="pool-empty">Indíts egy mérkőzést az aktív törzsek és kártyák megtekintéséhez.</p>}
 </dialog>;
}
