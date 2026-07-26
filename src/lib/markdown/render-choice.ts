import type { ChoiceValue, Option } from "@/lib/types/project";
import { selectedLabels } from "@/lib/project/choice-mutations";

/** ChoiceValue를 Prompt.md 본문 한 줄 또는 블록으로 변환 */
export function renderChoiceMarkdown(
  label: string,
  value: ChoiceValue,
  options: Option[],
): string {
  if (value.delegated) {
    return `- **${label}**: 🤖 판단 위임 (6장 참조)`;
  }

  const parts: string[] = [];
  const labels = selectedLabels(value, options);
  if (labels.length > 0) {
    parts.push(...labels.map((l) => `- ${l}`));
  }
  if (value.customEnabled && value.customText.trim()) {
    parts.push(`- (직접 입력) ${value.customText.trim()}`);
  }

  if (parts.length === 0) {
    return `- **${label}**: _(미입력)_`;
  }

  if (parts.length === 1 && !value.customEnabled) {
    return `- **${label}**: ${parts[0].replace(/^- /, "")}`;
  }

  return [`- **${label}**:`, ...parts.map((p) => `  ${p}`)].join("\n");
}

/** 복수 선택을 불릿 목록으로 */
export function renderChoiceListMarkdown(
  label: string,
  value: ChoiceValue,
  options: Option[],
): string {
  if (value.delegated) {
    return `- **${label}**: 🤖 판단 위임 (6장 참조)`;
  }

  const lines: string[] = [`- **${label}**:`];
  const labels = selectedLabels(value, options);
  for (const l of labels) {
    lines.push(`  - ${l}`);
  }
  if (value.customEnabled && value.customText.trim()) {
    lines.push(`  - (직접 입력) ${value.customText.trim()}`);
  }
  if (labels.length === 0 && !(value.customEnabled && value.customText.trim())) {
    lines.push("  - _(미입력)_");
  }
  return lines.join("\n");
}
