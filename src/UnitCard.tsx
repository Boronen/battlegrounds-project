import type { CombatEvent, Player, Unit } from "../shared/types";
import { unitDefinition } from "../shared/catalog";
import { minionPrice, powerState } from "../shared/hero-powers";
import { TRIGGER_LABELS, minionAbility } from "../shared/minion-effects";
import { tribeFor, tribeName } from "../shared/tribes";
import { MusicNote } from "@phosphor-icons/react";
import { statLayers } from "./combat-presentation";
import { TribeSurface } from "./TribeSurface";
import { TimingIcon } from "./TimingIcon";
import { KeywordBadges } from "./KeywordBadges";
import seriesAudio from "./series-audio.json";

interface CardProps {
  unit: Unit;
  area: string;
  you: Player;
  active: boolean;
  selected: boolean;
  inspectMode: boolean;
  canAct: boolean;
  visibleEvents: CombatEvent[];
  inspect: (u: Unit) => void;
  onClick: () => void;
}
export function UnitCard({
  unit: u,
  area,
  you,
  active,
  selected,
  inspectMode,
  canAct,
  visibleEvents,
  inspect,
  onClick,
}: CardProps) {
  const c = unitDefinition(u);
  const layers = statLayers(
    u,
    {
      attack: c.attack * (u.golden ? 2 : 1),
      health: c.health * (u.golden ? 2 : 1),
    },
    area === "board" ? you?.board.find((x) => x.uid === u.uid) : undefined,
    visibleEvents,
  );
  const permanent = layers.permanentAttack > 0 || layers.permanentHealth > 0,
    temporary = layers.combatAttack > 0 || layers.combatHealth > 0;
  return (
    <div
      key={u.uid}
      data-unit-id={u.uid}
      className={`unit-wrap ${area} ${selected ? "selected" : ""} ${active ? "attacking" : ""} ${u.health <= 0 ? "dying" : ""} ${temporary ? "combat-buffed" : ""} ${permanent ? "permanent-buffed" : ""}`}
    >
      <button
        data-tribe={tribeFor(c)}
        className={`unit ${u.golden ? "golden" : ""} ${u.shield ? "shielded" : ""} ${u.taunt ? "taunt" : ""}`}
        draggable={false}
        onContextMenu={(e) => {
          e.preventDefault();
          inspect(u);
        }}
        onClick={onClick}
        disabled={
          !inspectMode &&
          ((area === "shop" &&
            (!canAct ||
              you!.gold < minionPrice(you!, u) ||
              you!.hand.length + powerState(you!).spellHand.length >= 10)) ||
            (area === "hand" && !canAct))
        }
        aria-label={`${c.name}, ${u.attack} támadás, ${Math.max(0, u.health)} életerő${permanent ? ", végleges erősítés" : ""}${temporary ? ", harci erősítés" : ""}${area === "shop" ? `, vásárlás ${minionPrice(you!, u)} aranyért` : ""}`}
      >
        {seriesAudio.some((clip) => c.tags.includes(clip.franchise)) && (
          <span
            className="series-audio-badge"
            title="Franchise-hang kijátszáskor"
            aria-label="Hangbejátszás kijátszáskor"
          >
            <MusicNote size={10} weight="bold" />
          </span>
        )}
        <span className="tier-stars" aria-label={`${c.tier}. szint`}>
          {"★".repeat(c.tier)}
        </span>
        <TribeSurface tribe={tribeFor(c)} />
        <TimingIcon trigger={c.ability.trigger} />
        <KeywordBadges keywords={u.keywords} compact />
        <span className="unit-name">
          {u.drunk ? "🍺 " : ""}
          {c.name}
        </span>
        <span className="unit-tribe">{tribeName(tribeFor(c))}</span>
        <span
          className={`stat attack ${layers.combatAttack ? "temporary" : layers.permanentAttack ? "enhanced" : ""}`}
        >
          {u.attack}
        </span>
        <span
          className={`stat health ${layers.damaged ? "wounded" : layers.combatHealth ? "temporary" : layers.permanentHealth ? "enhanced" : ""}`}
        >
          {Math.max(0, u.health)}
        </span>
        {u.shield && <span className="shield-mark">◈</span>}
        {u.taunt && <span className="taunt-mark">Őrző</span>}
        {(permanent || temporary) && (
          <span className="buff-markers">
            {permanent && (
              <span className="permanent-mark" title="Végleges erősítés">
                ↑
              </span>
            )}
            {temporary && (
              <span className="combat-mark" title="Csak erre a harcra">
                ✦
              </span>
            )}
          </span>
        )}
      </button>
      <div className="unit-tooltip">
        <strong>
          {c.name}
          {u.golden ? " • Arany" : ""}
        </strong>
        <KeywordBadges keywords={u.keywords} />
        {minionAbility(u) && (
          <p>
            <b>{TRIGGER_LABELS[c.ability.trigger]}</b> · {c.text}
          </p>
        )}
        <dl className="stat-breakdown">
          <dt>Alapérték</dt>
          <dd>
            {c.attack * (u.golden ? 2 : 1)} / {c.health * (u.golden ? 2 : 1)}
          </dd>
          {permanent && (
            <>
              <dt className="permanent-text">Végleges bónusz</dt>
              <dd className="permanent-text">
                +{layers.permanentAttack} / +{layers.permanentHealth}
              </dd>
            </>
          )}
          {temporary && (
            <>
              <dt className="combat-text">Erre a harcra</dt>
              <dd className="combat-text">
                +{layers.combatAttack} / +{layers.combatHealth}
              </dd>
            </>
          )}
        </dl>
        <small>
          {c.tags.join(" · ")}
          {u.golden && c.ability.effect !== "amplify"
            ? " • Kétszeres hatáserő"
            : ""}
        </small>
      </div>
    </div>
  );
}
