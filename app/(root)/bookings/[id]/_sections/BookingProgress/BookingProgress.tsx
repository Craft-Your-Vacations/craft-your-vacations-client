import React from "react";
import { Send, BadgeCheck, ShieldCheck, PlaneTakeoff, XCircle } from "lucide-react";
import Surface from "@/components/Surface/Surface";
import { formatDate, formatMonth } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Booking, DocumentType } from "@/app/types/api";

interface BookingProgressProps {
  booking: Booking;
  uploadedDocumentTypes?: DocumentType[];
}

interface Step {
  key: string;
  label: string;
  meta: string;
  icon: React.ReactNode;
  done: boolean;
  /** Cancelled is a terminal step, not a milestone — it reads in the error tone. */
  tone?: "error";
}

// The journey thread the rest of the app uses (the destinations route rail, the
// itinerary progress rail) applied to a booking's lifecycle: vertical on mobile,
// horizontal from md up.
export default function BookingProgress({
  booking,
  uploadedDocumentTypes = [],
}: BookingProgressProps) {
  const isCancelled = booking.status === "cancelled";
  const isConfirmed =
    booking.status === "confirmed" || booking.status === "completed";
  const isCompleted = booking.status === "completed";

  const required = booking.requiredDocuments ?? [];
  const outstanding = required.filter(
    (type) => !uploadedDocumentTypes.includes(type),
  ).length;

  const requested: Step = {
    key: "requested",
    label: "Requested",
    meta: formatDate(booking.createdAt),
    icon: <Send className="h-5 w-5" />,
    done: true,
  };

  const steps: Step[] = isCancelled
    ? [
        requested,
        {
          key: "cancelled",
          label: "Cancelled",
          meta: "This booking is no longer active",
          icon: <XCircle className="h-5 w-5" />,
          done: true,
          tone: "error",
        },
      ]
    : [
        requested,
        {
          key: "confirmed",
          label: "Confirmed",
          meta: isConfirmed
            ? "Your trip is locked in"
            : "We're reviewing your request",
          icon: <BadgeCheck className="h-5 w-5" />,
          done: isConfirmed,
        },
        // Only a milestone when documents were actually asked for.
        ...(required.length > 0
          ? [
              {
                key: "documents",
                label: "Documents",
                meta:
                  outstanding > 0
                    ? `${outstanding} still to upload`
                    : "All uploaded",
                icon: <ShieldCheck className="h-5 w-5" />,
                done: isConfirmed && outstanding === 0,
              },
            ]
          : []),
        {
          key: "travelled",
          label: "Travelled",
          meta: formatMonth(booking.travelDate),
          icon: <PlaneTakeoff className="h-5 w-5" />,
          done: isCompleted,
        },
      ];

  // Where the traveller actually is: the last milestone reached, not the next
  // one owed. A pending booking sits on "Requested" — marking it at "Confirmed"
  // reads as though the trip were already confirmed.
  const lastReachedIndex = steps.reduce(
    (acc, step, i) => (step.done ? i : acc),
    0,
  );

  // A segment is lit only when the milestone it leads into has been reached, so
  // the thread stops exactly where the booking really is.
  const segmentTone = (into: Step | undefined) => {
    if (!into) return "bg-transparent";
    if (!into.done) return "bg-surface-highest";
    return into.tone === "error" ? "bg-error/50" : "bg-primary/50";
  };

  return (
    <div className="mx-auto max-w-(--container-max-w) px-6 pt-10 md:px-10 md:pt-12">
      <Surface className="gap-0 md:px-8 md:py-8">
        <ol className="flex flex-col md:flex-row">
          {steps.map((step, i) => {
            const isHere = i === lastReachedIndex;
            const isLast = i === steps.length - 1;

            // Tone follows whether the step itself happened; only the ring says
            // "you are here".
            const nodeTone = step.tone === "error"
              ? "border-error/60 bg-error/15 text-error"
              : step.done
                ? "border-primary/60 bg-primary/20 text-primary"
                : "border-outline bg-surface-high text-text-subtle";

            const hereRing = !isHere
              ? ""
              : step.tone === "error"
                ? "ring-4 ring-error/20"
                : "ring-4 ring-primary/20";

            return (
              <li
                key={step.key}
                aria-current={isHere ? "step" : undefined}
                className="flex flex-1 gap-4 md:flex-col md:gap-0"
              >
                {/* Rail — node stacked with its connectors */}
                <div
                  aria-hidden="true"
                  className="flex flex-col items-center md:w-full md:flex-row"
                >
                  <span
                    className={cn(
                      "hidden h-0.5 flex-1 md:block",
                      i === 0 ? "bg-transparent" : segmentTone(step),
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      nodeTone,
                      hereRing,
                    )}
                  >
                    {step.icon}
                  </span>
                  <span
                    className={cn(
                      "w-0.5 flex-1 md:h-0.5 md:w-auto",
                      isLast ? "bg-transparent" : segmentTone(steps[i + 1]),
                    )}
                  />
                </div>

                {/* Copy */}
                <div
                  className={cn(
                    "md:pt-4 md:pb-0 md:text-center",
                    isLast ? "pb-0" : "pb-8",
                  )}
                >
                  <p
                    className={cn(
                      "text-body-sm-bold",
                      step.tone === "error"
                        ? "text-error"
                        : step.done
                          ? "text-text"
                          : "text-text-subtle",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-body-sm text-text-muted mt-0.5">{step.meta}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Surface>
    </div>
  );
}
