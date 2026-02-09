import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";


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
  metadataBase: new URL('https://itinaravacation.com'),
  title: {
    default: "Indonesia Itinerary & Travel Guide - ITINARA",
    template: "%s - ITINARA"
  },
  description: "Plan your perfect Indonesia itinerary with ITINARA. Curated travel guides for independent travelers visiting Bali, Java, Lombok, and beyond.",
  keywords: ["Indonesia Itinerary", "Indonesia Travel", "Bali Itinerary", "Java Travel Guide", "Indonesia Vacation", "Itinara", "Travel Planner", "Indonesia Tourism"],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://itinaravacation.com',
    title: "Indonesia Itinerary & Travel Guide - ITINARA",
    description: "Plan your perfect Indonesia itinerary with ITINARA. Curated travel guides for independent travelers.",
    siteName: 'ITINARA',
    images: [
      {
        url: '/images/hero-mosaic.jpg',
        width: 1200,
        height: 630,
        alt: 'ITINARA - Indonesia Itinerary Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Indonesia Itinerary & Travel Guide - ITINARA",
    description: "Plan your perfect Indonesia itinerary with ITINARA. Curated travel guides for independent travelers.",
    images: ['/images/hero-mosaic.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

// Imports moved to (public)/layout.tsx

import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-C4MD92V7TE" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-C4MD92V7TE');
        `}
      </Script>
      <body className="font-sans antialiased bg-warm-white text-deep-teak" suppressHydrationWarning>
        {children}
        <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "ITINARA",
              "url": "https://itinaravacation.com",
              "logo": "https://itinaravacation.com/logo.png",
              "description": "Curated Indonesia travel itineraries and guides for independent travelers.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-8.409518",
                "longitude": "115.188919"
              },
              "sameAs": [
                "https://www.instagram.com/itinara",
                "https://twitter.com/itinara"
              ]
            }
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
