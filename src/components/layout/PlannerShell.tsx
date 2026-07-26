"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { StepCard } from "@/components/steps/StepCard";
import { StepBody } from "@/components/steps/StepBody";
import { FIRST_STEP, LAST_STEP, STEPS, type StepId } from "@/lib/steps";

/**
 * 위저드 셸. Step 전환은 라우팅이 아니라 상태로 처리한다.
 * (정적 배포에서 새로고침 404를 피하고 입력 상태를 유지하기 위함)
 */
export function PlannerShell() {
  const [current, setCurrent] = useState<StepId>(FIRST_STEP);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const step = STEPS.find((s) => s.id === current) ?? STEPS[0];

  const goPrev = () =>
    setCurrent((s) => (s > FIRST_STEP ? ((s - 1) as StepId) : s));
  const goNext = () =>
    setCurrent((s) => (s < LAST_STEP ? ((s + 1) as StepId) : s));

  return (
    <div className="flex min-h-dvh flex-col">
      <Header current={current} onSelect={setCurrent} saveStatus="idle" />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row lg:gap-0">
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <StepCard step={step}>
            <StepBody step={step.id} />
          </StepCard>
        </main>

        {/* 데스크톱: 우측 고정 미리보기 */}
        <aside className="hidden w-[420px] shrink-0 border-l border-line lg:block xl:w-[480px]">
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)]">
            <PreviewPane />
          </div>
        </aside>
      </div>

      <BottomNav current={current} onPrev={goPrev} onNext={goNext} />
      <Footer />

      {/* 모바일·태블릿: 하단 시트로 전환 */}
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
