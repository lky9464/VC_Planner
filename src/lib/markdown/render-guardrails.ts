import type { ChoiceValue } from "@/lib/types/project";
import { getGuardrailEntry } from "./guardrail-content";

/** Prompt.md 5장 — 선택된 가드레일 본문 */
export function renderGuardrailsSection(guardrails: ChoiceValue): string {
  const lines = [
    "## 5. 작업 규칙 (Guardrails)",
    "",
    "반드시 지켜야 할 규칙 목록. 위반이 필요하면 먼저 물어보세요.",
    "",
  ];

  const selected = guardrails.selectedIds
    .map((id) => getGuardrailEntry(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  if (selected.length === 0 && !(guardrails.customEnabled && guardrails.customText.trim())) {
    lines.push("_(아직 선택된 규칙 없음)_");
    return lines.join("\n");
  }

  for (const entry of selected) {
    lines.push(`### ${entry.title}`);
    lines.push("");
    lines.push(entry.body);
    lines.push("");
  }

  if (guardrails.customEnabled && guardrails.customText.trim()) {
    lines.push("### (직접 추가 규칙)");
    lines.push("");
    lines.push(guardrails.customText.trim());
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

/** Agent 규칙 탭 — AGENTS.md 형식 */
export function renderAgentRulesBody(
  roleLabel: string,
  guardrails: ChoiceValue,
): string {
  const lines = [
    "# Agent 작업 규칙",
    "",
    "Step 3에서 고른 규칙입니다. 파일 이름만 도구에 맞추면 됩니다.",
    "",
    "- Cursor       → .cursorrules",
    "- Claude Code  → CLAUDE.md",
    "- Windsurf     → .windsurfrules",
    "- 그 외         → AGENTS.md",
    "",
    "## 역할",
    "",
    roleLabel,
    "",
    "## 가드레일",
    "",
  ];

  const selected = guardrails.selectedIds
    .map((id) => getGuardrailEntry(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  if (selected.length === 0 && !(guardrails.customEnabled && guardrails.customText.trim())) {
    lines.push("_(아직 선택된 규칙 없음)_");
    return lines.join("\n");
  }

  for (const entry of selected) {
    lines.push(`### ${entry.title}`);
    lines.push("");
    lines.push(entry.body);
    lines.push("");
  }

  if (guardrails.customEnabled && guardrails.customText.trim()) {
    lines.push("### (직접 추가)");
    lines.push("");
    lines.push(guardrails.customText.trim());
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
