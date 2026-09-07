import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 py-12">
      <EmptyState
        title="Genre tidak ditemukan"
        description="Genre yang kamu cari tidak tersedia."
        action={<Link href="/genre" className="rounded-full bg-[#d50032] px-6 py-2.5 text-sm text-white">Lihat semua genre</Link>}
      />
    </div>
  );
}





