import type { ReactNode } from "react";

export function HeroFrame({ children }: { children: ReactNode }) {
  return (
    <div className="hero-frame">
      <div className="hero-frame-portrait">{children}</div>
    </div>
  );
}
