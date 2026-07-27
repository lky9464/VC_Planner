import type { FlowEdge, FlowNode, ProjectState } from "@/lib/types/project";
import { buildTextFlow } from "@/lib/flowchart/serialize";

/** 플로우차트에서 작업 순서 후보 추출 */
function buildPlanSteps(nodes: FlowNode[], edges: FlowEdge[]): string[] {
  if (nodes.length === 0) {
    return [
      "프로젝트 골격(페이지·라우팅) 구성",
      "Step 1 명세의 핵심 화면·기능 구현",
      "입출력·예외 처리 반영",
      "기술 스택·저장 방식 적용 및 마무리",
    ];
  }

  const start =
    nodes.find((n) => n.type === "start") ??
    nodes.find((n) => !edges.some((e) => e.target === n.id));

  if (!start) {
    return nodes
      .filter((n) => n.type !== "start" && n.type !== "end")
      .map((n) => `${n.label} 구현`);
  }

  const steps: string[] = [];
  const visited = new Set<string>();
  let current: string | undefined = start.id;

  while (current && !visited.has(current)) {
    visited.add(current);
    const node = nodes.find((n) => n.id === current);
    if (node && node.type !== "start" && node.type !== "end") {
      const suffix =
        node.type === "page"
          ? "화면·기능"
          : node.type === "database"
            ? "데이터 저장·연동"
            : node.type === "decision"
              ? "분기·조건 처리"
              : "단계";
      steps.push(`${node.label} — ${suffix}`);
    }
    const nextEdge = edges.find((e) => e.source === current);
    current = nextEdge?.target;
  }

  if (steps.length === 0) {
    const textFlow = buildTextFlow(nodes, edges);
    return [`업무 흐름(${textFlow}) 순서대로 단계별 구현`];
  }

  steps.push("예외 상황·빈 화면 처리 및 전체 점검");
  return steps;
}

/** Plan 11-2 — 섹션 7 작업 순서 */
export function renderSuggestedPlanSection(
  nodes: FlowNode[],
  edges: FlowEdge[],
): string {
  const steps = buildPlanSteps(nodes, edges);
  const lines = [
    "## 7. 작업 순서 (Suggested Plan)",
    "",
    "한 번에 전부 만들지 말고 단계별로 진행하세요.",
    "",
  ];

  steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`);
  });

  return lines.join("\n");
}

/** Plan 11-2 — 섹션 8 완료 기준 */
export function renderDefinitionOfDoneSection(state: ProjectState): string {
  const service = state.basic.serviceName.trim() || "서비스";

  return [
    "## 8. 완료 기준 (Definition of Done)",
    "",
    `아래 항목을 모두 충족하면 **${service}** 1차 버전이 완성된 것으로 봅니다.`,
    "",
    "- Step 1~3 명세(흐름·화면·입출력·기술·규칙)가 코드에 반영되었다",
    "- 업무 흐름도와 대표 화면 와이어프레임과 실제 UI가 크게 어긋나지 않는다",
    "- 데이터 없음·에러 등 예외 상황 처리가 명세와 같다",
    "- 민감 데이터·보안 관련 규칙(해당 시)을 위반하지 않는다",
    "- 사용자가 마우스·키보드만으로 핵심 시나리오를 끝까지 완주할 수 있다",
    "- 위임(6장) 항목이 있으면 사용자 확인 후 확정했다",
  ].join("\n");
}
