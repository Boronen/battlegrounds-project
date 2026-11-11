import { useLayoutEffect, useState } from 'react';
import type { RefObject, CSSProperties } from 'react';
import type { CombatBeat } from './combat-presentation';
import {gameAudio} from './audio';
import {attackMotion} from './attack-motion';

export function BattleEffects({beat,beatKey,speed,arena,onImpact}:{beat:CombatBeat|undefined;beatKey:string;speed:number;arena:RefObject<HTMLElement|null>;onImpact:(key:string)=>void}){
 const [points,setPoints]=useState<{x:number;y:number;text:string;kind:string}[]>([]);
 const [strike,setStrike]=useState<{x:number;y:number;fromX:number;fromY:number}|null>(null);
 useLayoutEffect(()=>{
  if(!beat||!arena.current){setPoints([]);setStrike(null);return;}
  const board=arena.current;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animations:Animation[]=[];const timers:ReturnType<typeof setTimeout>[]=[];
  const nodes=Array.from(board.querySelectorAll<HTMLElement>('[data-unit-id]'));
  const find=(id?:string)=>nodes.find(n=>n.dataset.unitId===id);
  const attack=beat.events.find(e=>e.type==='attack');
  const actor=find(attack?.actor),target=find(attack?.target);
  const rect=board.getBoundingClientRect();
  const positions=new Map(nodes.map(n=>{const r=n.getBoundingClientRect();return[n.dataset.unitId,{x:r.left+r.width/2-rect.left-board.clientLeft,y:r.top+r.height*.44-rect.top-board.clientTop}];}));
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
  if(attack&&actor&&target&&!reduced){
   const a=actor.getBoundingClientRect(),b=target.getBoundingClientRect();
   const {dx,dy,recoilX,recoilY}=attackMotion({x:a.left+a.width/2,y:a.top+a.height/2},{x:b.left+b.width/2,y:b.top+b.height/2});
   actor.style.zIndex='25';
   const start=positions.get(attack.actor)!,end=positions.get(attack.target)!;
   setStrike({x:end.x,y:end.y,fromX:start.x,fromY:start.y});
   gameAudio.play('swing');
   animations.push(actor.animate([{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${-dx*.065}px,${-dy*.09}px) scale(1.09) rotate(-4deg)`,offset:.19},{transform:`translate(${dx}px,${dy}px) scale(1.13) rotate(3deg)`,offset:.46},{transform:`translate(${dx-recoilX}px,${dy-recoilY}px) scale(1.06) rotate(-2deg)`,offset:.59},{transform:'translate(0,0) scale(1)',offset:1}],{duration:680/speed,easing:'cubic-bezier(.3,0,.2,1)'}));
   timers.push(setTimeout(()=>{animations.push(target.animate([{transform:'translate(0,0)'},{transform:`translate(${recoilX}px,${recoilY}px) rotate(-6deg)`},{transform:`translate(${-recoilX*.4}px,${-recoilY*.4}px) rotate(3deg)`},{transform:'translate(0,0)'}],{duration:280/speed}));animations.push(board.animate([{translate:'0 0'},{translate:'3px 1px'},{translate:'-2px -2px'},{translate:'1px 0'},{translate:'0 0'}],{duration:210/speed}));},310/speed));
  }
  const impact=()=>{onImpact(beatKey);setPoints(feedback);if(beat.events.some(e=>e.type==='shield'))gameAudio.play('shield');else if(beat.events.some(e=>e.type==='damage'))gameAudio.play('hit');else if(beat.events.some(e=>e.type==='buff'))gameAudio.play('buff');};
  if(reduced)impact();else timers.push(setTimeout(impact,attack?310/speed:30));
  return()=>{timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());if(actor)actor.style.zIndex='';};
 },[beat,beatKey,speed,arena,onImpact]);
 return <div className="battle-effects" aria-hidden="true">
  {strike&&<svg key={beatKey} className="strike-path"><path d={`M${strike.fromX} ${strike.fromY} Q${(strike.fromX+strike.x)/2+25} ${(strike.fromY+strike.y)/2} ${strike.x} ${strike.y}`} style={{animationDuration:`${460/speed}ms`}}/></svg>}
  {strike&&points.length>0&&<div key={`burst-${beatKey}`} className="collision-burst" style={{left:strike.x,top:strike.y,animationDuration:`${350/speed}ms`}}>{Array.from({length:10},(_,i)=><i key={i} style={{'--ray':`${i*36}deg`,'--length':`${35+i%3*14}px`} as CSSProperties}/>)}<span>✦</span></div>}
  {points.map((p,i)=><div key={`${beatKey}-${i}`} className={`battle-float ${p.kind}`} style={{left:p.x,top:p.y,animationDuration:`${650/speed}ms`}}><span>{p.text}</span>{p.kind==='damage'&&<i className="impact-sparks"/>}</div>)}
 </div>;
}
