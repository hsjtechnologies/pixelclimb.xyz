import type { Metadata } from "next";
import Link from "next/link";
import ConnectWallet from "@/components/ConnectWallet";

export const metadata: Metadata = {
  title: "Play Pixel Climb in your browser",
  description: "Tap to jump and climb endless floors. The full Pixel Climb game, running in your browser.",
  alternates: { canonical: "/play" },
};

export default function Play() {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-4 bg-background px-4 py-4">
      <nav className="flex w-full max-w-[min(100%,calc((100dvh-6rem)*9/16))] items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">← Pixel Climb</Link>
        <ConnectWallet />
      </nav>
      {/* Solar2D HTML5 build from scripts/game-web/build.sh; its loader fills the frame. */}
      <iframe
        src="/game/index.html"
        title="Pixel Climb game"
        allow="autoplay; fullscreen"
        className="aspect-9/16 w-full max-w-[min(100%,calc((100dvh-6rem)*9/16))] rounded-2xl border border-line bg-black"
      />
    </main>
  );
}
