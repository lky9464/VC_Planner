"use client";

import { useEffect, useState } from "react";

/** SSR과 LocalStorage 복원 사이의 하이드레이션 불일치를 줄이기 위한 가드 (Plan 3-4) */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
