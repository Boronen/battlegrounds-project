import { createMatch } from '../engine';
import type { Match } from '../types';
export class MatchFactory {
  create(seed:number, mode:Match['mode']='manual', allBots=false,humanNames?:string[]):Match {
    return createMatch(seed,mode,allBots,humanNames);
  }
}
