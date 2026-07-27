import type { FlowEdge, FlowNode, FlowNodeType } from "@/lib/types/project";

function sanitizeMermaidLabel(label: string): string {
  return label.replace(/"/g, "'").replace(/[\[\](){}]/g, " ").replace(/\n/g, " ").trim();
}

function mermaidNodeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

/** 노드 타입별 Mermaid shape */
function mermaidNodeLine(node: FlowNode): string {
  const id = mermaidNodeId(node.id);
  const label = sanitizeMermaidLabel(node.label || node.id);
  const shapes: Record<FlowNodeType, string> = {
    start: `${id}([${label}])`,
    end: `${id}([${label}])`,
    page: `${id}[${label}]`,
    database: `${id}[(${label})]`,
    decision: `${id}{${label}}`,
  };
  return `  ${shapes[node.type]}`;
}

function labelOf(nodes: FlowNode[], id: string): string {
  return nodes.find((n) => n.id === id)?.label ?? id;
}

/** 노드에 나가는 연결이 2개 이상이면 분기 그래프 */
function hasBranching(edges: FlowEdge[]): boolean {
  const outCount = new Map<string, number>();
  for (const e of edges) {
    outCount.set(e.source, (outCount.get(e.source) ?? 0) + 1);
  }
  return [...outCount.values()].some((c) => c > 1);
}

/** 단일 경로(분기 없음) — A → B → C */
function buildLinearTextFlow(nodes: FlowNode[], edges: FlowEdge[]): string {
  const start =
    nodes.find((n) => n.type === "start") ??
    nodes.find((n) => !edges.some((e) => e.target === n.id));

  if (!start) {
    return nodes.map((n) => n.label).join(" → ");
  }

  const path: string[] = [];
  const visited = new Set<string>();
  let current: string | undefined = start.id;

  while (current && !visited.has(current)) {
    visited.add(current);
    const node = nodes.find((n) => n.id === current);
    if (node) path.push(node.label);
    const nextEdge = edges.find((e) => e.source === current);
    current = nextEdge?.target;
  }

  return path.join(" → ");
}

/** 모든 연결을 라벨로 나열 (분기 포함) */
function buildConnectionLines(nodes: FlowNode[], edges: FlowEdge[]): string[] {
  return edges.map(
    (e) => `- ${labelOf(nodes, e.source)} → ${labelOf(nodes, e.target)}`,
  );
}

/** Prompt.md용 텍스트 흐름 — 분기 시 연결 목록, 단일 경로면 한 줄 */
export function buildTextFlow(nodes: FlowNode[], edges: FlowEdge[]): string {
  if (nodes.length === 0) return "_(미입력)_";
  if (edges.length === 0) {
    return nodes.map((n) => n.label).join(" · ");
  }

  if (hasBranching(edges)) {
    return buildConnectionLines(nodes, edges).join("\n");
  }

  return buildLinearTextFlow(nodes, edges);
}

/** Mermaid flowchart TD 블록 */
export function buildMermaidFlowchart(
  nodes: FlowNode[],
  edges: FlowEdge[],
): string {
  if (nodes.length === 0) {
    return "_(플로우차트 없음)_";
  }

  const lines = ["```mermaid", "flowchart TD"];

  for (const node of nodes) {
    lines.push(mermaidNodeLine(node));
  }

  for (const edge of edges) {
    const src = mermaidNodeId(edge.source);
    const tgt = mermaidNodeId(edge.target);
    lines.push(`  ${src} --> ${tgt}`);
  }

  lines.push("```");
  return lines.join("\n");
}

export function renderFlowchartMarkdown(
  nodes: FlowNode[],
  edges: FlowEdge[],
): string {
  if (nodes.length === 0) {
    return "_(아직 그린 업무 흐름이 없습니다)_";
  }

  const intro =
    "아래는 서비스의 **화면 개수·이동 경로·DB 연결**을 나타냅니다. 와이어프레임의 대표 1장과 함께 Agent가 전체 화면을 구현합니다.";

  const textFlow = buildTextFlow(nodes, edges);
  const branching = hasBranching(edges);

  return [
    intro,
    "",
    branching
      ? "**텍스트 흐름** (분기 — 모든 연결):"
      : "**텍스트 흐름**:",
    textFlow,
    "",
    "**Mermaid** (아래 코드에 모든 화살표가 포함됩니다):",
    "",
    buildMermaidFlowchart(nodes, edges),
  ].join("\n");
}
