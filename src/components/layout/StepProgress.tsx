"use client";

import { Check } from "lucide-react";
import { STEPS, type StepId } from "@/lib/steps";

type Props = {
  current: StepId;
  completedSteps: Record<StepId, boolean>;
  onSelect: (step: StepId) => void;
};

/**
 * 진행바. Step 완료 시에만 좌측 체크 표시 (모든 항목 입력 완료 기준).
 */
export function StepProgress({ current, completedSteps, onSelect }: Props) {
  return (
    <nav aria-label="진행 단계" className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, index) => {
        const isCurrent = step.id === current;
        const isComplete = completedSteps[step.id];

        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            {index > 0 && (
              <span
                aria-hidden
                className={`h-px w-3 sm:w-6 ${
                  isComplete || isCurrent ? "bg-accent/60" : "bg-line"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2 sm:pr-3 text-sm transition-colors ${
                isCurrent
                  ? "bg-accent-soft text-fg"
                  : "text-muted hover:bg-surface-2 hover:text-fg"
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent
                    ? "bg-accent text-bg"
                    : isComplete
                      ? "bg-accent/25 text-accent"
                      : "bg-surface-2 text-muted"
                }`}
              >
                {isComplete ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  step.id
                )}
              </span>
              <span className="hidden whitespace-nowrap sm:inline">
                {step.shortLabel}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
