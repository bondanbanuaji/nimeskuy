"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function LenisProvider() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic - lebih snappy dari default
      smoothWheel: true,
      syncTouch: false, // biar di HP tetap native biar gak ngelag
      syncTouchLerp: 0.08,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis;
    // expose buat debug / programmatic scroll
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // fix: cegah Lenis nge-hijack scroll di carousel & dropdown yang pakai data-lenis-prevent
    // udah dihandle via CSS, tapi kita juga kasih handler biar anchor smooth via Lenis
    const handleAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1 });
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      document.removeEventListener("click", handleAnchor);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // reset scroll pas ganti halaman — tanpa flicker
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
