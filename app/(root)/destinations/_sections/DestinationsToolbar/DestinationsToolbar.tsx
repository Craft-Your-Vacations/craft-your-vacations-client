"use client";

import { Search } from "lucide-react";
import FormField from "@/components/FormField/FormField";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

export type DestinationFilter = "all" | "featured";

interface DestinationsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filter: DestinationFilter;
  onFilterChange: (value: DestinationFilter) => void;
  /** How many destinations survive the current query + filter. */
  resultCount: number;
  /** How many destinations exist in total. */
  totalCount: number;
}

const filterOptions: { label: string; value: DestinationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
];

// Full-width glass band that sticks under the navbar (h-20) once the hero
// scrolls away, so search + filtering stay reachable down a long list.
export default function DestinationsToolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  resultCount,
  totalCount,
}: DestinationsToolbarProps) {
  return (
    <div
      id="destinations"
      className="sticky top-20 z-30 scroll-mt-20 border-y border-outline glass"
    >
      <div className="mx-auto flex max-w-(--container-max-w) flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
        <FormField
          id="destinations-search"
          type="search"
          placeholder="Search a place, city, or destination…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="w-full md:max-w-sm"
        />

        <div className="flex items-center gap-4">
          <SegmentedControl
            options={filterOptions}
            value={filter}
            onChange={onFilterChange}
            className="md:w-56"
          />
          <span className="hidden shrink-0 text-label-md text-text-subtle md:inline">
            {resultCount} of {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
