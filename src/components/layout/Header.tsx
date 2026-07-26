"use client";

import { StepProgress } from "./StepProgress";
import { SaveIndicator, type SaveStatus } from "./SaveIndicator";
import type { StepId } from "@/lib/steps";

type Props = {
  current: StepId;
  completedSteps: Record<StepId, boolean>;
  onSelect: (step: StepId) => void;
  saveStatus: SaveStatus;
};

export function Header({ current, completedSteps, onSelect, saveStatus }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4">
        <div className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-bg"
          >
            VC
          </span>
          <span className="hidden text-sm font-semibold tracking-tight md:inline">
            VC Planner
          </span>
        </div>

        <div className="flex flex-1 justify-center overflow-x-auto">
          <StepProgress
            current={current}
            completedSteps={completedSteps}
            onSelect={onSelect}
          />
        </div>

        <div className="hidden shrink-0 sm:block">
          <SaveIndicator status={saveStatus} />
        </div>
      </div>
    </header>
  );
}
