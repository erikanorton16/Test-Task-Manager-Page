import Link from "next/link";
import Avatar from "./Avatar";
import TagPill from "./TagPill";
import { hasRealAllergy } from "@/lib/utils";
import type { Passenger } from "@/lib/types";

export default function PassengerCard({ passenger }: { passenger: Passenger }) {
  return (
    <Link
      href={`/passengers/${passenger.id}`}
      className="card group flex flex-col p-5 hover:shadow-lift hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-4">
        <Avatar name={passenger.name} photoUrl={passenger.photoUrl} size="md" />
        <div className="min-w-0">
          <h3 className="font-display text-lg text-ink truncate group-hover:text-navy-700">
            {passenger.name}
          </h3>
          {passenger.relationship && (
            <p className="text-sm text-navy-400 truncate">{passenger.relationship}</p>
          )}
        </div>
      </div>

      {passenger.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {passenger.tags.map((tag) => (
            <TagPill key={tag.id} name={tag.name} />
          ))}
        </div>
      )}

      {hasRealAllergy(passenger.allergies) && (
        <p className="mt-3 text-xs text-red-500 line-clamp-1">⚠ {passenger.allergies}</p>
      )}
    </Link>
  );
}
