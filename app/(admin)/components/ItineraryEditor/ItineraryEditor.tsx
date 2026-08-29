"use client";

import { Trash2 } from "lucide-react";
import FormField from "@/components/FormField/FormField";
import SelectField from "@/components/SelectField/SelectField";
import Button from "@/components/Button/Button";
import Surface from "@/components/Surface/Surface";
import type { ItineraryDay, Activity, ActivityType } from "@/app/types/api";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { emptyActivity, emptyDay } from "@/lib/itinerary";

interface ItineraryEditorProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
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
        <Surface key={dayIndex} className="gap-4">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-primary font-semibold uppercase tracking-widest">
              Day {day.dayNumber}
            </span>
            {itinerary.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => removeDay(dayIndex)}
                className="hover:text-error hover:bg-error/10"
                aria-label="Remove day"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
                className="flex flex-col md:flex-row gap-2 items-stretch md:items-start"
              >
                <div className="flex gap-2 flex-1">
                  <FormField
                    id={`day-${dayIndex}-act-${actIndex}-time`}
                    value={act.time}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "time", e.target.value)
                    }
                    placeholder="Time (e.g. 09:00)"
                    className="w-24 shrink-0"
                  />
                  <FormField
                    id={`day-${dayIndex}-act-${actIndex}-desc`}
                    value={act.description}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "description", e.target.value)
                    }
                    placeholder="Activity description"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <SelectField
                    id={`day-${dayIndex}-act-${actIndex}-type`}
                    value={act.type}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "type", e.target.value as ActivityType)
                    }
                    className="flex-1 md:w-32 md:flex-none"
                    options={ACTIVITY_TYPES.map((t) => ({
                      value: t,
                      label: t.charAt(0).toUpperCase() + t.slice(1),
                    }))}
                  />
                  {day.activities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => removeActivity(dayIndex, actIndex)}
                      className="shrink-0 hover:text-error hover:bg-error/10"
                      aria-label="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
        </Surface>
      ))}
    </div>
  );
}
