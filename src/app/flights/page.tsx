"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/client";
import { formatDate, isUpcoming } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import type { FlightLogWithPassenger } from "@/lib/types";

function FlightRow({ flight }: { flight: FlightLogWithPassenger }) {
  return (
    <Link
      href={`/passengers/${flight.passenger.id}`}
      className="flex items-center gap-4 p-4 rounded-xl2 hover:bg-navy-50 transition-colors"
    >
      <Avatar name={flight.passenger.name} photoUrl={flight.passenger.photoUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">
          {flight.passenger.name}
          {flight.flightInfo && (
            <span className="text-navy-400 font-normal"> · {flight.flightInfo}</span>
          )}
        </p>
        {flight.notes && <p className="text-sm text-navy-400 truncate">{flight.notes}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm text-ink">{formatDate(flight.date)}</p>
        {flight.createdBy && <p className="text-xs text-navy-300">logged by {flight.createdBy}</p>}
      </div>
    </Link>
  );
}

export default function FlightsPage() {
  const { data, isLoading } = useSWR<{ flights: FlightLogWithPassenger[] }>(
    "/api/flights",
    fetcher,
    { refreshInterval: 8000 }
  );

  const flights = data?.flights ?? [];
  const upcoming = flights.filter((f) => isUpcoming(f.date)).sort((a, b) => a.date.localeCompare(b.date));
  const recent = flights.filter((f) => !isUpcoming(f.date));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10">
      <p className="text-xs uppercase tracking-[0.25em] text-gold-600 mb-2">Flight log</p>
      <h1 className="font-display text-3xl text-ink mb-8">Recent &amp; Upcoming Flights</h1>

      {isLoading && <p className="text-navy-400 text-sm">Loading flights…</p>}

      {!isLoading && (
        <div className="grid gap-6">
          <section className="card p-2">
            <h2 className="font-display text-lg text-ink px-4 pt-4 pb-2">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-navy-300 px-4 pb-4">No upcoming flights logged.</p>
            ) : (
              <div className="divide-y divide-navy-50">
                {upcoming.map((f) => (
                  <FlightRow key={f.id} flight={f} />
                ))}
              </div>
            )}
          </section>

          <section className="card p-2">
            <h2 className="font-display text-lg text-ink px-4 pt-4 pb-2">Recent</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-navy-300 px-4 pb-4">No past flights logged yet.</p>
            ) : (
              <div className="divide-y divide-navy-50">
                {recent.map((f) => (
                  <FlightRow key={f.id} flight={f} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
