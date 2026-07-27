/** Plan 11-4 — Agent 도구별 규칙 파일명 매핑 */
export type AgentTargetId =
  | "cursor"
  | "claude"
  | "windsurf"
  | "lovable"
  | "bolt"
  | "other";

export type AgentTarget = {
  id: AgentTargetId;
  label: string;
  /** null이면 별도 파일 없음(채팅 붙여넣기) */
  rulesFilename: string | null;
  pasteOnly: boolean;
};

export const AGENT_TARGETS: AgentTarget[] = [
  {
    id: "cursor",
    label: "Cursor",
    rulesFilename: ".cursorrules",
    pasteOnly: false,
  },
  {
    id: "claude",
    label: "Claude Code",
    rulesFilename: "CLAUDE.md",
    pasteOnly: false,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    rulesFilename: ".windsurfrules",
    pasteOnly: false,
  },
  {
    id: "lovable",
    label: "Lovable",
    rulesFilename: null,
    pasteOnly: true,
  },
  {
    id: "bolt",
    label: "Bolt.new",
    rulesFilename: null,
    pasteOnly: true,
  },
  {
    id: "other",
    label: "그 외",
    rulesFilename: "AGENTS.md",
    pasteOnly: false,
  },
];

export function getAgentTarget(id: AgentTargetId): AgentTarget {
  return AGENT_TARGETS.find((t) => t.id === id) ?? AGENT_TARGETS[0];
}

/** Prompt.md 부록에 표시할 도구 (targetAgents 비어 있으면 전체) */
export function resolveAppendixTargets(selectedIds: string[]): AgentTarget[] {
  if (selectedIds.length === 0) return AGENT_TARGETS;
  const set = new Set(selectedIds);
  return AGENT_TARGETS.filter((t) => set.has(t.id));
}
