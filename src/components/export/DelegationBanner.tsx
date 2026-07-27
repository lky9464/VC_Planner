"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Bot } from "lucide-react";
import type { DelegatedItem } from "@/lib/markdown/render-delegation";

/** Step 4 상단 — 위임 항목 요약 배너 (Plan 6-4) */
export function DelegationBanner({ items }: { items: DelegatedItem[] }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-accent/35 bg-accent-soft/30">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-fg"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <Bot className="size-4 shrink-0 text-accent" aria-hidden />
          <strong>
            {items.length}개 항목을 Agent 판단에 맡겼습니다
          </strong>
        </span>
        {expanded ? (
          <ChevronUp className="size-4 shrink-0 text-muted" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden />
        )}
      </button>

      {expanded && (
        <ul className="border-t border-accent/25 px-4 py-3 text-xs text-muted">
          {items.map((item) => (
            <li key={item.sectionKey} className="list-inside list-disc py-0.5">
              {item.label}
              {item.value.delegateHint.trim()
                ? ` — 선호: ${item.value.delegateHint.trim()}`
                : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
