import { formatDate } from "@/lib/utils";

export default function LastUpdated({
  by,
  at,
  className,
}: {
  by: string | null;
  at: string;
  className?: string;
}) {
  return (
    <p className={className ?? "text-xs text-navy-400"}>
      Last updated {by ? `by ${by}` : ""} · {formatDate(at)}
    </p>
  );
}
