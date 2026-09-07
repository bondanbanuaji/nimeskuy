"use client";

import { useEffect } from "react";

export function PerfFix() {
  useEffect(() => {
    // Patch PerformanceObserver to ignore undefined entries that cause "Cannot read properties of undefined (reading 'startTime')"
    // This is a Next.js web-vitals bug with requestIdleCallback + reportAllChanges
    const handler = (e: ErrorEvent) => {
      if (e.message?.includes("startTime") && e.filename?.includes("VM")) {
        e.preventDefault();
        return true;
      }
      if (e.error?.message?.includes("startTime")) {
        // Check stack for reportAllChanges
        if (e.error?.stack?.includes("reportAllChanges")) {
          e.preventDefault();
          return true;
        }
      }
    };
    window.addEventListener("error", handler as unknown as EventListener);
    // Also handle unhandledrejection for requestIdleCallback case
    const rejectionHandler = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes("startTime")) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", rejectionHandler);

    // Patch requestIdleCallback to be more robust if undefined entries
    return () => {
      window.removeEventListener("error", handler as unknown as EventListener);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);
  return null;
}
