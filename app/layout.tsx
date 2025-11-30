// app/layout.tsx

import type { Metadata } from "next"
import "@/app/globals.css?inline"
import { Analytics } from "@vercel/analytics/next"
import { Montserrat } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"
import BackgroundAnimations from "@/components/BackgroundAnimations"
import BackgroundImage from "@/components/BackgroundImage"

// Initialize Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: "BORNOVAMUN'26",
    template: "%s | BORNOVAMUN'26",
  },
  description:
    "Join BORNOVAMUN'26 in Bornova on 16-17-18 January 2026 for a premier Model UN experience. Debate, diplomacy, and leadership await!",
  keywords: [
    "MUN",
    "Bornova Model United Nations",
    "BORNOVAMUN'26",
    "BORNOVAMUN",
    "Model United Nations",
    "Turkey MUN 2026",
    "İzmir MUN",
  ],

  // Favicons
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  // OpenGraph (Social Media Previews)
  openGraph: {
    title: "BORNOVAMUN'26 | Bornova Model United Nations",
    description:
      "16-17-18 January 2026 | Experience diplomacy and debate at Bornova's premier MUN conference.",
    url: "https://www.bornovamun.org",
    siteName: "BORNOVAMUN'26",
    images: [
      {
        url: "https://www.bornovamun.org/icon.png",
        width: 1200,
        height: 630,
        alt: "BORNOVAMUN'26 - Bornova Model United Nations Conference",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "BORNOVAMUN'26 | Bornova Model United Nations",
    description:
      "16-17-18 January 2026 | Join Turkey's leading MUN conference in Bornova.",
    images: ["https://www.bornovamun.org/icon.png"],
  },

  // Technical SEO
  metadataBase: new URL("https://www.bornovamun.org"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`overflow-x-hidden max-w-screen scroll-smooth`}
    >
      <body
        className={`overflow-x-hidden max-w-screen ${montserrat.variable} ${montserrat.className} antialiased`}
        style={{ scrollbarWidth: "none" }}
      >
        <BackgroundImage />

        {/* Global Particles */}
        <BackgroundAnimations />

        <div className="min-h-screen relative z-10">
          <Navbar />
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}