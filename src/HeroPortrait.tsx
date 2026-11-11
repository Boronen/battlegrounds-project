import {hero} from '../shared/catalog';
const portraits:Record<string,number>={mentor:25,guardian:12,treasurer:34,inventor:4};
export function HeroPortrait({id,merchant=false}:{id:string|null;merchant?:boolean}){
 return <img className="hero-character-art" src={`/portraits/${merchant?19:portraits[id||'']||1}.svg`} alt={merchant?'A Büfés':hero(id)?.name||'Hős'} draggable={false}/>;
}
