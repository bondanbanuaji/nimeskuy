import { AnimeGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="h-64 rounded-2xl bg-[#111] animate-pulse" />
      <AnimeGridSkeleton count={12} />
    </div>
  );
}




