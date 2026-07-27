import type { ChoiceValue, Option, ProjectState } from "@/lib/types/project";
import {
  APP_TYPE_OPTIONS,
  DOMAIN_OPTIONS,
  GUARDRAIL_OPTIONS,
  INPUT_OPTIONS,
  OUTPUT_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SENSITIVE_DATA_OPTIONS,
  STORAGE_OPTIONS,
} from "@/lib/options/presets";
import { SCHEMA_VERSION } from "./constants";

/** 빈 선택값 — 모든 ChoiceGroup의 시작점 */
export function createEmptyChoiceValue(): ChoiceValue {
  return {
    selectedIds: [],
    customEnabled: false,
    customText: "",
    delegated: false,
    delegateHint: "",
  };
}

/** 추천 배지가 있는 옵션을 기본 선택 상태로 만든다 */
export function createChoiceWithRecommended(options: Option[]): ChoiceValue {
  return {
    selectedIds: options.filter((o) => o.recommended).map((o) => o.id),
    customEnabled: false,
    customText: "",
    delegated: false,
    delegateHint: "",
  };
}

/**
 * 선택지 프리셋에 따른 초기값.
 * - 추천(✨) 배지가 **없으면** → 아무것도 선택되지 않은 상태
 * - 추천 배지가 **있으면** → 해당 항목만 기본 체크
 */
export function createInitialChoiceValue(options: Option[]): ChoiceValue {
  const hasRecommended = options.some((o) => o.recommended);
  return hasRecommended
    ? createChoiceWithRecommended(options)
    : createEmptyChoiceValue();
}

/** Step 2 추천값 프리셋 (Plan 6-2) */
export function createStep2RecommendedValues(): Pick<
  ProjectState["tech"],
  "appType" | "storage"
> {
  return {
    appType: createChoiceWithRecommended(APP_TYPE_OPTIONS),
    storage: createChoiceWithRecommended(STORAGE_OPTIONS),
  };
}

/**
 * 가드레일 hydrate 시 추천(✨) 항목 기본 체크 보장.
 * - 저장값이 비어 있으면 추천 항목 전체 선택
 * - 저장값에 없는 추천 id만 보충 (g6~g8 추가 등) — 사용자가 해제한 항목은 유지
 */
export function ensureRecommendedGuardrails(stored: ChoiceValue): ChoiceValue {
  const recommendedIds = GUARDRAIL_OPTIONS.filter((o) => o.recommended).map(
    (o) => o.id,
  );

  if (
    stored.selectedIds.length === 0 &&
    !stored.customEnabled &&
    !stored.delegated
  ) {
    return createChoiceWithRecommended(GUARDRAIL_OPTIONS);
  }

  const missing = recommendedIds.filter((id) => !stored.selectedIds.includes(id));
  if (missing.length === 0) return stored;

  return {
    ...stored,
    selectedIds: [...stored.selectedIds, ...missing],
  };
}

export function createInitialState(): ProjectState {
  const now = new Date().toISOString();

  return {
    meta: { version: SCHEMA_VERSION, updatedAt: now },
    basic: {
      serviceName: "",
      oneLiner: "",
      // DOMAIN_OPTIONS에는 추천 배지 없음 → 최초 미선택
      domain: createInitialChoiceValue(DOMAIN_OPTIONS),
      sensitiveData: createInitialChoiceValue(SENSITIVE_DATA_OPTIONS),
    },
    flowchart: { nodes: [], edges: [], deliveryNotes: "" },
    wireframe: { items: [], cols: 12, rowHeight: 30, deliveryNotes: "" },
    dataIO: {
      input: createInitialChoiceValue(INPUT_OPTIONS),
      output: createInitialChoiceValue(OUTPUT_TYPE_OPTIONS),
    },
    edgeCases: {
      emptyState: createEmptyChoiceValue(),
      errorState: createEmptyChoiceValue(),
    },
    tech: createStep2RecommendedValues(),
    agentRules: {
      role: createInitialChoiceValue(ROLE_OPTIONS),
      guardrails: createInitialChoiceValue(GUARDRAIL_OPTIONS),
    },
    output: {
      includeToolAppendix: false,
      targetAgents: [],
    },
  };
}
