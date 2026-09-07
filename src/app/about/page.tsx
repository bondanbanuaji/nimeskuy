export const metadata = { title: "About | NimeSkuy" };
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-6 w-1 rounded-full bg-[#d50032]" />
          <h1 className="text-[20px] font-black tracking-tight text-white">Tentang NimeSkuy</h1>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">
          NimeSkuy adalah platform streaming anime yang menghadirkan pengalaman menonton yang simpel, cepat, dan nyaman. Kami mengambil metadata anime, daftar episode, dan link streaming dari Sanka Anime REST API yang mengagregasi data dari berbagai sumber seperti Otakudesu dan lainnya.
        </p>
        <p className="text-[13px] text-[#707070] border-t border-[#1c1c1c] pt-4">Powered by Sanka Anime API — Karya Sanka Vollerei.</p>
      </div>
    </div>
  );
}
