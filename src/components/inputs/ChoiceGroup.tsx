"use client";

import { useId } from "react";
import { Bot, Lock, Sparkles } from "lucide-react";
import type { ChoiceValue, Option } from "@/lib/types/project";
import {
  selectOption,
  toggleCustomInput,
  toggleDelegation,
  updateCustomText,
  updateDelegateHint,
} from "@/lib/project/choice-mutations";
import { HintIcon } from "./HintTooltip";

export type ChoiceGroupMode = "radio" | "checkbox" | "dropdown";

type Props = {
  label: string;
  description?: string;
  mode: ChoiceGroupMode;
  options: Option[];
  value: ChoiceValue;
  onChange: (value: ChoiceValue) => void;
  allowDelegate?: boolean;
  allowCustom?: boolean;
  /** 직접 입력 토글 라벨 (가드레일 등 항목별 문구) */
  customInputLabel?: string;
  /** 체크 해제 불가 옵션 id (민감 데이터 → G10 잠금 등) */
  lockedIds?: string[];
  /** PDF 캡처 — 화면과 동일하게 보이되 조작 UI는 숨김 */
  readOnly?: boolean;
};

/**
 * 공통 선택 입력 (Plan Phase 1).
 * 라디오/체크/드롭다운 + 직접 입력 + Agent 위임을 한 묶음으로 제공한다.
 */
export function ChoiceGroup({
  label,
  description,
  mode,
  options,
  value,
  onChange,
  allowDelegate = false,
  allowCustom = true,
  customInputLabel = "✏️ 직접 입력 / 기타",
  lockedIds = [],
  readOnly = false,
}: Props) {
  const groupId = useId();
  const multiple = mode === "checkbox";
  const isDisabled = value.delegated;

  const handleSelect = (optionId: string) => {
    if (
      multiple &&
      lockedIds.includes(optionId) &&
      value.selectedIds.includes(optionId)
    ) {
      return;
    }
    onChange(selectOption(value, optionId, multiple));
  };

  return (
    <fieldset className="space-y-3 rounded-lg border border-line bg-surface-2/30 p-4">
      <legend className="px-1 text-sm font-semibold text-fg">{label}</legend>

      {description && (
        <p className="text-xs leading-relaxed text-muted">{description}</p>
      )}

      {value.delegated && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-warn/35 bg-warn/10 px-3 py-2 text-xs text-fg"
        >
          <Bot className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
          <span>
            이 항목은 <strong>Agent 판단에 맡겼습니다</strong>. 명세서에는
            추천을 요청하는 지시문으로 출력됩니다.
          </span>
        </div>
      )}

      <div className={isDisabled && !readOnly ? "pointer-events-none opacity-45" : readOnly ? "pointer-events-none" : undefined}>
        {mode === "dropdown" ? (
          <DropdownSelect
            groupId={groupId}
            options={options}
            value={value}
            onSelect={handleSelect}
            readOnly={readOnly}
          />
        ) : (
          <OptionList
            groupId={groupId}
            mode={mode}
            options={options}
            value={value}
            lockedIds={lockedIds}
            onSelect={handleSelect}
            readOnly={readOnly}
          />
        )}
      </div>

      {allowCustom && !readOnly && (
        <CustomInputSection
          groupId={groupId}
          value={value}
          disabled={value.delegated}
          toggleLabel={customInputLabel}
          onToggle={() => onChange(toggleCustomInput(value))}
          onTextChange={(text) => onChange(updateCustomText(value, text))}
        />
      )}

      {readOnly && allowCustom && value.customEnabled && (
        <ReadOnlyCustomText groupId={groupId} value={value} toggleLabel={customInputLabel} />
      )}

      {allowDelegate && !readOnly && (
        <DelegateSection
          groupId={groupId}
          value={value}
          onToggle={() => onChange(toggleDelegation(value))}
          onHintChange={(hint) => onChange(updateDelegateHint(value, hint))}
        />
      )}
    </fieldset>
  );
}

function ReadOnlyCustomText({
  groupId,
  value,
  toggleLabel,
}: {
  groupId: string;
  value: ChoiceValue;
  toggleLabel: string;
}) {
  const inputId = `${groupId}-custom-text-readonly`;

  return (
    <div className="space-y-2 border-t border-line pt-3">
      <label htmlFor={inputId} className="text-sm text-fg">
        {toggleLabel}
      </label>
      <textarea
        id={inputId}
        value={value.customText}
        readOnly
        rows={3}
        className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg read-only:cursor-default read-only:opacity-100"
      />
    </div>
  );
}

function OptionList({
  groupId,
  mode,
  options,
  value,
  lockedIds,
  onSelect,
  readOnly = false,
}: {
  groupId: string;
  mode: "radio" | "checkbox";
  options: Option[];
  value: ChoiceValue;
  lockedIds: string[];
  onSelect: (id: string) => void;
  readOnly?: boolean;
}) {
  return (
    <ul className="space-y-2" role={mode === "checkbox" ? "group" : "radiogroup"}>
      {options.map((option) => {
        const inputId = `${groupId}-${option.id}`;
        const checked = value.selectedIds.includes(option.id);
        const isLocked = lockedIds.includes(option.id);

        return (
          <li key={option.id}>
            <label
              htmlFor={inputId}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                readOnly ? "cursor-default" : "cursor-pointer"
              } ${
                checked
                  ? "border-accent/50 bg-accent-soft/60"
                  : "border-line hover:border-accent/30 hover:bg-surface-2"
              } ${isLocked && checked ? "ring-1 ring-warn/30" : ""}`}
            >
              <input
                id={inputId}
                type={mode}
                name={mode === "radio" ? groupId : undefined}
                checked={checked}
                readOnly={readOnly}
                onChange={() => onSelect(option.id)}
                className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-sm">
                  {option.label}
                  {option.recommended && <RecommendedBadge />}
                  {isLocked && checked && (
                    <span
                      className="inline-flex items-center gap-0.5 text-[10px] text-warn"
                      title="민감 데이터를 선택했기 때문에 이 규칙은 해제할 수 없습니다"
                    >
                      <Lock className="size-2.5" aria-hidden />
                      잠금
                    </span>
                  )}
                  {option.hint && <HintIcon hint={option.hint} />}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function DropdownSelect({
  groupId,
  options,
  value,
  onSelect,
  readOnly = false,
}: {
  groupId: string;
  options: Option[];
  value: ChoiceValue;
  onSelect: (id: string) => void;
  readOnly?: boolean;
}) {
  const selected = value.selectedIds[0] ?? "";

  return (
    <div className="space-y-2">
      <select
        id={`${groupId}-select`}
        value={selected}
        disabled={readOnly}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-default disabled:opacity-100"
      >
        <option value="">— 선택해 주세요 —</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
            {option.recommended ? " ✨" : ""}
          </option>
        ))}
      </select>
      {selected && (
        <p className="text-xs text-muted">
          {options.find((o) => o.id === selected)?.hint ?? ""}
        </p>
      )}
    </div>
  );
}

function RecommendedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
      <Sparkles className="size-2.5" aria-hidden />
      추천
    </span>
  );
}

function CustomInputSection({
  groupId,
  value,
  disabled,
  toggleLabel,
  onToggle,
  onTextChange,
}: {
  groupId: string;
  value: ChoiceValue;
  disabled: boolean;
  toggleLabel: string;
  onToggle: () => void;
  onTextChange: (text: string) => void;
}) {
  const toggleId = `${groupId}-custom-toggle`;
  const inputId = `${groupId}-custom-text`;

  return (
    <div className="space-y-2 border-t border-line pt-3">
      <label
        htmlFor={toggleId}
        className={`flex cursor-pointer items-center gap-2 text-sm ${
          disabled ? "cursor-not-allowed opacity-45" : ""
        }`}
      >
        <input
          id={toggleId}
          type="checkbox"
          checked={value.customEnabled}
          disabled={disabled}
          onChange={onToggle}
          className="size-4 accent-[var(--accent)]"
        />
        <span>{toggleLabel}</span>
      </label>

      {value.customEnabled && (
        <textarea
          id={inputId}
          value={value.customText}
          disabled={disabled}
          onChange={(e) => onTextChange(e.target.value)}
          rows={3}
          placeholder="원하는 내용을 자유롭게 적어 주세요"
          className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-45"
        />
      )}
    </div>
  );
}

function DelegateSection({
  groupId,
  value,
  onToggle,
  onHintChange,
}: {
  groupId: string;
  value: ChoiceValue;
  onToggle: () => void;
  onHintChange: (hint: string) => void;
}) {
  const toggleId = `${groupId}-delegate-toggle`;
  const hintId = `${groupId}-delegate-hint`;

  return (
    <div className="space-y-2 border-t border-line pt-3">
      <button
        id={toggleId}
        type="button"
        onClick={onToggle}
        aria-pressed={value.delegated}
        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
          value.delegated
            ? "border-warn/40 bg-warn/10 text-fg"
            : "border-line text-muted hover:border-warn/30 hover:bg-surface-2 hover:text-fg"
        }`}
      >
        <Bot className="size-4 shrink-0" aria-hidden />
        <span>🤖 AI 추천 받기 — Agent에게 판단 맡기기</span>
      </button>

      {value.delegated && (
        <div className="space-y-1.5">
          <label htmlFor={hintId} className="text-xs text-muted">
            Agent에게 전달할 선호 (선택)
          </label>
          <input
            id={hintId}
            type="text"
            value={value.delegateHint}
            onChange={(e) => onHintChange(e.target.value)}
            placeholder='예: "비용은 최소로", "구현이 단순한 쪽"'
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      )}
    </div>
  );
}
