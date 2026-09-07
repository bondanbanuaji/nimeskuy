import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 py-16">
      <EmptyState
        icon="error"
        title="Halaman tidak ditemukan"
        description="Halaman yang kamu cari tidak tersedia."
        action={<Link href="/" className="rounded-full bg-[#d50032] px-6 py-2.5 text-sm font-medium text-white">Kembali ke Home</Link>}
      />
    </div>
  );
}





