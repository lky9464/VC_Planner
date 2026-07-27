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
import { DeliveryNotesField } from "@/components/inputs/DeliveryNotesField";

type Props = {
  items: WireframeItem[];
  cols?: number;
  rowHeight?: number;
  deliveryNotes: string;
  /** 업무 흐름도의 기능·페이지 노드 수 — 안내 문구용 */
  flowchartPageCount?: number;
  onChange: (items: WireframeItem[]) => void;
  onDeliveryNotesChange: (notes: string) => void;
  onApplyDashboardPreset: () => void;
  /** PDF 캡처 — 그리드만 표시 */
  readOnly?: boolean;
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
  deliveryNotes,
  flowchartPageCount = 0,
  onChange,
  onDeliveryNotesChange,
  onApplyDashboardPreset,
  readOnly = false,
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
    onDeliveryNotesChange("");
    setSelectedId(null);
  }, [onChange, onDeliveryNotesChange]);

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

  if (readOnly) {
    return (
      <div className="space-y-3">
        <div
          ref={containerRef}
          className="wireframe-canvas relative w-full overflow-hidden rounded-lg border border-line bg-bg"
          style={{ minHeight }}
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
              dragConfig={{ enabled: false, bounded: false }}
              resizeConfig={{ enabled: false }}
              compactor={verticalCompactor}
            >
              {items.map((item) => (
                <div key={item.i}>
                  <WireframeBlock
                    item={item}
                    selected={false}
                    onSelect={() => {}}
                    onLabelChange={() => {}}
                    onRemove={() => {}}
                    readOnly
                  />
                </div>
              ))}
            </ReactGridLayout>
          )}

          {items.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-muted">
              (와이어프레임이 비어 있습니다)
            </div>
          )}
        </div>

        <DeliveryNotesField
          inputId="wireframe-delivery-notes-print"
          value={deliveryNotes}
          onChange={onDeliveryNotesChange}
          readOnly
          description="대표 화면 배치에 대한 추가 설명·특이사항·다른 화면과의 차이 등을 적어 주세요. 비워 두어도 됩니다."
          placeholder="예) 네비게이션바와 사이드바는 모든 화면에서 공통(고정), 화면별 컨텐츠는 기능페이지별 다른 형태 등"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="space-y-2 rounded-lg border border-accent/25 bg-accent-soft/20 px-3 py-2.5 text-xs leading-relaxed text-fg"
        role="note"
      >
        <p className="font-medium">
          화면이 여러 개여도{" "}
          <span className="text-accent">대표 1장만</span> 그리면 됩니다.
        </p>
        <p className="text-muted">
          업무 흐름도는 화면 개수와 이동 경로를, 와이어프레임은{" "}
          <strong className="font-medium text-fg">한 장의 배치</strong>
          를 설명합니다. 나머지 화면은 흐름도에 적힌 이름을 AI가 참고합니다.
        </p>
        <ul className="list-inside list-disc space-y-0.5 text-muted">
          <li>
            그리기 좋은 화면:{" "}
            <strong className="font-medium text-fg">메인(시작) 화면</strong>,{" "}
            <strong className="font-medium text-fg">가장 복잡한 화면</strong>,{" "}
            또는{" "}
            <strong className="font-medium text-fg">
              네비+메뉴+본문 공통 틀
            </strong>
          </li>
          <li>
            그리지 않아도 됨: 기능별 상세 화면 각각 (흐름도 노드 이름으로
            충분)
          </li>
        </ul>
        {flowchartPageCount >= 2 && (
          <p className="rounded-md border border-accent/30 bg-bg/60 px-2 py-1.5 text-accent">
            흐름도에 페이지 {flowchartPageCount}개가 있습니다. 와이어프레임은
            그중 <strong className="font-semibold">대표 1장</strong>만
            그리세요.
          </p>
        )}
      </div>

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
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5"
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
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center text-xs text-muted">
            <p>
              ✨ 기본 불러오기로 공통 틀을 불러오거나, 팔레트로{" "}
              <strong className="font-medium text-fg">대표 화면 1장</strong>을
              구성하세요
            </p>
            <p>모든 화면을 각각 그릴 필요는 없습니다</p>
          </div>
        )}
      </div>

      <DeliveryNotesField
        inputId="wireframe-delivery-notes"
        value={deliveryNotes}
        onChange={onDeliveryNotesChange}
        description="대표 화면 배치에 대한 추가 설명·특이사항·다른 화면과의 차이 등을 적어 주세요. 비워 두어도 됩니다."
        placeholder="예) 네비게이션바와 사이드바는 모든 화면에서 공통(고정), 화면별 컨텐츠는 기능페이지별 다른 형태 등"
      />
    </div>
  );
}
