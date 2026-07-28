export default function DestinationsHeader() {
  return (
    <div className="z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col items-center">
        <h1 className="text-display-lg md:text-display-xl lg:text-display-xxl text-text tracking-tighter leading-hero">
          The Curated
        </h1>
        <span className="text-display-lg md:text-display-xl lg:text-display-xxl tracking-tighter leading-hero mb-4 lg:mb-8 text-stroke-primary italic">
          Horizon
        </span>
      </div>
      <p className="text-text-muted text-body-lg md:text-xl max-w-xl mb-0 lg:mb-10 leading-relaxed font-light">
        Discover hand-picked journeys that bridge the gap between luxury and raw
        exploration. Your next story begins here.
      </p>
    </div>
  );
}
