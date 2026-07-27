"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download, FileCode2 } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import {
  generateAgentRulesMarkdown,
  generatePromptMarkdown,
} from "@/lib/markdown/generate-prompt";
import { copyTextToClipboard } from "@/lib/export/clipboard";
import {
  downloadTextFile,
  MIME_MARKDOWN,
  MIME_PLAIN,
} from "@/lib/export/download";
import {
  AGENT_TARGETS,
  getAgentTarget,
  type AgentTargetId,
} from "@/lib/export/agent-tools";
import { ALL_APPENDIX_AGENT_IDS } from "@/lib/markdown/render-appendix";

type Feedback = { kind: "success" | "error"; message: string } | null;

/** Step 4 — 복사·다운로드 (Plan 6-4 · Phase 6) */
export function ExportPanel() {
  const { state, setOutputOption } = useProject();
  const [selectedAgent, setSelectedAgent] = useState<AgentTargetId>("cursor");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const promptMd = useMemo(() => generatePromptMarkdown(state), [state]);
  const rulesMd = useMemo(() => generateAgentRulesMarkdown(state), [state]);
  const agentTarget = getAgentTarget(selectedAgent);
  const serviceSlug =
    state.basic.serviceName.trim().replace(/\s+/g, "-") || "Prompt";

  const showFeedback = useCallback((message: string, kind: "success" | "error" = "success") => {
    setFeedback({ kind, message });
    window.setTimeout(() => setFeedback(null), 2500);
  }, []);

  const handleCopyRules = useCallback(async () => {
    if (agentTarget.pasteOnly) {
      showFeedback(
        `${agentTarget.label}는 Prompt.md 다운로드를 사용하세요.`,
        "error",
      );
      return;
    }
    try {
      await copyTextToClipboard(rulesMd);
      showFeedback(
        `Agent 규칙이 복사되었습니다. ${agentTarget.rulesFilename}로 저장하세요.`,
      );
    } catch {
      showFeedback("복사에 실패했습니다.", "error");
    }
  }, [rulesMd, agentTarget, showFeedback]);

  const handleDownloadPromptMd = useCallback(() => {
    downloadTextFile(promptMd, `${serviceSlug}.md`, MIME_MARKDOWN);
    showFeedback("Prompt.md 파일을 다운로드했습니다.");
  }, [promptMd, serviceSlug, showFeedback]);

  const handleDownloadPromptTxt = useCallback(() => {
    downloadTextFile(promptMd, `${serviceSlug}.txt`, MIME_PLAIN);
    showFeedback("Prompt.txt 파일을 다운로드했습니다.");
  }, [promptMd, serviceSlug, showFeedback]);

  const handleDownloadRules = useCallback(() => {
    if (!agentTarget.rulesFilename) {
      showFeedback(
        `${agentTarget.label}는 별도 규칙 파일 없이 Prompt.md를 사용합니다.`,
        "error",
      );
      return;
    }
    downloadTextFile(rulesMd, agentTarget.rulesFilename, MIME_PLAIN);
    showFeedback(`${agentTarget.rulesFilename} 파일을 다운로드했습니다.`);
  }, [rulesMd, agentTarget, showFeedback]);

  const toggleAppendix = useCallback(
    (checked: boolean) => {
      setOutputOption("includeToolAppendix", checked);
    },
    [setOutputOption],
  );

  const toggleTargetAgent = useCallback(
    (id: string, checked: boolean) => {
      const allIds = ALL_APPENDIX_AGENT_IDS;
      const current = state.output.targetAgents;
      const effective = current.length === 0 ? allIds : current;

      let next: string[];
      if (checked) {
        next = effective.includes(id) ? effective : [...effective, id];
        if (next.length === allIds.length) next = [];
      } else {
        next = effective.filter((x) => x !== id);
      }
      setOutputOption("targetAgents", next);
    },
    [state.output.targetAgents, setOutputOption],
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        먼저 사용할 Agent 도구를 선택한 뒤, 아래 버튼으로 명세서를 저장하거나
        Agent 규칙을 복사하세요. 오른쪽 미리보기와 동일한 내용이 출력됩니다.
      </p>

      <fieldset className="space-y-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Agent 규칙 대상 도구
        </legend>
        <p className="text-xs text-muted">
          Agent 규칙 복사·다운로드 시 저장할 파일 이름 안내에 사용됩니다.
          내용은 도구와 관계없이 모두 동일합니다.
        </p>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value as AgentTargetId)}
          className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        >
          {AGENT_TARGETS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
              {t.rulesFilename ? ` → ${t.rulesFilename}` : " (Prompt.md 붙여넣기)"}
            </option>
          ))}
        </select>
      </fieldset>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
            feedback.kind === "success"
              ? "border border-accent/30 bg-accent-soft/40 text-fg"
              : "border border-warn/30 bg-warn/10 text-fg"
          }`}
        >
          {feedback.kind === "success" && (
            <Check className="size-3.5 shrink-0 text-accent" aria-hidden />
          )}
          {feedback.message}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Prompt
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <ExportButton
              icon={Download}
              label="💾 Prompt.md 다운로드"
              hint="UTF-8, BOM 없음"
              onClick={handleDownloadPromptMd}
            />
            <ExportButton
              icon={Download}
              label="💾 Prompt.txt 다운로드"
              hint="UTF-8, BOM 없음"
              onClick={handleDownloadPromptTxt}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Rule
          </p>
          {agentTarget.pasteOnly ? (
            <p className="rounded-lg border border-line bg-surface-2/40 px-3 py-2.5 text-xs text-muted">
              {agentTarget.label}는 별도 규칙 파일 없이{" "}
              <strong className="font-medium text-fg">Prompt.md 다운로드</strong>
              를 사용하세요.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <ExportButton
                icon={FileCode2}
                label="📄 Agent 규칙 파일 복사"
                hint={
                  agentTarget.rulesFilename
                    ? `${agentTarget.rulesFilename} 내용`
                    : "클립보드"
                }
                onClick={handleCopyRules}
              />
              {agentTarget.rulesFilename && (
                <ExportButton
                  icon={Download}
                  label={`💾 ${agentTarget.rulesFilename} 다운로드`}
                  hint="Agent 규칙만"
                  onClick={handleDownloadRules}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <fieldset className="space-y-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Prompt.md 부록 (선택)
        </legend>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-fg">
          <input
            type="checkbox"
            checked={state.output.includeToolAppendix}
            onChange={(e) => toggleAppendix(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <span>
            <strong>부록 A — 도구별 적용 방법</strong>을 Prompt.md 맨 끝에
            덧붙이기
          </span>
        </label>
        {state.output.includeToolAppendix && (
          <div className="space-y-1.5 pl-6">
            <p className="text-xs text-muted">
              비워 두면 모든 도구 안내를 포함합니다.
            </p>
            {ALL_APPENDIX_AGENT_IDS.map((id) => {
              const target = AGENT_TARGETS.find((t) => t.id === id)!;
              const checked =
                state.output.targetAgents.length === 0 ||
                state.output.targetAgents.includes(id);
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 text-xs text-fg"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleTargetAgent(id, e.target.checked)}
                    className="accent-accent"
                  />
                  {target.label}
                </label>
              );
            })}
          </div>
        )}
      </fieldset>
    </div>
  );
}

function ExportButton({
  icon: Icon,
  label,
  hint,
  onClick,
  disabled = false,
}: {
  icon: typeof Copy;
  label: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-start gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-left text-sm text-fg transition-colors hover:border-accent/40 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <span>
        <strong className="block">{label}</strong>
        <span className="mt-0.5 block text-xs text-muted">{hint}</span>
      </span>
    </button>
  );
}
