import type { WireframeItem } from "@/lib/types/project";

/**
 * Plan 6-1 1-3 — 공통 화면 틀 프리셋
 * 12열 그리드: 네비(h:1) + 본문(h:5) = 총 6행
 * - 사이드바 w:3 (25%) · 검색 h:1 · 컨텐츠 h:4 (본문 80%)
 */
export function createDashboardWireframePreset(): WireframeItem[] {
  return [
    {
      i: "wf-navbar",
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      type: "navbar",
      label: "서비스 로고 / 메뉴",
    },
    {
      i: "wf-sidebar",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      type: "sidebar",
      label: "메뉴",
    },
    {
      i: "wf-search",
      x: 3,
      y: 1,
      w: 9,
      h: 1,
      type: "search",
      label: "조건 입력",
    },
    {
      i: "wf-content",
      x: 3,
      y: 2,
      w: 9,
      h: 4,
      type: "content",
      label: "화면별 컨텐츠",
    },
  ];
}
