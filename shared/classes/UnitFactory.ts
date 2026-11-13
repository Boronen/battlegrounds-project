import { makeUnit } from '../engine';
import type { Match } from '../types';
export class UnitFactory {
  create(match:Match,characterId:number,golden=false){return makeUnit(match,characterId,golden);}
}
