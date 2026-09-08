import { getGenres } from "@/lib/api/sanka";
import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { GenreGrid } from "./genre-grid";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Genre Anime | NimeSkuy",
  description:
    "Jelajahi anime berdasarkan genre di NimeSkuy — action, romance, comedy, adventure, dan lebih banyak lagi. Temukan anime favoritmu dengan mudah.",
  alternates: { canonical: "/genre" },
  openGraph: {
    title: "Genre Anime | NimeSkuy",
    description:
      "Jelajahi anime berdasarkan genre di NimeSkuy — temukan anime action, romance, comedy, dan lainnya.",
    url: absoluteUrl("/genre"),
    siteName: "NimeSkuy",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy — Genre Anime" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genre Anime | NimeSkuy",
    description: "Jelajahi anime berdasarkan genre di NimeSkuy.",
    images: ["/logo.png"],
  },
};

export default async function GenrePage() {
  const { Breadcrumbs } = await import("@/components/seo/breadcrumbs");
  const { JsonLd, breadcrumbJsonLd } = await import("@/components/seo/json-ld");
  const bc = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Genre", url: "/genre" },
  ]);
  try {
    const genres = await getGenres();
    if (!genres.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Belum ada genre" description="Gagal memuat genre dari Sanka." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <JsonLd data={bc} />
        <div className="mb-4">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Genre" }]} />
        </div>
        {/* header — not slop */}
        <div className="rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 hidden h-6 w-1 rounded-full bg-[#f5c518] sm:block" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-black leading-none tracking-tight text-white sm:text-[24px]">Genre</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#a0a0a0]">
                Jelajahi anime berdasarkan genre favoritmu. Semua genre diambil langsung dari{" "}
                <span className="font-semibold text-white">Sanka</span> — curated dari Otakudesu.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <GenreGrid genres={genres} />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat genre" description="Coba lagi nanti." />
      </div>
    );
  }
}

