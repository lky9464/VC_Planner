import type { ChoiceFieldPath, ChoiceValue, ProjectState } from "@/lib/types/project";

/** 중첩 객체에서 ChoiceValue 필드를 읽는다 */
export function getChoiceValue(
  state: ProjectState,
  path: ChoiceFieldPath,
): ChoiceValue {
  const [group, field] = path.split(".") as [keyof ProjectState, string];
  const section = state[group];

  if (section && typeof section === "object" && field in section) {
    return (section as Record<string, ChoiceValue>)[field];
  }

  throw new Error(`Unknown choice path: ${path}`);
}

/** 중첩 객체에 ChoiceValue 필드를 쓴다 */
export function setChoiceValue(
  state: ProjectState,
  path: ChoiceFieldPath,
  value: ChoiceValue,
): ProjectState {
  const [group, field] = path.split(".") as [keyof ProjectState, string];
  const section = state[group];

  if (!section || typeof section !== "object") {
    throw new Error(`Unknown choice path: ${path}`);
  }

  return {
    ...state,
    meta: { ...state.meta, updatedAt: new Date().toISOString() },
    [group]: {
      ...section,
      [field]: value,
    },
  };
}
