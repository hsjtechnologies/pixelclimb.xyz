import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const pixel = localFont({
  src: "./fonts/slkscr-webfont.woff",
  variable: "--font-silkscreen",
  weight: "100 900",
});

const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelclimb.xyz"),
  title: "Pixel Climb — One-tap climbing on NEAR",
  description:
    "Pixel Climb is a hyper-casual mobile game powered by NEAR. Tap to jump, climb endless floors, collect gems, and hold $PCMB.",
  openGraph: {
    title: "Pixel Climb",
    description: "Hyper-casual web3 game powered by NEAR.",
    url: "https://pixelclimb.xyz",
    siteName: "Pixel Climb",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pixel Climb gameplay: a block jumping between platforms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@pixelclimb",
    title: "Pixel Climb",
    description: "Hyper-casual web3 game powered by NEAR.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06070b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Flag JS before first paint so scroll reveals never hide content without scripts */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body
        className={`${pixel.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
