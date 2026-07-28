import { MapPin } from "lucide-react";

export default function RouteWaypoint() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center gap-3 py-2">
      {/* Top route dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
      {/* Line segment */}
      <div className="flex-1 w-0.5 bg-linear-to-b from-primary/20 via-primary/50 to-primary/70 rounded-full" />
      {/* Main pin */}
      <div className="relative flex-shrink-0">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 blur-sm" />
        <div className="relative w-11 h-11 rounded-full bg-primary/15 border-2 border-primary/60 shadow-lg shadow-primary/30 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" strokeWidth={2} />
        </div>
      </div>
      {/* Line segment */}
      <div className="flex-1 w-0.5 bg-linear-to-t from-primary/20 via-primary/50 to-primary/70 rounded-full" />
      {/* Bottom route dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
    </div>
  );
}
