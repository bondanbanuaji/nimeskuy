import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, BottomNav } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PerfFix } from "@/components/perf-fix";
import { LenisProvider } from "@/components/lenis-provider";
import { getSiteUrl, SITE_NAME, SITE_DESCRIPTION, DEVELOPER_NAME } from "@/lib/site";
import { JsonLd, websiteJsonLd, organizationJsonLd, personJsonLd } from "@/components/seo/json-ld";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#d50032",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
    template: "%s | NimeSkuy",
  },
  description: `${SITE_DESCRIPTION} Dikembangkan oleh ${DEVELOPER_NAME}.`,
  keywords: [
    "anime",
    "streaming anime",
    "nonton anime",
    "anime sub indo",
    "anime database",
    "otakudesu",
    "anime ongoing",
    "anime completed",
    "NimeSkuy",
    "Bondan Banuaji",
  ],
  authors: [{ name: DEVELOPER_NAME, url: "https://www.instagram.com/bdn_bnj" }],
  creator: DEVELOPER_NAME,
  publisher: SITE_NAME,
  category: "entertainment",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
    description: `${SITE_DESCRIPTION} Dikembangkan oleh ${DEVELOPER_NAME}.`,
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: SITE_NAME,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy — Streaming Anime Sub Indo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
    description: `${SITE_DESCRIPTION} Dikembangkan oleh ${DEVELOPER_NAME}.`,
    images: ["/logo.png"],
    creator: "@bdn_bnj",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ws = websiteJsonLd();
  const org = organizationJsonLd();
  const person = personJsonLd();
  return (
    <html lang="id" className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <JsonLd data={[ws, org, person]} />
      </head>
      <body className="min-h-full flex flex-col bg-black text-[#f0f0f0]">
        <LenisProvider />
        <PerfFix />
        <Navbar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
