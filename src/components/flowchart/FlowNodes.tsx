"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

type FlowNodeData = {
  label: string;
  nodeType: string;
  onLabelChange?: (id: string, label: string) => void;
};

function readNodeData(data: NodeProps["data"]): FlowNodeData {
  const raw = (data ?? {}) as Partial<FlowNodeData>;
  return {
    label: raw.label ?? "",
    nodeType: raw.nodeType ?? "page",
    onLabelChange: raw.onLabelChange,
  };
}

const HANDLE =
  "!h-2 !w-2 !border-line !bg-accent group-[.selected]:!bg-accent";

function BaseFlowNode({
  id,
  data,
  selected,
  shape,
  className,
}: NodeProps & {
  shape: "pill" | "rect" | "diamond" | "db";
  className: string;
}) {
  const nodeData = readNodeData(data);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(nodeData.label);

  useEffect(() => {
    setDraft(nodeData.label);
  }, [nodeData.label]);

  const commit = useCallback(() => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== nodeData.label) {
      nodeData.onLabelChange?.(id, trimmed);
    } else {
      setDraft(nodeData.label);
    }
  }, [nodeData, draft, id]);

  const shapeClass =
    shape === "pill"
      ? "rounded-full px-4 py-2"
      : shape === "diamond"
        ? "rotate-45 px-4 py-4"
        : shape === "db"
          ? "rounded-lg px-4 py-2 border-b-4 border-accent/40"
          : "rounded-lg px-4 py-2";

  return (
    <div
      className={`group min-w-[88px] border-2 text-center text-xs font-medium transition-colors ${shapeClass} ${className} ${
        selected ? "border-accent shadow-[0_0_0_2px_var(--accent-soft)]" : "border-line"
      }`}
      onDoubleClick={() => setEditing(true)}
    >
      <Handle type="target" position={Position.Left} className={HANDLE} />
      {shape === "diamond" ? (
        <div className="-rotate-45 min-w-[72px]">
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(nodeData.label);
                  setEditing(false);
                }
              }}
              className="w-full rounded border border-line bg-surface px-1 py-0.5 text-xs text-fg"
            />
          ) : (
            nodeData.label
          )}
        </div>
      ) : editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(nodeData.label);
              setEditing(false);
            }
          }}
          className="w-full rounded border border-line bg-surface px-1 py-0.5 text-xs text-fg"
        />
      ) : (
        nodeData.label
      )}
      <Handle type="source" position={Position.Right} className={HANDLE} />
    </div>
  );
}

export function StartFlowNode(props: NodeProps) {
  return (
    <BaseFlowNode
      {...props}
      shape="pill"
      className="bg-accent-soft text-accent"
    />
  );
}

export function PageFlowNode(props: NodeProps) {
  return (
    <BaseFlowNode
      {...props}
      shape="rect"
      className="bg-surface-2 text-fg"
    />
  );
}

export function DatabaseFlowNode(props: NodeProps) {
  return (
    <BaseFlowNode
      {...props}
      shape="db"
      className="bg-surface-2 text-fg"
    />
  );
}

export function DecisionFlowNode(props: NodeProps) {
  return (
    <BaseFlowNode
      {...props}
      shape="diamond"
      className="bg-warn/15 text-fg"
    />
  );
}

export function EndFlowNode(props: NodeProps) {
  return (
    <BaseFlowNode
      {...props}
      shape="pill"
      className="bg-surface-2 text-muted"
    />
  );
}

export const flowNodeTypes = {
  start: StartFlowNode,
  page: PageFlowNode,
  database: DatabaseFlowNode,
  decision: DecisionFlowNode,
  end: EndFlowNode,
};
