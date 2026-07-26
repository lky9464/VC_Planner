"use client";

import { useState } from "react";
import { FileCode2, FileText } from "lucide-react";

type TabId = "prompt" | "rules";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "prompt", label: "Prompt.md", icon: FileText },
  { id: "rules", label: "Agent 규칙", icon: FileCode2 },
];

/**
 * 우측 실시간 미리보기 (Plan 4장).
 * Phase 2에서 마크다운 생성기와 연결한다. 지금은 자리만 잡아 둔다.
 */
export function PreviewPane() {
  const [tab, setTab] = useState<TabId>("prompt");

  return (
    <section
      aria-label="명세서 미리보기"
      className="flex h-full min-h-0 flex-col bg-surface"
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-line px-3 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              tab === id
                ? "bg-accent-soft text-fg"
                : "text-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted">
          {tab === "prompt"
            ? PROMPT_PLACEHOLDER
            : RULES_PLACEHOLDER}
        </pre>
      </div>
    </section>
  );
}

const PROMPT_PLACEHOLDER = `# (서비스 이름) — 개발 명세서

왼쪽에서 항목을 채우면 이 자리에 명세서가 실시간으로 만들어집니다.

## 0. 이 문서 사용법
## 1. 역할 (Role)
## 2. 프로젝트 개요 (Context)
## 3. 요구사항 (Requirements)
## 4. 기술 스택 및 저장 방식
## 5. 작업 규칙 (Guardrails)
## 6. 판단 위임 항목
## 7. 작업 순서
## 8. 완료 기준`;

const RULES_PLACEHOLDER = `# Agent 작업 규칙

Step 3에서 고른 규칙만 따로 모아 보여 줍니다.
파일 이름만 도구에 맞추면 되고 내용은 동일합니다.

- Cursor       → .cursorrules
- Claude Code  → CLAUDE.md
- Windsurf     → .windsurfrules
- 그 외         → AGENTS.md`;
