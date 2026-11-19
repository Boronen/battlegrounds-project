import {useEffect,useId,useRef,type ReactNode} from 'react';
import {X} from '@phosphor-icons/react';

export function GameDialog({open,title,onClose,children}:{open:boolean;title:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 const id=useId();
 useEffect(()=>{
  const dialog=ref.current;
  if(open&&!dialog?.open)dialog?.showModal();
  if(!open&&dialog?.open)dialog.close();
 },[open]);
 return <dialog ref={ref} className="game-dialog" aria-labelledby={id}
  onCancel={event=>{event.preventDefault();onClose();}}
  onClick={event=>{if(event.target===ref.current)onClose();}}>
  <div className="dialog-frame">
   <header><h2 id={id}>{title}</h2><button type="button" aria-label={title+' bezárása'} onClick={onClose}><X size={20}/></button></header>
   <div className="dialog-content">{children}</div>
  </div>
 </dialog>;
}
