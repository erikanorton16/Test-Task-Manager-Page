"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoPicker from "@/components/PhotoPicker";
import TagPill from "@/components/TagPill";
import { cx } from "@/lib/utils";

const RELATIONSHIP_SUGGESTIONS = [
  "Primary Family Member",
  "Guest",
  "Child",
  "Extended Family",
  "Staff",
];

const TAG_SUGGESTIONS = ["VIP", "Child", "First-time flyer"];

type FormState = {
  name: string;
  photoUrl: string | null;
  relationship: string;
  dietaryPreferences: string;
  allergies: string;
  seatingPreference: string;
  temperaturePreference: string;
  favoriteSnack: string;
  drinkOfChoice: string;
  blanketPillowPreference: string;
  notes: string;
  tags: string[];
};

const INITIAL_STATE: FormState = {
  name: "",
  photoUrl: null,
  relationship: "",
  dietaryPreferences: "",
  allergies: "",
  seatingPreference: "",
  temperaturePreference: "",
  favoriteSnack: "",
  drinkOfChoice: "",
  blanketPillowPreference: "",
  notes: "",
  tags: [],
};

export default function AddPassengerPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [tagDraft, setTagDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || form.tags.includes(trimmed)) return;
    set("tags", [...form.tags, trimmed]);
    setTagDraft("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/passengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not create passenger.");
      router.push(`/passengers/${json.passenger.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 pb-16">
      <p className="text-xs uppercase tracking-[0.25em] text-gold-600 mb-2">New profile</p>
      <h1 className="font-display text-3xl text-ink mb-1">Add New Passenger</h1>
      <p className="text-navy-400 mb-8">
        Onboard someone being considered — or confirmed — as a guest on an upcoming flight.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <section className="card p-6 sm:p-8">
          <h2 className="font-display text-lg text-ink mb-5">Basic Information</h2>
          <div className="flex flex-col gap-5">
            <PhotoPicker name={form.name} value={form.photoUrl} onChange={(v) => set("photoUrl", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <label>
                <span className="field-label">Name *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="field-input"
                  placeholder="Full name"
                />
              </label>
              <label>
                <span className="field-label">Relationship / role</span>
                <input
                  value={form.relationship}
                  onChange={(e) => set("relationship", e.target.value)}
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
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map((tag) => (
                  <TagPill
                    key={tag}
                    name={tag}
                    onRemove={() => set("tags", form.tags.filter((t) => t !== tag))}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagDraft);
                    }
                  }}
                  placeholder="e.g. VIP"
                  className="field-input text-sm"
                  list="tag-suggestions"
                />
                <datalist id="tag-suggestions">
                  {TAG_SUGGESTIONS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
                <button type="button" onClick={() => addTag(tagDraft)} className="btn-secondary text-sm px-3">
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="font-display text-lg text-ink mb-5">Dietary Preferences &amp; Allergies</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="field-label">Dietary preferences</span>
              <input
                value={form.dietaryPreferences}
                onChange={(e) => set("dietaryPreferences", e.target.value)}
                className="field-input"
                placeholder="e.g. Pescatarian"
              />
            </label>
            <label>
              <span className="field-label">Allergies</span>
              <input
                value={form.allergies}
                onChange={(e) => set("allergies", e.target.value)}
                className="field-input"
                placeholder="e.g. Tree nuts"
              />
            </label>
          </div>
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="font-display text-lg text-ink mb-5">Personal Preferences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="field-label">Seating</span>
              <input
                value={form.seatingPreference}
                onChange={(e) => set("seatingPreference", e.target.value)}
                className="field-input"
                placeholder="e.g. Window, forward cabin"
              />
            </label>
            <label>
              <span className="field-label">Cabin temperature</span>
              <input
                value={form.temperaturePreference}
                onChange={(e) => set("temperaturePreference", e.target.value)}
                className="field-input"
                placeholder="e.g. Slightly warm"
              />
            </label>
            <label>
              <span className="field-label">Favorite snack</span>
              <input
                value={form.favoriteSnack}
                onChange={(e) => set("favoriteSnack", e.target.value)}
                className="field-input"
                placeholder="e.g. Marcona almonds"
              />
            </label>
            <label>
              <span className="field-label">Drink of choice</span>
              <input
                value={form.drinkOfChoice}
                onChange={(e) => set("drinkOfChoice", e.target.value)}
                className="field-input"
                placeholder="e.g. Sparkling water with lime"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Blanket / pillow</span>
              <input
                value={form.blanketPillowPreference}
                onChange={(e) => set("blanketPillowPreference", e.target.value)}
                className="field-input"
                placeholder="e.g. Cashmere throw, firm pillow"
              />
            </label>
          </div>
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="font-display text-lg text-ink mb-5">Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={4}
            className="field-textarea"
            placeholder={`e.g. "Prefers quiet during takeoff," "always asks for extra napkins"`}
          />
        </section>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className={cx("btn-gold", saving && "opacity-60")}>
            {saving ? "Saving…" : "Save profile"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
