import { createMatch } from '../engine';
import type { Match } from '../types';
export class MatchFactory {
  create(seed:number, mode:Match['mode']='manual', allBots=false):Match {
    return createMatch(seed,mode,allBots);
  }
}
