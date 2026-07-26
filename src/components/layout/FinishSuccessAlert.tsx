"use client";

import { CheckCircle2 } from "lucide-react";

/** Step 4 「명세서 받기」 성공 시 안내 */
export function FinishSuccessAlert() {
  return (
    <div
      role="status"
      className="rounded-lg border border-accent/40 bg-accent-soft/50 px-4 py-3 text-sm"
    >
      <p className="flex items-center gap-2 font-semibold text-fg">
        <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden />
        명세서 준비가 완료되었습니다
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        오른쪽 <strong className="text-fg">Prompt.md 미리보기</strong>에서
        내용을 확인하세요. 복사·파일 다운로드·PDF는 Phase 6에서 연결됩니다.
        (모바일은 하단 <strong className="text-fg">미리보기</strong> 버튼)
      </p>
    </div>
  );
}
