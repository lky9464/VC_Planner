import type { WireframeItem } from "@/lib/types/project";

/** Plan 6-1 — 와이어프레임 팔레트 8종 */
export const WIREFRAME_PALETTE: {
  type: WireframeItem["type"];
  label: string;
  hint: string;
}[] = [
  { type: "navbar", label: "네비게이션바", hint: "상단 메뉴·로고 영역" },
  { type: "sidebar", label: "사이드바", hint: "좌측 메뉴 패널" },
  { type: "search", label: "검색창", hint: "조건·키워드 입력" },
  { type: "table", label: "데이터 테이블", hint: "목록·결과 표" },
  { type: "kpi", label: "요약 카드 (KPI)", hint: "숫자·지표 요약" },
  { type: "buttons", label: "버튼 그룹", hint: "등록·삭제 등 액션" },
  { type: "chart", label: "차트 영역", hint: "그래프·시각화" },
  { type: "custom", label: "직접 입력", hint: "자유 영역" },
];

/** ASCII·미리보기용 유형 표시명 */
export const WIREFRAME_TYPE_LABELS: Record<WireframeItem["type"], string> = {
  navbar: "네비게이션바",
  sidebar: "사이드바",
  search: "검색창",
  table: "데이터 테이블",
  kpi: "KPI 카드",
  buttons: "버튼 그룹",
  chart: "차트 영역",
  custom: "직접 입력",
};

/** 새 블록 기본 크기 (그리드 단위) */
export const WIREFRAME_DEFAULT_SIZES: Record<
  WireframeItem["type"],
  { w: number; h: number }
> = {
  navbar: { w: 12, h: 1 },
  sidebar: { w: 3, h: 3 },
  search: { w: 6, h: 1 },
  table: { w: 8, h: 3 },
  kpi: { w: 4, h: 1 },
  buttons: { w: 4, h: 1 },
  chart: { w: 6, h: 3 },
  custom: { w: 4, h: 2 },
};

export const WIREFRAME_DEFAULT_LABELS: Record<WireframeItem["type"], string> = {
  navbar: "서비스 로고 / 메뉴",
  sidebar: "메뉴",
  search: "조건 입력",
  table: "결과 목록",
  kpi: "요약 3종",
  buttons: "등록 · 수정 · 삭제",
  chart: "추이 그래프",
  custom: "사용자 정의 영역",
};

export const WIREFRAME_COLS = 12;
export const WIREFRAME_ROW_HEIGHT = 30;

export function createWireframeItemId(): string {
  return `wf-${crypto.randomUUID()}`;
}

/** 팔레트에서 추가할 때 겹치지 않는 y 위치 */
export function nextAvailableY(items: WireframeItem[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.y + i.h));
}

export function createWireframeItem(
  type: WireframeItem["type"],
  items: WireframeItem[],
): WireframeItem {
  const size = WIREFRAME_DEFAULT_SIZES[type];
  return {
    i: createWireframeItemId(),
    x: 0,
    y: nextAvailableY(items),
    w: size.w,
    h: size.h,
    type,
    label: WIREFRAME_DEFAULT_LABELS[type],
  };
}
