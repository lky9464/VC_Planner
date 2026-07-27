import type {
  ChoiceFieldPath,
  FlowEdge,
  FlowNode,
  ProjectState,
  WireframeItem,
} from "@/lib/types/project";
import { createInitialState, createStep2RecommendedValues, ensureRecommendedGuardrails } from "./defaults";
import { createCrudFlowPreset } from "@/lib/flowchart/crud-preset";
import { createDashboardWireframePreset } from "@/lib/wireframe/dashboard-preset";
import { normalizeWireframeItems } from "@/lib/wireframe/constants";
import { setChoiceValue } from "./choice-path";
import { SCHEMA_VERSION } from "./constants";
import type { ChoiceValue } from "@/lib/types/project";

export type ProjectAction =
  | { type: "HYDRATE"; payload: ProjectState }
  | { type: "RESET" }
  | { type: "SET_CHOICE"; path: ChoiceFieldPath; value: ChoiceValue }
  | { type: "SET_BASIC_TEXT"; field: "serviceName" | "oneLiner"; value: string }
  | {
      type: "SET_OUTPUT";
      field: "includeToolAppendix" | "targetAgents";
      value: boolean | string[];
    }
  | { type: "APPLY_STEP2_DEFAULTS" }
  | { type: "SET_FLOWCHART"; nodes: FlowNode[]; edges: FlowEdge[] }
  | { type: "APPLY_CRUD_FLOW_PRESET" }
  | { type: "SET_WIREFRAME"; items: WireframeItem[] }
  | { type: "APPLY_DASHBOARD_WIREFRAME_PRESET" };

const G10_ID = "g10";

export function isSensitiveDataIncluded(state: ProjectState): boolean {
  return state.basic.sensitiveData.selectedIds.includes("included");
}

/** 민감 데이터 선택 시 G10(보안) 가드레일 자동 체크 */
function syncG10FromSensitiveData(state: ProjectState): ProjectState {
  if (!isSensitiveDataIncluded(state)) return state;

  const guardrails = state.agentRules.guardrails;
  if (guardrails.selectedIds.includes(G10_ID)) return state;

  return setChoiceValue(state, "agentRules.guardrails", {
    ...guardrails,
    selectedIds: [...guardrails.selectedIds, G10_ID],
  });
}

/** 민감 데이터 포함 시 G10 해제 방지 */
function enforceG10Lock(
  state: ProjectState,
  guardrails: ChoiceValue,
): ChoiceValue {
  if (!isSensitiveDataIncluded(state)) return guardrails;
  if (guardrails.selectedIds.includes(G10_ID)) return guardrails;
  return {
    ...guardrails,
    selectedIds: [...guardrails.selectedIds, G10_ID],
  };
}

/** 저장된 JSON을 현재 스키마에 맞게 보정한다 */
function normalizeHydratedState(raw: unknown): ProjectState {
  const initial = createInitialState();

  if (!raw || typeof raw !== "object") {
    return initial;
  }

  const data = raw as Partial<ProjectState>;

  let merged: ProjectState = {
    ...initial,
    ...data,
    meta: {
      version: data.meta?.version ?? SCHEMA_VERSION,
      updatedAt: data.meta?.updatedAt ?? new Date().toISOString(),
    },
    basic: { ...initial.basic, ...data.basic },
    flowchart: { ...initial.flowchart, ...data.flowchart },
    wireframe: {
      ...initial.wireframe,
      ...data.wireframe,
      items: normalizeWireframeItems(data.wireframe?.items),
    },
    dataIO: { ...initial.dataIO, ...data.dataIO },
    edgeCases: { ...initial.edgeCases, ...data.edgeCases },
    tech: { ...initial.tech, ...data.tech },
    agentRules: {
      ...initial.agentRules,
      ...data.agentRules,
      role: data.agentRules?.role ?? initial.agentRules.role,
      guardrails: ensureRecommendedGuardrails(
        data.agentRules?.guardrails ?? initial.agentRules.guardrails,
      ),
    },
    output: { ...initial.output, ...data.output },
  };

  merged = syncG10FromSensitiveData(merged);
  return merged;
}

export function projectReducer(
  state: ProjectState,
  action: ProjectAction,
): ProjectState {
  switch (action.type) {
    case "HYDRATE":
      return normalizeHydratedState(action.payload);

    case "RESET":
      return createInitialState();

    case "SET_CHOICE": {
      let next = setChoiceValue(state, action.path, action.value);

      if (action.path === "basic.sensitiveData") {
        next = syncG10FromSensitiveData(next);
      }

      if (action.path === "agentRules.guardrails") {
        const locked = enforceG10Lock(next, action.value);
        if (locked !== action.value) {
          next = setChoiceValue(next, "agentRules.guardrails", locked);
        }
      }

      return next;
    }

    case "SET_BASIC_TEXT":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        basic: { ...state.basic, [action.field]: action.value },
      };

    case "SET_OUTPUT":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        output: { ...state.output, [action.field]: action.value },
      };

    case "APPLY_STEP2_DEFAULTS": {
      const recommended = createStep2RecommendedValues();
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        tech: { ...state.tech, ...recommended },
      };
    }

    case "SET_FLOWCHART":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        flowchart: { nodes: action.nodes, edges: action.edges },
      };

    case "APPLY_CRUD_FLOW_PRESET":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        flowchart: createCrudFlowPreset(),
      };

    case "SET_WIREFRAME":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        wireframe: { ...state.wireframe, items: action.items },
      };

    case "APPLY_DASHBOARD_WIREFRAME_PRESET":
      return {
        ...state,
        meta: { ...state.meta, updatedAt: new Date().toISOString() },
        wireframe: {
          ...state.wireframe,
          items: createDashboardWireframePreset(),
        },
      };

    default:
      return state;
  }
}

export { normalizeHydratedState };
