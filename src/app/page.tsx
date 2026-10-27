import Image from "next/image";
import type { CSSProperties } from "react";
import Motion from "@/components/Motion";
import SiteHeader from "@/components/SiteHeader";
import pcmbLogo from "./images/pcmb-logo.png";

const LINKS = {
  play: "https://play.google.com/store/apps/details?id=com.harvz.pixelclimb",
  hackathon: "https://nearhackathon.com",
  deck: "https://docs.google.com/presentation/d/16RyBghsvNW822D_68EvWE-_b2ZL5Y8TkQRFif1F48lc/edit?usp=sharing",
  x: "https://x.com/pixelclimb",
  email: "mailto:support@pixelclimb.xyz",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const TICKER = [
  "Built on NEAR",
  "NEP-141 Token · $PCMB",
  "Live on Google Play",
  "Free to play",
  "One-tap gameplay",
  "Endless floors",
];

const TICKER_COLORS = ["bg-pcmb-blue", "bg-pcmb-yellow", "bg-pcmb-green", "bg-pcmb-red", "bg-pcmb-cyan", "bg-pcmb-orange"];

const GAMEPLAY = [
  {
    tag: "01",
    title: "One tap. That's it.",
    body: "Tap to jump between walls. Easy to pick up, and hard to put down once you're chasing a new floor.",
    art: <TapArt />,
  },
  {
    tag: "02",
    title: "Climb endless floors",
    body: "Platforms shift with every floor. The higher you go, the faster you need to react.",
    art: <FloorsArt />,
  },
  {
    tag: "03",
    title: "Collect gems, top the board",
    body: "Pick up gems on the way up, beat your daily high, and go for the top of the leaderboard.",
    art: <GemsArt />,
  },
];

const THESIS = [
  {
    k: "Market",
    title: "Hyper-casual reach",
    body: "The most downloaded genre on mobile. Short sessions and instant onboarding bring in players who would never open a wallet first.",
  },
  {
    k: "Chain",
    title: "NEAR-native",
    body: "Fast finality and low fees make on-chain micro-rewards practical, and players never have to notice the chain.",
  },
  {
    k: "Product",
    title: "Shipped, not slideware",
    body: "Playable today on Google Play. Web3 is added on top of a game that is already fun, not the other way around.",
  },
  {
    k: "Token",
    title: "Aligned economy",
    body: "$PCMB is both the native in-game currency and the governance token, so players have a say in the game's direction.",
  },
];

const TOKEN_SPECS = [
  ["Symbol", "PCMB"],
  ["Standard", "NEP-141"],
  ["Network", "NEAR · Testnet"],
  ["Role", "Native + Governance"],
];

const HACKATHONS = [
  {
    label: "NEAR Hackathon · Games With Real Economies",
    href: LINKS.hackathon,
  },
];

/* Wall platforms in the game's palette, tiled vertically by `.shaft` */
const SHAFT_PLATFORMS: [number, number, string][] = [
  [30, 92, "#f60000"],
  [130, 64, "#ff8c00"],
  [210, 100, "#4815aa"],
  [300, 72, "#4de94c"],
  [390, 88, "#3783ff"],
  [470, 60, "#ffee00"],
  [560, 84, "#2ef2ff"],
];
const SHAFT_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='640' viewBox='0 0 120 640' preserveAspectRatio='none'>${SHAFT_PLATFORMS.map(
    ([y, w, c]) => `<polygon points='0,${y + 4} ${w},${y - 6} ${w - 5},${y + 16} 0,${y + 24}' fill='${c}'/>`,
  ).join("")}</svg>`,
)}")`;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-pcmb-blue">
      <span className="h-1.5 w-1.5 bg-pcmb-blue" aria-hidden />
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      {...external}
      className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-pcmb-blue px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_40px_-10px_var(--blue)] transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_16px_50px_-10px_var(--blue)] active:translate-y-0 active:scale-[0.98]"
    >
      {/* sheen sweep on hover */}
      <span
        className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-[300%]"
        aria-hidden
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      {...(href.startsWith("mailto:") ? {} : external)}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white/3 px-6 text-sm font-semibold text-foreground backdrop-blur transition-[transform,background-color,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/6 active:translate-y-0 active:scale-[0.98]"
    >
      {children}
    </a>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4 2.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

function Shaft({ tile = 640, className = "" }: { tile?: number; className?: string }) {
  return (
    <div
      className={`shaft ${className}`}
      style={{ ...vars({ "--tile": `${tile}px` }), backgroundImage: SHAFT_TILE }}
      aria-hidden
    />
  );
}

/* ───────────────────────── Card illustrations ───────────────────────── */

function TapArt() {
  return (
    <>
      <span className="absolute inset-y-0 left-4 w-1 bg-pcmb-gray/50" />
      <span className="absolute inset-y-0 right-4 w-1 bg-pcmb-gray/50" />
      <span className="absolute left-5 top-8 h-2.5 w-10 -skew-y-6 bg-pcmb-red" />
      <span className="absolute right-5 top-16 h-2.5 w-8 skew-y-6 bg-pcmb-orange" />
      <div className="hop-x absolute bottom-7 left-5">
        <div className="hop-y">
          <div className="hop-r h-3.5 w-3.5 bg-pcmb-yellow shadow-[0_0_16px_rgba(255,238,0,0.6)]" />
        </div>
      </div>
      <span className="tap-ring absolute bottom-3 left-1/2 -ml-5 h-10 w-10 rounded-full border border-white/50" />
    </>
  );
}

function FloorsArt() {
  return (
    <>
      <div className="absolute inset-y-0 left-0 w-2/5 overflow-hidden border-l-4 border-pcmb-gray/50">
        <Shaft tile={320} className="[animation-duration:5s]" />
      </div>
      <div className="absolute inset-y-0 right-0 w-2/5 -scale-x-100 overflow-hidden border-l-4 border-pcmb-gray/50">
        <Shaft tile={320} className="[animation-duration:5s] [animation-delay:-2.3s]" />
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="bob h-3.5 w-3.5 bg-pcmb-yellow shadow-[0_0_16px_rgba(255,238,0,0.6)]" />
      </div>
    </>
  );
}

function GemsArt() {
  return (
    <>
      <div className="absolute left-1/2 top-7 -ml-6">
        <svg className="gem h-11 w-12 drop-shadow-[0_0_14px_rgba(46,242,255,0.55)]" viewBox="0 0 16 14" shapeRendering="crispEdges">
          <polygon points="4,0 12,0 16,5 8,14 0,5" fill="var(--cyan)" />
          <polygon points="4,0 12,0 16,5 0,5" fill="#9ffaff" />
          <polygon points="4,0 8,0 6,5 0,5" fill="#ffffff" opacity="0.7" />
        </svg>
      </div>
      <span className="sparkle absolute left-[34%] top-6 h-1.5 w-1.5 bg-white" />
      <span className="sparkle absolute right-[33%] top-14 h-1 w-1 bg-pcmb-cyan [animation-delay:-0.8s]" />
      <span className="sparkle absolute left-[40%] top-20 h-1 w-1 bg-white [animation-delay:-1.6s]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2">
        {[
          ["h-10", "bg-pcmb-blue/80"],
          ["h-16", "bg-pcmb-yellow"],
          ["h-7", "bg-pcmb-indigo"],
        ].map(([h, c], i) => (
          <span key={i} className={`podium w-10 rounded-t-sm ${h} ${c}`} style={vars({ "--i": i })} />
        ))}
      </div>
    </>
  );
}

function PhoneMockup() {
  return (
    <div className="intro relative mx-auto w-60 sm:w-67.5 lg:w-75" style={vars({ "--i": 3 })}>
      <div className="tilt relative">
        <div className="absolute -inset-12 -z-10 rounded-full bg-pcmb-blue/25 blur-3xl" aria-hidden />
        <div className="border-glow rounded-[2.75rem] bg-linear-to-b from-white/10 to-white/2 p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative overflow-hidden rounded-[2.1rem] bg-white">
            <video
              className="block h-auto w-full"
              width={576}
              height={1012}
              poster="/media/gameplay-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Pixel Climb gameplay: a yellow block jumping between colored platforms"
            >
              <source src="/media/gameplay.webm" type="video/webm" />
              <source src="/media/gameplay.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      {/* floating platforms */}
      <span className="platform absolute -left-10 top-16 h-3 w-14 rounded-xs bg-pcmb-red/90" aria-hidden />
      <span className="platform absolute -right-12 top-40 h-3 w-16 rounded-xs bg-pcmb-green/90 [animation-delay:-2s]" aria-hidden />
      <span className="platform absolute -left-14 bottom-28 h-3 w-12 rounded-xs bg-pcmb-indigo [animation-delay:-4s]" aria-hidden />
      <span className="platform absolute -right-8 bottom-12 h-3 w-10 rounded-xs bg-pcmb-yellow/90 [animation-delay:-1s]" aria-hidden />
    </div>
  );
}

function TokenStage() {
  return (
    <div
      data-reveal
      data-play
      className="border-glow relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-surface"
    >
      <div className="bg-grid-sm absolute inset-0 mask-[radial-gradient(circle_at_50%_45%,#000_20%,transparent_70%)]" aria-hidden />
      <div className="absolute left-1/2 top-[45%] h-[78%] w-[78%] -translate-1/2" aria-hidden>
        <div className="spin-slow h-full w-full rounded-full border border-dashed border-white/10" />
      </div>
      <div className="absolute left-1/2 top-[45%] h-[56%] w-[56%] -translate-1/2" aria-hidden>
        <div className="spin-slow-rev relative h-full w-full rounded-full border border-pcmb-blue/25">
          <span className="absolute -top-1 left-1/2 -ml-1 h-2 w-2 bg-pcmb-blue" />
          <span className="absolute -bottom-1 left-1/2 -ml-1 h-2 w-2 bg-pcmb-cyan" />
        </div>
      </div>
      <div className="absolute left-1/2 top-[45%] h-40 w-40 -translate-1/2 rounded-full bg-pcmb-blue/30 blur-3xl" aria-hidden />

      <div className="absolute left-1/2 top-[45%] h-32 w-32 -translate-1/2 perspective-[800px] sm:h-36 sm:w-36">
        <div className="coin relative h-full w-full">
          <Image src={pcmbLogo} alt="PCMB token" fill sizes="144px" className="coin-face pixelated object-contain" />
          <Image src={pcmbLogo} alt="" fill sizes="144px" className="coin-face coin-back pixelated object-contain" />
        </div>
      </div>
      <div className="coin-shadow absolute left-1/2 top-[70%] -ml-12 h-3 w-24 rounded-[50%] bg-black/70 blur-sm" aria-hidden />

      <span className="absolute right-5 top-5 rounded-full border border-pcmb-orange/30 bg-pcmb-orange/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-pcmb-orange">
        Testnet
      </span>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
        <div>
          <p className="font-pixel text-xl leading-none">PCMB</p>
          <p className="mt-1.5 text-xs text-muted">Pixel Climb Token</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">NEP-141</p>
      </div>
    </div>
  );
}

function Stairs() {
  const steps = ["bg-pcmb-red", "bg-pcmb-orange", "bg-pcmb-green", "bg-pcmb-cyan", "bg-pcmb-blue"];
  return (
    <div data-play className="relative mx-auto h-28 w-68" aria-hidden>
      {steps.map((c, i) => (
        <span
          key={c}
          className={`absolute h-1.5 w-12 rounded-xs ${c}`}
          style={{ left: i * 56, bottom: i * 20 }}
        />
      ))}
      <span className="stair-hop absolute bottom-0 left-0 h-3 w-3 bg-pcmb-yellow shadow-[0_0_14px_rgba(255,238,0,0.7)]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <Motion />
      <SiteHeader playHref={LINKS.play} />

      <main id="top">
        {/* Hero */}
        <section data-tilt className="relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="bg-grid absolute inset-x-0 top-0 h-225" />
            <div className="absolute left-1/2 -top-50 h-150 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(72,21,170,0.4),transparent)]" />
            <div className="absolute left-[60%] top-40 h-100 w-100 rounded-full bg-[radial-gradient(closest-side,rgba(55,131,255,0.18),transparent)]" />
            {/* The page edges are the game's walls */}
            <div className="absolute inset-y-0 left-0 hidden w-14 overflow-hidden border-l-4 border-pcmb-gray/30 opacity-70 mask-[linear-gradient(transparent,#000_15%,#000_70%,transparent)] xl:block 2xl:w-32">
              <Shaft />
            </div>
            <div className="absolute inset-y-0 right-0 hidden w-14 -scale-x-100 overflow-hidden border-l-4 border-pcmb-gray/30 opacity-70 mask-[linear-gradient(transparent,#000_15%,#000_70%,transparent)] xl:block 2xl:w-32">
              <Shaft className="[animation-delay:-7s]" />
            </div>
          </div>

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
            <div className="text-center lg:text-left">
              <div
                className="intro inline-flex items-center gap-2 rounded-full border border-line bg-white/3 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted backdrop-blur"
                style={vars({ "--i": -2 })}
              >
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-pcmb-green shadow-[0_0_8px_var(--green)]" />
                Live on Google Play · Powered by NEAR
              </div>

              <h1 className="mt-7 font-pixel text-[2rem] leading-[1.1] min-[400px]:text-4xl sm:text-6xl lg:text-[4rem] xl:text-7xl">
                <span className="intro-word text-gradient" style={vars({ "--i": 0 })}>Tap.</span>{" "}
                <span className="intro-word text-gradient" style={vars({ "--i": 1 })}>Jump.</span>
                <br />
                <span className="whitespace-nowrap">
                  <span className="intro-word" style={vars({ "--i": 2 })}>Climb</span>{" "}
                  <span className="intro-word" style={vars({ "--i": 3 })}>on-chain.</span>
                </span>
              </h1>

              <p
                className="intro mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg lg:mx-0"
                style={vars({ "--i": 1 })}
              >
                Pixel Climb is a one-tap, hyper-casual mobile game on NEAR. You
                learn it in seconds, then keep coming back for the next floor and
                a share of <span className="text-foreground">$PCMB</span>.
              </p>

              <div
                className="intro mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
                style={vars({ "--i": 2 })}
              >
                <PrimaryButton href={LINKS.play}>
                  <PlayIcon /> Play on Google Play
                </PrimaryButton>
                <GhostButton href={LINKS.deck}>
                  Read the pitch deck <Arrow />
                </GhostButton>
              </div>

              <dl
                className="intro mx-auto mt-12 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line lg:mx-0"
                style={vars({ "--i": 3 })}
              >
                {[
                  ["Chain", "NEAR"],
                  ["Token", "$PCMB"],
                  ["Price", "Free"],
                ].map(([k, v]) => (
                  <div key={k} className="px-2 py-4 text-center lg:text-left lg:first:pl-0 lg:not-first:pl-5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{k}</dt>
                    <dd className="mt-1 font-pixel text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <PhoneMockup />
          </div>
        </section>

        {/* Ticker */}
        <div className="marquee-wrap relative border-y border-line bg-surface/60 py-5" aria-hidden>
          <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee flex w-max">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-10 whitespace-nowrap pr-10 font-pixel text-sm uppercase tracking-wider text-foreground/70">
                  {t}
                  <span className={`h-2 w-2 ${TICKER_COLORS[i % TICKER_COLORS.length]}`} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gameplay */}
        <section id="game" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <div data-reveal>
              <Eyebrow>For players</Eyebrow>
            </div>
            <h2 data-reveal style={vars({ "--i": 1 })} className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Simple to learn. Hard to stop playing.
            </h2>
            <p data-reveal style={vars({ "--i": 2 })} className="mt-5 text-lg text-muted">
              No wallet setup screens to get through first. Open the app and
              start climbing.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {GAMEPLAY.map((g, i) => (
              <article key={g.tag} data-reveal style={vars({ "--i": i })}>
                <div
                  data-spotlight
                  className="h-full rounded-3xl border border-line bg-surface p-2 transition-colors duration-500 hover:border-white/12"
                >
                  <div
                    data-play
                    className="bg-grid-sm relative h-48 overflow-hidden rounded-[1.25rem] border border-line bg-background @container"
                    aria-hidden
                  >
                    {g.art}
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="font-mono text-xs text-muted">{g.tag}</span>
                    <h3 className="mt-3 text-lg font-semibold">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Token */}
        <section id="token" className="relative scroll-mt-24 border-y border-line bg-surface/40">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:gap-20">
            <div>
              <div data-reveal>
                <Eyebrow>The token</Eyebrow>
              </div>
              <h2 data-reveal style={vars({ "--i": 1 })} className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                <span className="font-pixel">$PCMB</span> powers the climb.
              </h2>
              <p data-reveal style={vars({ "--i": 2 })} className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
                $PCMB is Pixel Climb&apos;s native and governance token, issued
                as a NEP-141 fungible token on NEAR. It is launching on NEAR
                testnet while the in-game economy is being tested.
              </p>

              <dl data-reveal style={vars({ "--i": 3 })} className="mt-10 divide-y divide-line border-y border-line">
                {TOKEN_SPECS.map(([k, v]) => (
                  <div key={k} className="group flex items-center justify-between py-4 text-sm">
                    <dt className="font-mono text-xs uppercase tracking-widest text-muted transition-colors group-hover:text-pcmb-blue">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <TokenStage />
          </div>
        </section>

        {/* Investors */}
        <section id="investors" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div data-reveal>
                <Eyebrow>For investors</Eyebrow>
              </div>
              <h2 data-reveal style={vars({ "--i": 1 })} className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                Bringing the biggest mobile genre on-chain.
              </h2>
              <div data-reveal style={vars({ "--i": 2 })} className="mt-8">
                <GhostButton href={LINKS.deck}>
                  Full pitch deck <Arrow />
                </GhostButton>
              </div>

              <div data-reveal style={vars({ "--i": 3 })} className="mt-12">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Hackathon submission</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {HACKATHONS.map((h) => (
                    <li key={h.label}>
                      <a
                        href={h.href}
                        {...external}
                        className="group inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-white/20 hover:text-foreground"
                      >
                        {h.label} <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="flex flex-col gap-3">
              {THESIS.map((t, i) => (
                <li key={t.k} data-reveal style={vars({ "--i": i })}>
                  <article
                    data-spotlight
                    className="group grid grid-cols-[auto_1fr] gap-x-5 rounded-2xl border border-line bg-surface/60 p-6 transition-colors duration-500 hover:border-white/12 sm:gap-x-8 sm:p-8"
                  >
                    <span className="font-pixel text-2xl text-white/20 transition-colors duration-500 group-hover:text-pcmb-blue sm:text-3xl">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{t.k}</p>
                      <h3 className="mt-2 text-lg font-semibold sm:text-xl">{t.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{t.body}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
          <div data-reveal className="border-glow relative overflow-hidden rounded-[2rem] bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-150 -translate-x-1/2 rounded-full bg-pcmb-blue/25 blur-3xl" aria-hidden />
            <div className="relative">
              <Stairs />
              <h2 className="mt-8 text-balance font-pixel text-3xl sm:text-5xl">How high can you climb?</h2>
              <p className="mx-auto mt-5 max-w-md text-muted">
                Free on Android. Building with us or want to invest? Get in touch.
              </p>
              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href={LINKS.play}>
                  <PlayIcon /> Play now
                </PrimaryButton>
                <GhostButton href={LINKS.email}>Contact the team</GhostButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 pt-12 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image src={pcmbLogo} alt="" width={20} height={20} className="pixelated" />
            <span className="font-pixel text-sm">PIXEL CLIMB</span>
            <span className="text-xs text-muted">© {new Date().getFullYear()}</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <a href={LINKS.x} {...external} className="transition-colors hover:text-foreground">X / Twitter</a>
            <a href={LINKS.deck} {...external} className="transition-colors hover:text-foreground">Pitch deck</a>
            <a href={LINKS.email} className="transition-colors hover:text-foreground">support@pixelclimb.xyz</a>
          </nav>
        </div>
        <p
          className="text-fade pointer-events-none mt-8 select-none whitespace-nowrap text-center font-pixel text-[11.5vw] leading-[0.8] xl:text-[9.5rem]"
          aria-hidden
        >
          PIXEL CLIMB
        </p>
      </footer>
    </div>
  );
}
