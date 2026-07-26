import { ShieldCheck } from "lucide-react";

/**
 * 전 화면 공통 푸터.
 * 라이선스 고지와 로컬 저장 안내를 함께 노출한다 (Plan 12-3장) [G12]
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-bg px-4 py-3">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-1 text-[11px] leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 VC Planner · Licensed under BUSL-1.1 (source-available) ·
          무단 재배포 및 재가공을 금지합니다
        </p>
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          입력하신 내용은 브라우저에만 저장되며 서버로 전송되지 않습니다
        </p>
      </div>
    </footer>
  );
}
