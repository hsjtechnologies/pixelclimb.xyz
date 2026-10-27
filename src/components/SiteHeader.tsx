"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import pcmbLogo from "../app/images/pcmb-logo.png";

const NAV = [
  { id: "game", label: "Game" },
  { id: "token", label: "Token" },
  { id: "investors", label: "Investors" },
];

export default function SiteHeader({ playHref }: { playHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // A section is "active" while it crosses the band just below the header.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? null : cur));
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const raised = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`mx-auto max-w-6xl rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo ${
          raised
            ? "border-line bg-background/75 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="flex h-14 items-center justify-between pl-3 pr-2 sm:pl-4">
          <a href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Image
              src={pcmbLogo}
              alt=""
              width={26}
              height={26}
              className="pixelated transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:rotate-12"
              priority
            />
            <span className="font-pixel text-[15px] tracking-wide">PIXEL CLIMB</span>
          </a>

          <ul className="hidden items-center gap-1 text-sm md:flex">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`relative isolate rounded-full px-4 py-2 transition-colors duration-300 ${
                    active === id ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`absolute inset-0 -z-10 rounded-full bg-white/6 transition-[opacity,transform] duration-500 ease-out-expo ${
                      active === id ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                    aria-hidden
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href={playHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition-[transform,background-color] duration-300 hover:bg-white/85 active:scale-[0.97]"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M4 2.5v11l9-5.5-9-5.5z" />
              </svg>
              Play
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-9 w-9 place-items-center rounded-xl text-foreground transition-colors hover:bg-white/6 md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ease-out-expo ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ease-out-expo ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </nav>

        <div id="mobile-nav" className="menu-collapse md:hidden" data-open={open}>
          <div className="overflow-hidden">
            <ul className="flex flex-col gap-1 px-2 pb-3 pt-1" inert={!open}>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-white/5"
                  >
                    {label}
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-pcmb-blue transition-opacity ${active === id ? "opacity-100" : "opacity-0"}`}
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="scroll-progress absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-pcmb-indigo via-pcmb-blue to-pcmb-cyan"
        aria-hidden
      />
    </header>
  );
}
