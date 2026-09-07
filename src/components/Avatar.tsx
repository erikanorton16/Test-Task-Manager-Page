import { initials } from "@/lib/utils";
import { cx } from "@/lib/utils";

export default function Avatar({
  name,
  photoUrl,
  size = "md",
}: {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-14 w-14 text-base",
    lg: "h-24 w-24 text-2xl",
    xl: "h-32 w-32 text-3xl",
  }[size];

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={cx(sizeClasses, "rounded-full object-cover border border-navy-100 shadow-sm")}
      />
    );
  }

  return (
    <div
      className={cx(
        sizeClasses,
        "rounded-full bg-navy-100 text-navy-600 font-display flex items-center justify-center border border-navy-100 shadow-sm"
      )}
    >
      {initials(name) || "?"}
    </div>
  );
}
