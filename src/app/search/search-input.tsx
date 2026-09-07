"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchInput({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed === initialValue.trim()) return;
      if (!trimmed) {
        router.push("/search");
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [value, router, initialValue]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) router.push("/search");
    else router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative group">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070] group-focus-within:text-[#a0a0a0] transition" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari anime... contoh: One Piece"
        autoFocus
        className="w-full rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] py-4 pl-12 pr-4 text-[15px] font-medium text-white placeholder:text-[#707070] focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:ring-1 focus:ring-[#2a2a2a] transition"
      />
    </form>
  );
}
