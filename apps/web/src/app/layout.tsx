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
  title: "ITINARA - Curated Indonesian Itineraries",
  description: "Experience authentic Indonesia with AI-curated itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${jakarta.variable} ${crimson.variable} antialiased bg-warm-white text-stone-gray font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
