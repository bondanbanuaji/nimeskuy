import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${it.name}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#52525c] shrink-0" aria-hidden="true" />}
              {it.href && !isLast ? (
                <Link
                  href={it.href}
                  className="text-[#a0a0a0] hover:text-white transition font-medium"
                >
                  {it.name}
                </Link>
              ) : (
                <span className={isLast ? "text-white font-semibold" : "text-[#a0a0a0]"}>
                  {it.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
