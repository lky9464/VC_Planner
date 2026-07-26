/** 위저드 Step 정의 (Plan 4장 / 6장) */
export type StepId = 1 | 2 | 3 | 4;

export type StepMeta = {
  id: StepId;
  /** 진행바에 쓰는 짧은 이름 */
  shortLabel: string;
  /** 카드 제목 */
  title: string;
  /** 비개발자용 한 줄 안내 */
  description: string;
};

export const STEPS: readonly StepMeta[] = [
  {
    id: 1,
    shortLabel: "서비스 설계",
    title: "어떤 서비스를 만들까요?",
    description:
      "서비스 이름부터 업무 흐름, 화면 배치, 예외 상황까지 차근차근 정합니다.",
  },
  {
    id: 2,
    shortLabel: "기술 선택",
    title: "무엇으로, 어디에 저장할까요?",
    description:
      "어려운 용어는 몰라도 됩니다. 추천값이 이미 골라져 있어요.",
  },
  {
    id: 3,
    shortLabel: "AI 규칙",
    title: "AI가 지켜야 할 규칙을 정합니다",
    description:
      "AI가 마음대로 코드를 갈아엎거나 유료 서비스를 쓰지 않도록 미리 막아 둡니다.",
  },
  {
    id: 4,
    shortLabel: "결과 받기",
    title: "명세서를 받아 가세요",
    description:
      "복사해서 Cursor, Claude Code, Windsurf 등 원하는 도구에 그대로 붙여넣으면 됩니다.",
  },
] as const;

export const FIRST_STEP: StepId = 1;
export const LAST_STEP: StepId = 4;
