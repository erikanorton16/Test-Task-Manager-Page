import { format, formatDistanceToNow, isFuture } from "date-fns";

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isUpcoming(date: Date | string): boolean {
  return isFuture(new Date(date));
}

const NO_ALLERGY_PATTERN = /^(none|no known|n\/?a|nka)\b/i;

/** True when an allergies field actually states an allergy, not "none known" etc. */
export function hasRealAllergy(allergies: string | null | undefined): boolean {
  return Boolean(allergies && allergies.trim() && !NO_ALLERGY_PATTERN.test(allergies.trim()));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
