import type {Keyword} from '../shared/types';
import {KEYWORDS} from '../shared/keywords';
import './keywords.css';

export function KeywordBadges({keywords=[],compact=false}:{keywords?:Keyword[];compact?:boolean}){
 if(!keywords.length)return null;
 return <span className={compact?'unit-keywords':'keyword-list'}>{keywords.map(key=>{
  const k=KEYWORDS[key];return <span key={key} className={`keyword-badge keyword-${key}`} title={`${k.name} (${key}): ${k.text}`} aria-label={`${k.name}: ${k.text}`}>
   <span aria-hidden="true">{k.symbol}</span>{!compact&&<strong>{k.name}</strong>}
  </span>;
 })}</span>;
}
