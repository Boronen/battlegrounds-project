import { fight } from '../combat';
import type { Unit } from '../types';
export class CombatService {
  simulate(left:Unit[],right:Unit[],seed:number){return fight(left,right,seed);}
}
