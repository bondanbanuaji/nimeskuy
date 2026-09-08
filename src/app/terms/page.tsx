import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NimeSkuy",
  description: "Syarat penggunaan NimeSkuy — platform streaming anime yang dikembangkan oleh Bondan Banuaji.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-6 w-1 rounded-full bg-[#d50032]" />
          <h1 className="text-[20px] font-black tracking-tight text-white">Terms of Service</h1>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">Dengan menggunakan NimeSkuy, Anda setuju untuk tidak menyalahgunakan layanan, tidak melakukan scraping berlebihan, dan menghormati hak cipta pemilik konten.</p>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">Layanan disediakan sebagaimana adanya. Kami berupaya menjaga ketersediaan namun tidak menjamin uptime 100% karena ketergantungan pada API pihak ketiga.</p>
      </div>
    </div>
  );
}
