"use client";

import { HelpCircle } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  hint: string;
  children: React.ReactNode;
};

/** 선택지 옆 ? 아이콘 — 마우스·키보드 포커스 시 설명 표시 */
export function HintTooltip({ hint, children }: Props) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-describedby={open ? tooltipId : undefined}
        aria-label="자세한 설명 보기"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="rounded p-0.5 text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {children}
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-1.5 w-56 -translate-x-1/2 rounded-md border border-line bg-surface-2 px-2.5 py-2 text-xs leading-relaxed text-fg shadow-lg"
        >
          {hint}
        </span>
      )}
    </span>
  );
}

export function HintIcon({ hint }: { hint: string }) {
  return (
    <HintTooltip hint={hint}>
      <HelpCircle className="size-3.5" aria-hidden />
    </HintTooltip>
  );
}
