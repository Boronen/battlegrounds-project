import { useLayoutEffect, useState } from 'react';
import type { RefObject, CSSProperties } from 'react';
import type { CombatBeat } from './combat-presentation';
import {gameAudio} from './audio';
import {attackMotion} from './attack-motion';
import {combatVisuals, type VisualKind} from './combat-visuals';
import {HERO_ATTACKS} from './hero-media';
import type {AttackStyle} from './hero-media';

export function BattleEffects({beat,beatKey,speed,arena,onImpact,ownBattleLeft,motion,ownHeroId,opponentHeroId}:{beat:CombatBeat|undefined;beatKey:string;speed:number;arena:RefObject<HTMLElement|null>;onImpact:(key:string)=>void;ownBattleLeft:boolean;motion:boolean;ownHeroId?:string|null;opponentHeroId?:string|null}){
 const [points,setPoints]=useState<{x:number;y:number;text:string;kind:string}[]>([]);
 const [strike,setStrike]=useState<{x:number;y:number;fromX:number;fromY:number;style?:AttackStyle}|null>(null);
 const [visuals,setVisuals]=useState<{kind:VisualKind;x:number;y:number}[]>([]);
 useLayoutEffect(()=>{
  if(!beat||!arena.current){setPoints([]);setStrike(null);setVisuals([]);return;}
  const board=arena.current;const reduced=!motion;
  const animations:Animation[]=[];const timers:ReturnType<typeof setTimeout>[]=[];
  const nodes=Array.from(board.querySelectorAll<HTMLElement>('[data-unit-id]'));
  const find=(id?:string)=>nodes.find(n=>n.dataset.unitId===id);
  const attack=beat.events.find(e=>e.type==='attack');
  const actor=find(attack?.actor),target=find(attack?.target);
  const rect=board.getBoundingClientRect();
  const positions=new Map(nodes.map(n=>{const r=n.getBoundingClientRect();return[n.dataset.unitId,{x:r.left+r.width/2-rect.left-board.clientLeft,y:r.top+r.height*.44-rect.top-board.clientTop}];}));
  const effects=combatVisuals(beat).flatMap(v=>{
   let p=positions.get(v.uid)||positions.get(v.anchor);
   if(!p){
    const side=beat.after.left.some(u=>u.uid===v.uid)?beat.after.left:beat.after.right;
    p=side.map(u=>positions.get(u.uid)).find(Boolean);
    // A deathrattle can refill an entirely empty side. Its future DOM node is
    // not mounted until impact; use that side's row rather than dropping VFX.
    if(!p){
     const isLeft=beat.after.left.some(u=>u.uid===v.uid);
     const row=board.querySelector(isLeft===ownBattleLeft?'.board-zone':'.top-row');
     if(row){const r=row.getBoundingClientRect();p={x:r.left+r.width/2-rect.left,y:r.top+r.height/2-rect.top};}
    }
   }
   return p?[{kind:v.kind,...p}]:[];
  });
  const feedback=beat.events.flatMap((e,i)=>{
   let p=positions.get(e.target||e.actor);if(!p)return[];
   if(attack&&e.type==='damage'&&positions.get(attack.target)){const collision=positions.get(attack.target)!;p={x:collision.x+(e.target===attack.actor?-25:23),y:collision.y+(e.target===attack.actor?20:-12)};}
   let text='';
   if(e.type==='damage')text=`−${e.amount}`;
   if(e.type==='shield')text='Pajzs';
   if(e.type==='buff'){
    const prev=i?beat.events[i-1]:beat.before;
    const a=[...prev.left,...prev.right].find(u=>u.uid===e.target),b=[...e.left,...e.right].find(u=>u.uid===e.target);
    const da=a&&b?b.attack-a.attack:0,dh=a&&b?b.health-a.health:0;
    text=da||dh?`+${da} / +${dh}`:'✦';
   }
   return text?[{...p,text,kind:e.type}]:[];
  });
  setPoints([]);
  setStrike(null);
  setVisuals([]);
  if(attack&&actor&&target&&!reduced){
   const a=actor.getBoundingClientRect(),b=target.getBoundingClientRect();
   const {dx,dy,recoilX,recoilY}=attackMotion({x:a.left+a.width/2,y:a.top+a.height/2},{x:b.left+b.width/2,y:b.top+b.height/2});
   actor.style.zIndex='25';
   const start=positions.get(attack.actor)!,end=positions.get(attack.target)!;
   const actorLeft=beat.before.left.some(u=>u.uid===attack.actor);
   const heroId=actorLeft===ownBattleLeft?ownHeroId:opponentHeroId;
   setStrike({x:end.x,y:end.y,fromX:start.x,fromY:start.y,style:heroId?HERO_ATTACKS[heroId]?.style:undefined});
   gameAudio.play('swing');
   animations.push(actor.animate([{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${-dx*.065}px,${-dy*.09}px) scale(1.09) rotate(-4deg)`,offset:.19},{transform:`translate(${dx}px,${dy}px) scale(1.13) rotate(3deg)`,offset:.46},{transform:`translate(${dx-recoilX}px,${dy-recoilY}px) scale(1.06) rotate(-2deg)`,offset:.59},{transform:'translate(0,0) scale(1)',offset:1}],{duration:680/speed,easing:'cubic-bezier(.3,0,.2,1)'}));
   timers.push(setTimeout(()=>{animations.push(target.animate([{transform:'translate(0,0)'},{transform:`translate(${recoilX}px,${recoilY}px) rotate(-6deg)`},{transform:`translate(${-recoilX*.4}px,${-recoilY*.4}px) rotate(3deg)`},{transform:'translate(0,0)'}],{duration:280/speed}));animations.push(board.animate([{translate:'0 0'},{translate:'3px 1px'},{translate:'-2px -2px'},{translate:'1px 0'},{translate:'0 0'}],{duration:210/speed}));},310/speed));
  }
  const impact=()=>{onImpact(beatKey);setPoints(feedback);setVisuals(effects);if(beat.events.some(e=>e.type==='shield'))gameAudio.play('shield');else if(beat.events.some(e=>e.type==='damage'))gameAudio.play('hit');else if(beat.events.some(e=>e.type==='buff'))gameAudio.play('buff');};
  if(reduced)impact();else timers.push(setTimeout(impact,attack?310/speed:30));
  return()=>{timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());if(actor)actor.style.zIndex='';};
 },[beat,beatKey,speed,arena,onImpact,ownBattleLeft,motion,ownHeroId,opponentHeroId]);
 return <div className="battle-effects" aria-hidden="true" style={{'--effect-speed':speed} as CSSProperties}>
  {visuals.map((v,i)=><div key={`${beatKey}-v-${i}`} data-effect={v.kind} className={`combat-vfx vfx-${v.kind}`} style={{left:v.x,top:v.y}}><svg viewBox="0 0 120 120" focusable="false"><circle className="vfx-ring" cx="60" cy="60" r="34"/><path className="vfx-glyph" d={v.kind==='shield-break'||v.kind==='shield-gain'?'M60 18 88 30 84 66Q78 86 60 96 42 86 36 66L32 30Z':v.kind==='venom'?'M60 15Q91 50 87 65C87 99 33 99 33 65Q29 50 60 15Z':v.kind==='windfury'?'M15 45Q90 18 100 49T30 67M20 79Q70 49 102 76':v.kind==='reborn'?'M60 100Q20 65 48 23Q44 57 64 61Q87 29 79 20Q113 65 60 100Z':'M60 10 68 43 100 25 77 54 112 60 77 67 99 96 68 78 60 112 51 77 22 97 42 68 8 60 43 52 22 24 52 43Z'}/>{Array.from({length:8},(_,j)=><path className="vfx-fragment" key={j} d="M60 19 64 27 58 33 55 25Z" style={{'--angle':`${j*45}deg`} as CSSProperties}/>)}</svg></div>)}
  {strike&&<svg key={beatKey} className="strike-path"><path d={`M${strike.fromX} ${strike.fromY} Q${(strike.fromX+strike.x)/2+25} ${(strike.fromY+strike.y)/2} ${strike.x} ${strike.y}`} style={{animationDuration:`${460/speed}ms`}}/></svg>}
  {strike?.style&&<div key={`signature-${beatKey}`} data-attack-style={strike.style} className={`signature-attack signature-${strike.style}`} style={{left:strike.fromX,top:strike.fromY,width:Math.hypot(strike.x-strike.fromX,strike.y-strike.fromY),rotate:`${Math.atan2(strike.y-strike.fromY,strike.x-strike.fromX)*180/Math.PI}deg`,'--travel':`${Math.hypot(strike.x-strike.fromX,strike.y-strike.fromY)}px`} as CSSProperties}>
   {strike.style==='tire'?<><div className="tire-ribbon"/><div className="tire-smoke"><i/><i/><i/></div></>:<div className="signature-projectile"><svg viewBox="0 0 100 100">{strike.style==='dumbbell'?<g transform="rotate(-25 50 50)"><rect x="21" y="43" width="58" height="14" rx="5" fill="#e2e9f4" stroke="#506178" strokeWidth="3"/>{[13,27,63,77].map(x=><rect key={x} x={x} y={x===13||x===77?27:20} width="10" height={x===13||x===77?46:60} rx="4" fill="#52647d" stroke="#c5d6e9" strokeWidth="3"/>)}</g>:<><circle cx="50" cy="50" r="34" fill="#ffde46" stroke="#fff8cc" strokeWidth="3"/><path d="M19 36Q48 12 71 27L60 48Q36 40 19 61Z M71 27Q94 53 72 76L53 65Q68 45 60 48Z M72 76Q42 96 21 70L36 52Q45 75 53 65Z" fill="#397fcf" stroke="#173c6c" strokeWidth="2"/><path d="M50 17Q34 32 36 52M82 48Q67 57 53 65" fill="none" stroke="#fff" strokeWidth="2"/></>}</svg></div>}
  </div>}
  {strike&&points.length>0&&<div key={`shock-${beatKey}`} className="impact-shockwave" style={{left:strike.x,top:strike.y}}><i/><b/></div>}
  {strike&&points.length>0&&<div key={`burst-${beatKey}`} className="collision-burst" style={{left:strike.x,top:strike.y,animationDuration:`${350/speed}ms`}}>{Array.from({length:10},(_,i)=><i key={i} style={{'--ray':`${i*36}deg`,'--length':`${35+i%3*14}px`} as CSSProperties}/>)}<span>✦</span></div>}
  {points.map((p,i)=><div key={`${beatKey}-${i}`} className={`battle-float ${p.kind}`} style={{left:p.x,top:p.y,animationDuration:`${650/speed}ms`}}><span>{p.text}</span>{p.kind==='damage'&&<i className="impact-sparks"/>}</div>)}
 </div>;
}
