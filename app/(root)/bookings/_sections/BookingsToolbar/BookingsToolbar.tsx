"use client";

import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

export type BookingTab = "upcoming" | "past";

interface BookingsToolbarProps {
  tab: BookingTab;
  onTabChange: (value: BookingTab) => void;
  /** How many bookings are in the active tab. */
  resultCount: number;
  /** How many bookings the traveller has in total. */
  totalCount: number;
}

const tabOptions: { label: string; value: BookingTab }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

// Same sticky glass band as the destinations toolbar, so both list pages are
// operated the same way.
export default function BookingsToolbar({
  tab,
  onTabChange,
  resultCount,
  totalCount,
}: BookingsToolbarProps) {
  return (
    <div
      id="bookings"
      className="sticky top-20 z-30 scroll-mt-20 border-y border-outline glass"
    >
      <div className="mx-auto flex max-w-(--container-max-w) items-center justify-between gap-4 px-6 py-4 md:px-10">
        <SegmentedControl
          options={tabOptions}
          value={tab}
          onChange={onTabChange}
          className="md:w-72"
        />
        <span className="hidden shrink-0 text-label-md text-text-subtle md:inline">
          {resultCount} of {totalCount}
        </span>
      </div>
    </div>
  );
}
