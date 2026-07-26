"use client";

import { Check, CloudOff, Loader2 } from "lucide-react";

/** Phase 1에서 LocalStorage 저장 훅과 연결한다 */
export type SaveStatus = "idle" | "saving" | "saved";

const VIEW = {
  idle: { icon: CloudOff, text: "자동 저장 대기", tone: "text-muted" },
  saving: { icon: Loader2, text: "저장 중…", tone: "text-muted" },
  saved: { icon: Check, text: "저장됨", tone: "text-accent" },
} as const;

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const { icon: Icon, text, tone } = VIEW[status];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs ${tone}`}
      role="status"
      aria-live="polite"
      title="입력한 내용은 이 브라우저에만 저장되며 서버로 전송되지 않습니다"
    >
      <Icon
        className={`size-3.5 ${status === "saving" ? "animate-spin" : ""}`}
        aria-hidden
      />
      {text}
    </span>
  );
}
