# BG – 21 új TypeScript-osztály

A `shared/classes/` mappa 21 osztályt tartalmaz, külön fájlokban. A GameCommand csak interfész, nem számít bele. A korábbi Session és RuleError továbbra is megmarad.

A parancsobjektumok a meglévő tranzakciós motort használják: egy elutasított művelet nem változtatja meg sem az állapotot, sem a véletlenszám-generátort. A Session és a replay a MatchController osztályon keresztül hajtja végre a műveleteket. Ez osztályalapú hozzáférési réteg; a motor belső algoritmusai továbbra is függvények.

| Osztály | Feladat |
|---|---|
| ChooseHeroCommand | `chooseHero` játékosparancs |
| BuyUnitCommand | `buy` játékosparancs |
| SellUnitCommand | `sell` játékosparancs |
| PlayUnitCommand | `play` játékosparancs |
| ReorderBoardCommand | `reorder` játékosparancs |
| RefreshShopCommand | `refresh` játékosparancs |
| FreezeShopCommand | `freeze` játékosparancs |
| UpgradeTavernCommand | `upgrade` játékosparancs |
| DiscoverUnitCommand | `discover` játékosparancs |
| UseHeroPowerCommand | `power` játékosparancs |
| ReadyCommand | `ready` játékosparancs |
| MatchFactory | Meccs létrehozása |
| UnitFactory | Egység létrehozása |
| CharacterCatalog | Karakterek lekérése és szint szerinti szűrése |
| HeroCatalog | Hősök lekérése |
| ShopService | Belső boltfeltöltés |
| CombatService | Izolált harcszimuláció |
| BotService | Bot körének végrehajtása |
| RoundService | Fázisváltás és automatikus léptetés |
| MatchValidator | Állapotkorlátok és pool megmaradásának ellenőrzése |
| MatchController | Parancsok létrehozása és végrehajtása |

```ts
import { MatchFactory, MatchController } from './shared/classes';
const match = new MatchFactory().create(123);
const controller = new MatchController();
controller.execute(match, 'p0', {
  type: 'chooseHero', heroId: match.players[0].heroOffers[0],
});
```

A hálózati payloadok sima adatok maradnak. A böngészőtől érkező objektumot a szerver validálja, mielőtt osztálypéldányt hoz létre. A ShopService és UnitFactory belső segédek, nem kerülhetik meg a játékosparancsok ellenőrzését.
