import type { ReactNode } from "react";
import type { StepMeta } from "@/lib/steps";

type Props = {
  step: StepMeta;
  children?: ReactNode;
};

/** Step 본문을 감싸는 공통 카드 (Plan 4장) */
export function StepCard({ step, children }: Props) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <header className="mb-5 border-b border-line pb-4">
        <p className="mb-1 text-xs font-medium text-accent">
          Step {step.id} · {step.shortLabel}
        </p>
        <h2 className="text-lg font-semibold tracking-tight">{step.title}</h2>
        <p className="mt-1.5 text-sm text-muted">{step.description}</p>
      </header>
      {children}
    </article>
  );
}
