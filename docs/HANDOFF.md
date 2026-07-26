# VC Planner — 세션 인수인계 (HANDOFF)

> **작성일**: 2026-07-26  
> **기준 문서**: `Plan.md` v1.1 (Single Source of Truth)  
> **저장소**: https://github.com/lky9464/VC_Planner  
> **직전 커밋**: Phase 0 골격 → **이번 커밋**: Phase 1~5 구현

---

## 1. 한 줄 요약

비개발자용 AI Agent 명세서 작성 위저드(VC Planner)에서 **Phase 0~5**까지 구현을 완료했다.  
Step 1~3 입력, 플로우차트(Mermaid), 와이어프레임(ASCII), 실시간 `Prompt.md` 미리보기, LocalStorage 자동 저장까지 동작한다.  
**Phase 5 브라우저 DoD 확인은 다음 세션에서 진행** 예정이다.

---

## 2. Phase 진행 현황

| Phase | 내용 | 상태 | 비고 |
|-------|------|------|------|
| 0 | Next.js 골격, Static Export, 레이아웃 셸 | ✅ 완료 | 초기 커밋 |
| 1 | ChoiceGroup, Context, LocalStorage | ✅ 완료 | |
| 2 | Step 1 폼, 미리보기, G10 연동 | ✅ 완료 | |
| 3 | Step 2·3, 가드레일, 기술 스택 섹션 | ✅ 완료 | |
| 4 | Flowchart 에디터, Mermaid 직렬화 | ✅ 완료 | 사용자 DoD 확인 완료 |
| 5 | Wireframe 에디터, ASCII 직렬화 | ✅ 코드 완료 | **DoD 확인 예정** |
| 6 | Step 4 출력(복사·다운로드) | ⏳ 대기 | |
| 7 | PDF 리포트 | ⏳ 대기 | |
| 8 | 배포·라이선스·소스 보호 | ⏳ 대기 | |

---

## 3. 이번 세션에서 구현한 기능

### Phase 1 — 공통 입력

- `ChoiceGroup`: 라디오 / 체크박스 / 드롭다운, 직접 입력, AI 위임 토글, 추천 배지, 툴팁
- `ProjectContext` + `useReducer` 전역 상태
- LocalStorage 키 `vc-planner:project:v1`, 500ms 디바운스 저장, 헤더 「저장됨 ✓」

### Phase 2 — Step 1 폼 + 미리보기

- 기본 정보(서비스명, 한 줄 설명, 분야, 민감 데이터)
- 입출력 데이터, 예외 상황
- `generatePromptMarkdown()` 1차 + 우측 실시간 미리보기
- 민감 데이터 선택 → Step 3 G10(보안) 자동 체크·잠금

### Phase 3 — Step 2 & Step 3

- 앱 형태·저장 방식 선택, 「✨ 잘 모르겠어요 (기본값 적용)」
- AI 역할, G1~G12 가드레일 체크리스트, 「➕ 가드레일 직접 추가」
- 미리보기 4장(기술 스택), 5장(가드레일) 반영
- 하이드레이션 시 G1~G9 기본 체크 보정(`ensureRecommendedGuardrails`)

### Phase 4 — Flowchart 에디터

- 패키지: `@xyflow/react@12.11.2`
- 5종 노드(시작 / 기능·페이지 / DB / 조건 분기 / 종료), 팔레트 드래그, 연결, Delete 삭제
- 「✨ 기본 불러오기」(CRUD 프리셋), 「초기화」
- 더블클릭 이름 편집, 분기 시 텍스트 흐름 전체 연결 목록
- 미리보기 3-1: 텍스트 흐름 + Mermaid `flowchart TD`

### Phase 5 — Wireframe 에디터

- 패키지: `react-grid-layout@2.2.3` (v2 API, `useContainerWidth`)
- 8종 팔레트(네비·사이드바·검색·테이블·KPI·버튼·차트·직접 입력)
- 클릭 추가, 드래그·리사이즈, 더블클릭 라벨 편집, Delete 삭제
- 「✨ 기본 불러오기」(Plan 6-1 대시보드 레이아웃), 「초기화」
- 미리보기 3-2: ASCII 박스 도식 + 컴포넌트 목록 Markdown 표

---

## 4. 주요 파일 구조

```
src/
├── app/                    # Next.js App Router, globals.css
├── components/
│   ├── flowchart/        # FlowchartEditor, FlowNodes
│   ├── wireframe/        # WireframeEditor, WireframeBlock
│   ├── inputs/           # ChoiceGroup, TextField, HintTooltip
│   ├── layout/           # PlannerShell, Header, BottomNav, SaveIndicator …
│   ├── preview/          # PreviewPane (Prompt.md / Agent Rules 탭)
│   └── steps/            # StepBody, StepCard
├── context/              # ProjectContext
├── hooks/                # useMounted (하이드레이션 가드)
└── lib/
    ├── flowchart/        # constants, crud-preset, serialize (Mermaid)
    ├── wireframe/        # constants, dashboard-preset, serialize (ASCII)
    ├── markdown/         # generate-prompt, render-choice, render-guardrails …
    ├── options/          # presets (선택지 정의)
    ├── project/          # reducer, defaults, choice-path, constants
    ├── types/            # ProjectState, WireframeItem, FlowNode …
    └── validation/       # completion (Step 완료 검증)
```

---

## 5. 의존성 (Plan 3장 기준)

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next | 15.5.22 | App Router, Static Export |
| react / react-dom | 19.1.0 | UI |
| @xyflow/react | ^12.11.2 | 업무 흐름도 |
| react-grid-layout | ^2.2.3 | 와이어프레임 |
| lucide-react | ^1.27.0 | 아이콘 |
| tailwindcss | ^4 | 스타일 |

---

## 6. 로컬 실행

```powershell
cd VC_Planner
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 정적 산출물 (Static Export)
```

**주의**

- `npm run build` 직후 실행 중인 `npm run dev`는 `.next` 충돌로 500이 날 수 있다 → dev 서버 재시작.
- 코드 변경 후 사용자 확인 요청 시: dev 재시작 후 DoD 체크리스트 안내 (`.cursor/rules/verify-browser.mdc`).

---

## 7. 다음 세션 — Phase 5 DoD 확인 체크리스트

Step 1 → **화면 구성 (와이어프레임)**:

1. 「✨ 기본 불러오기」 → 5블록 배치 + 우측 3-2 ASCII 도식
2. 팔레트 클릭 → 블록 추가, 드래그·모서리로 위치·크기 조절
3. 블록 더블클릭 → 이름 변경 → 캔버스·3-2 반영
4. 블록 선택 + Delete → 삭제
5. 새로고침 → LocalStorage 복원
6. 블록 이동·크기 변경 → ASCII 도식 형태가 따라 바뀜

확인 후 Phase 6(Step 4 출력: 복사·md/txt 다운로드·Agent 규칙 파일) 착수.

---

## 8. Phase 6 이후 로드맵 (Plan 7장)

| Phase | 핵심 |
|-------|------|
| 6 | Prompt.md 최종 조립, 위임 배너, 복사·다운로드 (UTF-8 BOM 없음) |
| 7 | html2pdf.js PDF, 인쇄 전용 레이아웃 |
| 8 | Cloudflare Pages 배포, LICENSE(BUSL-1.1), 소스맵 비활성 확인 |

새 패키지(`html2pdf.js` 등) 설치 전 **G8 승인** 필요.

---

## 9. 가드레일 준수 메모

- **[G10]** 외부 네트워크 요청 0건 — 클라이언트 전용, LocalStorage만 사용
- **[G12]** API Routes·서버 액션·ISR 미사용, `output: 'export'` 유지
- **[G1]** 소스 UTF-8(BOM 없음), Markdown Blob도 BOM 없이 저장 예정(Phase 6)
- **[G11]** 생성 Prompt.md 본문은 도구 비종속 CommonMark

---

## 10. 데이터 스키마 (LocalStorage)

키: `vc-planner:project:v1`

주요 필드: `basic`, `flowchart`, `wireframe`, `dataIO`, `edgeCases`, `tech`, `agentRules`, `output`  
타입 정의: `src/lib/types/project.ts`

---

_이 문서는 VC Planner 개발 세션 인수인계용이며, 명세 변경 시 `Plan.md`를 우선한다._
