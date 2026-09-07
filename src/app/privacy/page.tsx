export const metadata = { title: "Privacy | NimeSkuy" };
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="h-6 w-1 rounded-full bg-[#d50032]" />
          <h1 className="text-[20px] font-black tracking-tight text-white">Privacy Policy</h1>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">NimeSkuy menyimpan data lokal seperti riwayat tonton dan favorit di browser Anda (localStorage). Kami tidak menyimpan data personal di server tanpa persetujuan.</p>
        <p className="text-[13.5px] leading-relaxed text-[#c4c4c4]">Kami dapat menggunakan analytics privacy-friendly untuk memahami penggunaan halaman.</p>
      </div>
    </div>
  );
}
