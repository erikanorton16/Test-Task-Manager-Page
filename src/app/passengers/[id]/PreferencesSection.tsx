"use client";

import { useState } from "react";
import EditableSection from "@/components/EditableSection";
import type { Passenger } from "@/lib/types";

type Draft = {
  seatingPreference: string;
  temperaturePreference: string;
  favoriteSnack: string;
  drinkOfChoice: string;
  blanketPillowPreference: string;
};

function toDraft(p: Passenger): Draft {
  return {
    seatingPreference: p.seatingPreference ?? "",
    temperaturePreference: p.temperaturePreference ?? "",
    favoriteSnack: p.favoriteSnack ?? "",
    drinkOfChoice: p.drinkOfChoice ?? "",
    blanketPillowPreference: p.blanketPillowPreference ?? "",
  };
}

const FIELDS: { key: keyof Draft; label: string; placeholder: string }[] = [
  { key: "seatingPreference", label: "Seating", placeholder: "e.g. Window, forward cabin" },
  { key: "temperaturePreference", label: "Cabin temperature", placeholder: "e.g. Slightly warm" },
  { key: "favoriteSnack", label: "Favorite snack", placeholder: "e.g. Marcona almonds" },
  { key: "drinkOfChoice", label: "Drink of choice", placeholder: "e.g. Sparkling water with lime" },
  { key: "blanketPillowPreference", label: "Blanket / pillow", placeholder: "e.g. Cashmere throw, firm pillow" },
];

export default function PreferencesSection({
  passenger,
  onSave,
}: {
  passenger: Passenger;
  onSave: (data: Partial<Record<keyof Draft, string | null>>) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(passenger));

  return (
    <EditableSection
      title="Preferences"
      editing={editing}
      onEdit={() => {
        setDraft(toDraft(passenger));
        setEditing(true);
      }}
      onCancel={() => setEditing(false)}
      onSave={async () => {
        await onSave(draft);
        setEditing(false);
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, placeholder }) =>
          editing ? (
            <label key={key}>
              <span className="field-label">{label}</span>
              <input
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                placeholder={placeholder}
                className="field-input"
              />
            </label>
          ) : (
            <div key={key}>
              <span className="field-label">{label}</span>
              <p className="text-sm text-ink">
                {passenger[key] || <span className="text-navy-300">Not set</span>}
              </p>
            </div>
          )
        )}
      </div>
    </EditableSection>
  );
}
