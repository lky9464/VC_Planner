import type { FlowEdge, FlowNode } from "@/lib/types/project";
import { createFlowEdgeId } from "./constants";

/** Plan 6-1 — 기본 CRUD 서비스 흐름 프리셋 */
export function createCrudFlowPreset(): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const nodes: FlowNode[] = [
    {
      id: "crud-start",
      type: "start",
      label: "시작",
      position: { x: 0, y: 60 },
    },
    {
      id: "crud-list",
      type: "page",
      label: "목록 화면",
      position: { x: 200, y: 60 },
    },
    {
      id: "crud-form",
      type: "page",
      label: "등록/수정/삭제",
      position: { x: 420, y: 60 },
    },
    {
      id: "crud-db",
      type: "database",
      label: "DB 저장",
      position: { x: 640, y: 60 },
    },
    {
      id: "crud-end",
      type: "end",
      label: "종료",
      position: { x: 840, y: 60 },
    },
  ];

  const edges: FlowEdge[] = [
    {
      id: createFlowEdgeId("crud-start", "crud-list"),
      source: "crud-start",
      target: "crud-list",
    },
    {
      id: createFlowEdgeId("crud-list", "crud-form"),
      source: "crud-list",
      target: "crud-form",
    },
    {
      id: createFlowEdgeId("crud-form", "crud-db"),
      source: "crud-form",
      target: "crud-db",
    },
    {
      id: createFlowEdgeId("crud-db", "crud-end"),
      source: "crud-db",
      target: "crud-end",
    },
  ];

  return { nodes, edges };
}
