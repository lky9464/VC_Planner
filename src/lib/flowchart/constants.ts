import type { FlowNodeType } from "@/lib/types/project";

/** Plan 6-1 — 플로우차트 노드 5종 */
export const FLOW_NODE_PALETTE: {
  type: FlowNodeType;
  label: string;
  hint: string;
}[] = [
  { type: "start", label: "시작점", hint: "흐름의 시작" },
  { type: "page", label: "기능 · 페이지", hint: "화면 또는 처리 단계" },
  { type: "database", label: "데이터 저장 · DB", hint: "저장소와의 상호작용" },
  { type: "decision", label: "조건 분기", hint: "예/아니오 등 분기" },
  { type: "end", label: "종료점", hint: "흐름의 끝" },
];

export const FLOW_NODE_DEFAULT_LABELS: Record<FlowNodeType, string> = {
  start: "시작",
  page: "기능/페이지",
  database: "DB 저장",
  decision: "조건 분기",
  end: "종료",
};

export const FLOW_DND_MIME = "application/vc-planner-flow-node";

export function createFlowNodeId(): string {
  return `node-${crypto.randomUUID()}`;
}

export function createFlowEdgeId(source: string, target: string): string {
  return `edge-${source}-${target}`;
}
