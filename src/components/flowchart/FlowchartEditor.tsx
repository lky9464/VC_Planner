"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FlowEdge, FlowNode, FlowNodeType } from "@/lib/types/project";
import {
  FLOW_DND_MIME,
  FLOW_NODE_DEFAULT_LABELS,
  FLOW_NODE_PALETTE,
  createFlowEdgeId,
  createFlowNodeId,
} from "@/lib/flowchart/constants";
import { flowNodeTypes } from "./FlowNodes";

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onChange: (nodes: FlowNode[], edges: FlowEdge[]) => void;
  onApplyCrudPreset: () => void;
};

function toReactFlowNodes(
  nodes: FlowNode[],
  onLabelChange: (id: string, label: string) => void,
): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: { label: n.label, nodeType: n.type, onLabelChange },
  }));
}

function toReactFlowEdges(edges: FlowEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    style: { stroke: "var(--accent)", strokeWidth: 2 },
  }));
}

function fromReactFlowNodes(rfNodes: Node[]): FlowNode[] {
  return rfNodes.map((n) => ({
    id: n.id,
    type: (n.type ?? "page") as FlowNodeType,
    label: String(n.data?.label ?? ""),
    position: n.position,
  }));
}

function fromReactFlowEdges(rfEdges: Edge[]): FlowEdge[] {
  return rfEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));
}

/** 노드·엣지가 바뀌면 뷰포트를 맞춘다 (CRUD 프리셋 등) */
function FitViewWhenNodesChange({ count }: { count: number }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (count === 0) return;
    const timer = window.setTimeout(() => {
      fitView({ padding: 0.2, duration: 200 });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [count, fitView]);

  return null;
}

function FlowchartCanvas({ nodes, edges, onChange, onApplyCrudPreset }: Props) {
  const { screenToFlowPosition } = useReactFlow();
  const syncingFromParent = useRef(false);
  const isDragging = useRef(false);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const stableLabelChange = useCallback((id: string, label: string) => {
    labelChangeImplRef.current(id, label);
  }, []);

  const labelChangeImplRef = useRef<(id: string, label: string) => void>(() => {});

  const externalNodes = useMemo(
    () => toReactFlowNodes(nodes, stableLabelChange),
    [nodes, stableLabelChange],
  );
  const externalEdges = useMemo(() => toReactFlowEdges(edges), [edges]);

  const [rfNodes, setRfNodes] = useNodesState(externalNodes);
  const [rfEdges, setRfEdges] = useEdgesState(externalEdges);

  const rfNodesRef = useRef(rfNodes);
  rfNodesRef.current = rfNodes;

  labelChangeImplRef.current = (id: string, label: string) => {
    const nextRf = rfNodesRef.current.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, label } } : n,
    );
    rfNodesRef.current = nextRf;
    setRfNodes(nextRf);
    onChangeRef.current(fromReactFlowNodes(nextRf), edgesRef.current);
  };

  // 구조(id·연결) 변경만 동기화 — 위치는 드래그 중 내부 state가 담당 (재동기화 시 노드 깜빡임 방지)
  const externalKey = useMemo(
    () =>
      [
        nodes.map((n) => `${n.id}:${n.type}:${n.label}`).join("|"),
        edges.map((e) => `${e.id}:${e.source}->${e.target}`).join("|"),
      ].join("||"),
    [nodes, edges],
  );
  const prevExternalKey = useRef(externalKey);

  useEffect(() => {
    if (prevExternalKey.current === externalKey || isDragging.current) return;
    prevExternalKey.current = externalKey;
    syncingFromParent.current = true;
    setRfNodes(externalNodes);
    setRfEdges(externalEdges);
    rfNodesRef.current = externalNodes;
    syncingFromParent.current = false;
  }, [externalKey, externalNodes, externalEdges, setRfNodes, setRfEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const onlyMeta = changes.every(
        (c) => c.type === "select" || c.type === "dimensions",
      );
      const next = applyNodeChanges(changes, rfNodesRef.current);
      rfNodesRef.current = next;
      setRfNodes(next);
      if (!syncingFromParent.current && !onlyMeta) {
        onChange(fromReactFlowNodes(next), edges);
      }
    },
    [edges, onChange, setRfNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const next = applyEdgeChanges(changes, rfEdges);
      setRfEdges(next);
      if (!syncingFromParent.current) {
        onChange(nodes, fromReactFlowEdges(next));
      }
    },
    [rfEdges, nodes, onChange, setRfEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const next = addEdge(
        {
          ...connection,
          id: createFlowEdgeId(connection.source, connection.target),
          style: { stroke: "var(--accent)", strokeWidth: 2 },
        },
        rfEdges,
      );
      setRfEdges(next);
      onChange(nodes, fromReactFlowEdges(next));
    },
    [rfEdges, nodes, onChange, setRfEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData(
        FLOW_DND_MIME,
      ) as FlowNodeType;
      if (!nodeType || !FLOW_NODE_DEFAULT_LABELS[nodeType]) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: FlowNode = {
        id: createFlowNodeId(),
        type: nodeType,
        label: FLOW_NODE_DEFAULT_LABELS[nodeType],
        position,
      };

      onChange([...nodes, newNode], edges);
    },
    [nodes, edges, onChange, screenToFlowPosition],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const ids = new Set(deleted.map((n) => n.id));
      onChange(
        nodes.filter((n) => !ids.has(n.id)),
        edges.filter((e) => !ids.has(e.source) && !ids.has(e.target)),
      );
    },
    [nodes, edges, onChange],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const ids = new Set(deleted.map((e) => e.id));
      onChange(
        nodes,
        edges.filter((e) => !ids.has(e.id)),
      );
    },
    [nodes, edges, onChange],
  );

  const handleClear = useCallback(() => {
    onChange([], []);
  }, [onChange]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onApplyCrudPreset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/35 bg-accent-soft/40 px-3 py-2 text-xs font-medium text-fg transition-colors hover:bg-accent-soft/70"
        >
          <Sparkles className="size-3.5 text-accent" aria-hidden />
          ✨ 기본 불러오기
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={nodes.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-fg transition-colors hover:border-warn/40 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-3.5 text-muted" aria-hidden />
          초기화
        </button>
        <p className="text-xs text-muted">
          아래 팔레트를 캔버스로 드래그 · 더블클릭 이름 편집 · 핸들로 연결 ·
          Delete 키로 삭제
        </p>
      </div>

      <div
        aria-label="노드 팔레트"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5"
      >
        {FLOW_NODE_PALETTE.map(({ type, label, hint }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(FLOW_DND_MIME, type);
              e.dataTransfer.effectAllowed = "move";
            }}
            title={hint}
            className="flex min-h-[2.75rem] cursor-grab items-center justify-center rounded-lg border border-line bg-surface-2 px-3 py-2 text-center text-xs leading-snug text-fg active:cursor-grabbing hover:border-accent/40"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="h-[320px] min-h-[280px] w-full overflow-hidden rounded-lg border border-line bg-bg">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={flowNodeTypes as NodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStart={() => {
            isDragging.current = true;
          }}
          onNodeDragStop={() => {
            isDragging.current = false;
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          elevateNodesOnSelect
          proOptions={{ hideAttribution: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <Background color="var(--border)" gap={16} />
          <Controls className="!border-line !bg-surface-2 !shadow-none [&>button]:!border-line [&>button]:!bg-surface-2 [&>button]:!fill-fg" />
          <FitViewWhenNodesChange count={rfNodes.length} />
        </ReactFlow>
      </div>
    </div>
  );
}

/** Step 1 업무 흐름도 에디터 (Plan Phase 4) */
export function FlowchartEditor(props: Props) {
  return (
    <ReactFlowProvider>
      <FlowchartCanvas {...props} />
    </ReactFlowProvider>
  );
}
