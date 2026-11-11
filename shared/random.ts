export interface RandomState { rng:number }
export function random(s:RandomState){ let x=s.rng|0; x^=x<<13;x^=x>>>17;x^=x<<5;s.rng=x>>>0;return s.rng/4294967296; }
export function pick<T>(s:RandomState,list:T[]):T { if(!list.length)throw new Error('Empty random choice');return list[Math.floor(random(s)*list.length)]; }
export function shuffle<T>(s:RandomState,list:T[]):T[]{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
