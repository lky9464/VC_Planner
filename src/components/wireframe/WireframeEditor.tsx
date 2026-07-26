"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactGridLayout, {
  useContainerWidth,
  verticalCompactor,
  type Layout,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { RotateCcw, Sparkles } from "lucide-react";
import type { WireframeItem } from "@/lib/types/project";
import {
  WIREFRAME_COLS,
  WIREFRAME_PALETTE,
  WIREFRAME_ROW_HEIGHT,
  createWireframeItem,
} from "@/lib/wireframe/constants";
import { WireframeBlock } from "./WireframeBlock";

type Props = {
  items: WireframeItem[];
  cols?: number;
  rowHeight?: number;
  onChange: (items: WireframeItem[]) => void;
  onApplyDashboardPreset: () => void;
};

function toLayout(items: WireframeItem[]): Layout {
  return items.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }));
}

function mergeLayout(items: WireframeItem[], layout: Layout): WireframeItem[] {
  const byId = new Map(items.map((item) => [item.i, item]));
  return layout
    .map((cell) => {
      const existing = byId.get(cell.i);
      if (!existing) return null;
      return {
        ...existing,
        x: cell.x,
        y: cell.y,
        w: cell.w,
        h: cell.h,
      };
    })
    .filter((item): item is WireframeItem => item !== null);
}

/** Step 1 와이어프레임 에디터 (Plan Phase 5) */
export function WireframeEditor({
  items,
  cols = WIREFRAME_COLS,
  rowHeight = WIREFRAME_ROW_HEIGHT,
  onChange,
  onApplyDashboardPreset,
}: Props) {
  const { width, containerRef, mounted } = useContainerWidth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isDragging = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const layout = useMemo(() => toLayout(items), [items]);

  const handleDragStop = useCallback(
    (_layout: Layout) => {
      isDragging.current = false;
      const merged = mergeLayout(itemsRef.current, _layout);
      onChange(merged);
    },
    [onChange],
  );

  const handleResizeStop = useCallback(
    (_layout: Layout) => {
      const merged = mergeLayout(itemsRef.current, _layout);
      onChange(merged);
    },
    [onChange],
  );

  const handleAdd = useCallback(
    (type: WireframeItem["type"]) => {
      onChange([...items, createWireframeItem(type, items)]);
    },
    [items, onChange],
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange(items.map((item) => (item.i === id ? { ...item, label } : item)));
    },
    [items, onChange],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(items.filter((item) => item.i !== id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [items, onChange],
  );

  const handleClear = useCallback(() => {
    onChange([]);
    setSelectedId(null);
  }, [onChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        handleRemove(selectedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, handleRemove]);

  const minHeight = useMemo(() => {
    if (items.length === 0) return 320;
    const rows = Math.max(...items.map((i) => i.y + i.h), 4);
    return Math.max(320, rows * rowHeight + 48);
  }, [items, rowHeight]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onApplyDashboardPreset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/35 bg-accent-soft/40 px-3 py-2 text-xs font-medium text-fg transition-colors hover:bg-accent-soft/70"
        >
          <Sparkles className="size-3.5 text-accent" aria-hidden />
          ✨ 기본 불러오기
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={items.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-fg transition-colors hover:border-warn/40 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-3.5 text-muted" aria-hidden />
          초기화
        </button>
        <p className="text-xs text-muted">
          팔레트 클릭으로 추가 · 드래그·모서리로 배치·크기 조절 · 더블클릭
          이름 편집 · Delete 키로 삭제
        </p>
      </div>

      <div
        aria-label="와이어프레임 팔레트"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8"
      >
        {WIREFRAME_PALETTE.map(({ type, label, hint }) => (
          <button
            key={type}
            type="button"
            title={hint}
            onClick={() => handleAdd(type)}
            className="flex min-h-[2.75rem] items-center justify-center rounded-lg border border-line bg-surface-2 px-2 py-2 text-center text-xs leading-snug text-fg transition-colors hover:border-accent/40 hover:bg-surface"
          >
            {label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="wireframe-canvas relative w-full overflow-hidden rounded-lg border border-line bg-bg"
        style={{ minHeight }}
        onClick={() => setSelectedId(null)}
      >
        {mounted && width > 0 && (
          <ReactGridLayout
            width={width}
            layout={layout}
            gridConfig={{
              cols,
              rowHeight,
              margin: [8, 8] as [number, number],
              containerPadding: [8, 8] as [number, number],
            }}
            dragConfig={{ enabled: true, bounded: false }}
            resizeConfig={{ enabled: true }}
            compactor={verticalCompactor}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
          >
            {items.map((item) => (
              <div key={item.i}>
                <WireframeBlock
                  item={item}
                  selected={selectedId === item.i}
                  onSelect={setSelectedId}
                  onLabelChange={handleLabelChange}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </ReactGridLayout>
        )}

        {items.length === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted">
            팔레트에서 컴포넌트를 클릭해 화면을 구성하세요
          </p>
        )}
      </div>
    </div>
  );
}
