"use client";

import { useMemo, useState } from "react";
import { Eye, X } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { ValidationAlert } from "./ValidationAlert";
import { FinishSuccessAlert } from "./FinishSuccessAlert";
import { PreviewDrawer } from "./PreviewDrawer";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { StepCard } from "@/components/steps/StepCard";
import { StepBody } from "@/components/steps/StepBody";
import { DelegationBanner } from "@/components/export/DelegationBanner";
import { collectDelegatedItems } from "@/lib/markdown/render-delegation";
import { FIRST_STEP, LAST_STEP, STEPS, type StepId } from "@/lib/steps";
import {
  canProceedToResults,
  getIncompleteFields,
  getStepCompletionMap,
} from "@/lib/validation/completion";

/**
 * 위저드 셸. Step 전환은 라우팅이 아니라 상태로 처리한다.
 * (정적 배포에서 새로고침 404를 피하고 입력 상태를 유지하기 위함)
 */
export function PlannerShell() {
  const { state, saveStatus } = useProject();
  const [current, setCurrent] = useState<StepId>(FIRST_STEP);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  /** Step 4 하단 「명세서 받기」 클릭 시에만 미완료 경고 표시 */
  const [finishWarning, setFinishWarning] = useState(false);
  /** 검증 통과 후 성공 안내 */
  const [finishSuccess, setFinishSuccess] = useState(false);

  const completedSteps = useMemo(() => getStepCompletionMap(state), [state]);
  const incompleteFields = useMemo(() => getIncompleteFields(state), [state]);
  const delegatedItems = useMemo(() => collectDelegatedItems(state), [state]);

  const step = STEPS.find((s) => s.id === current) ?? STEPS[0];

  const goToStep = (target: StepId) => {
    setFinishWarning(false);
    setFinishSuccess(false);
    setCurrent(target);
  };

  const goPrev = () =>
    setCurrent((s) => {
      setFinishWarning(false);
      setFinishSuccess(false);
      return s > FIRST_STEP ? ((s - 1) as StepId) : s;
    });

  const goNext = () => {
    setFinishWarning(false);
    setFinishSuccess(false);
    setCurrent((s) => (s < LAST_STEP ? ((s + 1) as StepId) : s));
  };

  const handleFinish = () => {
    if (!canProceedToResults(state)) {
      setFinishSuccess(false);
      setFinishWarning(true);
      return;
    }
    setFinishWarning(false);
    setFinishSuccess(true);

    // 모바일·태블릿: 미리보기 시트를 자동으로 연다
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setPreviewOpen(true);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        current={current}
        completedSteps={completedSteps}
        onSelect={goToStep}
        saveStatus={saveStatus}
      />

      {current === 4 && delegatedItems.length > 0 && (
        <div className="border-b border-accent/25 bg-accent-soft/20 px-4 py-3">
          <div className="mx-auto max-w-[1600px]">
            <DelegationBanner items={delegatedItems} />
          </div>
        </div>
      )}

      {finishSuccess && current === 4 && (
        <div className="border-b border-accent/30 bg-accent-soft/30 px-4 py-3">
          <div className="mx-auto max-w-[1600px]">
            <FinishSuccessAlert />
          </div>
        </div>
      )}

      {finishWarning && current === 4 && (
        <div className="border-b border-warn/30 bg-warn/5 px-4 py-3">
          <div className="mx-auto max-w-[1600px]">
            <ValidationAlert
              items={incompleteFields}
              title="명세서를 받기 전에 아래 항목을 모두 입력해 주세요"
            />
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row lg:gap-0">
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <StepCard step={step}>
            <StepBody step={step.id} finishSuccess={finishSuccess && current === 4} />
          </StepCard>
        </main>

        <PreviewDrawer />
      </div>

      <BottomNav
        current={current}
        onPrev={goPrev}
        onNext={goNext}
        onFinish={handleFinish}
      />
      <Footer />

      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="fixed right-4 bottom-24 z-30 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-bg shadow-lg lg:hidden"
      >
        <Eye className="size-4" aria-hidden />
        미리보기
      </button>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="미리보기 닫기"
            onClick={() => setPreviewOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-x-0 bottom-0 flex h-[75dvh] flex-col rounded-t-2xl border-t border-line bg-surface">
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2">
              <span className="text-sm font-semibold">명세서 미리보기</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="닫기"
                className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <PreviewPane />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
