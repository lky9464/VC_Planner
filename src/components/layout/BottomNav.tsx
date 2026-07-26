"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { FIRST_STEP, LAST_STEP, STEPS, type StepId } from "@/lib/steps";

type Props = {
  current: StepId;
  onPrev: () => void;
  onNext: () => void;
};

export function BottomNav({ current, onPrev, onNext }: Props) {
  const isFirst = current === FIRST_STEP;
  const isLast = current === LAST_STEP;
  const nextStep = STEPS.find((s) => s.id === current + 1);

  return (
    <div className="border-t border-line bg-surface px-4 py-3">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft className="size-4" aria-hidden />
          이전
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {nextStep ? `다음: ${nextStep.shortLabel}` : "다음"}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
