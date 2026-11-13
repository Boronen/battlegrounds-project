import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) reorder művelet típusbiztos parancsobjektuma. */
export class ReorderBoardCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'reorder'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
