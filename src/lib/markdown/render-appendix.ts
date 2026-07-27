import {
  AGENT_TARGETS,
  resolveAppendixTargets,
} from "@/lib/export/agent-tools";

/** Plan 11-4 — 부록 A (includeToolAppendix가 true일 때만) */
export function renderToolAppendix(targetAgentIds: string[]): string | null {
  const targets = resolveAppendixTargets(targetAgentIds);
  if (targets.length === 0) return null;

  const lines = [
    "## 부록 A. 도구별 적용 방법",
    "",
    "본문(0~8장)은 모든 Agent에 공통입니다. 사용 중인 도구에 맞게 규칙 파일만 저장하세요.",
    "",
  ];

  for (const target of targets) {
    if (target.pasteOnly) {
      lines.push(
        `- **${target.label}**: 이 문서(Prompt.md) 전문을 첫 메시지로 붙여넣으세요.`,
      );
      continue;
    }
    lines.push(
      `- **${target.label}**: 5장(작업 규칙) 내용을 프로젝트 루트 \`${target.rulesFilename}\`로 저장하세요.`,
    );
  }

  return lines.join("\n");
}

/** 부록에 넣을 수 있는 전체 도구 id 목록 */
export const ALL_APPENDIX_AGENT_IDS = AGENT_TARGETS.map((t) => t.id);
