import type { ChoiceValue, ProjectState } from "@/lib/types/project";
import type { StepId } from "@/lib/steps";

/** Step별 현재 구현된 Choice 입력 항목 */
export type StepFieldSpec = {
  step: StepId;
  label: string;
  allowDelegate: boolean;
  getValue: (state: ProjectState) => ChoiceValue;
};

/** Step별 텍스트 입력 항목 */
export type TextFieldSpec = {
  step: StepId;
  label: string;
  getValue: (state: ProjectState) => string;
};

export const STEP_FIELD_SPECS: StepFieldSpec[] = [
  {
    step: 1,
    label: "서비스 분야",
    allowDelegate: false,
    getValue: (s) => s.basic.domain,
  },
  {
    step: 1,
    label: "민감 데이터 처리 여부",
    allowDelegate: false,
    getValue: (s) => s.basic.sensitiveData,
  },
  {
    step: 1,
    label: "입력 데이터",
    allowDelegate: false,
    getValue: (s) => s.dataIO.input,
  },
  {
    step: 1,
    label: "출력 형태",
    allowDelegate: false,
    getValue: (s) => s.dataIO.output,
  },
  {
    step: 1,
    label: "빈 화면 처리",
    allowDelegate: false,
    getValue: (s) => s.edgeCases.emptyState,
  },
  {
    step: 1,
    label: "에러 처리",
    allowDelegate: false,
    getValue: (s) => s.edgeCases.errorState,
  },
  {
    step: 2,
    label: "앱 형태",
    allowDelegate: true,
    getValue: (s) => s.tech.appType,
  },
  {
    step: 2,
    label: "데이터 저장 방식",
    allowDelegate: true,
    getValue: (s) => s.tech.storage,
  },
  {
    step: 3,
    label: "AI 역할",
    allowDelegate: false,
    getValue: (s) => s.agentRules.role,
  },
  {
    step: 3,
    label: "가드레일",
    allowDelegate: false,
    getValue: (s) => s.agentRules.guardrails,
  },
];

export const TEXT_FIELD_SPECS: TextFieldSpec[] = [
  {
    step: 1,
    label: "서비스 이름",
    getValue: (s) => s.basic.serviceName,
  },
  {
    step: 1,
    label: "한 줄 설명",
    getValue: (s) => s.basic.oneLiner,
  },
];

export type IncompleteField = {
  step: StepId;
  label: string;
};

export function isChoiceComplete(
  value: ChoiceValue,
  allowDelegate: boolean,
): boolean {
  if (allowDelegate && value.delegated) return true;
  if (value.selectedIds.length > 0) return true;
  if (value.customEnabled && value.customText.trim().length > 0) return true;
  return false;
}

export function getIncompleteFields(state: ProjectState): IncompleteField[] {
  const choiceIncomplete = STEP_FIELD_SPECS.filter(
    (spec) => !isChoiceComplete(spec.getValue(state), spec.allowDelegate),
  ).map((spec) => ({ step: spec.step, label: spec.label }));

  const textIncomplete = TEXT_FIELD_SPECS.filter(
    (spec) => !spec.getValue(state).trim(),
  ).map((spec) => ({ step: spec.step, label: spec.label }));

  return [...choiceIncomplete, ...textIncomplete];
}

export function getStepCompletionMap(
  state: ProjectState,
): Record<StepId, boolean> {
  const map: Record<StepId, boolean> = { 1: true, 2: true, 3: true, 4: true };

  for (const spec of STEP_FIELD_SPECS) {
    if (!isChoiceComplete(spec.getValue(state), spec.allowDelegate)) {
      map[spec.step] = false;
    }
  }

  for (const spec of TEXT_FIELD_SPECS) {
    if (!spec.getValue(state).trim()) {
      map[spec.step] = false;
    }
  }

  // Step 4는 입력 항목 없음 — Step 1~3 완료면 결과 받기 가능
  map[4] = map[1] && map[2] && map[3];

  return map;
}

export function canProceedToResults(state: ProjectState): boolean {
  return getIncompleteFields(state).length === 0;
}
