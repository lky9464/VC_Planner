"use client";

type Props = {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

/** Step 1 기본 정보용 텍스트 입력 */
export function TextField({
  label,
  description,
  value,
  onChange,
  placeholder,
  multiline = false,
}: Props) {
  const inputId = label.replace(/\s/g, "-");

  return (
    <div className="space-y-2 rounded-lg border border-line bg-surface-2/30 p-4">
      <label htmlFor={inputId} className="block text-sm font-semibold text-fg">
        {label}
      </label>
      {description && (
        <p className="text-xs leading-relaxed text-muted">{description}</p>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      )}
    </div>
  );
}
