"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/client";
import type { Passenger } from "@/lib/types";
import BasicInfoSection from "./BasicInfoSection";
import PreferencesSection from "./PreferencesSection";
import DietarySection from "./DietarySection";
import NotesSection from "./NotesSection";
import MealHistorySection from "./MealHistorySection";
import FlightHistorySection from "./FlightHistorySection";

export default function PassengerProfileClient({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useSWR<{ passenger: Passenger }>(
    `/api/passengers/${id}`,
    fetcher,
    { refreshInterval: 8000, revalidateOnFocus: true }
  );

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/passengers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not save changes.");
    await mutate(json, { revalidate: false });
  }

  async function addMeal(entry: { date: string; item: string; notes?: string }) {
    const res = await fetch(`/api/passengers/${id}/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not save entry.");
    await mutate();
  }

  async function deleteMeal(mealId: string) {
    await fetch(`/api/meals/${mealId}`, { method: "DELETE" });
    await mutate();
  }

  async function addFlight(entry: { date: string; flightInfo?: string; notes?: string }) {
    const res = await fetch(`/api/passengers/${id}/flights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not save flight.");
    await mutate();
  }

  async function deleteFlight(flightId: string) {
    await fetch(`/api/flights/${flightId}`, { method: "DELETE" });
    await mutate();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <p className="text-navy-400 text-sm">Loading profile…</p>
      </div>
    );
  }

  if (error || !data?.passenger) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <div className="card p-10 text-center">
          <p className="font-display text-xl text-ink mb-2">Passenger not found</p>
          <Link href="/" className="btn-secondary mt-4 inline-flex">
            Back to directory
          </Link>
        </div>
      </div>
    );
  }

  const passenger = data.passenger;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8">
      <Link href="/" className="text-sm text-navy-400 hover:text-navy-600 mb-4 inline-block">
        ← Directory
      </Link>

      <div className="flex flex-col gap-5">
        <BasicInfoSection
          passenger={passenger}
          onSave={(fields) => patch(fields)}
        />
        <PreferencesSection passenger={passenger} onSave={(fields) => patch(fields)} />
        <DietarySection passenger={passenger} onSave={(fields) => patch(fields)} />
        <NotesSection passenger={passenger} onSave={(fields) => patch(fields)} />
        <MealHistorySection
          meals={passenger.mealLogs ?? []}
          onAdd={addMeal}
          onDelete={deleteMeal}
        />
        <FlightHistorySection
          flights={passenger.flightLogs ?? []}
          onAdd={addFlight}
          onDelete={deleteFlight}
        />
      </div>
    </div>
  );
}
