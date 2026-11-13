import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) upgrade művelet típusbiztos parancsobjektuma. */
export class UpgradeTavernCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'upgrade'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
