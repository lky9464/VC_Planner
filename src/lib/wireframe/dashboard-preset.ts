import type { WireframeItem } from "@/lib/types/project";

/** Plan 6-1 예시 레이아웃 — 대시보드형 CRUD 화면 */
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
      h: 4,
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
      i: "wf-kpi",
      x: 3,
      y: 2,
      w: 9,
      h: 1,
      type: "kpi",
      label: "요약 3종",
    },
    {
      i: "wf-table",
      x: 3,
      y: 3,
      w: 9,
      h: 2,
      type: "table",
      label: "결과 목록",
    },
  ];
}
