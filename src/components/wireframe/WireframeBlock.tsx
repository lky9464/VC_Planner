"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { WireframeItem } from "@/lib/types/project";
import { WIREFRAME_TYPE_LABELS } from "@/lib/wireframe/constants";

type Props = {
  item: WireframeItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
};

/** 그리드 안 한 블록 — 더블클릭으로 명칭 편집 */
export function WireframeBlock({
  item,
  selected,
  onSelect,
  onLabelChange,
  onRemove,
  readOnly = false,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(item.label);
  }, [item.label, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitLabel = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.label) {
      onLabelChange(item.i, trimmed);
    }
    setEditing(false);
  }, [draft, item.i, item.label, onLabelChange]);

  const typeLabel = WIREFRAME_TYPE_LABELS[item.type];

  if (readOnly) {
    return (
      <div className="wireframe-block relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-2/90 p-2 text-left">
        <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-accent">
          {typeLabel}
        </span>
        <p className="mt-1 line-clamp-3 flex-1 text-xs leading-snug text-fg">
          {item.label}
        </p>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.i);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item.i);
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      className={`wireframe-block group relative flex h-full flex-col overflow-hidden rounded-md border bg-surface-2/90 p-2 text-left transition-colors ${
        selected
          ? "border-accent ring-1 ring-accent/50"
          : "border-line hover:border-accent/35"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-accent">
          {typeLabel}
        </span>
        <button
          type="button"
          aria-label={`${typeLabel} 삭제`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.i);
          }}
          className="rounded p-0.5 text-muted opacity-0 transition-opacity hover:bg-surface hover:text-fg group-hover:opacity-100"
        >
          <X className="size-3" aria-hidden />
        </button>
      </div>

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitLabel}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitLabel();
            if (e.key === "Escape") {
              setDraft(item.label);
              setEditing(false);
            }
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-full rounded border border-line bg-bg px-1.5 py-0.5 text-xs text-fg outline-none focus:border-accent"
        />
      ) : (
        <p className="mt-1 line-clamp-3 flex-1 text-xs leading-snug text-fg">
          {item.label}
        </p>
      )}
    </div>
  );
}
