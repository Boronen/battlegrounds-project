import {useEffect,useLayoutEffect,useRef} from 'react';

export function useCardDrag(enabled:boolean,round:number,onDrop:(uid:string,from:string,to:string,target?:string)=>void){
 const latest=useRef(onDrop);
 useLayoutEffect(()=>{latest.current=onDrop;},[onDrop]);
 useEffect(()=>{
  if(!enabled)return;
  let grip:{id:number;x:number;y:number;uid:string;from:string;card:HTMLElement;touch:boolean}|undefined;
  let ghost:HTMLElement|undefined,highlight:Element|null=null,blockClick=false;
  let resetTimer=0;
  function clear(){
   const active=grip;
   grip=undefined;
   if(active?.card.hasPointerCapture(active.id))active.card.releasePointerCapture(active.id);
   active?.card.classList.remove('card-lifted');
   ghost?.remove();ghost=undefined;highlight?.classList.remove('card-drop-target');highlight=null;
  }
  function down(e:PointerEvent){
   if(grip||!e.isPrimary||e.button!==0||!(e.target instanceof Element))return;
   const card=e.target.closest<HTMLElement>('.unit-wrap,[data-spell-id]');
   const uid=card?.dataset.unitId||card?.dataset.spellId;
   if(!card||!uid||!card.querySelector('button.unit:enabled,button.spell-card:enabled'))return;
   const from=card.dataset.zone||['shop','hand','board'].find(zone=>card.classList.contains(zone));
   if(from)grip={id:e.pointerId,x:e.clientX,y:e.clientY,uid,from,card,touch:e.pointerType==='touch'};
  }
  function destination(x:number,y:number){
   const el=document.elementFromPoint(x,y);
   if(grip?.from==='shop'){
    const hand=el?.closest('.hand-dock');
    if(hand)return hand;
    const arena=el?.closest('.arena');
    const shop=arena?.querySelector('.top-row');
    if(shop&&y>shop.getBoundingClientRect().bottom&&!el?.closest('button:not(.unit),.discover-backdrop'))return document.querySelector('.hand-dock');
    return null;
   }
   if(grip?.from==='board'){
    const sell=el?.closest('.sell-drop,.keeper-avatar,.top-row');
    if(sell)return sell;
   }
   const slot=el?.closest('.board-zone .unit-wrap,.board-zone');
   if(slot||grip?.from!=='hand')return slot;
   const arena=el?.closest('.arena');
   if(arena&&!el?.closest('button,.discover-backdrop,.top-row,.tavern-top'))return arena.querySelector('.board-zone');
   return null;
  }
  function move(e:PointerEvent){
   if(!grip||grip.id!==e.pointerId)return;
   if(!ghost){
    if(Math.hypot(e.clientX-grip.x,e.clientY-grip.y)<7)return;
    const rect=grip.card.querySelector('.unit,.spell-card')!.getBoundingClientRect();
    ghost=grip.card.cloneNode(true) as HTMLElement;
    ghost.removeAttribute('data-unit-id');ghost.removeAttribute('data-spell-id');ghost.setAttribute('aria-hidden','true');ghost.inert=true;
    ghost.querySelector('.unit-tooltip')?.remove();ghost.classList.add('card-in-flight');
    ghost.style.width=rect.width+'px';ghost.style.height=rect.height+'px';
    document.body.append(ghost);grip.card.classList.add('card-lifted');grip.card.setPointerCapture(e.pointerId);
   }
   ghost.style.transform='translate('+e.clientX+'px,'+e.clientY+'px) translate(-50%,-57%) rotate(-4deg) scale(1.08)';
   const next=destination(e.clientX,e.clientY)??null;
   if(next!==highlight){highlight?.classList.remove('card-drop-target');next?.classList.add('card-drop-target');highlight=next;}
  }
  function up(e:PointerEvent){
   if(grip?.id!==e.pointerId)return;
   if(ghost){
    blockClick=true;window.clearTimeout(resetTimer);resetTimer=window.setTimeout(()=>{blockClick=false;},0);
    const dest=destination(e.clientX,e.clientY);
    if(dest){const area=dest.matches('.hand-dock')?'hand':dest.closest('.board-zone')?'board':'sell';
     latest.current(grip.uid,grip.from,area,dest.getAttribute('data-unit-id')??undefined);}
   }
   clear();
  }
  function cancel(e:PointerEvent){if(grip?.id===e.pointerId)clear();}
  function lost(e:PointerEvent){if(e.target===grip?.card)cancel(e);}
  function click(e:MouseEvent){if(blockClick){e.preventDefault();e.stopImmediatePropagation();}}
  function menu(e:MouseEvent){if(ghost||grip?.touch){e.preventDefault();e.stopImmediatePropagation();}}
  document.addEventListener('pointerdown',down);document.addEventListener('pointermove',move);
  document.addEventListener('pointerup',up);document.addEventListener('pointercancel',cancel);
  document.addEventListener('lostpointercapture',lost);window.addEventListener('blur',clear);
  document.addEventListener('click',click,true);document.addEventListener('contextmenu',menu,true);
  return ()=>{clear();window.clearTimeout(resetTimer);
   document.removeEventListener('pointerdown',down);document.removeEventListener('pointermove',move);
   document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',cancel);
   document.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',clear);
   document.removeEventListener('click',click,true);document.removeEventListener('contextmenu',menu,true);};
 },[enabled,round]);
}
