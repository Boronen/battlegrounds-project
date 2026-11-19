import {Sparkle} from '@phosphor-icons/react';
import {UPGRADE_NAMES,upgradeText} from '../shared/hero-powers';
import type {SpellCard} from '../shared/types';

export function SpellTile({card,zone,price,disabled,onClick}:{card:SpellCard;zone:'shop'|'hand';price?:number;disabled:boolean;onClick:()=>void}){
 const name=UPGRADE_NAMES[card.kind];
 const description=upgradeText(card.kind,card.tier);
 return <div className={zone==='shop'?'spell-offer':'spell-in-hand'} data-spell-id={card.uid} data-zone={zone}>
  <button type="button" className="spell-card" title={description} aria-label={`${name} · ${description} · ${zone==='shop'?`${price} arany`:'Kijátszás'}`} disabled={disabled} onClick={onClick}>
   <Sparkle weight="duotone" aria-hidden="true"/><strong>{name}</strong>{zone==='shop'&&<small>{price} ◉</small>}
  </button>
 </div>;
}
