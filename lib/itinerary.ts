import type { ItineraryDay, Activity } from "@/app/types/api";

// Factories for a blank itinerary day / activity, shared by the admin package
// editor (ItineraryEditor) and the new-package page.
export function emptyActivity(): Activity {
  return { time: "", description: "", type: "leisure" };
}

export function emptyDay(dayNumber: number): ItineraryDay {
  return { dayNumber, title: "", activities: [emptyActivity()] };
}
