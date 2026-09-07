import { cx } from "@/lib/utils";

const TAG_COLORS: Record<string, string> = {
  VIP: "bg-gold-100 text-gold-600 border-gold-200",
  Child: "bg-navy-50 text-navy-500 border-navy-100",
  "First-time flyer": "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function TagPill({ name, onRemove }: { name: string; onRemove?: () => void }) {
  const colorClass = TAG_COLORS[name] ?? "bg-parchment text-navy-500 border-navy-100";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorClass
      )}
    >
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100"
          aria-label={`Remove ${name} tag`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
