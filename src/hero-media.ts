export type AttackStyle='tire'|'dumbbell'|'volleyball';
export interface HeroMusic { label:string; videoId?:string; playlistId?:string; url:string }
const youtube=(videoId:string):HeroMusic=>({label:'Az űrlapban választott zene',videoId,url:`https://www.youtube.com/watch?v=${videoId}`});
export const HERO_MUSIC:Record<string,HeroMusic>={
 'original-12':youtube('iqlVtWlotq4'), // Kevin — explicit user mapping
 'original-1':youtube('EgAOqt8I5ac'),
 'original-3':youtube('kOL7aeIDruA'),
 'original-4':youtube('LcrnbWhlE0c'),
 'original-2':youtube('9ryq7imPs2w'),
 'original-23':youtube('fHI8X4OXluQ'),
 'original-13':youtube('jT1g0G82He0'),
 'original-5':youtube('nyuo9-OjNNg'),
 'original-17':youtube('wA1LKdGwFgc'),
 'original-35':{label:'Hiperkarma – Amondó',playlistId:'OLAK5uy_nhFewuG-aYt7t85pGbRvBgC4r88-kADX8',url:'https://www.youtube.com/playlist?list=OLAK5uy_nhFewuG-aYt7t85pGbRvBgC4r88-kADX8'},
 // Artist-only answers use explicit, documented default tracks.
 'original-26':{...youtube('1ZlRihc3bw4'),label:'Palya Bea – Szabadon (előadói válaszból választva)'},
 'original-10':{...youtube('EGXPAoyP_cg'),label:'Chris Christodoulou – The Rain Formerly Known as Purple'},
 'original-14':{label:'Slipknot – The Devil in I',videoId:'XEEasR7hVhA',url:'https://www.youtube.com/watch?v=XEEasR7hVhA'},
};
export const HERO_ATTACKS:Record<string,{style:AttackStyle;label:string}>={
 'original-2':{style:'tire',label:'Motoros guminyom'},
 'original-12':{style:'dumbbell',label:'Repülő súlyzó'},
 'original-1':{style:'volleyball',label:'Röplabda'},
};
