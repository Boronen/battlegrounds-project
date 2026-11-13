import {writeFileSync} from 'node:fs';
import {HEROES} from '../shared/catalog';

// Stylized avatars, not representations of the real people's appearance.
// Explicit combinations give each hero a different silhouette and accessories.
const profiles:[hair:number,accessory:string,color:string,hairColor:string][]=[
 [0,'jacket','#407e84','#40332d'],[1,'visor','#a26437','#302b31'],
 [2,'round-glasses','#856998','#453237'],[3,'square-glasses','#466c9b','#252b37'],
 [4,'scarf','#a56677','#6b402c'],[5,'beret','#5c927f','#322b30'],
 [6,'earrings','#957258','#3b3038'],[0,'tie','#527d70','#44332d'],
 [7,'headphones','#8c5798','#272631'],[1,'square-glasses','#657b9c','#5b4736'],
 [3,'cap','#858157','#302f36'],[0,'headband','#9f624d','#302b29'],
 [7,'earphones','#506d92','#503a2e'],[1,'round-glasses','#477e83','#382a2a'],
 [4,'ribbon','#9d728f','#7e5434'],[3,'jacket','#8e7545','#483b32'],
 [5,'earrings','#5c7f9c','#4e3435'],[6,'headband','#587e58','#3e3431'],
 [2,'headphones','#926a78','#3c2d32'],[5,'scarf','#597e87','#725139'],
 [7,'cap','#8b6a4c','#3b2d27'],[3,'headphones','#65795b','#30282b'],
 [1,'tie','#5b6989','#5d493c'],[4,'beret','#a35e45','#934e32'],
 [0,'square-glasses','#677e86','#56453e'],[6,'jacket','#95714a','#342a2a'],
 [2,'scarf','#638875','#8b6544'],[7,'round-glasses','#68708a','#302b30'],
 [1,'bowtie','#785b86','#3b302d'],[3,'tie','#96794d','#55483b'],
 [0,'round-glasses','#507c70','#77706a'],[6,'square-glasses','#985d4f','#985b3b'],
 [2,'earrings','#80627d','#716056'],[7,'bowtie','#5b7f99','#46312c'],
];
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const hair=[
 'M58 91Q49 35 92 31Q147 23 145 91L129 67 105 55 80 73Z',
 'M57 83Q58 30 99 30Q144 30 145 82L126 58 66 70Z',
 'M48 132L49 73Q49 25 99 29Q151 24 152 79L151 139 132 127 128 67 76 67 68 133Z',
 'M57 76L57 38 72 48 88 27 104 42 130 29 145 59 141 84 119 59 79 62Z',
 'M46 99Q18 39 60 34Q78 20 91 41Q142 17 148 79L132 81Q122 47 77 70L65 101Z',
 'M53 112Q36 58 65 38Q98 15 132 41Q162 69 143 117L131 72 102 51 68 84Z',
 'M60 82Q55 38 98 35Q142 35 143 85L130 65 75 63Z',
 'M52 96Q42 60 64 43Q76 21 97 36Q121 20 137 42Q159 60 148 96L130 73 117 58 98 71 80 59 69 91Z',
];
function accessory(kind:string){
 if(kind==='round-glasses')return '<g fill="none" stroke="#dbca9b" stroke-width="4"><circle cx="82" cy="99" r="15"/><circle cx="119" cy="99" r="15"/><path d="M97 97H104M64 95 56 91M135 95 144 91"/></g>';
 if(kind==='square-glasses')return '<g fill="#26384566" stroke="#d6cfb9" stroke-width="4"><rect x="65" y="87" width="30" height="23" rx="5"/><rect x="106" y="87" width="30" height="23" rx="5"/><path d="M95 94H106"/></g>';
 if(kind==='visor')return '<path d="M51 91Q43 26 99 24Q155 26 151 96L137 112 133 76 67 76 65 112Z" fill="#303e4e" stroke="#ddc6a0" stroke-width="3"/><path d="M63 72H138L133 98H68Z" fill="#74a9b3" stroke="#c4d7ce" stroke-width="3"/><path d="M76 76 91 94" stroke="#d4ece9" opacity=".6" stroke-width="5"/>';
 if(kind==='cap')return '<path d="M51 69Q53 23 100 25Q142 27 146 69Z" fill="#c5b680"/><path d="M51 69Q94 53 151 69L163 80 53 78Z" fill="#e0d3a1"/>';
 if(kind==='beret')return '<path d="M47 58Q37 23 90 22Q142 9 151 47L135 67 65 71Z" fill="#c6a68c"/><path d="M94 23 100 12" stroke="#d9c4a6" stroke-width="5"/>';
 if(kind==='headband')return '<path d="M57 76Q101 62 143 77" fill="none" stroke="#e1c69e" stroke-width="12"/><path d="M141 77 161 100 146 101" fill="#e1c69e"/>';
 if(kind==='ribbon')return '<path d="M48 62 28 42 25 80 48 69 70 80 70 44Z" fill="#dbb8b3"/><circle cx="48" cy="65" r="7" fill="#eee0c0"/>';
 if(kind==='headphones')return '<path d="M48 106V75Q49 26 100 26Q152 26 152 75V106" fill="none" stroke="#cab787" stroke-width="9"/><rect x="41" y="83" width="16" height="39" rx="8" fill="#d1c6ae"/><rect x="144" y="83" width="16" height="39" rx="8" fill="#d1c6ae"/>';
 if(kind==='earrings')return '<g fill="none" stroke="#e9cf91" stroke-width="4"><circle cx="59" cy="121" r="9"/><circle cx="143" cy="121" r="9"/></g>';
 if(kind==='earphones')return '<path d="M61 110 80 150V190M139 110 120 150V190" stroke="#e2d5b8" stroke-width="3" fill="none"/><circle cx="61" cy="109" r="5" fill="#f1e4ca"/><circle cx="139" cy="109" r="5" fill="#f1e4ca"/>';
 if(kind==='scarf')return '<path d="M71 151Q100 165 129 151L135 170 104 181 71 172Z" fill="#dfbe88"/><path d="M105 176 122 217 141 213 123 168" fill="#ccb17e"/>';
 if(kind==='bowtie')return '<path d="M99 173 78 162V187L99 178 122 188V162Z" fill="#e4c590"/><circle cx="100" cy="176" r="6" fill="#f0dfb5"/>';
 if(kind==='tie')return '<path d="M93 166H107L110 178 100 213 90 178Z" fill="#e2c58e"/>';
 return '<path d="M75 155 86 197 99 180 116 199 129 155" fill="none" stroke="#d3bc99" stroke-width="4"/>';
}
for(const [index,h] of HEROES.entries()){
 const [style,detail,color,hairColor]=profiles[index];
 const skin=['#dab397','#cfa88b','#e3c3a8','#bd937a'][index%4];
 const faceWidth=[37,34,39,35][index%4];
 const mouth=index%3===0?'M87 128Q100 139 114 126':index%3===1?'M89 130Q102 134 112 128':'M91 131H111';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" role="img" aria-labelledby="title"><title id="title">${esc(h.name)} — stylized hero avatar</title><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#171d29"/></linearGradient></defs><rect width="200" height="220" rx="20" fill="url(#bg)"/><circle cx="100" cy="95" r="78" fill="none" stroke="#e8d4a8" stroke-opacity=".15"/><path d="M17 211 183 39M-8 168 158 2" stroke="#ffffff" stroke-opacity=".04" stroke-width="25"/><path d="M27 220Q27 163 70 153L130 153Q173 163 173 220" fill="${color}" stroke="#141c28" stroke-width="3"/><path d="M76 150 100 178 124 150" fill="#eee0bf"/><path d="M85 131H116V158Q100 174 85 158Z" fill="${skin}"/><path d="${hair[style]}" fill="${hairColor}"/><ellipse cx="100" cy="98" rx="${faceWidth}" ry="47" fill="${skin}"/><ellipse cx="61" cy="105" rx="7" ry="12" fill="${skin}"/><ellipse cx="139" cy="105" rx="7" ry="12" fill="${skin}"/><path d="${hair[style]}" fill="${hairColor}"/><path d="M74 86 88 84M111 84 125 87" stroke="${hairColor}" stroke-width="3" stroke-linecap="round"/><g fill="#30303a"><ellipse cx="82" cy="100" rx="3" ry="4"/><ellipse cx="119" cy="100" rx="3" ry="4"/></g><path d="M100 102 96 117 103 118" fill="none" stroke="#8e6659" stroke-width="2" stroke-linecap="round"/><path d="${mouth}" fill="none" stroke="#80584f" stroke-width="2.5" stroke-linecap="round"/>${accessory(detail)}<path d="M37 214H163" stroke="#dfcba1" stroke-opacity=".4"/><rect x="8" y="8" width="184" height="204" rx="16" fill="none" stroke="#ead3a3" stroke-opacity=".3"/></svg>`;
 writeFileSync(new URL(`../public/portraits/${index+1}.svg`,import.meta.url),svg);
}
console.log(`Generated ${HEROES.length} distinct stylized hero avatars.`);
