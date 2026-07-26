import type { ChoiceValue } from "@/lib/types/project";

/**
 * 옵션 선택 시 위임을 자동 해제한다 (Plan 5-1 규칙 3).
 * 다중 선택이면 토글, 단일 선택이면 교체.
 */
export function selectOption(
  current: ChoiceValue,
  optionId: string,
  multiple: boolean,
): ChoiceValue {
  const base = { ...current, delegated: false };

  if (multiple) {
    const exists = base.selectedIds.includes(optionId);
    return {
      ...base,
      selectedIds: exists
        ? base.selectedIds.filter((id) => id !== optionId)
        : [...base.selectedIds, optionId],
    };
  }

  return { ...base, selectedIds: [optionId] };
}

/** [✏️ 직접 입력] 토글. 켤 때는 위임을 해제한다 */
export function toggleCustomInput(current: ChoiceValue): ChoiceValue {
  const nextEnabled = !current.customEnabled;
  return {
    ...current,
    customEnabled: nextEnabled,
    delegated: nextEnabled ? false : current.delegated,
  };
}

/** 직접 입력 텍스트 변경 */
export function updateCustomText(
  current: ChoiceValue,
  text: string,
): ChoiceValue {
  return {
    ...current,
    customText: text,
    delegated: false,
  };
}

/**
 * [🤖 AI 추천 받기] 위임 토글 (Step 2 기술 선택 전용).
 * 켜면 선택·직접입력을 비우고 "미선택" 상태로 Agent에게 위임한다.
 */
export function toggleDelegation(current: ChoiceValue): ChoiceValue {
  const nextDelegated = !current.delegated;

  if (nextDelegated) {
    return {
      ...current,
      delegated: true,
      selectedIds: [],
      customEnabled: false,
    };
  }

  return { ...current, delegated: false };
}

/** 위임 시 사용자 선호 힌트 */
export function updateDelegateHint(
  current: ChoiceValue,
  hint: string,
): ChoiceValue {
  return { ...current, delegateHint: hint };
}

/** 선택된 옵션 id → 라벨 목록 (마크다운 생성기에서 재사용) */
export function selectedLabels(
  value: ChoiceValue,
  options: { id: string; label: string }[],
): string[] {
  return value.selectedIds
    .map((id) => options.find((o) => o.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}
