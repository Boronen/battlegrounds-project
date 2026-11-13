import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) power művelet típusbiztos parancsobjektuma. */
export class UseHeroPowerCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'power'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
