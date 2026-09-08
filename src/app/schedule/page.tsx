import { getSchedule } from "@/lib/api/sanka";
import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Jadwal Rilis Anime | NimeSkuy",
  description:
    "Jadwal rilis anime harian di NimeSkuy — kalender Senin hingga Minggu untuk anime ongoing sub Indo. Selalu update.",
  alternates: { canonical: "/schedule" },
  openGraph: {
    title: "Jadwal Rilis Anime | NimeSkuy",
    description: "Kalender jadwal rilis anime harian — temukan anime tayang setiap hari di NimeSkuy.",
    url: absoluteUrl("/schedule"),
    siteName: "NimeSkuy",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy — Jadwal Rilis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jadwal Rilis Anime | NimeSkuy",
    description: "Kalender jadwal rilis anime harian di NimeSkuy.",
    images: ["/logo.png"],
  },
};

const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default async function SchedulePage() {
  try {
    const schedule = await getSchedule();
    if (!schedule.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Jadwal tidak tersedia" description="Gagal memuat jadwal." />
        </div>
      );
    }

    const sorted = [...schedule].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6">
        <ScheduleCalendar schedule={sorted} />
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat jadwal" description="Coba lagi nanti." />
      </div>
    );
  }
}
