"use client";

import { useMemo, useState } from "react";
import { FileCode2, FileText } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import {
  generateAgentRulesMarkdown,
  generatePromptMarkdown,
} from "@/lib/markdown/generate-prompt";

type TabId = "prompt" | "rules";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "prompt", label: "Prompt.md", icon: FileText },
  { id: "rules", label: "Agent 규칙", icon: FileCode2 },
];

/** 우측 실시간 Prompt.md / Agent 규칙 미리보기 */
export function PreviewPane() {
  const { state, hydrated } = useProject();
  const [tab, setTab] = useState<TabId>("prompt");

  const promptMd = useMemo(
    () => (hydrated ? generatePromptMarkdown(state) : ""),
    [state, hydrated],
  );
  const rulesMd = useMemo(
    () => (hydrated ? generateAgentRulesMarkdown(state) : ""),
    [state, hydrated],
  );

  const content =
    tab === "prompt"
      ? promptMd || PLACEHOLDER_LOADING
      : rulesMd || PLACEHOLDER_LOADING;

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
        <pre
          className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted"
          aria-live="polite"
        >
          {content}
        </pre>
      </div>
    </section>
  );
}

const PLACEHOLDER_LOADING = "저장된 내용을 불러오는 중…";
