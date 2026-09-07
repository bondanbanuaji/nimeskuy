import { cn } from "@/lib/utils/cn";
import React from "react";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d50032] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-[#d50032] text-white hover:bg-[#e8003a]",
    ghost: "hover:bg-[#141414] text-[#f0f0f0]",
    outline: "border border-[#2a2a2a] text-white hover:bg-[#141414]",
  };
  const sizes = {
    default: "h-9 px-5 py-2 text-sm",
    sm: "h-8 px-3 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-9 w-9",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

