"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";

/**
 * Presentational edit/save chrome for a profile section. Editing state and
 * the field draft live in the parent so the parent can seed the draft from
 * the latest server data each time editing starts.
 */
export default function EditableSection({
  title,
  editing,
  onEdit,
  onCancel,
  onSave,
  children,
  savingLabel = "Saving…",
}: {
  title: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => Promise<void> | void;
  children: React.ReactNode;
  savingLabel?: string;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">{title}</h2>
        {!editing ? (
          <button
            onClick={onEdit}
            className="text-xs uppercase tracking-wide text-navy-400 hover:text-gold-500 transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setError(null);
                onCancel();
              }}
              className="text-xs uppercase tracking-wide text-navy-400 hover:text-navy-600"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={cx(
                "text-xs uppercase tracking-wide font-semibold text-gold-600 hover:text-gold-700",
                saving && "opacity-60"
              )}
            >
              {saving ? savingLabel : "Save"}
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="mb-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {children}
    </section>
  );
}
