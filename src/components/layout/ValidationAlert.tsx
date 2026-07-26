"use client";

import { AlertTriangle } from "lucide-react";
import { STEPS } from "@/lib/steps";
import type { IncompleteField } from "@/lib/validation/completion";

type Props = {
  items: IncompleteField[];
  title?: string;
};

/** Step 4 진입 차단·결과 받기 전 미완료 항목 경고 */
export function ValidationAlert({
  items,
  title = "아직 입력되지 않은 항목이 있습니다",
}: Props) {
  if (items.length === 0) return null;

  const grouped = STEPS.map((step) => ({
    step,
    fields: items.filter((i) => i.step === step.id),
  })).filter((g) => g.fields.length > 0);

  return (
    <div
      role="alert"
      className="rounded-lg border border-warn/40 bg-warn/10 px-4 py-3 text-sm"
    >
      <p className="mb-2 flex items-center gap-2 font-semibold text-fg">
        <AlertTriangle className="size-4 shrink-0 text-warn" aria-hidden />
        {title}
      </p>
      <ul className="space-y-2 text-xs leading-relaxed text-muted">
        {grouped.map(({ step, fields }) => (
          <li key={step.id}>
            <span className="font-medium text-fg">
              Step {step.id} · {step.shortLabel}
            </span>
            <ul className="mt-0.5 list-inside list-disc pl-1">
              {fields.map((f) => (
                <li key={f.label}>{f.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
