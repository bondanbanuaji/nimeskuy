import Link from "next/link";
import { InstagramWatermark } from "@/components/ui/instagram-watermark";
import { DEVELOPER_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[#1c1c1c] bg-[#080808]">
      {/* subtle top glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d50032]/20 to-transparent opacity-60" />
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8">
        {/* main */}
        <div className="py-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            {/* brand */}
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <img src="/logo.png" alt="NimeSkuy" width={32} height={32} className="h-8 w-8 rounded-lg object-cover shadow-[0_4px_14px_rgba(213,0,50,0.35)]" />
                <span className="text-[15px] font-black tracking-tight text-white">
                  Nime<span className="text-[#d50032]">Skuy</span>
                </span>
              </Link>
              <p className="mt-3 text-[13px] leading-5 text-[#a0a0a0]">
                Platform streaming anime sub Indo dengan katalog lengkap, genre, dan jadwal rilis.
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[#707070]">
                Anime Streaming Platform · Developed by{" "}
                <a
                  href="https://www.instagram.com/bdn_bnj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#a0a0a0] hover:text-white transition"
                >
                  {DEVELOPER_NAME}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-[#a0a0a0] border border-[#1c1c1c]">Sub Indo</span>
                <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-[#a0a0a0] border border-[#1c1c1c]">HD</span>
                <span className="rounded-full bg-[#f5c518]/10 px-2.5 py-1 text-[11px] font-bold text-[#f5c518] border border-[#f5c518]/15">HD</span>
              </div>
            </div>

            {/* nav */}
            <nav className="flex gap-10 sm:gap-14" aria-label="Footer">
              <div>
                <h2 className="text-[11px] font-bold tracking-widest text-white/90">JELAJAHI</h2>
                <ul className="mt-3 space-y-2">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/ongoing", label: "Ongoing Anime" },
                    { href: "/completed", label: "Completed Anime" },
                    { href: "/movies", label: "Movie Anime" },
                    { href: "/schedule", label: "Jadwal Rilis" },
                    { href: "/genre", label: "Genre Anime" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[13px] text-[#a0a0a0] hover:text-white transition">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] font-bold tracking-widest text-white/90">INFO</h2>
                <ul className="mt-3 space-y-2">
                  {[
                    { href: "/about", label: "About NimeSkuy" },
                    { href: "/disclaimer", label: "Disclaimer" },
                    { href: "/privacy", label: "Privacy" },
                    { href: "/terms", label: "Terms" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[13px] text-[#a0a0a0] hover:text-white transition">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* legal card */}
            <div className="max-w-[320px] rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-4">
              <h2 className="text-[11px] font-bold tracking-widest text-white/80">LEGAL</h2>
              <p className="mt-2 text-xs leading-5 text-[#707070]">
                NimeSkuy tidak menyimpan file video. Konten dan tautan tayang berasal dari sumber eksternal.
              </p>
              <p className="mt-2 text-[11px] leading-4 text-[#52525c]">
                Untuk permintaan penghapusan, hubungi pemilik hak terkait. Ketentuan penggunaan berlaku pada sumber terkait.
              </p>
            </div>
          </div>
        </div>

        {/* bottom bar - attribution watermark centered */}
        <div className="flex justify-center border-t border-[#1c1c1c] py-6">
          <InstagramWatermark />
        </div>
      </div>
    </footer>
  );
}

