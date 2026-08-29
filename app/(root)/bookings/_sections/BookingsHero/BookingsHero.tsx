import GlassHero, { type HeroStat } from "@/components/GlassHero/GlassHero";
import HeroImage from "@/public/introImage4.jpg";
import type { Booking } from "@/app/types/api";

interface BookingsHeroProps {
  bookings: Booking[];
}

// Account-page counterpart of the destinations hero — same glass panel, accent
// word and stat row, so the two list pages open the same way.
export default function BookingsHero({ bookings }: BookingsHeroProps) {
  const hasBookings = bookings.length > 0;

  const upcoming = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  ).length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const stats: HeroStat[] = hasBookings
    ? [
        {
          value: String(bookings.length),
          label: bookings.length === 1 ? "Booking" : "Bookings",
        },
        { value: String(upcoming), label: "Upcoming" },
        ...(completed ? [{ value: String(completed), label: "Completed" }] : []),
      ]
    : [];

  return (
    <GlassHero
      image={HeroImage}
      imageAlt="Hot-air balloons drifting across a clear sky"
      eyebrow="Your journeys"
      title="My Travel"
      titleAccent="Bookings"
      description="Packages you've expressed interest in. Our team will reach out to tailor each trip to your preferences before anything is confirmed."
      stats={stats}
      // With nothing booked yet the only useful next step is the catalogue.
      cta={
        hasBookings
          ? { label: "View my bookings", href: "#bookings" }
          : { label: "Explore destinations", href: "/destinations" }
      }
      scrollCue={hasBookings ? "Scroll to your bookings" : "Scroll for more"}
    />
  );
}
