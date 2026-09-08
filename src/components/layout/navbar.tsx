"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Heart, Clock, Menu, X } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils/cn";

/* Icons plek ketiplek reference — stroke 1.5 w-3.5 h-3.5 */
function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" strokeWidth="1.5" stroke="currentColor">
      <path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFilm() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" strokeWidth="1.5" stroke="currentColor">
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" />
      <path d="M2.5 7H21.5" stroke="currentColor" strokeLinejoin="round" /><path d="M2.5 17H21.5" stroke="currentColor" strokeLinejoin="round" /><path d="M12 17L12 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 7L8 3M16 7L16 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 21L8 17M16 21L16 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSeries() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" strokeWidth="1.5" stroke="currentColor">
      <path d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z" stroke="currentColor" strokeLinecap="round" />
      <path d="M9 3L12 6L16 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" strokeWidth="1.5" stroke="currentColor">
      <path d="M16 2V6M8 2V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 10H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGenre() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" strokeWidth="1.5" stroke="currentColor">
      <circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" /><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Beranda", icon: IconHome },
  { href: "/ongoing", label: "Ongoing", icon: IconFilm },
  { href: "/completed", label: "Completed", icon: IconSeries },
  { href: "/schedule", label: "Jadwal", icon: IconCalendar },
  { href: "/genre", label: "Genre", icon: IconGenre },
];

function MobileSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707070]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari anime..."
        className="w-full rounded-full bg-[#111] border border-[#1c1c1c] py-2.5 pl-10 pr-4 text-[13px] text-white placeholder:text-[#707070] focus:outline-none focus:border-[#2a2a2a] focus:bg-[#141414]"
      />
    </form>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("site-header fixed left-0 right-0 z-[var(--z-header)] header-safe", scrolled && "site-header--scrolled")}>
        <div className="header-outer">
          <div className="header-inner max-w-[1520px] mx-auto">
            <div className="header-content-padding px-3 sm:px-5">
              <div className="site-header-row flex items-center">
                {/* logo — png dari gradient N */}
                <div className="header-logo flex items-center mr-6 lg:mr-8 shrink-0">
                  <Link href="/" className="site-logo-action flex items-center gap-2.5">
                    <img src="/logo.png" alt="NimeSkuy" width={28} height={28} className="h-7 w-7 rounded-[7px] object-cover shadow-[0_2px_8px_rgba(213,0,50,0.3)]" />
                    <span className="hidden sm:inline text-[16px] font-black tracking-tight text-white leading-none">
                      Nime<span className="text-[#d50032]">Skuy</span>
                    </span>
                  </Link>
                </div>

                {/* desktop nav — plek: header-desktop-nav gap-1 flex-1 */}
                <nav className="header-desktop-nav items-center gap-1 flex-1 min-w-0 hidden lg:flex" aria-label="Menu">
                  {navLinks.map((l) => {
                    const active = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={cn("header-nav-link header-nav-text", active && "header-nav-link--active")}
                      >
                        <l.icon />
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="header-mobile-spacer" />

                {/* right controls — plek: header-icon-control */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  <Link href="/search" aria-label="Cari anime" className="header-icon-control">
                    <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>

                  <Link href="/favorites" aria-label="Favorit" className="hidden sm:flex header-icon-control">
                    <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>

                  <Link href="/history" aria-label="Riwayat" className="hidden sm:flex header-icon-control">
                    <Clock className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="header-mobile-menu-trigger lg:hidden"
                    aria-label="Menu"
                    aria-expanded={open}
                  >
                    <span className="flex items-center gap-1.5">
                      {open ? <X className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />}
                      <span className="hidden sm:inline text-[13px] font-bold">Menu</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* spacer biar gak ketutup fixed header — plek: --site-header-h 66px */}
      <div aria-hidden className="h-[var(--site-header-h)]" />

      {/* mobile panel — plek: dropdown */}
      {open && (
        <div className="fixed left-0 right-0 z-[var(--z-header-mobile-menu)] px-3 sm:px-5 top-[calc(var(--site-header-h)+8px)]">
          <div className="mx-auto max-w-[1520px]">
            <div className="rounded-2xl border border-[#ffffff16] bg-[#0c0c0c] shadow-[0_16px_36px_#00000085] overflow-hidden backdrop-blur-xl">
              <div className="p-3 sm:p-4 space-y-3">
                <Suspense>
                  <MobileSearch />
                </Suspense>
                <nav className="grid grid-cols-1 gap-1.5">
                  {navLinks.map((l) => {
                    const active = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "header-nav-link justify-start px-4",
                          active ? "header-nav-link--active" : "bg-[#111] border border-[#1c1c1c] text-white"
                        )}
                      >
                        <l.icon />
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c1c1c]">
                  <Link href="/favorites" onClick={() => setOpen(false)} className="header-nav-link bg-[#111] border border-[#1c1c1c]">
                    <Heart className="w-4 h-4" /> Favorit
                  </Link>
                  <Link href="/history" onClick={() => setOpen(false)} className="header-nav-link bg-[#111] border border-[#1c1c1c]">
                    <Clock className="w-4 h-4" /> Riwayat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items: { href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { href: "/", label: "Home", icon: IconHome },
    { href: "/search", label: "Cari", icon: Search },
    { href: "/schedule", label: "Jadwal", icon: IconCalendar },
    { href: "/favorites", label: "Favorit", icon: Heart },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#1c1c1c] bg-black/95 backdrop-blur-xl px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:hidden">
      {items.map((it) => {
        const active = pathname === it.href;
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-[11px] font-semibold tracking-tight transition",
              active ? "text-[#d50032]" : "text-[#707070]"
            )}
          >
            <Icon className="h-5 w-5" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
