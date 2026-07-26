import type { ProjectState } from "@/lib/types/project";
import { selectedLabels } from "@/lib/project/choice-mutations";
import {
  APP_TYPE_OPTIONS,
  DOMAIN_OPTIONS,
  EMPTY_STATE_OPTIONS,
  ERROR_STATE_OPTIONS,
  INPUT_OPTIONS,
  OUTPUT_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SENSITIVE_DATA_OPTIONS,
  STORAGE_OPTIONS,
} from "@/lib/options/presets";
import { renderFlowchartMarkdown } from "@/lib/flowchart/serialize";
import { renderWireframeMarkdown } from "@/lib/wireframe/serialize";
import { renderDelegationSection } from "./render-delegation";
import { renderAgentRulesBody, renderGuardrailsSection } from "./render-guardrails";
import {
  renderChoiceListMarkdown,
  renderChoiceMarkdown,
} from "./render-choice";

const DEFAULT_TITLE = "(서비스 이름)";

function renderRoleSection(state: ProjectState): string {
  const { role } = state.agentRules;
  const labels = selectedLabels(role, ROLE_OPTIONS);
  const roleText =
    labels[0] ??
    (role.customEnabled && role.customText.trim()
      ? role.customText.trim()
      : "_(미입력)_");

  return [
    "## 1. 역할 (Role)",
    "",
    `당신은 **${roleText}**입니다. 아래 명세를 기준으로 작업하세요.`,
  ].join("\n");
}

/** Phase 3: Step 1~3 항목 + 4·5·6장 연결 */
export function generatePromptMarkdown(state: ProjectState): string {
  const { basic, dataIO, edgeCases, tech, flowchart, wireframe } = state;
  const title = basic.serviceName.trim() || DEFAULT_TITLE;
  const oneLiner = basic.oneLiner.trim() || "_(미입력)_";

  const delegationSection = renderDelegationSection(state);

  const sections = [
    `# ${title} — 개발 명세서`,
    "",
    "## 0. 이 문서 사용법",
    "",
    "이 문서는 AI 코딩 Agent에게 전달하는 개발 지시서입니다.",
    "특정 도구에 종속되지 않는 표준 Markdown으로 작성되었으며,",
    "Cursor / Claude Code / Windsurf / Lovable / Bolt.new 등에서 그대로 사용할 수 있습니다.",
    "",
    renderRoleSection(state),
    "",
    "## 2. 프로젝트 개요 (Context)",
    "",
    `- **서비스명**: ${basic.serviceName.trim() || "_(미입력)_"}`,
    `- **한 줄 설명**: ${oneLiner}`,
    renderChoiceMarkdown("서비스 분야", basic.domain, DOMAIN_OPTIONS),
    renderChoiceMarkdown(
      "민감 데이터 처리",
      basic.sensitiveData,
      SENSITIVE_DATA_OPTIONS,
    ),
    "",
    "## 3. 요구사항 (Requirements)",
    "",
    "### 3-1. 업무 흐름",
    "",
    renderFlowchartMarkdown(flowchart.nodes, flowchart.edges),
    "",
    "### 3-2. 화면 구성",
    "",
    renderWireframeMarkdown(wireframe.items, wireframe.cols),
    "",
    "### 3-3. 입출력 데이터",
    "",
    renderChoiceListMarkdown("입력", dataIO.input, INPUT_OPTIONS),
    renderChoiceListMarkdown("출력", dataIO.output, OUTPUT_TYPE_OPTIONS),
    "",
    "### 3-4. 예외 상황 처리",
    "",
    renderChoiceListMarkdown(
      "데이터 없음 (빈 화면)",
      edgeCases.emptyState,
      EMPTY_STATE_OPTIONS,
    ),
    renderChoiceListMarkdown(
      "에러 · 잘못된 입력",
      edgeCases.errorState,
      ERROR_STATE_OPTIONS,
    ),
    "",
    "## 4. 기술 스택 및 저장 방식 (Tech Constraints)",
    "",
    renderChoiceMarkdown("앱 형태", tech.appType, APP_TYPE_OPTIONS),
    renderChoiceMarkdown("데이터 저장 방식", tech.storage, STORAGE_OPTIONS),
    "",
    renderGuardrailsSection(state.agentRules.guardrails),
    "",
  ];

  if (delegationSection) {
    sections.push(delegationSection, "");
  }

  sections.push(
    "---",
    "_이 문서는 VC Planner로 생성되었습니다. **문서의 내용과 저작권은 작성자 본인에게 있으며 자유롭게 사용·수정·배포할 수 있습니다.**",
    "VC Planner 자체의 소스코드는 BUSL-1.1로 보호되며 무단 재배포·재가공을 금합니다._",
  );

  return sections.join("\n");
}

/** Agent 규칙 탭 — Prompt.md 5장과 동기화 */
export function generateAgentRulesMarkdown(state: ProjectState): string {
  const { role, guardrails } = state.agentRules;
  const labels = selectedLabels(role, ROLE_OPTIONS);
  const roleLabel =
    labels[0] ??
    (role.customEnabled && role.customText.trim()
      ? role.customText.trim()
      : "친절하고 유능한 수석 풀스택 개발자");

  return renderAgentRulesBody(roleLabel, guardrails);
}
