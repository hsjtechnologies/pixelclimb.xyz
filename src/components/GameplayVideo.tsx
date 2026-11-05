"use client";

import { useEffect, useRef } from "react";

/**
 * Hero gameplay clip. Autoplays only for users without a reduced-motion
 * preference; everyone else gets the poster, and the `<video>` never starts
 * on its own so a failed hydration can't leave it running.
 */
export default function GameplayVideo({
  className,
  width,
  height,
  poster,
  label,
}: {
  className?: string;
  width: number;
  height: number;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {
      /* Autoplay blocked: the poster stays put. */
    });
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
    >
      <source src="/media/gameplay.webm" type="video/webm" />
      <source src="/media/gameplay.mp4" type="video/mp4" />
    </video>
  );
}
