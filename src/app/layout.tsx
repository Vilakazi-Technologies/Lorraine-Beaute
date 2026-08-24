import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from "next/font/google";
import { StoreShell } from "@/components/store-shell";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
  display: "block",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lorraine Beauté | Luxury Skincare, Lips & Fragrance",
  description:
    "Curated beauty for South Africa and beyond. AI skin analysis, personalised recommendations, lips, skincare, fragrance, and gift sets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable}`}>
      <body className="antialiased">
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
