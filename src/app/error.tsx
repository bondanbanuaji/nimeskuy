"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d50032]/10 border border-[#d50032]/20 mx-auto">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-lg font-semibold text-white">Terjadi kesalahan</h2>
      <p className="mt-1 text-sm text-[#a0a0a0]">{error.message || "Gagal memuat halaman. Coba lagi."}</p>
      <button onClick={() => reset()} className="mt-6 rounded-full bg-[#d50032] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#e8003a]">
        Coba lagi
      </button>
    </div>
  );
}




