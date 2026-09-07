import { cn } from "@/lib/utils/cn";
import { SearchX, Film, AlertCircle } from "lucide-react";

export function EmptyState({
  icon = "search",
  title,
  description,
  action,
  className,
}: {
  icon?: "search" | "film" | "error";
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = icon === "search" ? SearchX : icon === "film" ? Film : AlertCircle;
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0c0c0c] border border-[#1c1c1c]">
        <Icon className="h-8 w-8 text-[#707070]" />
      </div>
      <h3 className="text-[15px] font-bold tracking-tight text-white sm:text-base">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[#a0a0a0]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Gagal memuat data",
  description = "Terjadi kesalahan saat mengambil data. Coba lagi nanti.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d50032]/10 border border-[#d50032]/20">
        <AlertCircle className="h-8 w-8 text-[#d50032]" />
      </div>
      <h3 className="text-[15px] font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[#a0a0a0]">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-full bg-[#d50032] px-6 py-2.5 text-[13px] font-bold text-white hover:bg-[#e8003a] transition shadow-[0_2px_10px_rgba(213,0,50,0.3)]"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
