"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";

interface Props {
  cities: string[];
  onChange: (cities: string[]) => void;
}

export default function CityTagInput({ cities, onChange }: Props) {
  const [cityInput, setCityInput] = useState("");

  function addCity() {
    const trimmed = cityInput.trim();
    if (trimmed && !cities.includes(trimmed)) {
      onChange([...cities, trimmed]);
      setCityInput("");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <FormField
          id="city-tag-input"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCity())}
          placeholder="Add a city and press Enter"
          className="flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addCity}
          aria-label="Add city"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {cities.map((city) => (
            <span
              key={city}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm"
            >
              {city}
              <button
                type="button"
                onClick={() => onChange(cities.filter((c) => c !== city))}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
