import type { WireframeItem } from "@/lib/types/project";

/** Plan 6-1 — 와이어프레임 팔레트 5종 */
export const WIREFRAME_PALETTE: {
  type: WireframeItem["type"];
  label: string;
  hint: string;
}[] = [
  { type: "navbar", label: "네비게이션바", hint: "상단 메뉴·로고 영역" },
  { type: "sidebar", label: "사이드바", hint: "좌측 메뉴 패널" },
  { type: "search", label: "검색창", hint: "조건·키워드 입력" },
  {
    type: "content",
    label: "화면별 컨텐츠",
    hint: "목록·폼·차트 등 화면마다 바뀌는 본문 영역",
  },
  { type: "custom", label: "직접 입력", hint: "자유 영역" },
];

/** ASCII·미리보기용 유형 표시명 */
export const WIREFRAME_TYPE_LABELS: Record<WireframeItem["type"], string> = {
  navbar: "네비게이션바",
  sidebar: "사이드바",
  search: "검색창",
  content: "화면별 컨텐츠",
  custom: "직접 입력",
};

/** 새 블록 기본 크기 (그리드 단위) */
export const WIREFRAME_DEFAULT_SIZES: Record<
  WireframeItem["type"],
  { w: number; h: number }
> = {
  navbar: { w: 12, h: 1 },
  sidebar: { w: 3, h: 5 },
  search: { w: 9, h: 1 },
  content: { w: 9, h: 4 },
  custom: { w: 4, h: 2 },
};

export const WIREFRAME_DEFAULT_LABELS: Record<WireframeItem["type"], string> = {
  navbar: "서비스 로고 / 메뉴",
  sidebar: "메뉴",
  search: "조건 입력",
  content: "화면별 컨텐츠",
  custom: "사용자 정의 영역",
};

export const WIREFRAME_COLS = 12;
export const WIREFRAME_ROW_HEIGHT = 30;

/** 구 팔레트 타입 → 화면별 컨텐츠 (LocalStorage 복원용) */
const LEGACY_CONTENT_TYPES = new Set([
  "table",
  "kpi",
  "buttons",
  "chart",
]);

const VALID_WIREFRAME_TYPES = new Set<string>([
  "navbar",
  "sidebar",
  "search",
  "content",
  "custom",
]);

/** 저장된 항목 타입을 현재 스키마에 맞게 보정 */
export function normalizeWireframeItem(
  raw: Partial<WireframeItem> & { type?: string },
): WireframeItem | null {
  if (
    !raw.i ||
    typeof raw.x !== "number" ||
    typeof raw.y !== "number" ||
    typeof raw.w !== "number" ||
    typeof raw.h !== "number" ||
    typeof raw.label !== "string"
  ) {
    return null;
  }

  let type: WireframeItem["type"] = "custom";
  if (raw.type && LEGACY_CONTENT_TYPES.has(raw.type)) {
    type = "content";
  } else if (raw.type && VALID_WIREFRAME_TYPES.has(raw.type)) {
    type = raw.type as WireframeItem["type"];
  }

  return {
    i: raw.i,
    x: raw.x,
    y: raw.y,
    w: raw.w,
    h: raw.h,
    type,
    label: raw.label,
  };
}

export function normalizeWireframeItems(items: unknown): WireframeItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => normalizeWireframeItem(item as Partial<WireframeItem>))
    .filter((item): item is WireframeItem => item !== null);
}

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
