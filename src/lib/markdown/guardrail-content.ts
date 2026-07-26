/** Prompt.md 5장·Agent 규칙 파일에 쓸 G1~G12 본문 (Plan 1-2 / AGENTS.md) */
export type GuardrailEntry = {
  id: string;
  title: string;
  body: string;
};

export const GUARDRAIL_ENTRIES: GuardrailEntry[] = [
  {
    id: "g1",
    title: "[G1] 인코딩 & 크로스 플랫폼 호환성 (UTF-8 필수)",
    body:
      "모든 소스 파일은 UTF-8(BOM 없음, LF)로 저장합니다. 파일 생성·다운로드·클립보드 복사에서 한글이 깨지지 않게 하고, " +
      "경로 구분자를 하드코딩하지 않습니다. 개발 환경은 Windows이므로 명령은 PowerShell 기준으로 작성합니다.",
  },
  {
    id: "g2",
    title: "[G2] 패키지 버전 충돌 방지",
    body:
      "React / Next.js 메이저 버전과 호환이 검증된 조합만 설치합니다. " +
      "`--legacy-peer-deps`나 `--force`로 경고를 덮지 않습니다. 충돌이 나면 우회하지 말고 원인을 보고하세요.",
  },
  {
    id: "g3",
    title: "[G3] 오픈소스 & 무료 우선",
    body: "전 구성요소를 오픈소스/무료로 구성합니다. 유료 요소가 필요하면 착수 전에 사유를 설명하고 승인을 받으세요.",
  },
  {
    id: "g4",
    title: "[G4] 와이어프레임 & 명세서 엄격 준수",
    body:
      "명세서에 정의된 화면 구성·데이터 항목·예외 처리를 임의로 바꾸지 않습니다. " +
      "변경이 필요하면 먼저 제안하고 승인 후 명세를 갱신하세요.",
  },
  {
    id: "g5",
    title: "[G5] 작업 단위 쪼개기",
    body:
      "한 번에 전체를 구현하지 않습니다. `기본 틀 → 기능 1개 추가 → 동작 확인` 순으로 진행하며, " +
      "명세서의 Phase 경계를 넘지 않습니다.",
  },
  {
    id: "g6",
    title: "[G6] 기존 코드 보호",
    body: "파일 전체 재작성을 금지합니다. 수정이 필요한 부분만 부분 편집합니다.",
  },
  {
    id: "g7",
    title: "[G7] 에러 대응 절차",
    body:
      "에러가 나면 바로 코드를 고치지 않습니다. ① 원인 설명 → ② 수정 계획 제시 → ③ 코드 작성 순서를 지킵니다.",
  },
  {
    id: "g8",
    title: "[G8] 패키지 설치 승인",
    body: "새 패키지 설치 전 반드시 이유를 설명하고 승인을 받습니다.",
  },
  {
    id: "g9",
    title: "[G9] 비개발자 친화적 대화",
    body: "전문 용어 대신 쉬운 말로 설명하고, 핵심 로직에는 한국어 주석을 답니다.",
  },
  {
    id: "g10",
    title: "[G10] 보안 및 규정 준수",
    body:
      "API 키·비밀값을 코드에 하드코딩하지 않습니다. 사용자 입력이 브라우저 밖으로 나가지 않도록 유지합니다. " +
      "외부 네트워크 요청이 필요하면 먼저 확인을 받으세요.",
  },
  {
    id: "g11",
    title: "[G11] Agent 범용성 (도구 비종속)",
    body:
      "생성되는 명세서는 표준 Markdown(CommonMark)으로만 구성합니다. " +
      "특정 도구 전용 문법(`@file`, `@Codebase` 등)을 본문에 쓰지 않고, 필요하면 부록으로 분리합니다.",
  },
  {
    id: "g12",
    title: "[G12] 배포 & 소스 보호",
    body:
      "Cloudflare Pages(Static Export)에 그대로 올릴 수 있는 구성을 유지합니다. " +
      "API Routes, 서버 액션, 미들웨어, ISR/`revalidate` 등 서버 런타임 의존 코드를 추가하지 않습니다.",
  },
];

export function getGuardrailEntry(id: string): GuardrailEntry | undefined {
  return GUARDRAIL_ENTRIES.find((e) => e.id === id);
}
