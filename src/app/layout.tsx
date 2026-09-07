import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, BottomNav } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PerfFix } from "@/components/perf-fix";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "NimeSkuy - Streaming Anime Sub Indo Terlengkap",
    template: "%s | NimeSkuy",
  },
  description:
    "NimeSkuy adalah platform streaming anime sub Indo terlengkap. Cari, jelajahi, dan tonton anime ongoing, completed, dan movie dengan cepat dan nyaman.",
  keywords: ["anime", "streaming anime", "nonton anime", "anime sub indo", "otakudesu", "anime ongoing"],
  openGraph: {
    title: "NimeSkuy - Streaming Anime Sub Indo",
    description: "Streaming anime sub Indo terlengkap dan tercepat.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "NimeSkuy - Streaming Anime Sub Indo",
    description: "Streaming anime sub Indo terlengkap dan tercepat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-[#f0f0f0]">
        <PerfFix />
        <Navbar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
