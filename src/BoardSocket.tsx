import {useId} from 'react';

/** Painted bevels, rim brackets and a recessed face; live labels stay in HTML. */
export function BoardSocket({dial=false}:{dial?:boolean}) {
 const id=useId().replaceAll(':','');
 return <svg className="board-socket" viewBox="0 0 240 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
   <linearGradient id={`${id}-rim`} x2=".3" y2="1"><stop stopColor="#fff0cb"/><stop offset=".16" stopColor="var(--arena-metal)"/><stop offset=".5" stopColor="#44352d"/><stop offset=".72" stopColor="var(--arena-metal)"/><stop offset="1" stopColor="#302324"/></linearGradient>
   <linearGradient id={`${id}-face`} x2="0" y2="1"><stop stopColor="#18191d"/><stop offset=".24" stopColor="var(--arena-surface)"/><stop offset=".8" stopColor="var(--arena-surface)"/><stop offset="1" stopColor="#15151a"/></linearGradient>
  </defs>
  <path d="M0 39 28 29 44 16 196 16 212 29 240 39V81L211 90 195 105H45L28 91 0 81Z" fill="#15131a" stroke="#1c171a" strokeWidth="7"/>
  <path d="M2 42 37 34V87L2 78ZM238 42 203 34V87L238 78Z" fill={`url(#${id}-rim)`} stroke="#36282a" strokeWidth="3"/>
  <path d="M38 27Q120 5 202 27L214 60 202 95Q120 116 38 95L26 60Z" fill={`url(#${id}-rim)`} stroke="#34272a" strokeWidth="3"/>
  <path d="M48 34Q120 15 192 34L202 60 192 87Q120 105 48 87L38 60Z" fill={`url(#${id}-face)`} stroke="#17151a" strokeWidth="5"/>
  <path d="M49 33Q120 14 191 33M45 39 40 57M195 81 190 87Q120 104 49 87" fill="none" stroke="#fff0cc" strokeOpacity=".4" strokeWidth="2"/>
  {[15,225].map(x=><g key={x}><circle cx={x} cy="60" r="6" fill="#211c20"/><circle cx={x} cy="58" r="4" fill="var(--arena-metal)"/><path d={`M${x-2} 57h4`} stroke="#f5dfaa"/></g>)}
  {dial&&<ellipse cx="120" cy="60" rx="78" ry="39" fill="none" stroke="var(--arena-metal)" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 9"/>}
  <g className="socket-motif" fill={`url(#${id}-rim)`} stroke="#30252b" strokeWidth="1.5">
   <path className="motif-organic" d="M30 42Q6 13 40 4L46 30ZM210 42Q234 13 200 4L194 30ZM32 79Q13 106 45 113L48 93ZM208 79Q227 106 195 113L192 93Z"/>
   <path className="motif-leaf" d="M32 39Q2 28 13 7Q36 7 43 28ZM208 39Q238 28 227 7Q204 7 197 28ZM38 91Q8 87 13 110Q36 115 46 96ZM202 91Q232 87 227 110Q204 115 194 96Z"/>
   <path className="motif-shell" d="M87 22Q80 1 94 9Q98-3 108 7Q120-5 132 7Q142-3 146 9Q160 1 153 22ZM94 19 98 11M107 17 110 8M120 16V5M133 17 130 8M146 19 142 11"/>
   <path className="motif-crystal" d="M95 21 103 2 118 15 120 0 136 16 145 8 149 23ZM27 55 12 42 8 65 31 76ZM213 55 228 42 232 65 209 76Z"/>
   <path className="motif-tusk" d="M36 37Q10 34 22 4Q17 27 45 25ZM204 37Q230 34 218 4Q223 27 195 25Z"/>
   <path className="motif-rope" d="M50 25Q120 0 190 25M50 96Q120 120 190 96" fill="none" stroke="var(--arena-metal)" strokeWidth="5" strokeDasharray="4 3"/>
   <path className="motif-scale" d="M91 21 100 8 110 17 120 4 130 17 140 8 149 21M30 40 22 31 17 44M210 40 218 31 223 44"/>
  </g>
 </svg>;
}
