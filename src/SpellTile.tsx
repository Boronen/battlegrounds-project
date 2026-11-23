import { CardPreview } from "./CardPreview";
import { GameIcon } from "./GameIcon";
import { GameDialog } from "./GameDialog";
import { useState } from "react";
import { UPGRADE_NAMES, upgradeText } from "../shared/hero-powers";
import type { SpellCard } from "../shared/types";

export function SpellTile({
  card,
  zone,
  price,
  disabled,
  onClick,
}: {
  card: SpellCard;
  zone: "shop" | "hand";
  price?: number;
  disabled: boolean;
  onClick: () => void;
}) {
  const name = UPGRADE_NAMES[card.kind];
  const description = upgradeText(card.kind, card.tier);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div
      className={zone === "shop" ? "spell-offer" : "spell-in-hand"}
      tabIndex={disabled ? 0 : undefined}
      data-spell-id={card.uid}
      data-zone={zone}
      onContextMenu={(event) => {
        event.preventDefault();
        setShowDetails(true);
      }}
    >
      <button
        type="button"
        className="spell-card"
        aria-label={`${name} · ${description} · ${zone === "shop" ? `${price} arany` : "Kijátszás"}`}
        disabled={disabled}
        onClick={onClick}
      >
        <GameIcon name="spark" />
        <strong>{name}</strong>
        {zone === "shop" && <small>{price} ◉</small>}
      </button>
      <CardPreview>
        <strong>{name}</strong>
        <p>{description}</p>
      </CardPreview>
      <button type="button" className="spell-details" aria-label={name + " leírása"} onClick={() => setShowDetails(true)}>i</button>
      {showDetails && <GameDialog open title={name} onClose={() => setShowDetails(false)}><p>{description}</p></GameDialog>}
    </div>
  );
}
