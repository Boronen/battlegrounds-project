import { useLayoutEffect, useRef } from "react";
import type { CombatBeat } from "./combat-presentation";

export function CombatPlayback({
  beat,
  speed,
  onImpact,
  beatKey,
}: {
  beat: CombatBeat;
  speed: number;
  onImpact: (key: string) => void;
  beatKey: string;
}) {
  const anchor = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const arena = anchor.current?.closest(".arena");
    if (!arena) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const unit = (id?: string) =>
      id
        ? arena.querySelector<HTMLElement>(
            '[data-unit-id="' + CSS.escape(id) + '"]',
          )
        : null;
    const attack = beat.events.find((event) => event.type === "attack");
    const actor = unit(attack?.actor);
    const defender = unit(attack?.target);
    let animation: Animation | undefined;
    if (!reduced && actor && defender) {
      const start = actor.getBoundingClientRect();
      const end = defender.getBoundingClientRect();
      const x = end.x - start.x + (end.width - start.width) / 2;
      const y = end.y - start.y + (end.height - start.height) / 2;
      actor.classList.add("combat-striker");
      animation = actor.animate(
        [
          { transform: "none" },
          { transform: "translate(" + x + "px," + y + "px)", offset: 0.55 },
          { transform: "none" },
        ],
        { duration: 500 / speed, easing: "ease-in-out" },
      );
    }
    const images: HTMLImageElement[] = [];
    const targets = new Set(
      beat.events
        .filter(
          (event) =>
            event.type === "damage" ||
            (event.type === "shield" && !event.actor),
        )
        .map((event) => event.target),
    );
    const timer = setTimeout(
      () => {
        onImpact(beatKey);
        for (const id of targets) {
          const target = unit(id);
          if (!target) continue;
          const image = document.createElement("img");
          image.className = "card-hit";
          image.alt = "";
          image.src = reduced ? "/art/hit-still.png" : "/art/hit.png";
          target.append(image);
          images.push(image);
        }
      },
      animation ? 275 / speed : 0,
    );
    return () => {
      clearTimeout(timer);
      animation?.cancel();
      actor?.classList.remove("combat-striker");
      images.forEach((image) => image.remove());
    };
  }, [beat, speed, onImpact, beatKey]);
  return <span ref={anchor} hidden />;
}
