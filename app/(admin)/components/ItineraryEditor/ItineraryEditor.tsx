"use client";

import { Trash2 } from "lucide-react";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
import type { ItineraryDay, Activity, ActivityType } from "@/app/types/api";
import { ACTIVITY_TYPES } from "@/lib/constants";

interface ItineraryEditorProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}

function emptyActivity(): Activity {
  return { time: "", description: "", type: "leisure" };
}

function emptyDay(dayNumber: number): ItineraryDay {
  return { dayNumber, title: "", activities: [emptyActivity()] };
}

export default function ItineraryEditor({ itinerary, onChange }: ItineraryEditorProps) {
  function addDay() {
    onChange([...itinerary, emptyDay(itinerary.length + 1)]);
  }

  function removeDay(index: number) {
    onChange(
      itinerary
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function updateDay(index: number, field: keyof ItineraryDay, value: unknown) {
    onChange(itinerary.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  }

  function addActivity(dayIndex: number) {
    onChange(
      itinerary.map((d, i) =>
        i === dayIndex ? { ...d, activities: [...d.activities, emptyActivity()] } : d
      )
    );
  }

  function removeActivity(dayIndex: number, actIndex: number) {
    onChange(
      itinerary.map((d, i) =>
        i === dayIndex
          ? { ...d, activities: d.activities.filter((_, j) => j !== actIndex) }
          : d
      )
    );
  }

  function updateActivity(
    dayIndex: number,
    actIndex: number,
    field: keyof Activity,
    value: string
  ) {
    onChange(
      itinerary.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              activities: d.activities.map((a, j) =>
                j === actIndex ? { ...a, [field]: value } : a
              ),
            }
          : d
      )
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-text">Itinerary</h2>
        <Button type="button" variant="secondary" size="sm" onClick={addDay}>
          Add Day
        </Button>
      </div>

      {itinerary.map((day, dayIndex) => (
        <div key={dayIndex} className="glass rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-primary font-semibold uppercase tracking-widest">
              Day {day.dayNumber}
            </span>
            {itinerary.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
                className="text-text-muted hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <FormField
            id={`day-${dayIndex}-title`}
            label="Day Title"
            value={day.title}
            onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
            placeholder="e.g. Arrival & Check-in"
          />

          <div className="flex flex-col gap-3">
            <label className="text-label-md text-text-muted">Activities</label>
            {day.activities.map((act, actIndex) => (
              <div
                key={actIndex}
                className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-start"
              >
                <div className="flex gap-2 flex-1">
                  <input
                    value={act.time}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "time", e.target.value)
                    }
                    placeholder="Time (e.g. 09:00)"
                    className="w-24 shrink-0 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={act.description}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "description", e.target.value)
                    }
                    placeholder="Activity description"
                    className="flex-1 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={act.type}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "type", e.target.value as ActivityType)
                    }
                    className="flex-1 sm:w-32 sm:flex-none bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  {day.activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActivity(dayIndex, actIndex)}
                      className="p-2 text-text-muted hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="text"
              size="sm"
              onClick={() => addActivity(dayIndex)}
            >
              + Add activity
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
