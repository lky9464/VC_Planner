# VC Planner — 세션 인수인계 (HANDOFF)

> **작성일**: 2026-07-27  
> **기준 문서**: `Plan.md` v1.2 (Single Source of Truth)  
> **저장소**: https://github.com/lky9464/VC_Planner  
> **직전 커밋**: Phase 1~5 초기 구현 → **이번 커밋**: Phase 5 마감(와이어프레임 개편·UX 안내·Plan v1.2)

---

## 1. 한 줄 요약

비개발자용 AI Agent 명세서 작성 위저드(VC Planner)에서 **Phase 0~5**까지 구현·DoD 확인을 **완료**했다.  
Phase 5 후속으로 와이어프레임 팔레트를 5종으로 단순화하고, **대표 화면 1장**·**업무 흐름도 작성 요령** UI를 추가했다.  
**다음 세션: Phase 6**(Step 4 출력 — 복사·다운로드) 착수.

---

## 2. Phase 진행 현황

| Phase | 내용 | 상태 | 비고 |
|-------|------|------|------|
| 0 | Next.js 골격, Static Export, 레이아웃 셸 | ✅ 완료 | |
| 1 | ChoiceGroup, Context, LocalStorage | ✅ 완료 | |
| 2 | Step 1 폼, 미리보기, G10 연동 | ✅ 완료 | |
| 3 | Step 2·3, 가드레일, 기술 스택 섹션 | ✅ 완료 | |
| 4 | Flowchart 에디터, Mermaid 직렬화 | ✅ 완료 | 작성 요령 UI 추가 |
| 5 | Wireframe 에디터, ASCII 직렬화 | ✅ **완료** | DoD 확인 완료 (2026-07-27) |
| 6 | Step 4 출력(복사·다운로드) | ⏳ **다음** | |
| 7 | PDF 리포트 | ⏳ 대기 | |
| 8 | 배포·라이선스·소스 보호 | ⏳ 대기 | |

---

## 3. 이번 세션(2026-07-27) 작업 요약

### Phase 5 마감 — 와이어프레임 개편

| 항목 | 변경 |
|------|------|
| 팔레트 | 8종 → **5종** (`navbar` / `sidebar` / `search` / **`content`** / `custom`) |
| 제거 | `table`, `kpi`, `buttons`, `chart` |
| 추가 | **`content`(화면별 컨텐츠)** — 목록·폼·차트 등 본문을 하나로 표현 |
| 기본 불러오기 | 공통 화면 틀: 네비(12×1) + 사이드바(3×5) + 검색(9×1) + 컨텐츠(9×4) |
| LocalStorage | 구 타입 복원 시 `content`로 자동 보정 (`normalizeWireframeItems`) |
| Prompt.md | 3-2 제목 `화면 구성 (대표 1장)`, 서두 역할 설명 자동 삽입 |

### UX — 작성 요령 UI (비전문가 대상)

- **업무 흐름도**: 모든 화면·이동·DB 연결 안내, 페이지 2개↑ 시 와이어프레임 교차 안내
- **대표 화면 레이아웃**: 대표 1장만 그리면 됨 안내, 흐름도 페이지 수 연동 배너
- **업무 흐름도** 미리보기 3-1 서두: 흐름도 역할 설명 1문장

### Plan.md v1.2

- 5-3 타입 스키마, 6-1 1-2·1-3, Phase 4·5, 11-2(3-2) 반영
- UI 안내·교차 연동·DoD 확인 완료 기록

### 개발 환경 (로컬 전용, Git 미포함)

- `.cursor/hooks/` — 코드 편집 후 dev 서버 자동 재시작
- `.cursor/rules/auto-restart-dev.mdc`
- `start-dev-server.bat`, `restart-dev-server.bat` — `.gitignore` 처리

---

## 4. Phase 5 DoD 확인 결과 (2026-07-27)

| # | 항목 | 결과 |
|---|------|------|
| 1 | ✨ 기본 불러오기 → 4블록(네비·사이드바·검색·화면별 컨텐츠) + 3-2 ASCII | ✅ |
| 2 | 팔레트 클릭 → 추가, 드래그·리사이즈 | ✅ |
| 3 | 더블클릭 이름 변경 → 캔버스·3-2 반영 | ✅ |
| 4 | Delete 삭제 | ✅ |
| 5 | 새로고침 → LocalStorage 복원 | ✅ |
| 6 | 블록 이동·크기 변경 → ASCII 형태 연동 | ✅ |

---

## 5. 주요 파일 (Phase 5 관련)

```
src/
├── components/
│   ├── flowchart/FlowchartEditor.tsx   # 작성 요령 UI
│   ├── wireframe/WireframeEditor.tsx   # 작성 요령 UI, flowchartPageCount 연동
│   └── steps/StepBody.tsx              # 섹션 제목 변경
└── lib/
    ├── wireframe/
    │   ├── constants.ts                # 5종 팔레트, normalizeWireframeItems
    │   ├── dashboard-preset.ts         # 공통 화면 틀 좌표
    │   └── serialize.ts                # 3-2 서두 문구
    ├── flowchart/serialize.ts          # 3-1 서두 문구
    ├── markdown/generate-prompt.ts     # 3-2 섹션 제목
    ├── project/reducer.ts              # hydrate 시 wireframe 보정
    └── types/project.ts                # WireframeItem.type
```

---

## 6. 로컬 실행

```powershell
cd VC_Planner
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 정적 산출물
```

**주의**

- `npm run build` 직후 dev 서버 재시작 필요 (500 방지).
- Windows: `.bat` 파일 더블클릭 또는 `npm run dev`.

---

## 7. 다음 세션 — Phase 6 착수

Plan.md 6-4 · Phase 6 DoD 기준:

1. `Prompt.md` 최종 조립 (11장 표준 구조)
2. `[📋 전체 프롬프트 복사]` / `[📄 Agent 규칙 파일 복사]`
3. `[💾 txt/md 다운로드]` — UTF-8, **BOM 없음** [G1]
4. 위임(`delegated`) 항목 → 위임 지시문 + 상단 요약 배너
5. **DoD**: 메모장·VS Code에서 한글 깨짐 없음, 도구 전용 문법 본문 미혼입 [G11]

새 패키지 설치 전 **G8 승인** 필요.

---

## 8. Phase 7~8 로드맵

| Phase | 핵심 |
|-------|------|
| 7 | html2pdf.js PDF, 인쇄 전용 레이아웃 |
| 8 | Cloudflare Pages 배포, LICENSE(BUSL-1.1), 소스맵 비활성 확인 |

---

## 9. 가드레일 준수 메모

- **[G10]** 외부 네트워크 0건 — 클라이언트 전용
- **[G12]** Static Export 유지
- **[G1]** UTF-8(BOM 없음) — Phase 6 다운로드에서 검증 예정
- **[G11]** Prompt.md CommonMark, 도구 비종속

---

## 10. 데이터 스키마 (LocalStorage)

키: `vc-planner:project:v1`

`WireframeItem.type`: `navbar` | `sidebar` | `search` | `content` | `custom`  
구 타입(`table` 등) → hydrate 시 `content`로 보정

---

_이 문서는 VC Planner 개발 세션 인수인계용이며, 명세 변경 시 `Plan.md`를 우선한다._
