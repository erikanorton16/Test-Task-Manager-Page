"use client";

import { useState } from "react";
import EditableSection from "@/components/EditableSection";
import type { Passenger } from "@/lib/types";

export default function NotesSection({
  passenger,
  onSave,
}: {
  passenger: Passenger;
  onSave: (data: { notes: string | null }) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(passenger.notes ?? "");

  return (
    <EditableSection
      title="Notes"
      editing={editing}
      onEdit={() => {
        setDraft(passenger.notes ?? "");
        setEditing(true);
      }}
      onCancel={() => setEditing(false)}
      onSave={async () => {
        await onSave({ notes: draft || null });
        setEditing(false);
      }}
    >
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder={`e.g. "Prefers quiet during takeoff," "always asks for extra napkins"`}
          className="field-textarea"
        />
      ) : (
        <p className="text-sm text-ink whitespace-pre-wrap">
          {passenger.notes || <span className="text-navy-300">No notes yet.</span>}
        </p>
      )}
    </EditableSection>
  );
}
