"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import PassengerCard from "@/components/PassengerCard";
import { fetcher } from "@/lib/client";
import type { Passenger, Tag } from "@/lib/types";

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data, isLoading } = useSWR<{ passengers: Passenger[] }>(
    "/api/passengers",
    fetcher,
    { refreshInterval: 8000, revalidateOnFocus: true }
  );
  const { data: tagData } = useSWR<{ tags: Tag[] }>("/api/tags", fetcher, {
    refreshInterval: 30000,
  });

  const passengers = data?.passengers ?? [];
  const tags = tagData?.tags ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return passengers.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.relationship?.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q);
      const matchesTag = !activeTag || p.tags.some((t) => t.name === activeTag);
      return matchesQuery && matchesTag;
    });
  }, [passengers, query, activeTag]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-600 mb-2">
            Shared &amp; always in sync
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink">Passenger Directory</h1>
          <p className="text-navy-400 mt-1">
            {passengers.length} passenger{passengers.length === 1 ? "" : "s"} on file
          </p>
        </div>
        <Link href="/passengers/new" className="btn-gold self-start sm:self-auto">
          + Add New Passenger
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, relationship, or notes…"
          className="field-input sm:max-w-sm"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                !activeTag
                  ? "bg-navy-800 text-linen border-navy-800"
                  : "border-navy-200 text-navy-500 hover:bg-navy-50"
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeTag === tag.name
                    ? "bg-navy-800 text-linen border-navy-800"
                    : "border-navy-200 text-navy-500 hover:bg-navy-50"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && <p className="text-navy-400 text-sm">Loading passengers…</p>}

      {!isLoading && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="font-display text-xl text-ink mb-2">No passengers found</p>
          <p className="text-navy-400 text-sm mb-6">
            {passengers.length === 0
              ? "Start by adding the first passenger profile."
              : "Try a different search or clear the tag filter."}
          </p>
          {passengers.length === 0 && (
            <Link href="/passengers/new" className="btn-gold">
              + Add New Passenger
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((passenger) => (
          <PassengerCard key={passenger.id} passenger={passenger} />
        ))}
      </div>
    </div>
  );
}
