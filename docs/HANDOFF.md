# VC Planner — 세션 인수인계 (HANDOFF)

> **작성일**: 2026-07-27  
> **기준 문서**: `Plan.md` v1.4 (Single Source of Truth)  
> **저장소**: https://github.com/lky9464/VC_Planner  
> **직전 커밋**: Phase 5 마감 → **이번 커밋**: Phase 6~7 마감 (PDF 제외, Plan v1.4)

---

## 1. 한 줄 요약

비개발자용 AI Agent 명세서 작성 위저드(VC Planner)에서 **Phase 0~7**까지 구현·DoD 확인을 **완료**했다 (PDF는 v1 범위 외, 배포 후 선택).  
**다음 세션: Phase 8** — LICENSE·NOTICE, 푸터 라이선스 고지, Cloudflare Pages 배포.

---

## 2. Phase 진행 현황

| Phase | 내용 | 상태 | 비고 |
|-------|------|------|------|
| 0 | Next.js 골격, Static Export, 레이아웃 셸 | ✅ 완료 | |
| 1 | ChoiceGroup, Context, LocalStorage | ✅ 완료 | |
| 2 | Step 1 폼, 미리보기, G10 연동 | ✅ 완료 | |
| 3 | Step 2·3, 가드레일, 기술 스택 섹션 | ✅ 완료 | |
| 4 | Flowchart 에디터, Mermaid 직렬화 | ✅ 완료 | |
| 5 | Wireframe 에디터, ASCII 직렬화 | ✅ 완료 | |
| 6 | Step 4 출력(복사·다운로드) | ✅ **완료** | DoD 확인 (2026-07-27) |
| 7 | 마감 & UX (README, 미리보기 서랍) | ✅ **완료** | PDF 제외 |
| 8 | 배포·라이선스·소스 보호 | ⏳ **다음** | |
| — | PDF 리포트 | ⏸ 보류 | 배포 후 필요 시 [G8] |

---

## 3. 이번 세션(2026-07-27) 작업 요약

### Phase 6 — Step 4 출력

| 항목 | 내용 |
|------|------|
| Prompt.md | 11장 표준 구조 최종 조립 |
| Agent 규칙 | 도구별 파일명(`.cursorrules` / `AGENTS.md` / `.windsurfrules`) 복사·다운로드 |
| Prompt 전달 | md·txt 다운로드 (클립보드 복사 버튼 없음 — Plan v1.3) |
| 위임 | `delegated` 항목 → 위임 지시문 + 상단 요약 배너 |
| UI | Agent 도구 선택 → Prompt / Rule 2줄 버튼 배치 |
| 인코딩 | UTF-8, BOM 없음 [G1] |

### Phase 7 — 마감 (PDF 제외)

| 항목 | 내용 |
|------|------|
| README | source-available(BUSL-1.1) 성격 명시 |
| 미리보기 서랍 | lg+ 우측 패널 접기/펼치기, **기본 열림**, LocalStorage(`vc-planner-preview-drawer`) |
| PDF | 시도 후 제거 — Tailwind v4 `oklab` ↔ html2canvas 호환 이슈. **1차 배포 후 재검토** |

### Plan.md v1.4

- Phase 6·7 완료 기록, PDF를 배포 후 선택 과제로 이동
- 6-4 Step 4 표·4장 레이아웃(미리보기 서랍) 반영

---

## 4. Phase 6 DoD 확인 결과

| # | 항목 | 결과 |
|---|------|------|
| 1 | Windows 메모장·VS Code에서 다운로드 파일 한글 깨짐 없음 | ✅ |
| 2 | Prompt.md 본문에 도구 전용 문법 미혼입 [G11] | ✅ |

---

## 5. 주요 파일 (Phase 6~7)

```
src/
├── components/
│   ├── export/ExportPanel.tsx       # Step 4 출력 (PDF 없음)
│   ├── layout/
│   │   ├── PlannerShell.tsx         # PreviewDrawer 연동
│   │   └── PreviewDrawer.tsx        # 데스크톱 미리보기 서랍
│   ├── preview/PreviewPane.tsx
│   └── steps/StepBody.tsx           # readOnly prop (PDF 재구현 대비 잔재)
├── lib/
│   ├── markdown/generate-prompt.ts
│   └── export/                      # 다운로드·규칙 추출
└── README.md
```

**삭제됨 (PDF 시도 롤백)**: `pdf.ts`, `PdfCaptureHost.tsx`, `PrintWizardLayout.tsx`, `html2pdf.js` 의존성

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

## 7. 다음 세션 — Phase 8 착수

Plan.md Phase 8 · 12장 기준:

1. `LICENSE`(BUSL-1.1) + `NOTICE` — Licensor 표기명·Change Date 확정 필요
2. 푸터 라이선스 고지, Prompt.md 하단 출처
3. Cloudflare Pages 배포 문서
4. **DoD**: `out/` 배포, 프로덕션 소스맵 미노출, 푸터 고지 유지

새 패키지 설치 전 **G8 승인** 필요.

---

## 8. (배포 후 선택) PDF 리포트

- **목표**: Step 1~3 설계 화면을 A4 PDF로 저장 (우측 미리보기 제외)
- **이슈**: html2canvas가 Tailwind v4 `oklab` 색상 파싱 실패, 캡처 레이아웃·z-index 문제
- **착수 조건**: v1 배포 완료 후 사용자 승인 [G8]

---

## 9. 가드레일 준수 메모

- **[G10]** 외부 네트워크 0건 — 클라이언트 전용
- **[G12]** Static Export 유지 — API Routes·서버 액션 없음
- **[G1]** UTF-8(BOM 없음) — Phase 6 DoD 확인 완료
- **[G11]** Prompt.md CommonMark, 도구 비종속

---

## 10. 데이터 스키마 (LocalStorage)

| 키 | 용도 |
|----|------|
| `vc-planner:project:v1` | 프로젝트 전역 상태 |
| `vc-planner-preview-drawer` | 미리보기 서랍 열림/닫힘 |

`WireframeItem.type`: `navbar` | `sidebar` | `search` | `content` | `custom`

---

_이 문서는 VC Planner 개발 세션 인수인계용이며, 명세 변경 시 `Plan.md`를 우선한다._
