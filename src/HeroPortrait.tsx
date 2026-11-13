import {hero} from '../shared/catalog';
export function HeroPortrait({id,merchant=false}:{id:string|null;merchant?:boolean}){
 return <img className="hero-character-art" src={merchant?'/portraits/sketch/19.png':hero(id)?.portrait||'/portraits/sketch/1.png'} alt={merchant?'A Büfés':hero(id)?.name||'Hős'} draggable={false}/>;
}
