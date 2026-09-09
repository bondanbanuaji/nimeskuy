import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, DEVELOPER_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, personJsonLd } from "@/components/seo/json-ld";

const ABOUT_DESC =
  "Pelajari tentang NimeSkuy, platform streaming anime yang dikembangkan oleh Bondan Banuaji. Jelajahi katalog anime, genre, jadwal rilis, dan fitur lengkapnya.";

export const metadata: Metadata = {
  title: "About NimeSkuy | Bondan Banuaji",
  description: ABOUT_DESC,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About NimeSkuy | Bondan Banuaji",
    description: ABOUT_DESC,
    url: absoluteUrl("/about"),
    siteName: "NimeSkuy",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About NimeSkuy | Bondan Banuaji",
    description: ABOUT_DESC,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);
  const person = personJsonLd();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <JsonLd data={[breadcrumb, person]} />
      <div className="mb-6">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      </div>

      <article className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-6 sm:p-8 space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#d50032]" />
            <h1 className="text-[22px] font-black tracking-tight text-white sm:text-[24px]">Tentang NimeSkuy</h1>
          </div>
          <p className="text-[13px] font-medium text-[#707070]">Anime Streaming Platform · Developed by {DEVELOPER_NAME}</p>
        </header>

        <div className="space-y-4 text-[13.5px] leading-[1.7] text-[#c4c4c4]">
          <p>
            <strong className="font-semibold text-white">NimeSkuy</strong> adalah platform streaming anime yang dikembangkan oleh{" "}
            <strong className="font-semibold text-white">{DEVELOPER_NAME}</strong>. Platform ini menghadirkan pengalaman menonton
            yang simpel, cepat, dan nyaman — dengan katalog anime terbaru, informasi episode yang jelas, serta navigasi genre yang mudah.
          </p>
          <p>
            NimeSkuy menampilkan metadata anime, daftar episode, dan tautan streaming dari sumber data eksternal. Informasi ditampilkan secara
            terstruktur agar mudah ditemukan oleh pengguna maupun mesin pencari.
          </p>

          <h2 className="text-[15px] font-bold tracking-tight text-white pt-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Fitur Utama
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-[#d50032]">
            <li>Katalog ongoing, completed, dan movie yang diperbarui berkala</li>
            <li>Halaman detail anime dengan sinopsis, genre, status, skor, dan daftar episode</li>
            <li>Pemutar episode dengan pilihan server streaming</li>
            <li>Pencarian anime dan jelajah berdasarkan genre</li>
            <li>Jadwal rilis harian (Senin–Minggu)</li>
            <li>Favorit dan riwayat tonton yang disimpan lokal di browser</li>
          </ul>

          <h2 className="text-[15px] font-bold tracking-tight text-white pt-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Tujuan Project
          </h2>
          <p>
            NimeSkuy dibangun sebagai proyek portofolio untuk menunjukkan kemampuan pengembangan web modern — mulai dari integrasi
            sumber data eksternal, server-side rendering untuk SEO, hingga desain yang responsif dan aksesibel. Fokus utamanya adalah
            performa, kejelasan informasi, dan kemudahan penggunaan tanpa mengorbankan pengalaman menonton.
          </p>

          <h2 className="text-[15px] font-bold tracking-tight text-white pt-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Teknologi
          </h2>
          <p>
            Dibangun dengan Next.js 16 (App Router), React 19, TypeScript, dan Tailwind CSS. Data diperoleh dari sumber eksternal dengan
            penyaringan konten untuk menjaga kecepatan sekaligus menghormati batas penggunaan. Optimasi mencakup ISR/SSG, metadata dinamis,
            sitemap dinamis, dan structured data JSON-LD.
          </p>

          <h2 className="text-[15px] font-bold tracking-tight text-white pt-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Developer
          </h2>
          <p>
            Developed by{" "}
            <a
              href="https://www.instagram.com/bdn_bnj"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline decoration-[#d50032]/40 underline-offset-4 hover:decoration-[#d50032]"
            >
              {DEVELOPER_NAME}
            </a>{" "}
            — kreator dan developer di balik NimeSkuy. Lihat source code di{" "}
            <a
              href="https://github.com/bondanbanuaji/nimeskuy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <footer className="border-t border-[#1c1c1c] pt-4 flex flex-wrap gap-2">
          <Link href="/" className="rounded-full bg-[#d50032] px-4 py-2 text-xs font-bold text-white hover:bg-[#e8003a]">
            Kembali ke Home
          </Link>
          <Link
            href="/genre"
            className="rounded-full bg-[#111] border border-[#1c1c1c] px-4 py-2 text-xs font-semibold text-[#a0a0a0] hover:text-white hover:bg-[#141414]"
          >
            Jelajahi Genre
          </Link>
        </footer>

        <p className="text-[12px] leading-4 text-[#52525c] border-t border-[#1c1c1c] pt-4">
          NimeSkuy tidak menyimpan file video secara langsung. Konten dan tautan tayang berasal dari sumber eksternal.
        </p>
      </article>
    </div>
  );
}
