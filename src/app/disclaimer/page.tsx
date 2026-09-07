export const metadata = { title: "Disclaimer | NimeSkuy" };
export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-6 w-1 rounded-full bg-[#d50032]" />
          <h1 className="text-[20px] font-black tracking-tight text-white">Disclaimer</h1>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">
          NimeSkuy tidak menyimpan file video anime secara langsung. Semua konten, metadata, poster, dan link streaming diambil dari Sanka Anime REST API dan provider pihak ketiga. NimeSkuy tidak mengklaim kepemilikan atas konten tersebut.
        </p>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">
          Jika Anda adalah pemilik hak cipta dan menemukan konten yang melanggar, silakan hubungi provider sumber asli. Penggunaan embed mengikuti terms dari masing-masing provider.
        </p>
      </div>
    </div>
  );
}
