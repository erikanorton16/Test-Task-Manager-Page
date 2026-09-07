"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import PhotoPicker from "@/components/PhotoPicker";
import TagPill from "@/components/TagPill";
import LastUpdated from "@/components/LastUpdated";
import TagsEditor from "./TagsEditor";
import { cx } from "@/lib/utils";
import type { Passenger } from "@/lib/types";

const RELATIONSHIP_SUGGESTIONS = [
  "Primary Family Member",
  "Guest",
  "Child",
  "Extended Family",
  "Staff",
];

type Draft = {
  name: string;
  relationship: string;
  photoUrl: string | null;
  tags: string[];
};

function toDraft(passenger: Passenger): Draft {
  return {
    name: passenger.name,
    relationship: passenger.relationship ?? "",
    photoUrl: passenger.photoUrl,
    tags: passenger.tags.map((t) => t.name),
  };
}

export default function BasicInfoSection({
  passenger,
  onSave,
}: {
  passenger: Passenger;
  onSave: (data: {
    name: string;
    relationship: string | null;
    photoUrl: string | null;
    tags: string[];
  }) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(passenger));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: draft.name,
        relationship: draft.relationship || null,
        photoUrl: draft.photoUrl,
        tags: draft.tags,
      });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6 sm:p-8">
      {!editing ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar name={passenger.name} photoUrl={passenger.photoUrl} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-ink">{passenger.name}</h1>
                {passenger.relationship && (
                  <p className="text-navy-400 mt-0.5">{passenger.relationship}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setDraft(toDraft(passenger));
                  setEditing(true);
                }}
                className="btn-secondary text-xs self-start"
              >
                Edit details
              </button>
            </div>
            {passenger.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {passenger.tags.map((tag) => (
                  <TagPill key={tag.id} name={tag.name} />
                ))}
              </div>
            )}
            <LastUpdated by={passenger.updatedBy} at={passenger.updatedAt} className="mt-3 text-xs text-navy-400" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <PhotoPicker
            name={draft.name}
            value={draft.photoUrl}
            onChange={(dataUrl) => setDraft((d) => ({ ...d, photoUrl: dataUrl }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="field-label">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="field-input"
              />
            </label>
            <label>
              <span className="field-label">Relationship / role</span>
              <input
                value={draft.relationship}
                onChange={(e) => setDraft((d) => ({ ...d, relationship: e.target.value }))}
                className="field-input"
                list="relationship-suggestions"
                placeholder="e.g. Guest"
              />
              <datalist id="relationship-suggestions">
                {RELATIONSHIP_SUGGESTIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </label>
          </div>
          <div>
            <span className="field-label">Tags</span>
            <TagsEditor tags={draft.tags} onChange={(tags) => setDraft((d) => ({ ...d, tags }))} />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !draft.name.trim()}
              className={cx("btn-gold text-sm", saving && "opacity-60")}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setError(null);
                setEditing(false);
              }}
              disabled={saving}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
