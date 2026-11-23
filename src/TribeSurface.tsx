import type { CardType } from "../shared/tribes";

export function TribeSurface({ tribe }: { tribe: CardType }) {
  return (
    <img
      className="tribe-surface"
      src={"/art/tribes/" + tribe + ".webp"}
      alt=""
      draggable={false}
    />
  );
}
