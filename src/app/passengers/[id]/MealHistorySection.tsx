"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { MealLog } from "@/lib/types";

export default function MealHistorySection({
  meals,
  onAdd,
  onDelete,
}: {
  meals: MealLog[];
  onAdd: (data: { date: string; item: string; notes?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [item, setItem] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onAdd({ date, item: item.trim(), notes: notes.trim() || undefined });
      setItem("");
      setNotes("");
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">Meal &amp; Beverage History</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs uppercase tracking-wide font-semibold text-gold-600 hover:text-gold-700"
          >
            + Log entry
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-navy-100 bg-parchment/40 p-4">
          <div className="grid sm:grid-cols-[140px_1fr] gap-3 mb-3">
            <label>
              <span className="field-label">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="field-input"
                required
              />
            </label>
            <label>
              <span className="field-label">What they had</span>
              <input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. Grilled salmon, sparkling water"
                className="field-input"
                required
                autoFocus
              />
            </label>
          </div>
          <label className="block mb-3">
            <span className="field-label">Notes (optional)</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Asked for sauce on the side"
              className="field-input"
            />
          </label>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? "Saving…" : "Save entry"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {meals.length === 0 ? (
        <p className="text-sm text-navy-300">No meal history logged yet.</p>
      ) : (
        <ul className="divide-y divide-navy-50">
          {meals.map((meal) => (
            <li key={meal.id} className="py-3 flex items-start justify-between gap-3 group">
              <div>
                <p className="text-sm text-ink font-medium">{meal.item}</p>
                {meal.notes && <p className="text-sm text-navy-400 mt-0.5">{meal.notes}</p>}
                <p className="text-xs text-navy-300 mt-1">
                  {formatDate(meal.date)}
                  {meal.createdBy ? ` · logged by ${meal.createdBy}` : ""}
                </p>
              </div>
              <button
                onClick={() => onDelete(meal.id)}
                className="text-xs text-navy-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
