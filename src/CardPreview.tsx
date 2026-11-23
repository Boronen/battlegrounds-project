import { useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function CardPreview({ children }: { children: ReactNode }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const parent = anchor.current?.parentElement;
    const card = popup.current;
    if (!parent || !card) return;
    const hide = () => {
      card.hidden = true;
    };
    const show = () => {
      const box = parent.getBoundingClientRect();
      card.hidden = false;
      card.style.left =
        Math.max(8, Math.min(box.left, innerWidth - card.offsetWidth - 8)) +
        "px";
      const above = box.top - card.offsetHeight - 8;
      card.style.top =
        Math.max(
          8,
          above >= 8
            ? above
            : Math.min(box.bottom + 8, innerHeight - card.offsetHeight - 8),
        ) + "px";
    };
    const events = new AbortController();
    const options = { signal: events.signal };
    parent.addEventListener("pointerenter", show, options);
    parent.addEventListener("pointerleave", hide, options);
    parent.addEventListener("focusin", show, options);
    parent.addEventListener("focusout", hide, options);
    window.addEventListener("scroll", hide, { ...options, capture: true });
    window.addEventListener("resize", hide, options);
    return () => events.abort();
  }, []);
  return (
    <>
      <span ref={anchor} hidden />
      {createPortal(
        <div ref={popup} className="card-preview" hidden aria-hidden="true">
          {children}
        </div>,
        document.body,
      )}
    </>
  );
}
