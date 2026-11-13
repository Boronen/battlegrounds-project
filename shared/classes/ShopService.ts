import { fillShop } from '../engine';
import type { Match, Player } from '../types';
/** Belső motorsegéd; fizetős játékosművelethez RefreshShopCommand használandó. */
export class ShopService {
  fill(match:Match,player:Player,keep=false):void {fillShop(match,player,keep);}
}
