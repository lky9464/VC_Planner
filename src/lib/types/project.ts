/** 선택지 하나 (Plan 5-1) */
export type Option = {
  id: string;
  label: string;
  hint?: string;
  recommended?: boolean;
};

/** 사용자의 선택 결과 — 단일/다중 공용 (Plan 5-1) */
export type ChoiceValue = {
  selectedIds: string[];
  customEnabled: boolean;
  customText: string;
  delegated: boolean;
  delegateHint: string;
};

export type FlowNodeType = "start" | "page" | "database" | "decision" | "end";

export type FlowNode = {
  id: string;
  type: FlowNodeType;
  label: string;
  position: { x: number; y: number };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
};

export type WireframeItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "navbar" | "sidebar" | "search" | "content" | "custom";
  label: string;
};

export type ProjectState = {
  meta: { version: string; updatedAt: string };

  basic: {
    serviceName: string;
    oneLiner: string;
    domain: ChoiceValue;
    sensitiveData: ChoiceValue;
  };
  flowchart: { nodes: FlowNode[]; edges: FlowEdge[]; deliveryNotes: string };
  wireframe: {
    items: WireframeItem[];
    cols: number;
    rowHeight: number;
    deliveryNotes: string;
  };
  dataIO: { input: ChoiceValue; output: ChoiceValue };
  edgeCases: { emptyState: ChoiceValue; errorState: ChoiceValue };

  tech: { appType: ChoiceValue; storage: ChoiceValue };

  agentRules: { role: ChoiceValue; guardrails: ChoiceValue };

  output: {
    includeToolAppendix: boolean;
    targetAgents: string[];
  };
};

/** ChoiceValue를 갖는 필드 경로 */
export type ChoiceFieldPath =
  | "basic.domain"
  | "basic.sensitiveData"
  | "dataIO.input"
  | "dataIO.output"
  | "edgeCases.emptyState"
  | "edgeCases.errorState"
  | "tech.appType"
  | "tech.storage"
  | "agentRules.role"
  | "agentRules.guardrails";
