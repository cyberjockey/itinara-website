import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Crimson_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://itinara.com'),
  title: "ITINARA - Curated Indonesia Travel Itineraries",
  description: "Discover Indonesia with intention. Curated itineraries for independent travelers.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

// Imports moved to (public)/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-warm-white text-deep-teak" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
