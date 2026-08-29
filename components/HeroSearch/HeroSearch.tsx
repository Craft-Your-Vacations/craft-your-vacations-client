"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/Button/Button";

/**
 * Hero destination finder. Visual/navigational only — routes to the
 * destinations listing (optionally carrying the query as ?q=). Styled for
 * the on-photo overlay context, so it uses theme-independent white/overlay
 * tones rather than the theme `glass` token.
 */
export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/destinations?q=${encodeURIComponent(trimmed)}` : "/destinations",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-3xl border border-white/20 bg-white/10 p-2 shadow-ambient backdrop-blur-xl transition-colors focus-within:border-white/40 focus-within:ring-2 focus-within:ring-primary/50 md:max-w-xl"
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a place, city, or destination…"
          aria-label="Search destinations"
          className="w-full rounded-2xl bg-transparent py-3.5 pl-12 pr-4 text-body-md text-white placeholder:text-white/60 focus:outline-none"
        />
      </div>
      <Button type="submit" size="lg" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
