"use client";

import { useEffect } from "react";

/**
 * Page-wide motion controller. Renders nothing; wires up:
 * - `[data-reveal]`: one-shot reveal when scrolled into view
 * - `[data-play]`: loops that only run while on screen
 * - `[data-spotlight]`: cursor-following glow (--mx / --my)
 * - `[data-tilt]`: pointer-driven tilt for children using `.tilt` (--rx / --ry)
 * One IntersectionObserver and one rAF-throttled pointer listener cover all of it.
 */
export default function Motion() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) {
            target.setAttribute("data-in", "");
            if (!target.hasAttribute("data-play")) io.unobserve(target);
          } else if (target.hasAttribute("data-play")) {
            target.removeAttribute("data-in");
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal], [data-play]").forEach((el) => io.observe(el));

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer) return () => io.disconnect();

    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const update = () => {
      frame = 0;
      if (!last) return;
      const target = last.target instanceof Element ? last.target : null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${last.clientX - r.left}px`);
        spot.style.setProperty("--my", `${last.clientY - r.top}px`);
      }

      const tilt = reduced ? null : target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== tilt) {
        tilted.style.removeProperty("--rx");
        tilted.style.removeProperty("--ry");
      }
      tilted = tilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (last.clientX - r.left) / r.width - 0.5;
        const y = (last.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onLeave = () => {
      tilted?.style.removeProperty("--rx");
      tilted?.style.removeProperty("--ry");
      tilted = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
