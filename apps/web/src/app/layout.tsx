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
  metadataBase: new URL('https://itinaravacation.com'),
  title: {
    default: "ITINARA - Curated Indonesia Travel Itineraries",
    template: "%s | ITINARA"
  },
  description: "Discover Indonesia with intention. Curated itineraries for independent travelers visiting Bali, Java, Lombok, and beyond. Plan your perfect Indonesian vacation today.",
  keywords: ["Indonesia Travel", "Bali Itinerary", "Java Travel Guide", "Indonesia Vacation", "Itinara", "Travel Planner", "Indonesia Tourism"],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://itinaravacation.com',
    title: "ITINARA - Curated Indonesia Travel Itineraries",
    description: "Discover Indonesia with intention. Curated itineraries for independent travelers.",
    siteName: 'ITINARA',
    images: [
      {
        url: '/images/hero-mosaic.jpg', // Using existing hero image
        width: 1200,
        height: 630,
        alt: 'ITINARA - Discover Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ITINARA - Curated Indonesia Travel Itineraries",
    description: "Discover Indonesia with intention. Curated itineraries for independent travelers.",
    images: ['/images/hero-mosaic.jpg'], // Using existing hero image
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJFW644R');`}
      </Script>
      <body className="font-sans antialiased bg-warm-white text-deep-teak" suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TJFW644R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
