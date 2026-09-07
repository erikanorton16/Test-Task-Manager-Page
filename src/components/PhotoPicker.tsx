"use client";

import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { fileToResizedDataUrl } from "@/lib/client";

export default function PhotoPicker({
  name,
  value,
  onChange,
  size = "xl",
}: {
  name: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  size?: "lg" | "xl";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      onChange(dataUrl);
    } catch {
      // silently ignore unreadable files
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name || "?"} photoUrl={value} size={size} />
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-secondary text-xs px-3 py-1.5"
          disabled={busy}
        >
          {busy ? "Processing…" : value ? "Change photo" : "Upload photo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-navy-400 hover:text-red-500 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}
