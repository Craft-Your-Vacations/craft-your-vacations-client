// Components Demo Page
"use client";

import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ColorPalette } from "@/components/ColorPalette/ColorPalette";
import { TypographyShowcase } from "@/components/TypographyShowcase/TypographyShowcase";
import { Button } from "@/components/Button/Button";
import { FormField } from "@/components/FormField/FormField";
import { SelectField } from "@/components/SelectField/SelectField";
import { TextAreaField } from "@/components/TextAreaField/TextAreaField";
import { DestinationCard } from "@/components/DestinationCard/DestinationCard";
import { PackageCard } from "@/components/PackageCard/PackageCard";
import { TestimonialCard } from "@/components/TestimonialCard/TestimonialCard";
import { Footer } from "@/components/Footer/Footer";
import { FAB } from "@/components/FAB/FAB";
import { ArrowUp, Clock, ExternalLink, Heart, MapPin, Rocket, Trash2 } from "lucide-react";
import { Search } from "lucide-react";
import { useState } from "react";
import Section from "@/components/Section/Sections";
import Surface from "@/components/Surface/Surface";
import EmptyState from "@/components/EmptyState/EmptyState";
import Checkbox from "@/components/Checkbox/Checkbox";
import IconBadge from "@/components/IconBadge/IconBadge";
import InfoChip from "@/components/InfoChip/InfoChip";
import OtpInput from "@/components/OtpInput/OtpInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

/* ─── demo data ──────────────────────────────────────────────────────────── */

const destinations = [
  {
    id: 1,
    slug: "dubai",
    title: "Dubai",
    imagePath: "/dubai.jpg",
    content:
      "Glamour, modern skylines, desert safaris and luxury — Dubai awaits the discerning traveler.",
    minPackagePrice: 60000,
    detailJson: {
      packages: [
        {
          key: "classic",
          days: 4,
          price: 60000,
          title: "Classic Dubai",
          excerpt: "Highlights: Burj Khalifa, Desert Safari, Dhow Cruise",
        },
        {
          key: "luxury",
          days: 6,
          price: 120000,
          title: "Luxury Dubai",
          excerpt: "Luxury hotels, private desert experience, fine dining",
        },
        {
          key: "family",
          days: 5,
          price: 85000,
          title: "Family Escape",
          excerpt: "Family-friendly resorts & theme-park day",
        },
      ],
      destinationCities: ["Abu Dhabi", "Sharjah", "Al Ain"],
    },
  },
  {
    id: 2,
    slug: "bali",
    title: "Bali",
    imagePath: "/bali.jpg",
    content:
      "Tropical paradise of temples, beaches, and lush rice terraces — Bali offers serenity and adventure in equal measure.",
    minPackagePrice: 55000,
    detailJson: {
      packages: [
        {
          key: "essence",
          days: 5,
          price: 55000,
          title: "Essence of Bali",
          excerpt: "Ubud temples, rice terraces, and Kuta beach",
        },
        {
          key: "romantic",
          days: 6,
          price: 95000,
          title: "Romantic Bali",
          excerpt: "Couples spa, sunset dinner, and beach villas",
        },
        {
          key: "explorer",
          days: 7,
          price: 110000,
          title: "Bali Explorer",
          excerpt:
            "Mount Batur trek, waterfalls, and snorkeling in Nusa Penida",
        },
      ],
      destinationCities: ["Ubud", "Seminyak", "Nusa Dua"],
    },
  },
  {
    id: 3,
    slug: "paris",
    title: "Paris",
    imagePath: "/paris.jpg",
    content:
      "The city of lights, love, and timeless art — Paris charms with history, cuisine, and chic boulevards.",
    minPackagePrice: 90000,
    detailJson: {
      packages: [
        {
          key: "romantic",
          days: 5,
          price: 90000,
          title: "Romantic Paris",
          excerpt: "Eiffel Tower, Seine Cruise, Montmartre",
        },
        {
          key: "artlover",
          days: 6,
          price: 115000,
          title: "Art & Culture",
          excerpt: "Louvre, Orsay, and Versailles Palace",
        },
        {
          key: "family",
          days: 7,
          price: 125000,
          title: "Family Getaway",
          excerpt: "Disneyland Paris and city highlights",
        },
      ],
      destinationCities: ["Versailles", "Lyon", "Nice"],
    },
  },
];

const packages = [
  {
    title: "Explorer",
    duration: "7 days · 6 nights",
    features: [
      { icon: "flight", text: "Return flights included" },
      { icon: "hotel", text: "3-star accommodation" },
      { icon: "directions_bus", text: "Airport transfers" },
      { icon: "map", text: "Guided city tour" },
    ],
    ctaLabel: "Book Explorer",
  },
  {
    title: "Voyager",
    duration: "10 days · 9 nights",
    features: [
      { icon: "flight", text: "Business class flights" },
      { icon: "hotel", text: "5-star accommodation" },
      { icon: "directions_car", text: "Private transfers" },
      { icon: "tour", text: "3 guided excursions" },
      { icon: "restaurant", text: "Daily breakfast + 2 dinners" },
    ],
    ctaLabel: "Book Voyager",
  },
  {
    title: "Luminary",
    duration: "14 days · 13 nights",
    features: [
      { icon: "flight", text: "First class flights" },
      { icon: "villa", text: "Private villa or suite" },
      { icon: "local_activity", text: "Dedicated concierge" },
      { icon: "spa", text: "Spa & wellness access" },
      { icon: "restaurant", text: "All meals included" },
    ],
    ctaLabel: "Book Luminary",
  },
];

const testimonials = [
  {
    quote:
      "Every detail was flawlessly arranged. CraftVacations turned our anniversary trip into something truly magical — we still talk about it every day.",
    authorName: "Sofia Reyes",
    authorTitle: "Product Designer, Barcelona",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=5",
    authorAvatarAlt: "Sofia Reyes",
  },
  {
    quote:
      "I've travelled to 40+ countries but nothing compares to having a team that genuinely understands what you're looking for. Absolutely world-class.",
    authorName: "James Thornton",
    authorTitle: "Tech Entrepreneur, London",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=12",
    authorAvatarAlt: "James Thornton",
  },
  {
    quote:
      "The Patagonia expedition was breathtaking. The local guides they connected us with had knowledge you simply can't find in any guidebook.",
    authorName: "Aiko Nakamura",
    authorTitle: "Photographer, Tokyo",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=47",
    authorAvatarAlt: "Aiko Nakamura",
  },
];

/* ─── page ───────────────────────────────────────────────────────────────── */
export default function DemoPage() {
  const [subscribed, setSubscribed] = useState(true);
  const [segment, setSegment] = useState<"overview" | "itinerary" | "reviews">(
    "overview"
  );
  const [otp, setOtp] = useState("");

  return (
    <div className="bg-bg min-h-screen">
      {/* Navbar */}
      {/* <Navbar
        links={[
          { label: "Destinations", href: "#destinations" },
          { label: "Packages", href: "#packages", isActive: true },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Contact", href: "#forms" },
        ]}
      /> */}

      {/* Hero */}
      <div className="pt-16">
        <div className="mx-auto max-w-(--container-max-w) px-6 md:px-10 section-gap">
          <PageHeader
            eyebrow="Component Library"
            title="Nocturnal Voyager"
            description="A dark, oceanic design system for crafting immersive travel experiences. Scroll to explore every component."
            align="center"
            actions={
              <>
                <Button variant="primary" size="lg">
                  <MapPin className="text-on-primary" />
                  Start Exploring
                </Button>
                <Button variant="secondary" size="lg">
                  View Source
                </Button>
              </>
            }
          />
        </div>
      </div>

      {/* Color Palette */}
      <Section id="colors" title="Color Palette">
        <ColorPalette />
      </Section>

      {/* Typography */}
      <Section id="typography" title="Typography Scale">
        <TypographyShowcase />
      </Section>

      {/* Buttons */}
      <Section id="buttons" title="Button Variants">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-body-sm text-text-subtle mb-4">Variants</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="icon" aria-label="Search">
                <span className="material-symbols-outlined text-[20px]">
                  <Search />
                </span>
              </Button>
              <Button variant="text">Text button</Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">Sizes</p>
            <div className="flex flex-wrap items-end gap-4">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">With icons</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                <Rocket/>
                Book Now
              </Button>
              <Button variant="secondary">
                <Heart/>
                Save Trip
              </Button>
              <Button variant="primary" href="#">
                <ExternalLink/>
                Link Button
              </Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">
              Disabled states
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Forms */}
      <Section id="forms" title="Form Fields">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormField
            id="full-name"
            label="Full Name"
            placeholder="Sofia Reyes"
            required
            helperText="As it appears on your passport."
          />
          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="sofia@example.com"
            required
          />
          <FormField
            id="phone"
            label="Phone"
            type="tel"
            placeholder="+1 555 000 0000"
            errorMessage="Please enter a valid phone number."
          />
          <FormField id="departure" label="Departure Date" type="date" />
          <SelectField
            id="destination"
            label="Preferred Destination"
            placeholder="Choose a destination"
            required
            options={[
              { value: "santorini", label: "Santorini, Greece" },
              { value: "kyoto", label: "Kyoto, Japan" },
              { value: "patagonia", label: "Patagonia, Chile" },
              { value: "maldives", label: "Maldives" },
            ]}
            helperText="We'll tailor recommendations to your choice."
          />
          <SelectField
            id="budget"
            label="Budget Range"
            placeholder="Select budget"
            options={[
              { value: "budget", label: "Under $1,500" },
              { value: "mid", label: "$1,500 – $3,000" },
              { value: "luxury", label: "$3,000 – $6,000" },
              { value: "ultra", label: "$6,000+" },
            ]}
          />
          <TextAreaField
            id="notes"
            label="Special Requests"
            placeholder="Dietary requirements, accessibility needs, anniversary surprises…"
            maxLength={300}
            helperText="Anything that will make your trip perfect."
            className="md:col-span-2"
          />
        </div>
      </Section>

      {/* Cards & chips */}
      <Section id="cards" title="Cards, Badges & Chips">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-body-sm text-text-subtle mb-4">
              Surface variants &amp; EmptyState
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Surface>
                <h3 className="text-headline-sm text-text">default</h3>
                <p className="text-body-sm text-text-muted">
                  The standard panel — <code>glass rounded-2xl p-6</code> with a
                  vertical <code>gap-5</code> stack.
                </p>
              </Surface>
              <Surface variant="table">
                <div className="px-6 py-4 border-b border-outline">
                  <p className="text-body-sm text-text">table</p>
                </div>
                <div className="px-6 py-4">
                  <p className="text-body-sm text-text-muted">
                    Flush container (<code>overflow-hidden</code>, no padding) —
                    wrap a table or edge-to-edge list; children own their
                    spacing.
                  </p>
                </div>
              </Surface>
              <EmptyState
                className="md:col-span-2"
                title="EmptyState"
                description="Rendered instead of a list or table when it has no items."
              />
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">
              IconBadge &amp; InfoChip
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <IconBadge>
                <MapPin className="w-4 h-4 text-primary" />
              </IconBadge>
              <IconBadge>
                <Clock className="w-4 h-4 text-primary" />
              </IconBadge>
              <InfoChip>
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-body-md text-text font-medium">7 Days</p>
                </div>
              </InfoChip>
            </div>
          </div>
        </div>
      </Section>

      {/* Controls */}
      <Section id="controls" title="Controls">
        <div className="flex flex-col gap-8 max-w-md">
          <div>
            <p className="text-body-sm text-text-subtle mb-4">Ghost buttons</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost" size="sm">
                <MapPin className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-error hover:bg-error/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">Checkbox</p>
            <Checkbox
              checked={subscribed}
              onChange={setSubscribed}
              label="Email me trip inspiration"
            />
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">SegmentedControl</p>
            <SegmentedControl
              options={[
                { label: "Overview", value: "overview" },
                { label: "Itinerary", value: "itinerary" },
                { label: "Reviews", value: "reviews" },
              ]}
              value={segment}
              onChange={setSegment}
            />
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">OtpInput</p>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
        </div>
      </Section>

      {/* Destination Cards */}
      <Section id="destinations" title="Destination Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              href="/"
              key={destination.id}
              imagePath={destination.imagePath}
              title={destination.title}
              destinationCities={destination.detailJson.destinationCities}
              content={destination.content}
            />
          ))}
        </div>
      </Section>

      {/* Package Cards */}
      <Section id="packages" title="Package Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((p, i) => (
            <PackageCard key={p.title} {...p} highlighted={i === 1} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" title="Testimonial Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.authorName} {...t} />
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Footer />

      {/* FAB */}
      <FAB
        icon={<ArrowUp className="h-6 w-6" />}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}
