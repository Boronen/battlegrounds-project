import { ChooseHeroCommand } from './ChooseHeroCommand';
import { BuyUnitCommand } from './BuyUnitCommand';
import { SellUnitCommand } from './SellUnitCommand';
import { PlayUnitCommand } from './PlayUnitCommand';
import { ReorderBoardCommand } from './ReorderBoardCommand';
import { RefreshShopCommand } from './RefreshShopCommand';
import { FreezeShopCommand } from './FreezeShopCommand';
import { UpgradeTavernCommand } from './UpgradeTavernCommand';
import { DiscoverUnitCommand } from './DiscoverUnitCommand';
import { UseHeroPowerCommand } from './UseHeroPowerCommand';
import { ReadyCommand } from './ReadyCommand';
import { RuleError } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A szerver és a replay közös parancsbelépési pontja. */
export class MatchController {
  command(action:Action):GameCommand {
    switch(action.type){
      case 'rerollHeroes':case 'chooseHero':return new ChooseHeroCommand(structuredClone(action));
      case 'buy':return new BuyUnitCommand(structuredClone(action));
      case 'sell':return new SellUnitCommand(structuredClone(action));
      case 'play':return new PlayUnitCommand(structuredClone(action));
      case 'reorder':return new ReorderBoardCommand(structuredClone(action));
      case 'refresh':return new RefreshShopCommand(structuredClone(action));
      case 'freeze':return new FreezeShopCommand(structuredClone(action));
      case 'upgrade':return new UpgradeTavernCommand(structuredClone(action));
      case 'discover':return new DiscoverUnitCommand(structuredClone(action));
      case 'power':return new UseHeroPowerCommand(structuredClone(action));
      case 'ready':return new ReadyCommand(structuredClone(action));
      default:throw new RuleError('INVALID','Ismeretlen művelet.');
    }
  }
  execute(match:Match,playerId:string,action:Action):void {
    this.command(action).execute(match,playerId);
  }
}
