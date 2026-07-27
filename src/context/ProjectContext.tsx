"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SaveStatus } from "@/components/layout/SaveIndicator";
import type {
  ChoiceFieldPath,
  ChoiceValue,
  FlowEdge,
  FlowNode,
  ProjectState,
  WireframeItem,
} from "@/lib/types/project";
import { SAVE_DEBOUNCE_MS, STORAGE_KEY } from "@/lib/project/constants";
import { createInitialState } from "@/lib/project/defaults";
import { projectReducer, type ProjectAction } from "@/lib/project/reducer";
import { useMounted } from "@/hooks/useMounted";

type ProjectContextValue = {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  hydrated: boolean;
  saveStatus: SaveStatus;
  setChoice: (path: ChoiceFieldPath, value: ChoiceValue) => void;
  setBasicText: (field: "serviceName" | "oneLiner", value: string) => void;
  applyStep2Defaults: () => void;
  setFlowchart: (nodes: FlowNode[], edges: FlowEdge[]) => void;
  setFlowchartDeliveryNotes: (notes: string) => void;
  applyCrudFlowPreset: () => void;
  setWireframe: (items: WireframeItem[]) => void;
  setWireframeDeliveryNotes: (notes: string) => void;
  applyDashboardWireframePreset: () => void;
  setOutputOption: (
    field: "includeToolAppendix" | "targetAgents",
    value: boolean | string[],
  ) => void;
  resetProject: () => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [state, dispatch] = useReducer(
    projectReducer,
    undefined,
    createInitialState,
  );
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const skipNextSave = useRef(true);

  // LocalStorage에서 복원
  useEffect(() => {
    if (!mounted) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as ProjectState });
      }
    } catch {
      // 손상된 저장값은 무시하고 기본값 사용
    }

    setHydrated(true);
  }, [mounted]);

  // 상태 변경 시 500ms 디바운스 저장 (Plan 5-4)
  useEffect(() => {
    if (!hydrated) return;

    if (skipNextSave.current) {
      skipNextSave.current = false;
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("idle");
      }
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [state, hydrated]);

  const setChoice = useCallback((path: ChoiceFieldPath, value: ChoiceValue) => {
    dispatch({ type: "SET_CHOICE", path, value });
  }, []);

  const setBasicText = useCallback(
    (field: "serviceName" | "oneLiner", value: string) => {
      dispatch({ type: "SET_BASIC_TEXT", field, value });
    },
    [],
  );

  const applyStep2Defaults = useCallback(() => {
    dispatch({ type: "APPLY_STEP2_DEFAULTS" });
  }, []);

  const setFlowchart = useCallback((nodes: FlowNode[], edges: FlowEdge[]) => {
    dispatch({ type: "SET_FLOWCHART", nodes, edges });
  }, []);

  const setFlowchartDeliveryNotes = useCallback((notes: string) => {
    dispatch({ type: "SET_FLOWCHART_DELIVERY_NOTES", notes });
  }, []);

  const applyCrudFlowPreset = useCallback(() => {
    dispatch({ type: "APPLY_CRUD_FLOW_PRESET" });
  }, []);

  const setWireframe = useCallback((items: WireframeItem[]) => {
    dispatch({ type: "SET_WIREFRAME", items });
  }, []);

  const setWireframeDeliveryNotes = useCallback((notes: string) => {
    dispatch({ type: "SET_WIREFRAME_DELIVERY_NOTES", notes });
  }, []);

  const applyDashboardWireframePreset = useCallback(() => {
    dispatch({ type: "APPLY_DASHBOARD_WIREFRAME_PRESET" });
  }, []);

  const setOutputOption = useCallback(
    (
      field: "includeToolAppendix" | "targetAgents",
      value: boolean | string[],
    ) => {
      dispatch({ type: "SET_OUTPUT", field, value });
    },
    [],
  );

  const resetProject = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      hydrated,
      saveStatus,
      setChoice,
      setBasicText,
      applyStep2Defaults,
      setFlowchart,
      setFlowchartDeliveryNotes,
      applyCrudFlowPreset,
      setWireframe,
      setWireframeDeliveryNotes,
      applyDashboardWireframePreset,
      setOutputOption,
      resetProject,
    }),
    [
      state,
      hydrated,
      saveStatus,
      setChoice,
      setBasicText,
      applyStep2Defaults,
      setFlowchart,
      setFlowchartDeliveryNotes,
      applyCrudFlowPreset,
      setWireframe,
      setWireframeDeliveryNotes,
      applyDashboardWireframePreset,
      setOutputOption,
      resetProject,
    ],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject는 ProjectProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
