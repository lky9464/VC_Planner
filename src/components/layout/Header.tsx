"use client";

import { BookOpen } from "lucide-react";
import { README_URL } from "@/lib/project/constants";
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

        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href={README_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-xs font-semibold text-accent shadow-sm shadow-accent/10 transition-colors hover:border-accent/70 hover:bg-accent/20 hover:text-fg"
            title="GitHub README에서 사용 방법 보기"
          >
            <BookOpen className="size-3.5 shrink-0" aria-hidden />
            사용 방법
          </a>
          <div className="hidden sm:block">
            <SaveIndicator status={saveStatus} />
          </div>
        </div>
      </div>
    </header>
  );
}
