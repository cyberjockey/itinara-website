import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Crimson_Pro } from "next/font/google";
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

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundMusic } from "@/components/ui/BackgroundMusic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-warm-white text-deep-teak" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
        <BackgroundMusic />
      </body>
    </html>
  );
}
