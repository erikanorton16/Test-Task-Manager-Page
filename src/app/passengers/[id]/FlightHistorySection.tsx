"use client";

import { useState } from "react";
import { formatDate, isUpcoming } from "@/lib/utils";
import type { FlightLog } from "@/lib/types";

export default function FlightHistorySection({
  flights,
  onAdd,
  onDelete,
}: {
  flights: FlightLog[];
  onAdd: (data: { date: string; flightInfo?: string; notes?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [flightInfo, setFlightInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onAdd({ date, flightInfo: flightInfo.trim() || undefined, notes: notes.trim() || undefined });
      setFlightInfo("");
      setNotes("");
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save flight.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">Flight History</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs uppercase tracking-wide font-semibold text-gold-600 hover:text-gold-700"
          >
            + Add flight
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
              <span className="field-label">Route / flight</span>
              <input
                value={flightInfo}
                onChange={(e) => setFlightInfo(e.target.value)}
                placeholder="e.g. KTEB → KPBI"
                className="field-input"
                autoFocus
              />
            </label>
          </div>
          <label className="block mb-3">
            <span className="field-label">Notes (optional)</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Smooth flight, watched a documentary"
              className="field-input"
            />
          </label>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? "Saving…" : "Save flight"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {flights.length === 0 ? (
        <p className="text-sm text-navy-300">No flights logged yet.</p>
      ) : (
        <ul className="divide-y divide-navy-50">
          {flights.map((flight) => (
            <li key={flight.id} className="py-3 flex items-start justify-between gap-3 group">
              <div>
                <p className="text-sm text-ink font-medium">
                  {flight.flightInfo || "Flight"}
                  {isUpcoming(flight.date) && (
                    <span className="ml-2 text-xs font-semibold text-gold-600 uppercase tracking-wide">
                      Upcoming
                    </span>
                  )}
                </p>
                {flight.notes && <p className="text-sm text-navy-400 mt-0.5">{flight.notes}</p>}
                <p className="text-xs text-navy-300 mt-1">
                  {formatDate(flight.date)}
                  {flight.createdBy ? ` · logged by ${flight.createdBy}` : ""}
                </p>
              </div>
              <button
                onClick={() => onDelete(flight.id)}
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
