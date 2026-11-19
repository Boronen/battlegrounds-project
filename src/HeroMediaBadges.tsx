import {HERO_ATTACKS,HERO_MUSIC} from './hero-media';
export function HeroMediaBadges({id}:{id:string|null|undefined}){
 const music=id?HERO_MUSIC[id]:undefined,attack=id?HERO_ATTACKS[id]:undefined;
 return <span className="hero-media-badges">{music&&(music.videoId||music.playlistId)&&<span title={`Saját zene: ${music.label}`} aria-label="Saját zene">♫</span>}{attack&&<span title={attack.label} aria-label={attack.label}>{attack.style==='tire'?'🏍':attack.style==='dumbbell'?'🏋':'🏐'}</span>}</span>;
}
