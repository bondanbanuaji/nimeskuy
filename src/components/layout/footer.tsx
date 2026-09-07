import Link from "next/link";

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
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#d50032] to-[#ff3d2e] text-[13px] font-black text-white shadow-[0_4px_14px_rgba(213,0,50,0.35)]">
                  N
                </span>
                <span className="text-[15px] font-black tracking-tight text-white">
                  Nime<span className="text-[#d50032]">Skuy</span>
                </span>
              </Link>
              <p className="mt-3 text-[13px] leading-5 text-[#a0a0a0]">
                Streaming anime sub Indo cepat & cinematic. Powered by Sanka.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-[#a0a0a0] border border-[#1c1c1c]">Sanka API</span>
                <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-[#a0a0a0] border border-[#1c1c1c]">Otakudesu</span>
                <span className="rounded-full bg-[#f5c518]/10 px-2.5 py-1 text-[11px] font-bold text-[#f5c518] border border-[#f5c518]/15">HD</span>
              </div>
            </div>

            {/* nav */}
            <div className="flex gap-10 sm:gap-14">
              <div>
                <h4 className="text-[11px] font-bold tracking-widest text-white/90">JELAJAHI</h4>
                <ul className="mt-3 space-y-2">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/ongoing", label: "Ongoing" },
                    { href: "/completed", label: "Completed" },
                    { href: "/schedule", label: "Jadwal" },
                    { href: "/genre", label: "Genre" },
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
                <h4 className="text-[11px] font-bold tracking-widest text-white/90">INFO</h4>
                <ul className="mt-3 space-y-2">
                  {[
                    { href: "/about", label: "About" },
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
            </div>

            {/* legal card */}
            <div className="max-w-[320px] rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-4">
              <h4 className="text-[11px] font-bold tracking-widest text-white/80">LEGAL</h4>
              <p className="mt-2 text-xs leading-5 text-[#707070]">
                NimeSkuy tidak host video. Semua konten, poster & streaming diambil dari Sanka API.
              </p>
              <p className="mt-2 text-[11px] leading-4 text-[#52525c]">
                Hubungi provider sumber untuk takedown. Embed mengikuti terms provider.
              </p>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#1c1c1c] py-5 sm:flex-row">
          <p className="text-xs text-[#707070]">
            © {new Date().getFullYear()} NimeSkuy • <span className="text-[#a0a0a0]">Sanka Anime API</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-[#52525c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#46d369] shadow-[0_0_8px_rgba(70,211,105,0.5)]" />
            API 60/menit • cache aktif
            <span className="hidden sm:inline text-[#1c1c1c]">|</span>
            <span className="text-[#707070]">Dark only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

