import type { ChoiceValue, ProjectState } from "@/lib/types/project";
import { selectedLabels } from "@/lib/project/choice-mutations";
import {
  DOMAIN_OPTIONS,
  SENSITIVE_DATA_OPTIONS,
} from "@/lib/options/presets";

export type DelegatedItem = {
  sectionKey: string;
  label: string;
  value: ChoiceValue;
};

/** Step 2 등 위임(delegated) 항목 수집 */
export function collectDelegatedItems(state: ProjectState): DelegatedItem[] {
  const items: DelegatedItem[] = [];

  if (state.tech.appType.delegated) {
    items.push({
      sectionKey: "6-1",
      label: "앱 형태",
      value: state.tech.appType,
    });
  }
  if (state.tech.storage.delegated) {
    items.push({
      sectionKey: "6-2",
      label: "데이터 저장 방식",
      value: state.tech.storage,
    });
  }

  return items;
}

function domainContextLabel(state: ProjectState): string {
  const domain = selectedLabels(state.basic.domain, DOMAIN_OPTIONS);
  const sensitive = selectedLabels(state.basic.sensitiveData, SENSITIVE_DATA_OPTIONS);
  const parts: string[] = [];
  if (domain.length > 0) parts.push(`서비스 분야=${domain.join(", ")}`);
  if (sensitive.length > 0) parts.push(`민감 데이터=${sensitive.join(", ")}`);
  return parts.length > 0 ? parts.join(", ") : "_(맥락 정보 없음)_";
}

/** Plan 11-3 — 섹션 6 판단 위임 블록 */
export function renderDelegationSection(state: ProjectState): string | null {
  const items = collectDelegatedItems(state);
  if (items.length === 0) return null;

  const lines = [
    "## 6. 판단 위임 항목 (Decisions Delegated to You)",
    "",
    "아래 항목은 사용자가 결정을 보류했습니다. 임의로 확정하지 말고,",
    "**선택지 2~3개와 각각의 장단점을 제시한 뒤 추천안을 하나 골라** 확인을 받고 진행하세요.",
    "",
  ];

  const context = domainContextLabel(state);

  for (const item of items) {
    lines.push(`### ${item.sectionKey}. ${item.label}`);
    lines.push("- 현재 상태: 미정");
    if (item.value.delegateHint.trim()) {
      lines.push(`- 사용자 선호: ${item.value.delegateHint.trim()}`);
    }
    lines.push(`- 판단에 참고할 맥락: ${context}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
