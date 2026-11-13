import { HEROES, hero } from '../catalog';
export class HeroCatalog {
  all(){return structuredClone(HEROES);}
  find(id:string){const result=hero(id);return result?structuredClone(result):null;}
}
