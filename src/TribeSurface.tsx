import type { CardType } from '../shared/tribes';

// One abstract surface per tribe, shared by every card. No minion-specific assets.
export function TribeSurface({tribe}:{tribe:CardType}) {
 return <span className="tribe-surface" data-tribe={tribe} aria-hidden="true"><span className="surface-arch"/><span className="surface-orbit"/><span className="surface-rule"/></span>;
}
