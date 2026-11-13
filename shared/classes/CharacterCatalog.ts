import { CHARACTERS, character } from '../catalog';
export class CharacterCatalog {
  all(){return structuredClone(CHARACTERS);}
  find(id:number){return structuredClone(character(id));}
  forTier(tier:number){return this.all().filter(c=>c.tier===tier);}
}
