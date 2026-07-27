"use client";

import { Hammer, Sparkles } from "lucide-react";
import { ChoiceGroup } from "@/components/inputs/ChoiceGroup";
import { TextField } from "@/components/inputs/TextField";
import { FlowchartEditor } from "@/components/flowchart/FlowchartEditor";
import { WireframeEditor } from "@/components/wireframe/WireframeEditor";
import { ExportPanel } from "@/components/export/ExportPanel";
import { FinishSuccessAlert } from "@/components/layout/FinishSuccessAlert";
import { useProject } from "@/context/ProjectContext";
import { isSensitiveDataIncluded } from "@/lib/project/reducer";
import {
  DOMAIN_OPTIONS,
  EMPTY_STATE_OPTIONS,
  ERROR_STATE_OPTIONS,
  GUARDRAIL_OPTIONS,
  INPUT_OPTIONS,
  OUTPUT_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SENSITIVE_DATA_OPTIONS,
  APP_TYPE_OPTIONS,
  STORAGE_OPTIONS,
} from "@/lib/options/presets";
import type { ChoiceFieldPath, ChoiceValue } from "@/lib/types/project";
import type { StepId } from "@/lib/steps";

export function StepBody({
  step,
  finishSuccess = false,
  readOnly = false,
}: {
  step: StepId;
  finishSuccess?: boolean;
  readOnly?: boolean;
}) {
  const { hydrated } = useProject();

  if (!hydrated) {
    return (
      <p className="text-sm text-muted" aria-live="polite">
        저장된 내용을 불러오는 중…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 && <Step1Fields readOnly={readOnly} />}
      {step === 2 && <Step2Fields readOnly={readOnly} />}
      {step === 3 && <Step3Fields readOnly={readOnly} />}
      {step === 4 && <Step4Fields finishSuccess={finishSuccess} />}

      {!readOnly && <ComingSoonNotice step={step} />}
    </div>
  );
}

function Step1Fields({ readOnly = false }: { readOnly?: boolean }) {
  const {
    state,
    setChoice,
    setBasicText,
    setFlowchart,
    setFlowchartDeliveryNotes,
    applyCrudFlowPreset,
    setWireframe,
    setWireframeDeliveryNotes,
    applyDashboardWireframePreset,
  } = useProject();

  return (
    <>
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          기본 정보
        </h3>
        <TextField
          label="서비스 이름"
          description="만들 서비스의 이름을 적어 주세요."
          value={state.basic.serviceName}
          onChange={(v) => setBasicText("serviceName", v)}
          placeholder="예: 재고 관리 도우미"
          readOnly={readOnly}
        />
        <TextField
          label="한 줄 설명"
          description="이 서비스가 무엇을 해 주는지 한 문장으로 적어 주세요."
          value={state.basic.oneLiner}
          onChange={(v) => setBasicText("oneLiner", v)}
          placeholder="예: 창고 재고를 쉽게 등록·조회하는 웹앱"
          multiline
          readOnly={readOnly}
        />
        <ChoiceField
          path="basic.domain"
          label="서비스 분야"
          description="만들려는 서비스가 어느 영역에 가까운지 골라 주세요."
          mode="radio"
          options={DOMAIN_OPTIONS}
          value={state.basic.domain}
          onChange={setChoice}
          readOnly={readOnly}
        />
        <ChoiceField
          path="basic.sensitiveData"
          label="민감 데이터 처리 여부"
          description="개인정보·금융·의료 데이터를 다루면 Step 3의 「보안 및 규정 준수」 규칙이 자동으로 켜지고 잠깁니다."
          mode="radio"
          options={SENSITIVE_DATA_OPTIONS}
          value={state.basic.sensitiveData}
          onChange={setChoice}
          readOnly={readOnly}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          업무 흐름도
        </h3>
        <FlowchartEditor
          nodes={state.flowchart.nodes}
          edges={state.flowchart.edges}
          deliveryNotes={state.flowchart.deliveryNotes}
          onChange={setFlowchart}
          onDeliveryNotesChange={setFlowchartDeliveryNotes}
          onApplyCrudPreset={applyCrudFlowPreset}
          readOnly={readOnly}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          대표 화면 레이아웃 (와이어프레임)
        </h3>
        <WireframeEditor
          items={state.wireframe.items}
          cols={state.wireframe.cols}
          rowHeight={state.wireframe.rowHeight}
          deliveryNotes={state.wireframe.deliveryNotes}
          flowchartPageCount={
            state.flowchart.nodes.filter((node) => node.type === "page").length
          }
          onChange={setWireframe}
          onDeliveryNotesChange={setWireframeDeliveryNotes}
          onApplyDashboardPreset={applyDashboardWireframePreset}
          readOnly={readOnly}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          입출력 데이터
        </h3>
        <ChoiceField
          path="dataIO.input"
          label="입력 (복수 선택)"
          description="사용자가 서비스에 넣는 데이터 종류입니다."
          mode="checkbox"
          options={INPUT_OPTIONS}
          value={state.dataIO.input}
          onChange={setChoice}
          readOnly={readOnly}
        />
        <ChoiceField
          path="dataIO.output"
          label="출력 (복수 선택)"
          description="화면이나 파일로 보여 줄 결과 형태입니다."
          mode="checkbox"
          options={OUTPUT_TYPE_OPTIONS}
          value={state.dataIO.output}
          onChange={setChoice}
          readOnly={readOnly}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          예외 상황
        </h3>
        <ChoiceField
          path="edgeCases.emptyState"
          label="데이터가 없을 때"
          mode="checkbox"
          options={EMPTY_STATE_OPTIONS}
          value={state.edgeCases.emptyState}
          onChange={setChoice}
          readOnly={readOnly}
        />
        <ChoiceField
          path="edgeCases.errorState"
          label="에러 · 잘못된 입력"
          mode="checkbox"
          options={ERROR_STATE_OPTIONS}
          value={state.edgeCases.errorState}
          onChange={setChoice}
          readOnly={readOnly}
        />
      </section>
    </>
  );
}

function Step2Fields({ readOnly = false }: { readOnly?: boolean }) {
  const { state, setChoice, applyStep2Defaults } = useProject();

  return (
    <>
      {!readOnly && (
        <button
          type="button"
          onClick={applyStep2Defaults}
          className="flex w-full items-center gap-2 rounded-lg border border-accent/35 bg-accent-soft/40 px-4 py-3 text-left text-sm text-fg transition-colors hover:border-accent/50 hover:bg-accent-soft/70"
        >
          <Sparkles className="size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <strong>✨ 잘 모르겠어요 (기본값 적용)</strong>
            <span className="mt-0.5 block text-xs text-muted">
              Next.js 웹앱 + 브라우저 저장(LocalStorage) 추천값으로 채웁니다
            </span>
          </span>
        </button>
      )}

      <ChoiceField
        path="tech.appType"
        label="앱 형태"
        mode="radio"
        options={APP_TYPE_OPTIONS}
        value={state.tech.appType}
        onChange={setChoice}
        allowDelegate
        readOnly={readOnly}
      />
      <ChoiceField
        path="tech.storage"
        label="데이터 저장 방식"
        mode="radio"
        options={STORAGE_OPTIONS}
        value={state.tech.storage}
        onChange={setChoice}
        allowDelegate
        readOnly={readOnly}
      />
    </>
  );
}

function Step3Fields({ readOnly = false }: { readOnly?: boolean }) {
  const { state, setChoice } = useProject();
  const g10Locked = isSensitiveDataIncluded(state);

  return (
    <>
      <ChoiceField
        path="agentRules.role"
        label="AI 역할"
        description="Agent가 어떤 전문가처럼 행동할지 정합니다."
        mode="dropdown"
        options={ROLE_OPTIONS}
        value={state.agentRules.role}
        onChange={setChoice}
        readOnly={readOnly}
      />
      <ChoiceField
        path="agentRules.guardrails"
        label="가드레일 (복수 선택)"
        description={
          g10Locked
            ? "민감 데이터를 선택했으므로 「보안 및 규정 준수」는 자동 체크·잠금 상태입니다."
            : "Agent가 반드시 지켜야 할 규칙입니다."
        }
        mode="checkbox"
        options={GUARDRAIL_OPTIONS}
        value={state.agentRules.guardrails}
        onChange={setChoice}
        lockedIds={g10Locked ? ["g10"] : []}
        customInputLabel="➕ 가드레일 직접 추가"
        readOnly={readOnly}
      />
    </>
  );
}

function Step4Fields({ finishSuccess }: { finishSuccess: boolean }) {
  return (
    <div className="space-y-4">
      {finishSuccess && <FinishSuccessAlert />}
      <ExportPanel />
    </div>
  );
}

function ChoiceField({
  path,
  allowDelegate = false,
  lockedIds,
  customInputLabel,
  readOnly = false,
  ...props
}: {
  path: ChoiceFieldPath;
  label: string;
  description?: string;
  mode: "radio" | "checkbox" | "dropdown";
  options: typeof DOMAIN_OPTIONS;
  value: ChoiceValue;
  onChange: (path: ChoiceFieldPath, value: ChoiceValue) => void;
  allowDelegate?: boolean;
  lockedIds?: string[];
  customInputLabel?: string;
  readOnly?: boolean;
}) {
  return (
    <ChoiceGroup
      {...props}
      allowDelegate={allowDelegate}
      lockedIds={lockedIds}
      customInputLabel={customInputLabel}
      readOnly={readOnly}
      onChange={(value) => props.onChange(path, value)}
    />
  );
}

function ComingSoonNotice({ step }: { step: StepId }) {
  const LATER: Partial<Record<StepId, string[]>> = {};

  const items = LATER[step];
  if (!items?.length) return null;

  return (
    <div className="rounded-lg border border-dashed border-line bg-surface-2/40 px-4 py-3">
      <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
        <Hammer className="size-3.5" aria-hidden />
        다음 Phase에서 추가될 항목
      </p>
      <ul className="list-inside list-disc space-y-1 text-xs text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
