import {useId, type ReactNode} from 'react';

/** A recessed portrait socket shared by the tavern keeper and combat heroes. */
export function HeroFrame({children}:{children:ReactNode}) {
 const id=useId().replaceAll(':','');
 return <div className="hero-frame">
  <div className="hero-frame-portrait">{children}</div>
  <svg className="hero-frame-trim" viewBox="0 0 200 220" preserveAspectRatio="none" aria-hidden="true">
   <defs>
    <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
     <stop stopColor="#fff0b7"/><stop offset=".22" stopColor="#caa46a"/>
     <stop offset=".48" stopColor="#735032"/><stop offset=".7" stopColor="#e2bf7d"/><stop offset="1" stopColor="#624329"/>
    </linearGradient>
    <linearGradient id={`${id}-wood`} x2="0" y2="1">
     <stop stopColor="#6d5141"/><stop offset=".5" stopColor="#3d2b28"/><stop offset="1" stopColor="#241f23"/>
    </linearGradient>
    <mask id={`${id}-window`}><rect width="200" height="220" fill="white"/><path d="M33 190V92C33 57 61 35 100 35S167 57 167 92V190Z" fill="black"/></mask>
   </defs>
   <path d="M9 208V91C9 40 49 10 100 10S191 40 191 91V208L165 218H35Z" mask={`url(#${id}-window)`} fill={`url(#${id}-wood)`} stroke="#241c20" strokeWidth="9"/>
   <path d="M22 196V92C22 49 55 23 100 23S178 49 178 92V196Z" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="15"/>
   <path d="M33 190V92C33 57 61 35 100 35S167 57 167 92V190" fill="none" stroke="#211d23" strokeWidth="5"/>
   <path d="M6 178 28 187 34 211 9 205ZM194 178 172 187 166 211 191 205Z" fill={`url(#${id}-metal)`} stroke="#473127" strokeWidth="3"/>
   <path d="M37 198H163L155 215H45Z" fill={`url(#${id}-metal)`} stroke="#352822" strokeWidth="3"/>
   <path d="M55 204H145" stroke="#f6dc9f" strokeOpacity=".55" strokeWidth="2"/>
   <path d="M79 19 100 2 121 19 100 40Z" fill={`url(#${id}-metal)`} stroke="#3c2a25" strokeWidth="3"/>
   <path className="hero-frame-gem" d="M89 20 100 10 111 20 100 31Z"/>
   <path d="M96 17 100 13 104 17" fill="none" stroke="#fff4d0" strokeOpacity=".8" strokeWidth="2"/>
  </svg>
 </div>;
}
