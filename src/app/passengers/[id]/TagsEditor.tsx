"use client";

import { useState } from "react";
import useSWR from "swr";
import TagPill from "@/components/TagPill";
import { fetcher } from "@/lib/client";
import type { Tag } from "@/lib/types";

export default function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const { data } = useSWR<{ tags: Tag[] }>("/api/tags", fetcher);
  const suggestions = (data?.tags ?? [])
    .map((t) => t.name)
    .filter((name) => !tags.includes(name));

  function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <TagPill key={tag} name={tag} onRemove={() => onChange(tags.filter((t) => t !== tag))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(draft);
            }
          }}
          placeholder="Add a tag (e.g. VIP) and press Enter"
          className="field-input text-sm"
          list="tag-suggestions"
        />
        <datalist id="tag-suggestions">
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <button type="button" onClick={() => addTag(draft)} className="btn-secondary text-sm px-3">
          Add
        </button>
      </div>
    </div>
  );
}
