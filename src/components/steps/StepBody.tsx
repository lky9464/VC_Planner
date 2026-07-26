import { Hammer } from "lucide-react";
import type { StepId } from "@/lib/steps";

/**
 * Phase 0에서는 각 Step에 들어갈 항목만 안내한다.
 * Phase 2~6에서 실제 입력 컴포넌트로 하나씩 교체된다.
 */
const PLANNED: Record<StepId, string[]> = {
  1: [
    "기본 정보 — 서비스 이름, 한 줄 설명, 분야, 민감 데이터 여부",
    "업무 흐름도 — 드래그로 그리는 플로우차트",
    "화면 배치 — 블록을 끌어다 놓는 와이어프레임",
    "입출력 데이터 — 무엇을 받고 무엇을 보여줄지",
    "예외 상황 — 데이터가 없을 때, 오류가 났을 때",
  ],
  2: [
    "앱 형태 — 웹앱 / 정적 사이트 등",
    "데이터 저장 위치 — 브라우저 저장 / 클라우드 등",
  ],
  3: [
    "AI 역할 정하기",
    "가드레일 체크리스트 — 지켜야 할 규칙 12가지",
    "규칙 직접 추가하기",
  ],
  4: [
    "전체 프롬프트 복사",
    "Agent 규칙 파일 복사",
    "md / txt 파일 다운로드",
    "PDF 리포트 다운로드",
  ],
};

export function StepBody({ step }: { step: StepId }) {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {PLANNED[step].map((item) => (
          <li
            key={item}
            className="rounded-lg border border-dashed border-line bg-surface-2/40 px-4 py-3 text-sm text-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-2 text-xs text-muted">
        <Hammer className="size-3.5 shrink-0" aria-hidden />
        아직 준비 중인 화면입니다. 위 항목이 차례로 채워집니다.
      </p>
    </div>
  );
}
