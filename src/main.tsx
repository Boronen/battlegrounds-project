import {OnlineLobby,type OnlineRoom} from './OnlineLobby';
import {Standings} from './Standings';
import {GameDialog} from './GameDialog';
import {useCardDrag} from './useCardDrag';
import {TimingIcon} from './TimingIcon';
import {minionAbility,TRIGGER_LABELS} from '../shared/minion-effects';
import {HeroPowerPanel} from './HeroPowerPanel';
import {minionPrice,powerState,effectivePowerId} from '../shared/hero-powers';
import {MusicNote,SpeakerHigh,SpeakerSlash,SlidersHorizontal,ArrowClockwise,Snowflake,Sword,Books,UsersThree,GearSix,Sparkle,Eye,SignOut,X} from '@phosphor-icons/react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import { character, hero,unitDefinition } from '../shared/catalog';
import {RULES} from '../shared/rules';
import type { Ack, Action, Command, Control, Replay, Snapshot, Unit } from '../shared/types';
import { BattleEffects } from './BattleEffects';
import { combatBeats, displayedUnits, statLayers } from './combat-presentation';
import './style.css';
import './arena-polish.css';
import {BoardSocket} from './BoardSocket';
import {Lobby} from './Lobby';
import {gameAudio} from './audio';
import seriesAudio from './series-audio.json';
import {HeroMediaBadges} from './HeroMediaBadges';
import {HeroMusicPlayer} from './HeroMusicPlayer';
import {HeroPortrait} from './HeroPortrait';
import {HeroFrame} from './HeroFrame';
import './hero-frame.css';
import {arenaForMatch,arenaStyle} from './arenas';
import {CardPool} from './CardPool';
import {TribeSurface} from './TribeSurface';
import {KeywordBadges} from './KeywordBadges';
import {tribeFor,tribeName} from '../shared/tribes';
import './card-templates.css';
import './hero-cards.css';
import './arena-layout.css';
import './web-shell.css';
import './battle-effects.css';
import './game-screen.css';

const socket=io({autoConnect:false,auth:{token:sessionStorage.getItem('battleToken')}});
const phaseNames={hero:'Hősválasztás',recruit:'Toborzás',combat:'Harc',finished:'Eredmény'};
function App(){
 const [state,setState]=useState<Snapshot|null>(null),[connected,setConnected]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [onlineRoom,setOnlineRoom]=useState<OnlineRoom|null>(null);
 const [panel,setPanel]=useState<'powers'|'standings'|'settings'|null>(null);
 const [inspectMode,setInspectMode]=useState(false);
 const [inspected,setInspected]=useState<Unit|null>(null);
 const [compact,setCompact]=useState(()=>matchMedia('(max-width: 1050px), (max-height: 580px)').matches);
 const [poolOpen,setPoolOpen]=useState(false);
 const [smoke,setSmoke]=useState<{x:number;y:number}|null>(null);
 useEffect(()=>{if(!smoke)return;const timer=setTimeout(()=>setSmoke(null),950);return()=>clearTimeout(timer);},[smoke]);
 useEffect(()=>setSmoke(null),[state?.phase,state?.matchId]);
 const [motion,setMotion]=useState(localStorage.getItem('battleMotion')!=='reduced');
 useEffect(()=>{document.documentElement.dataset.motion=motion?'full':'reduced';localStorage.setItem('battleMotion',motion?'full':'reduced');},[motion]);
 const [sound,setSound]=useState(gameAudio.isEnabled());
 useEffect(()=>{const failed=(event:Event)=>setError((event as CustomEvent<string>).detail);window.addEventListener('battleAudioError',failed);return()=>window.removeEventListener('battleAudioError',failed);},[]);
 const [seed,setSeed]=useState(''),[mode,setMode]=useState<'manual'|'timed'>('timed');
 const [selected,setSelected]=useState<string|null>(null),[step,setStep]=useState(0),[paused,setPaused]=useState(false),[speed,setSpeed]=useState(1),[tools,setTools]=useState(false),[running,setRunning]=useState(false),[now,setNow]=useState(Date.now());
 const lastSeed=useRef<number|null>(null);
 const arenaRef=useRef<HTMLElement|null>(null);const [impactKey,setImpactKey]=useState('');
 const [replayResult,setReplayResult]=useState('');const current=useRef(state);current.current=state;const auto=useRef(false);
 useEffect(()=>{
  const onState=(s:Snapshot)=>{lastSeed.current=s.seed;setState(s);};const onConnect=()=>setConnected(true);const onDisconnect=()=>{setConnected(false);setBusy(false);};
  socket.on('onlineRoom',setOnlineRoom);socket.on('snapshot',onState);socket.on('connect',onConnect);socket.on('disconnect',onDisconnect);socket.connect();
  return()=>{socket.off('onlineRoom',setOnlineRoom);socket.off('snapshot',onState);socket.off('connect',onConnect);socket.off('disconnect',onDisconnect);socket.disconnect();};
 },[]);
 useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(t);},[]);
 useEffect(()=>{
  setStep(0);setSelected(null);setInspected(null);setInspectMode(false);
  setPanel(previous=>previous==='powers'?null:previous);
 },[state?.matchId,state?.round,state?.phase]);
 useEffect(()=>{setPaused(state?.paused||false);},[state?.paused]);
 useEffect(()=>{
  const query=matchMedia('(max-width: 1050px), (max-height: 580px)');
  const change=()=>{setCompact(query.matches);setPanel(previous=>previous==='standings'?null:previous);};
  query.addEventListener('change',change);
  return()=>query.removeEventListener('change',change);
 },[]);
 const battle=state?.battle;
 const arena=useMemo(()=>arenaForMatch(state?.matchId),[state?.matchId]);
 const beats=useMemo(()=>combatBeats(battle?.events||[]),[state?.matchId,state?.round,battle?.leftId,battle?.rightId,battle?.events.length]);
 const total=beats.length;const beat=beats[Math.min(step,total-1)];const beatKey=`${state?.matchId}:${state?.round}:${step}`;const impact=impactKey===beatKey;
 useEffect(()=>{if(state?.phase!=='combat'||paused||step>=total-1)return;const t=setTimeout(()=>setStep(i=>Math.min(i+1,total-1)),(beat?.duration||600)/speed);return()=>clearTimeout(t);},[state?.phase,total,step,paused,speed,beat]);
 useEffect(()=>{if(selected&&state&&!state.you.board.some(u=>u.uid===selected)&&!state.you.hand.some(u=>u.uid===selected))setSelected(null);},[state,selected]);
 const send=async(action:Action)=>{
  if(!connected||!current.current||busy)return false;setError('');setBusy(true);
  const smokeNode=action.type==='power'&&effectivePowerId(current.current.you)==='original-9'?Array.from(arenaRef.current?.querySelectorAll<HTMLElement>('[data-unit-id]')||[]).find(n=>n.dataset.unitId===action.targetUid):undefined;const smokeRect=smokeNode?.getBoundingClientRect(),arenaRect=arenaRef.current?.getBoundingClientRect();const smokePoint=smokeRect&&arenaRect?{x:smokeRect.left+smokeRect.width/2-arenaRect.left,y:smokeRect.top+smokeRect.height/2-arenaRect.top}:undefined;
  const playedTags=action.type==='play'?current.current.you.hand.find(u=>u.uid===action.uid)?.characterId:undefined;
  const cmd:Command={commandId:crypto.randomUUID(),expectedVersion:current.current.version,action};
  try{let ack:Ack|undefined;for(let attempt=0;attempt<3;attempt++){try{ack=await socket.timeout(3000).emitWithAck('command',cmd);break;}catch{if(attempt===2)throw new Error('A szerver nem válaszol. Ellenőrizd a kapcsolatot.');}}
   if(ack?.ok&&smokePoint)setSmoke(smokePoint);
   if(!ack?.ok)setError(ack?.message||'A művelet sikertelen.');else if(action.type==='buy')gameAudio.play('buy');else if(action.type==='play'){gameAudio.play('play');if(playedTags!==undefined)gameAudio.playSeries(character(playedTags).tags);}else if(action.type==='chooseHero'||action.type==='rerollHeroes'||action.type==='upgrade')gameAudio.play('select');else if(action.type==='power')gameAudio.play('buff');return !!ack?.ok;
  }catch(e){setError(e instanceof Error?e.message:'Kapcsolati hiba.');return false;}finally{setBusy(false);}
 };
 const control=async(c:Control)=>{try{const ack=await socket.timeout(5000).emitWithAck('control',c);if(!ack.ok)setError(ack.message||'A vezérlés nem érhető el.');return ack.ok;}catch{setError('Megszakadt a kapcsolat.');return false;}};
 const start=async()=>{let matchSeed=Number(seed);if(!seed.trim()){do {matchSeed=crypto.getRandomValues(new Uint32Array(1))[0];}while(matchSeed===0||matchSeed===lastSeed.current);}setError('');auto.current=false;setRunning(false);setPaused(false);const ack=await socket.timeout(5000).emitWithAck('start',{mode,seed:matchSeed}).catch(()=>({ok:false,message:'A szerver nem érhető el.'}));if(ack.ok){sessionStorage.setItem('battleToken',ack.token);socket.auth={token:ack.token};}else setError(ack.message);};
 const exportReplay=async()=>{if(onlineRoom){setError('Online replay-export még nem támogatott.');return;}const replay:Replay=await socket.timeout(5000).emitWithAck('export');const url=URL.createObjectURL(new Blob([JSON.stringify(replay,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`csatater-${replay.seed}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const importReplay=async(file?:File)=>{if(!file)return;try{if(file.size>2000000)throw new Error('Legfeljebb 2 MB-os fájl tölthető be.');const data=JSON.parse(await file.text());const res=await fetch('/api/replays/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await res.json();setReplayResult(result.ok?`Egyező eredmény • ${result.round}. kör • ${phaseNames[result.phase as Snapshot['phase']]}`:result.error);}catch{setReplayResult('Hibás visszajátszási fájl.');}};
 const runMatch=async()=>{if(running){auto.current=false;setRunning(false);return;}auto.current=true;setRunning(true);for(let i=0;i<130&&auto.current;i++){if(current.current?.phase==='finished')break;if(!await control('autoplay'))break;await new Promise(r=>setTimeout(r,100));}auto.current=false;setRunning(false);};
 useEffect(()=>{gameAudio.stop();},[state?.matchId,state?.phase]);
 const you=state?.you;const h=hero(you?.heroId||null);const ownBattleLeft=battle?.leftId===you?.id;const frame=beat?(impact?beat.after:beat.before):undefined;
 const leftUnits=beat?displayedUnits(beat.before.left,beat.after.left,impact):[];const rightUnits=beat?displayedUnits(beat.before.right,beat.after.right,impact):[];
 const ownChampion=(ownBattleLeft?leftUnits:rightUnits).find(u=>u.heroFighter);const enemyChampion=(ownBattleLeft?rightUnits:leftUnits).find(u=>u.heroFighter);
 const ownUnits=(state?.phase==='combat'&&frame?(ownBattleLeft?leftUnits:rightUnits):you?.board||[]).filter(u=>!u.heroFighter);
 const enemies=(frame?(ownBattleLeft?rightUnits:leftUnits):[]).filter(u=>!u.heroFighter);
 const visibleEvents=beats.slice(0,step).flatMap(b=>b.events).concat(beat?(impact?beat.events:[]):[]);
 const selectedUnit=you?[...you.board,...you.hand].find(u=>u.uid===selected):undefined;
 const handCount=you?you.hand.length+powerState(you).spellHand.length:0;
 const rewardNeedsSpace=!!you?.discover.length&&handCount>=10;
 useEffect(()=>{
  if(you?.discover.length&&!rewardNeedsSpace)setPanel(previous=>previous==='powers'?null:previous);
 },[you?.discover.length,rewardNeedsSpace]);
 const selectedInHand=you?.hand.some(u=>u.uid===selected);const canAct=connected&&state?.phase==='recruit'&&!you?.ready;
 const play=(u:Unit)=>{const ab=minionAbility(u);if((ab?.trigger==='play'&&ab.target==='other'||[-4,-5,-6].includes(u.characterId))&&you?.board.length&&!you.board.some(x=>x.uid===selected)){setSelected(u.uid);setError('Válassz egy saját egységet a táblán a kijátszási képességhez.');return;}send({type:'play',uid:u.uid,targetUid:you?.board.find(x=>x.uid===selected)?.uid});};
 const boardClick=(u:Unit)=>{if(selectedInHand&&selectedUnit){send({type:'play',uid:selectedUnit.uid,targetUid:u.uid});setSelected(null);}else setSelected(selected===u.uid?null:u.uid);};
 const move=(dir:number)=>{if(!you)return;const uids=you.board.map(u=>u.uid),i=uids.indexOf(selected||''),j=i+dir;if(i>=0&&j>=0&&j<uids.length){[uids[i],uids[j]]=[uids[j],uids[i]];send({type:'reorder',uids});}};
 useCardDrag(!!canAct&&!inspectMode,state?.round??0,(uid,from,to,target)=>{
  if(!you||busy)return;
  if(from==='shop'&&to==='hand')send({type:'buy',uid});
  if(from==='board'&&to==='sell')send({type:'sell',uid});
  const order=you.board.map(unit=>unit.uid),index=target?order.indexOf(target):order.length;
  if(to!=='board'||index<0)return;
  if(from==='hand'){
   const unit=you.hand.find(card=>card.uid===uid);
   if(!unit)return;
   if(minionAbility(unit)?.target==='other'&&order.length&&!target){play(unit);return;}
   send({type:'play',uid,position:index,targetUid:target});
  }
  if(from==='board'&&order.includes(uid)&&uid!==target){
   order.splice(order.indexOf(uid),1);order.splice(index,0,uid);send({type:'reorder',uids:order});
  }
 });
 const ropeMs=state?.phase==='recruit'&&!you?.ready&&state.deadline?state.deadline-now:0;
 const joinRoom=async(name:string,code:string)=>{
  const ack=await socket.timeout(5000).emitWithAck('onlineJoin',{name,code}).catch(()=>({ok:false,message:'A szerver nem válaszol. Próbáld újra.'}));
  if(ack.ok){sessionStorage.setItem('battleToken',ack.token);socket.auth={token:ack.token};}
  else setError(ack.message);
 };
 const launchRoom=async()=>{
  const ack=await socket.timeout(5000).emitWithAck('onlineLaunch',{}).catch(()=>({ok:false,message:'A szerver nem válaszol. Próbáld újra.'}));
  if(!ack.ok)setError(ack.message);
 };
 const leaveRoom=async()=>{
  const ack=await socket.timeout(5000).emitWithAck('onlineLeave').catch(()=>({ok:false,message:'A szerver nem válaszol. Próbáld újra.'}));
  if(ack.ok){sessionStorage.removeItem('battleToken');socket.auth={};setOnlineRoom(null);setState(null);setBusy(false);setPanel(null);}
  else setError(ack.message);
 };
 const inspect=(unit:Unit)=>{setInspectMode(false);setInspected(unit);};
 const inspectedCard=inspected&&unitDefinition(inspected);
 const unitCard=(u:Unit,area:string,index:number)=>{
  const c=unitDefinition(u);const active=beat?.events[0].type==='attack'&&beat.events[0].actor===u.uid;
  const layers=statLayers(u,{attack:c.attack*(u.golden?2:1),health:c.health*(u.golden?2:1)},area==='board'?you?.board.find(x=>x.uid===u.uid):undefined,state?.phase==='combat'?visibleEvents:[]);
  const permanent=layers.permanentAttack>0||layers.permanentHealth>0,temporary=layers.combatAttack>0||layers.combatHealth>0;
  return <div key={u.uid} data-unit-id={u.uid} className={`unit-wrap ${area} ${selected===u.uid?'selected':''} ${active?'attacking':''} ${u.health<=0?'dying':''} ${temporary?'combat-buffed':''} ${permanent?'permanent-buffed':''}`}>
   <button data-tribe={tribeFor(c)} className={`unit ${u.golden?'golden':''} ${u.shield?'shielded':''} ${u.taunt?'taunt':''}`} draggable={false} onContextMenu={e=>{e.preventDefault();inspect(u);}} onClick={()=>inspectMode?inspect(u):area==='shop'?send({type:'buy',uid:u.uid}):area==='hand'?play(u):area==='board'?boardClick(u):undefined} disabled={!inspectMode&&((area==='shop'&&(!canAct||you!.gold<minionPrice(you!,u)||you!.hand.length+powerState(you!).spellHand.length>=10))||(area==='hand'&&!canAct))} aria-label={`${c.name}, ${u.attack} támadás, ${Math.max(0,u.health)} életerő${permanent?', végleges erősítés':''}${temporary?', harci erősítés':''}${area==='shop'?`, vásárlás ${minionPrice(you!,u)} aranyért`:''}`}>
    {seriesAudio.some(clip=>c.tags.includes(clip.franchise))&&<span className="series-audio-badge" title="Franchise-hang kijátszáskor" aria-label="Hangbejátszás kijátszáskor"><MusicNote size={10} weight="bold"/></span>}<span className="tier-stars" aria-label={`${c.tier}. szint`}>{'★'.repeat(c.tier)}</span><TribeSurface tribe={tribeFor(c)}/><TimingIcon trigger={c.ability.trigger}/><KeywordBadges keywords={u.keywords} compact/><span className="unit-name">{u.drunk?'🍺 ':''}{c.name}</span><span className="unit-tribe">{tribeName(tribeFor(c))}</span>
    <span className={`stat attack ${layers.combatAttack?'temporary':layers.permanentAttack?'enhanced':''}`}>{u.attack}</span><span className={`stat health ${layers.damaged?'wounded':layers.combatHealth?'temporary':layers.permanentHealth?'enhanced':''}`}>{Math.max(0,u.health)}</span>
    {u.shield&&<span className="shield-mark">◈</span>}{u.taunt&&<span className="taunt-mark">Őrző</span>}
    {(permanent||temporary)&&<span className="buff-markers">{permanent&&<span className="permanent-mark" title="Végleges erősítés">↑</span>}{temporary&&<span className="combat-mark" title="Csak erre a harcra">✦</span>}</span>}
   </button><div className="unit-tooltip"><strong>{c.name}{u.golden?' • Arany':''}</strong><KeywordBadges keywords={u.keywords}/>{minionAbility(u)&&<p><b>{TRIGGER_LABELS[c.ability.trigger]}</b> · {c.text}</p>}
    <dl className="stat-breakdown"><dt>Alapérték</dt><dd>{c.attack*(u.golden?2:1)} / {c.health*(u.golden?2:1)}</dd>{permanent&&<><dt className="permanent-text">Végleges bónusz</dt><dd className="permanent-text">+{layers.permanentAttack} / +{layers.permanentHealth}</dd></>}{temporary&&<><dt className="combat-text">Erre a harcra</dt><dd className="combat-text">+{layers.combatAttack} / +{layers.combatHealth}</dd></>}</dl>
    <small>{c.tags.join(' · ')}{u.golden&&c.ability.effect!=='amplify'?' • Kétszeres hatáserő':''}</small></div>
  </div>;};
 return <div className={`app-shell ${state?'in-game':'is-lobby'}`} style={arenaStyle(arena)} onPointerDownCapture={()=>void gameAudio.unlock()} onKeyDownCapture={()=>void gameAudio.unlock()}>
  <header className="masthead">
   <a className="wordmark" href="/">Utolsó pad<span>Csatatér</span></a>
   {state&&<div className="match-heading"><span>{phaseNames[state.phase]}</span>{state.round>0&&<strong>{state.round}. kör</strong>}{state.deadline&&<time className="compact-timer">{Math.max(0,Math.ceil((state.deadline-now)/1000))} mp</time>}</div>}
   <nav className="game-nav" aria-label="Játék menü">
    {compact&&state&&<button aria-label="Tabella" title="Tabella" aria-haspopup="dialog" onClick={()=>setPanel('standings')}><UsersThree size={20}/></button>}
    <button className="card-pool-toggle" aria-label="Kártyakatalógus" title="Kártyakatalógus" aria-haspopup="dialog" aria-expanded={poolOpen} onClick={()=>setPoolOpen(true)}><Books size={19}/><span>Katalógus</span></button>
    <button className="sound-toggle" aria-label={sound?'Hang kikapcsolása':'Hang bekapcsolása'} aria-pressed={sound} onClick={()=>{gameAudio.setEnabled(!sound);setSound(!sound);}}>{sound?<SpeakerHigh size={19}/>:<SpeakerSlash size={19}/>}</button>
    <button className={`tools-toggle ${tools?'on':''}`} aria-label="Tesztpad" title="Tesztpad" onClick={()=>setTools(!tools)} aria-expanded={tools}><SlidersHorizontal size={19}/><span>Tesztpad</span></button>
    <button className="settings-toggle" aria-label="Beállítások és zene" title="Beállítások és zene" aria-haspopup="dialog" onClick={()=>setPanel('settings')}><GearSix size={19}/></button>
    {onlineRoom&&<button className="leave-room" aria-label="Kilépés a szobából" title="Kilépés a szobából" onClick={leaveRoom}><SignOut size={19}/></button>}
   </nav>
  </header>
  <main className={`game-layout ${!state?'lobby-layout':''} ${tools?'with-tools':''}`}>
   {!state&&<Lobby seed={seed} setSeed={setSeed} mode={mode} setMode={setMode} connected={connected} start={start} online={<OnlineLobby room={onlineRoom} join={joinRoom} launch={launchRoom}/>}/>}
   {state&&(compact?
    <GameDialog open={panel==='standings'} title="Tabella" onClose={()=>setPanel(null)}><Standings state={state} room={onlineRoom}/></GameDialog>:
    <Standings state={state} room={onlineRoom}/> )}
   {state&&<div className="game-stage"><div className="board-viewport"><section ref={arenaRef} style={{backgroundImage:`url("${arena.image}")`}} data-arena={arena.id} data-material={arena.material} aria-busy={busy} className={`arena ${state?.phase==='combat'?'in-combat':''} ${state&&state.phase!=='hero'?'has-match':''}`} aria-label={`Játékaréna – ${arena.name}`}>
    {state?.phase==='hero'&&<div className="hero-selection"><h1>Válassz hőst!</h1><div className="hero-reroll"><button onClick={()=>send({type:'rerollHeroes'})} disabled={!connected||busy||you!.heroRerolls===0}>Új hősök ({you!.heroRerolls}/3)</button></div><div className="hero-offers">{you!.heroOffers.map(id=>{const candidate=hero(id)!;return <button key={id} className="hero-offer" onClick={()=>send({type:'chooseHero',heroId:id})} disabled={!connected||busy}><div className={`hero-art ${id}`}><HeroPortrait id={id}/><i>✦</i></div><h2>{candidate.name}<HeroMediaBadges id={id}/></h2><em>{candidate.title}</em><p>{candidate.text}</p><span className="hero-armor">◈ {candidate.armor} páncél</span><strong className="hero-select-label">Őt választom</strong></button>;})}</div></div>}
    {state&&state.phase!=='hero'&&<>
     <div className="tavern-top"><div className="tavern-keeper"><div className="keeper-avatar" data-unit-id={enemyChampion?.uid}><HeroFrame><HeroPortrait id={state.opponent?.heroId||null} merchant={state.phase!=='combat'}/></HeroFrame>{enemyChampion&&<span className="champion-attack-badge" title="Csefi támadása">⚔ {enemyChampion.attack}</span>}</div><div className="upper-hero-name"><strong>{state.phase==='combat'?state.opponent?.name||'Csatatér':'A Büfés'}</strong><small>{state.phase==='combat'?'Az összecsapás elkezdődött':'„Valamit a hosszú napra?”'}</small></div></div><div className="phase-medallion">{state.phase==='combat'?'⚔':'✦'}<span>{phaseNames[state.phase]}</span></div></div>
     <div className="top-row"><span className="row-label">{state.phase==='combat'?'Ellenfél csapata':rewardNeedsSpace?'Jutalom vár · Szabadíts fel egy helyet a kezedben.':`Kínálat • ${minionPrice(you!)} arany / egység`}</span><div className="unit-row">{state.phase==='combat'?enemies.map((u,i)=>unitCard(u,'enemy',i)):you!.shop.map((u,i)=>u?unitCard(u,'shop',i):<div className="empty-shop" key={`empty-${i}`}>✦</div>)}</div></div>
     <div className="arena-divider"><span/>{state.phase==='combat'?<strong>⚔</strong>:<strong>✦</strong>}<span/></div>
     {ropeMs>0&&ropeMs<=20000&&<div className="round-rope" aria-label="Utolsó 20 másodperc"><i style={{width:(ropeMs/200)+'%'}}/></div>}
     <div className="board-zone"><span className="row-label">A csapatod <span>{ownUnits.length} / 7</span></span><div className="unit-row board-row">{ownUnits.map((u,i)=>unitCard(u,'board',i))}{ownUnits.length===0&&<p className="empty-board">{state.phase==='combat'?'A csapatod elesett.':'Vásárolj egy egységet, majd játszd ki a kezedből.'}</p>}</div></div>
     <div className="buff-legend"><span className="permanent-text">↑ Végleges bónusz</span><span className="combat-text">✦ Harci bónusz</span><span className="wounded-text">♥ Sérült életerő</span></div><div className="table-controls"><div className="shop-actions" aria-label="Fogadó vezérlése"><span className="furniture-emblem" aria-hidden="true">{arena.emblem}</span><button className="upgrade-control" aria-disabled={busy} onClick={()=>send({type:'upgrade'})} disabled={!canAct||you!.tier===6||you!.gold<you!.upgradeCost} title="A következő körben 1 arannyal olcsóbb."><BoardSocket/><span className="control-icon">★ {you!.tier}</span><span>Fejlesztés</span> <b>{you!.tier===6?'Max.':`${you!.upgradeCost} ◉`}</b></button><button className="refresh-control" aria-disabled={busy} onClick={()=>send({type:'refresh'})} disabled={!canAct||you!.gold<1}><BoardSocket dial/><ArrowClockwise size={20} aria-hidden="true"/> <span>Frissítés</span> <b>1 ◉</b></button><button className={`freeze-control ${you!.frozen?'frozen':''}`} aria-pressed={you!.frozen} aria-disabled={busy} onClick={()=>send({type:'freeze'})} disabled={!canAct}><BoardSocket dial/><Snowflake size={20} aria-hidden="true"/>{you!.frozen?'Befagyasztva':'Fagyasztás'}</button></div><div className="round-actions"><span className="furniture-emblem" aria-hidden="true">{arena.emblem}</span><BoardSocket/>{state.phase==='recruit'?<button className="primary" onClick={async()=>{if(you!.hp<=0){await control('step');return;}if(await send({type:'ready'})&&state.mode==='manual'&&!onlineRoom)await control('step');}} disabled={you!.hp<=0?!connected:!canAct}>{you!.hp<=0?'Harc megtekintése':'Harc indítása'} <Sword size={17} weight="duotone" aria-hidden="true"/></button>:state.phase==='combat'?<button className="primary" onClick={()=>control('finishCombat')} disabled={!connected}>Következő kör <span>→</span></button>:<button className="primary" onClick={()=>{setState(null);auto.current=false;}}>Új mérkőzés</button>}<span className="timer">{state.deadline?`${Math.max(0,Math.ceil((state.deadline-now)/1000))} mp`:state.phase==='combat'?'Harc · nincs időkorlát':'Kézi léptetés'}</span></div></div>

    </>}
    {state&&state.phase!=='hero'&&<div className="hero-dock" role="group" aria-label="Saját hős"><div className={`player-hero ${h?.id}`} data-unit-id={ownChampion?.uid}><HeroFrame><HeroPortrait id={you!.heroId}/></HeroFrame>{ownChampion&&<span className="champion-attack-badge" title="Csefi támadása">⚔ {ownChampion.attack}</span>}<b className="hero-hp">{Math.max(0,you!.hp)} ♥</b><b className="armor">{you!.armor} ◈</b></div><div className="hero-power"><strong>{h?.name}<HeroMediaBadges id={h?.id}/></strong>{state.phase==='recruit'&&<button className="power-launch" aria-label="Hősképesség és varázslatok" aria-haspopup="dialog" onClick={()=>setPanel('powers')}><Sparkle size={16} weight="fill"/><span>{h?.power?'Képesség':'Varázslatok'}</span>{powerState(you!).spellHand.length>0&&<b>{powerState(you!).spellHand.length}</b>}</button>}</div><div className="gold-wallet"><span>Elkölthető arany</span><strong>{you!.gold}<small> / {(Math.min(10,state.round+2)+(powerState(you!).maxGold-10))}</small> <i>◉</i></strong></div></div>}
    {state?.phase==='recruit'&&you?.discover.length&&!rewardNeedsSpace? <div className="discover-backdrop"><section className="discover"><h2>Válassz egy egységet</h2><div>{you.discover.map(u=><button key={u.uid} onClick={()=>send({type:'discover',uid:u.uid})} disabled={!connected||busy}><span className="discover-art" data-tribe={tribeFor(unitDefinition(u))}><TribeSurface tribe={tribeFor(unitDefinition(u))}/><TimingIcon trigger={unitDefinition(u).ability.trigger}/></span><strong>{character(u.characterId).name}</strong><span>{u.attack} ⚔ / {u.health} ♥</span><small>{unitDefinition(u).text}</small></button>)}</div></section></div>:null}
    {state?.phase==='finished'&&<div className="result-overlay"><p className="result-summary">Vége a mérkőzésnek</p><h1>{you!.place===1?'Tiéd az első hely!':`${you!.place}. helyezés`}</h1><p>{state.round} kör</p><ol>{state.standings.slice().sort((a,b)=>a.place!-b.place!).map(p=><li key={p.id}><b>{p.place}.</b>{p.name}<span>{p.id===you?.id?'Te':hero(p.heroId)?.name}</span></li>)}</ol><div><button className="primary" onClick={()=>{setState(null);auto.current=false;}}>Új mérkőzés</button><button onClick={exportReplay}>Visszajátszás mentése</button></div></div>}
    {smoke&&<div className="drain-smoke" aria-label="A minion füstté vált" style={{left:smoke.x,top:smoke.y}}><i/><i/><i/><i/></div>}
    <BattleEffects beat={state?.phase==='combat'?beat:undefined} beatKey={beatKey} speed={speed} arena={arenaRef} onImpact={setImpactKey} ownBattleLeft={ownBattleLeft} motion={motion} ownHeroId={you?.heroId} opponentHeroId={state?.standings.find(p=>p.id===(ownBattleLeft?battle?.rightId:battle?.leftId))?.heroId}/>
    {state&&state.phase!=='hero'&&<><div className="board-resource-ribbon">{you!.gold}/{powerState(you!).maxGold} ◉</div><div className="board-round-plaque"><BoardSocket/><small>{state.phase==='combat'?'Harc':'Kör / Idő'}</small><strong>{state.round}<span> / {state.deadline?`${Math.max(0,Math.ceil((state.deadline-now)/1000))} mp`:'—'}</span></strong></div></>}
   </section></div>{state&&state.phase!=='hero'&&<section className="hand-dock" aria-label="Kéz"><div className="hand-label"><strong>A kezed</strong><span title="Minionok és varázslatok együtt">{handCount} / 10</span><button className="inspect-toggle" aria-pressed={inspectMode} onClick={()=>setInspectMode(!inspectMode)} title="Válassz egy lapot a részletekhez"><Eye size={15}/>{inspectMode?'Válassz lapot':'Lapinfó'}</button></div><div className="hand-cards">{you!.hand.map((u,i)=>unitCard(u,'hand',i))}{!you!.hand.length&&<span className="empty-hand">A megvásárolt egységek ide kerülnek.</span>}</div>{selectedUnit&&!selectedInHand&&state.phase==='recruit'&&<div className="selection-actions"><strong>{character(selectedUnit.characterId).name}</strong><div><button onClick={()=>move(-1)} disabled={!canAct||you!.board[0].uid===selected}>← Balra</button><button onClick={()=>move(1)} disabled={!canAct||you!.board.at(-1)?.uid===selected}>Jobbra →</button><button className="sell-button" onClick={()=>send({type:'sell',uid:selectedUnit.uid})} disabled={!canAct}>Eladás {you!.heroId==='original-1'?'+2 ◉ a következő körben':'+1 ◉'}</button><button aria-label="Kijelölés megszüntetése" onClick={()=>setSelected(null)}><X size={16}/></button></div></div>}<button className="sell-drop" aria-disabled={!canAct||!selectedUnit||!!selectedInHand} onClick={()=>canAct&&selectedUnit&&!selectedInHand&&send({type:'sell',uid:selectedUnit.uid})} aria-label="Kijelölt egység eladása" title="Húzd ide a táblán lévő egységet az eladáshoz">↥<small>Eladás</small></button></section>}</div>}
   {tools&&<aside className="test-panel"><div className="panel-heading"><h2>Tesztpad</h2><button aria-label="Tesztpad bezárása" onClick={()=>setTools(false)}><X size={16}/></button></div><dl><dt>Seed</dt><dd>{state?.seed||'—'}</dd><dt>Állapotverzió</dt><dd>{state?.version??'—'}</dd><dt>Szabályprofil</dt><dd>{state?.ruleset||RULES.id}</dd></dl><h3>Harcvezérlés</h3><div className="test-buttons"><button onClick={()=>{setPaused(!paused);control(paused?'resume':'pause');}} disabled={!state}>{paused?'▶ Folytatás':'Ⅱ Szünet'}</button><button onClick={()=>{setPaused(true);control('pause');setStep(i=>Math.min(i+1,total-1));}} disabled={state?.phase!=='combat'||step>=total-1}>Esemény léptetése</button></div><label>Lejátszás sebessége<select value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.5,1,2,4,8].map(n=><option key={n} value={n}>{n}× sebesség</option>)}</select></label><p className="event-counter">{total?`${step+1} / ${total} harci lépés`:'Még nincs harci esemény.'}</p><h3>Meccsteszt</h3><button onClick={()=>control('autoplay')} disabled={!state||running||state.phase==='finished'}>Bot lépés a saját helyemen is</button><button onClick={runMatch} disabled={!state||state.phase==='finished'}>{running?'Szimuláció leállítása':'Teljes meccs lefuttatása'}</button><button onClick={exportReplay} disabled={!state}>Visszajátszás exportálása</button><label className="import-file">Visszajátszás újrafuttatása<input type="file" accept="application/json,.json" onChange={e=>importReplay(e.target.files?.[0])}/></label>{replayResult&&<p role="status">{replayResult}</p>}<h3>Eseménynapló</h3><div className="event-log">{battle?visibleEvents.slice(-14).map((e,i)=><p key={i} className={e.type}>{e.text}</p>):state?.log.slice(-10).map((e,i)=><p key={i}>{e}</p>)}</div></aside>}
  </main>

  {state?.phase==='recruit'&&you&&<GameDialog open={panel==='powers'} title="Hősképesség és varázslatok" onClose={()=>setPanel(null)}>
   <HeroPowerPanel player={you} round={state.round} canAct={!!canAct} busy={busy} send={async action=>{
    const ok=await send(action);
    if(ok&&effectivePowerId(you)==='original-9'&&action.type==='power'&&!action.mode)setPanel(null);
    return ok;
   }}/>
   {error&&<p className="dialog-error" role="alert">{error}</p>}
  </GameDialog>}
  <GameDialog open={panel==='settings'} title="Beállítások és zene" onClose={()=>setPanel(null)}>
   <button className="motion-toggle" aria-pressed={motion} onClick={()=>setMotion(!motion)}>{motion?'Animációk be':'Animációk ki'}</button>
   <p className={`connection ${connected?'online':''}`}>{connected?'Kapcsolódva a szerverhez':'Kapcsolódás…'}</p>
   {state&&state.phase!=='hero'&&state.phase!=='finished'&&<HeroMusicPlayer heroId={you?.heroId||null} enabled={sound}/>}
  </GameDialog>
  {inspected&&inspectedCard&&<GameDialog open title={inspectedCard.name} onClose={()=>setInspected(null)}>
   <div className="card-inspection" data-tribe={tribeFor(inspectedCard)}>
    <TribeSurface tribe={tribeFor(inspectedCard)}/>
    <div><small>{inspectedCard.tier}. szint · {tribeName(tribeFor(inspectedCard))}{inspected.golden?' · Arany':''}</small>
    <strong>{inspected.attack} ⚔ / {Math.max(0,inspected.health)} ♥</strong><KeywordBadges keywords={inspected.keywords}/>
    <p><b>{TRIGGER_LABELS[inspectedCard.ability.trigger]}</b> · {inspectedCard.text}</p></div>
   </div>
  </GameDialog>}
  {poolOpen&&<CardPool match={state} onClose={()=>setPoolOpen(false)}/>}
  <div className="feedback" role="status" aria-live="polite">{error&&<span className="error">{error}<button onClick={()=>setError('')} aria-label="Üzenet bezárása">×</button></span>}{!connected&&<span className="error">Kapcsolódás a szerverhez… A játékállapotot visszatéréskor frissítjük.</span>}</div>
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
