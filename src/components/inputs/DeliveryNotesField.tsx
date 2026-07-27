"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  description: string;
  placeholder: string;
  inputId: string;
  readOnly?: boolean;
};

/** 캔버스 아래 — 팔레트로 그린 내용에 대한 추가 설명 (Plan 6-1) */
export function DeliveryNotesField({
  value,
  onChange,
  description,
  placeholder,
  inputId,
  readOnly = false,
}: Props) {
  return (
    <div className="space-y-2 rounded-lg border border-line bg-surface-2/30 p-3">
      <label htmlFor={inputId} className="block text-xs font-semibold text-fg">
        전달 사항 (선택)
      </label>
      <p className="text-xs leading-relaxed text-muted">{description}</p>
      <textarea
        id={inputId}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 read-only:cursor-default read-only:opacity-100"
      />
    </div>
  );
}
