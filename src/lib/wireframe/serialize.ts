import type { WireframeItem } from "@/lib/types/project";
import { WIREFRAME_TYPE_LABELS } from "./constants";

/** 그리드 1열당 ASCII 문자 수 */
const CHARS_PER_COL = 8;
/** 그리드 1행당 ASCII 줄 수 */
const LINES_PER_ROW = 2;

function totalGridRows(items: WireframeItem[]): number {
  return Math.max(...items.map((i) => i.y + i.h), 1);
}

/** 겹치는 박스 테두리 문자 병합 */
function mergeBorder(existing: string, next: string): string {
  if (existing === " " || existing === next) return next;
  if (existing === next) return existing;

  const pair = new Set([existing, next]);
  if (pair.has("─") && pair.has("│")) return "┼";
  if (pair.has("─") && pair.has("┌")) return "┬";
  if (pair.has("─") && pair.has("┐")) return "┬";
  if (pair.has("─") && pair.has("└")) return "┴";
  if (pair.has("─") && pair.has("┘")) return "┴";
  if (pair.has("│") && pair.has("┌")) return "├";
  if (pair.has("│") && pair.has("┐")) return "┤";
  if (pair.has("│") && pair.has("└")) return "├";
  if (pair.has("│") && pair.has("┘")) return "┤";
  if (pair.has("┬") && pair.has("│")) return "┬";
  if (pair.has("┴") && pair.has("│")) return "┴";
  if (pair.has("├") && pair.has("─")) return "┼";
  if (pair.has("┤") && pair.has("─")) return "┼";
  return "┼";
}

function setCell(grid: string[][], x: number, y: number, char: string) {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return;
  const current = grid[y][x];
  grid[y][x] =
    current === " " ? char : mergeBorder(current, char);
}

function placeLabel(grid: string[][], x: number, y: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    const cx = x + i;
    if (cx >= grid[0].length - 1) break;
    if (grid[y][cx] === " ") {
      grid[y][cx] = text[i];
    }
  }
}

/** 그리드 좌표 → ASCII 박스 도식 (Plan 6-1) */
export function buildAsciiDiagram(
  items: WireframeItem[],
  cols: number,
): string {
  if (items.length === 0) return "";

  const gridRows = totalGridRows(items);
  const width = cols * CHARS_PER_COL + 1;
  const height = gridRows * LINES_PER_ROW + 1;

  const grid: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => " "),
  );

  for (const item of items) {
    const x1 = item.x * CHARS_PER_COL;
    const x2 = (item.x + item.w) * CHARS_PER_COL;
    const y1 = item.y * LINES_PER_ROW;
    const y2 = (item.y + item.h) * LINES_PER_ROW;

    for (let x = x1; x <= x2; x++) {
      setCell(
        grid,
        x,
        y1,
        x === x1 ? "┌" : x === x2 ? "┐" : "─",
      );
      setCell(
        grid,
        x,
        y2,
        x === x1 ? "└" : x === x2 ? "┘" : "─",
      );
    }

    for (let y = y1; y <= y2; y++) {
      setCell(
        grid,
        x1,
        y,
        y === y1 ? "┌" : y === y2 ? "└" : "│",
      );
      setCell(
        grid,
        x2,
        y,
        y === y1 ? "┐" : y === y2 ? "┘" : "│",
      );
    }

    const tag = WIREFRAME_TYPE_LABELS[item.type];
    const label = `[${tag}] ${item.label}`.slice(0, x2 - x1 - 1);
    placeLabel(grid, x1 + 1, y1 + 1, label);
  }

  return grid
    .map((row) => row.join("").replace(/\s+$/u, ""))
    .filter((line, idx, arr) => line.length > 0 || idx < arr.length - 1)
    .join("\n");
}

/** 컴포넌트 목록 표 (Plan 6-1) */
export function buildComponentTable(items: WireframeItem[]): string {
  if (items.length === 0) return "";

  const sorted = [...items].sort((a, b) =>
    a.y === b.y ? a.x - b.x : a.y - b.y,
  );

  const lines = [
    "| # | 유형 | 명칭 | 위치 (x,y) | 크기 (w×h) |",
    "|---|---|---|---|---|",
  ];

  sorted.forEach((item, index) => {
    const type = WIREFRAME_TYPE_LABELS[item.type];
    const safeLabel = item.label.replace(/\|/g, "\\|");
    lines.push(
      `| ${index + 1} | ${type} | ${safeLabel} | (${item.x}, ${item.y}) | ${item.w}×${item.h} |`,
    );
  });

  return lines.join("\n");
}

export function renderWireframeMarkdown(
  items: WireframeItem[],
  cols: number,
): string {
  if (items.length === 0) {
    return "_(아직 배치한 대표 화면 레이아웃이 없습니다)_";
  }

  const intro =
    "아래는 **대표 화면 1장**(또는 공통 레이아웃)의 배치입니다. 업무 흐름도의 다른 페이지는 이 틀을 참고해 Agent가 구현합니다.";

  const ascii = buildAsciiDiagram(items, cols);
  const table = buildComponentTable(items);

  return [
    intro,
    "",
    "**ASCII 레이아웃 도식**:",
    "",
    "```",
    ascii,
    "```",
    "",
    "**컴포넌트 목록**:",
    "",
    table,
  ].join("\n");
}
