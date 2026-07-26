import type { Option } from "@/lib/types/project";

/** Phase 1 데모·이후 Step 폼에서 공통으로 쓰는 선택지 프리셋 */

/** 서비스 분야 — 추천(✨) 배지 없음 → 최초 미선택 상태 */
export const DOMAIN_OPTIONS: Option[] = [
  {
    id: "general-it",
    label: "일반 IT / 업무 도구",
    hint: "내부 업무, 대시보드, 관리 화면 등",
  },
  {
    id: "finance",
    label: "금융 · 회계",
    hint: "결제, 장부, 세금 관련 서비스",
  },
  {
    id: "public",
    label: "공공 · 행정",
    hint: "민원, 공공 데이터, 행정 업무",
  },
  {
    id: "healthcare",
    label: "헬스케어",
    hint: "건강 기록, 병원·클리닉 업무",
  },
  {
    id: "commerce",
    label: "커머스 · 쇼핑",
    hint: "상품 판매, 주문, 재고 관리",
  },
];

export const SENSITIVE_DATA_OPTIONS: Option[] = [
  {
    id: "none",
    label: "민감 데이터 없음",
    hint: "일반적인 공개·업무 정보만 다룹니다",
    recommended: true,
  },
  {
    id: "included",
    label: "민감 데이터 포함",
    hint: "개인정보, 금융, 의료 등 규제 대상 데이터",
  },
];

export const APP_TYPE_OPTIONS: Option[] = [
  {
    id: "nextjs-web",
    label: "Next.js 웹앱 (App Router + Tailwind)",
    hint: "모던 웹앱. 정적 배포도 가능",
    recommended: true,
  },
  {
    id: "static-site",
    label: "정적 웹사이트",
    hint: "로그인 없이 보여주기만 하는 페이지",
  },
  {
    id: "mobile-web",
    label: "모바일 친화 웹앱",
    hint: "휴대폰 화면에 맞춘 반응형 웹",
  },
];

export const STORAGE_OPTIONS: Option[] = [
  {
    id: "localstorage",
    label: "내 브라우저에 저장 (LocalStorage)",
    hint: "서버·회원가입·비용 없이 즉시 동작",
    recommended: true,
  },
  {
    id: "indexeddb",
    label: "브라우저 대용량 저장 (IndexedDB)",
    hint: "파일·이미지 등 큰 데이터를 브라우저에",
  },
  {
    id: "cloud",
    label: "클라우드 DB (Firebase 등)",
    hint: "여러 기기에서 같은 데이터를 쓰려면",
  },
];

export const ROLE_OPTIONS: Option[] = [
  {
    id: "fullstack-senior",
    label: "친절하고 유능한 수석 풀스택 개발자",
    recommended: true,
  },
  {
    id: "frontend-focus",
    label: "UI/UX에 강한 프론트엔드 개발자",
  },
  {
    id: "backend-focus",
    label: "안정적인 백엔드·데이터 설계 전문가",
  },
];

export const GUARDRAIL_OPTIONS: Option[] = [
  { id: "g1", label: "UTF-8 인코딩 · 크로스 플랫폼", recommended: true },
  { id: "g2", label: "패키지 버전 충돌 방지", recommended: true },
  { id: "g3", label: "오픈소스 · 무료 우선", recommended: true },
  { id: "g4", label: "와이어프레임 · 명세 엄격 준수", recommended: true },
  { id: "g5", label: "작업 단위 쪼개기", recommended: true },
  { id: "g6", label: "기존 코드 보호", recommended: true },
  { id: "g7", label: "에러 대응 절차", recommended: true },
  { id: "g8", label: "패키지 설치 승인", recommended: true },
  { id: "g9", label: "비개발자 친화적 설명", recommended: true },
  // G10: 민감 데이터 선택 시에만 자동 체크·잠금 (Plan 6-3)
  { id: "g10", label: "보안 및 규정 준수" },
  { id: "g11", label: "Agent 범용성 (표준 Markdown)" },
  { id: "g12", label: "배포 · 소스 보호" },
];

export const INPUT_OPTIONS: Option[] = [
  { id: "text-form", label: "텍스트 폼 입력", hint: "이름, 설명 등 직접 타이핑" },
  { id: "csv-excel", label: "CSV · Excel 업로드", hint: "표 형태 파일을 올려서 처리" },
  {
    id: "file-upload",
    label: "이미지 · 문서 첨부",
    hint: "PDF, 이미지 등 파일 업로드",
  },
];

export const OUTPUT_TYPE_OPTIONS: Option[] = [
  { id: "summary-cards", label: "요약 카드 (KPI)", recommended: true },
  { id: "data-table", label: "데이터 테이블" },
  { id: "charts", label: "차트 · 그래프" },
  { id: "pdf-report", label: "PDF 리포트" },
];

export const EMPTY_STATE_OPTIONS: Option[] = [
  { id: "message", label: "안내 문구 표시", hint: "데이터가 없을 때 설명 텍스트" },
  {
    id: "cta-button",
    label: "등록 유도 버튼",
    hint: "첫 데이터를 추가하도록 버튼 제공",
  },
];

export const ERROR_STATE_OPTIONS: Option[] = [
  {
    id: "toast",
    label: "토스트 알림",
    hint: "화면 구석에 잠깐 뜨는 알림",
  },
  {
    id: "error-banner",
    label: "상단 에러 배너",
    hint: "화면 위쪽에 붉은색 경고 줄",
  },
];

export const TARGET_AGENT_OPTIONS: Option[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude Code" },
  { id: "windsurf", label: "Windsurf" },
  { id: "lovable", label: "Lovable" },
  { id: "bolt", label: "Bolt.new" },
];
