"use client";

import { useState } from "react";
import EditableSection from "@/components/EditableSection";
import { hasRealAllergy } from "@/lib/utils";
import type { Passenger } from "@/lib/types";

type Draft = { dietaryPreferences: string; allergies: string };

function toDraft(p: Passenger): Draft {
  return { dietaryPreferences: p.dietaryPreferences ?? "", allergies: p.allergies ?? "" };
}

export default function DietarySection({
  passenger,
  onSave,
}: {
  passenger: Passenger;
  onSave: (data: { dietaryPreferences: string | null; allergies: string | null }) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(passenger));

  return (
    <EditableSection
      title="Dietary Preferences & Allergies"
      editing={editing}
      onEdit={() => {
        setDraft(toDraft(passenger));
        setEditing(true);
      }}
      onCancel={() => setEditing(false)}
      onSave={async () => {
        await onSave({
          dietaryPreferences: draft.dietaryPreferences || null,
          allergies: draft.allergies || null,
        });
        setEditing(false);
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <span className="field-label">Dietary preferences</span>
          {editing ? (
            <input
              value={draft.dietaryPreferences}
              onChange={(e) => setDraft((d) => ({ ...d, dietaryPreferences: e.target.value }))}
              placeholder="e.g. Pescatarian"
              className="field-input"
            />
          ) : (
            <p className="text-sm text-ink">
              {passenger.dietaryPreferences || <span className="text-navy-300">Not set</span>}
            </p>
          )}
        </div>
        <div>
          <span className="field-label">Allergies</span>
          {editing ? (
            <input
              value={draft.allergies}
              onChange={(e) => setDraft((d) => ({ ...d, allergies: e.target.value }))}
              placeholder="e.g. Tree nuts"
              className="field-input"
            />
          ) : hasRealAllergy(passenger.allergies) ? (
            <p className="text-sm text-red-500 font-medium">⚠ {passenger.allergies}</p>
          ) : (
            <p className="text-sm text-navy-300">{passenger.allergies || "None known"}</p>
          )}
        </div>
      </div>
    </EditableSection>
  );
}
