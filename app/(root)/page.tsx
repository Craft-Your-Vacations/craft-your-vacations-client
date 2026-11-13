import CtaBanner from "@/components/CtaBanner/CtaBanner";
import { bffFetch } from "@/lib/bff";
import HeroSection from "./_sections/HeroSection/HeroSection";
import WhoWeAre from "./_sections/WhoWeAre/WhoWeAre";
import CuratedDestinations from "./_sections/CuratedDestinations/CuratedDestinations";
import Testimonials from "./_sections/Testimonials/Testimonials";
import Memories from "./_sections/Memories/Memories";
import type { Destination, Review } from "@/app/types/api";

/**
 * Server component on purpose.
 *
 * As a client component this fetched destinations with useDestinations(), so the
 * hero's image URLs did not exist until the browser had downloaded the bundle,
 * hydrated, and completed a round trip to .NET — three serial hops before the
 * first hero image could even begin downloading. Fetching here puts those URLs
 * in the initial HTML, so the browser starts them immediately.
 *
 * The data is public and near-static, and both calls already cache at the Next
 * layer (300s / 60s), so nothing is lost by dropping React Query here.
 *
 * `null` for the request: there is no incoming NextRequest in a server
 * component. Both endpoints are public and neither is per-IP rate limited.
 */
async function getHomeData(): Promise<{
  destinations: Destination[];
  reviews: Review[];
}> {
  const [destinationsResult, reviewsResult] = await Promise.all([
    bffFetch<Destination[]>("/api/destinations", null, {
      isPublic: true,
      cache: { revalidate: 300, tags: ["destinations"] },
    }),
    bffFetch<Review[]>("/api/reviews/approved", null, {
      isPublic: true,
      cache: { revalidate: 60, tags: ["reviews"] },
    }),
  ]);

  // Throw rather than fall back to []. This page is prerendered, so a silent
  // empty array would bake a destination-less homepage into the build and serve
  // it until the next revalidation — which is what happens whenever the API is
  // asleep at build time, and it is invisible because the page still renders.
  // Throwing instead fails the deploy loudly and leaves the previous build
  // serving; on a background revalidation Next keeps the last good HTML.
  if (!destinationsResult.ok) {
    throw new Error(
      "Home page prerender failed: /api/destinations was unreachable. " +
        "Check BACKEND_URL and that the API is awake.",
    );
  }

  // Reviews are different: testimonials are a secondary section that renders
  // nothing when empty, so losing them degrades the page instead of gutting it.
  return {
    destinations: destinationsResult.data,
    reviews: reviewsResult.ok ? reviewsResult.data : [],
  };
}

export default async function HomePage() {
  const { destinations, reviews } = await getHomeData();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <HeroSection destinations={destinations} />
      <WhoWeAre />
      <CuratedDestinations destinations={destinations} />
      <Testimonials reviews={reviews} />
      <Memories reviews={reviews} />
      <CtaBanner
        heading="Plan an Unforgettable Experience Today!"
        subtext="We can help you fit your stay and experience within your allotted budget."
      />
    </div>
  );
}
