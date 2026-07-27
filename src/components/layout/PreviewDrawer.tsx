"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PreviewPane } from "@/components/preview/PreviewPane";

const STORAGE_KEY = "vc-planner-preview-drawer";
/** PlannerShell 본문 max-width (px) */
const CONTENT_MAX_W = 1600;
const DRAWER_W_LG = 420;
const DRAWER_W_XL = 480;

/** 1600px 중앙 정렬 레이아웃 기준 — 서랍 토글 버튼 right(px) */
function calcToggleRight(open: boolean): number {
  if (typeof window === "undefined") {
    return open ? DRAWER_W_LG : 0;
  }
  const vw = window.innerWidth;
  const sideMargin = Math.max(0, (vw - Math.min(CONTENT_MAX_W, vw)) / 2);
  const drawerW = vw >= 1280 ? DRAWER_W_XL : DRAWER_W_LG;
  return sideMargin + (open ? drawerW : 0);
}

/** lg 이상 — 우측 Prompt.md·Agent 규칙 미리보기 서랍 (기본: 열림) */
export function PreviewDrawer() {
  const [open, setOpen] = useState(true);
  const [toggleRight, setToggleRight] = useState(() => calcToggleRight(true));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "closed") setOpen(false);
    } catch {
      /* LocalStorage 불가 환경 — 기본 열림 유지 */
    }
  }, []);

  useEffect(() => {
    const update = () => setToggleRight(calcToggleRight(open));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "open" : "closed");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* 스크롤과 무관하게 화면 중앙·우측에 고정 */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="preview-drawer"
        aria-label={
          open ? "명세서 미리보기 숨기기" : "명세서 미리보기 보이기"
        }
        className="fixed top-1/2 z-40 hidden h-16 w-7 items-center justify-center rounded-l-lg border border-r-0 border-line bg-surface-2 text-muted shadow-md transition-[right] duration-300 ease-in-out hover:border-accent/40 hover:bg-surface hover:text-fg lg:flex"
        style={{ right: toggleRight, transform: "translate(-100%, -50%)" }}
      >
        {open ? (
          <ChevronRight className="size-4" aria-hidden />
        ) : (
          <ChevronLeft className="size-4" aria-hidden />
        )}
      </button>

      <div
        className={`hidden shrink-0 self-stretch overflow-hidden transition-[width] duration-300 ease-in-out lg:block ${
          open ? "w-[420px] xl:w-[480px]" : "w-0"
        }`}
      >
        <aside
          id="preview-drawer"
          aria-hidden={!open}
          className={`h-full overflow-hidden transition-opacity duration-300 ${
            open
              ? "border-l border-line opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)] w-[420px] xl:w-[480px]">
            <PreviewPane />
          </div>
        </aside>
      </div>
    </>
  );
}
