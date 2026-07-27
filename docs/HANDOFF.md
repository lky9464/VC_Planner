# VC Planner — 세션 인수인계 (HANDOFF)

> **작성일**: 2026-07-28  
> **기준 문서**: `Plan.md` v1.5 (Single Source of Truth)  
> **저장소**: https://github.com/lky9464/VC_Planner  
> **운영 URL**: https://vc-planner.pages.dev/  
> **최신 커밋**: `8d11d9e` — 헤더 「사용 방법」·README 정리

---

## 1. 한 줄 요약

VC Planner **v1 완료** — Phase 0~8 구현·DoD 확인·**Cloudflare Pages 실배포**·README 공개까지 끝냈다.  
일반 사용자는 배포 URL에서 바로 이용하고, 헤더 **「사용 방법」** 으로 GitHub README(화면 안내·스크린샷)에 접근한다.

---

## 2. Phase · 마일스톤 현황

| 구분 | 내용 | 상태 |
|------|------|------|
| Phase 0~8 | 구현·DoD | ✅ 완료 |
| Cloudflare Pages 배포 | https://vc-planner.pages.dev/ | ✅ **운영 중** |
| README (사용자용) | Live Demo·Step 1~4 스크린샷 | ✅ |
| PDF 리포트 | Step 1~3 A4 저장 | ⏸ 배포 후 선택 [G8] |

---

## 3. 이번 세션(2026-07-27~28) 작업 요약

### Phase 8 — 배포·라이선스·소스 보호 (`290ae29`)

| 항목 | 내용 |
|------|------|
| `LICENSE` | BUSL-1.1 — Licensor `lky9464`, Change Date `2030-07-27` |
| `NOTICE` | 서드파티 MIT/ISC 등 고지 |
| `public/_headers` | Cloudflare 보안 헤더 |
| `docs/DEPLOY.md` | Pages 빌드·DoD 가이드 |
| DoD | `out/` 빌드, `.map` 0건, 푸터·`_headers` 확인 ✅ |

### 배포 전 최종 점검

- `npm run build` · `npm run lint` ✅
- `package.json` / `package-lock.json` 의존성 일치 ✅
- Node 전용 API·하드코딩 비밀값 없음 ✅
- SPA 라우팅: 단일 페이지 `/`, `_redirects` 불필요 ✅
- Cloudflare 설정: `npm run build` / `out` / `NODE_VERSION=20` / 앱 env 변수 없음

### Cloudflare Pages 실배포

- URL: **https://vc-planner.pages.dev/**
- GitHub `main` 연동 → push 시 자동 재배포

### README · UX (`d1c3975`, `8d11d9e`)

| 항목 | 내용 |
|------|------|
| README 재작성 | Live Demo, 서비스 소개, Step 1~4·미리보기 설명 + 스크린샷 |
| 스크린샷 | `docs/screenshots/` — 배포 URL Playwright 캡처 5장 |
| 재생성 스크립트 | `scripts/capture-readme-screenshots.mjs` |
| README 정리 | 「개발자용 — 로컬 실행」 섹션 **삭제** (일반 사용자 중심) |
| 헤더 버튼 | **「사용 방법」** — `README_URL` → GitHub README 새 탭 (`Header.tsx`) |

---

## 4. 커밋 이력 (이번 세션)

| 커밋 | 요약 |
|------|------|
| `290ae29` | Phase 8 LICENSE·NOTICE·DEPLOY·_headers |
| `93a1ca5` | (직전) Phase 6~7 |
| `d1c3975` | README + 스크린샷 |
| `8d11d9e` | 헤더 사용 방법 링크, README dev 섹션 제거 |

---

## 5. 주요 파일 맵

```
LICENSE / NOTICE
public/_headers
docs/DEPLOY.md
docs/screenshots/          # README용 캡처
scripts/capture-readme-screenshots.mjs
README.md                  # 사용자용 (배포 URL·화면 안내)
src/components/layout/
  Header.tsx               # 「사용 방법」 버튼
  Footer.tsx               # BUSL-1.1 푸터
src/lib/project/constants.ts  # README_URL, STORAGE_KEY
```

---

## 6. 로컬 실행 (개발자)

```powershell
cd VC_Planner
npm install
npm run dev      # http://localhost:3000
npm run build    # out/
```

상세 명세·배포 절차: `Plan.md`, `docs/DEPLOY.md`

---

## 7. 다음에 할 수 있는 일 (선택)

| 우선순위 | 항목 | 비고 |
|----------|------|------|
| — | **PDF 리포트** | Tailwind v4 oklab ↔ html2canvas 이슈. 착수 전 [G8] |
| — | **커스텀 도메인** | Cloudflare Pages → Custom domains |
| — | README 스크린샷 갱신 | UI 변경 후 `capture-readme-screenshots.mjs` 재실행 |
| — | Plan.md v1.6 | 헤더 「사용 방법」 등 post-v1 UX 반영 시 |

---

## 8. 가드레일 메모

- **[G10]** 런타임 외부 API 호출 0건. 「사용 방법」은 **사용자 클릭 시** GitHub README로만 이동.
- **[G12]** Static Export 유지, 소스맵 off, 푸터·Prompt.md 출처 유지.
- **생성 명세서** 저작권은 사용자 소유 (README·LICENSE와 동일 정책).

---

## 9. LocalStorage 키

| 키 | 용도 |
|----|------|
| `vc-planner:project:v1` | 프로젝트 상태 |
| `vc-planner-preview-drawer` | 미리보기 서랍 열림/닫힘 |

---

_v1 기준 세션 마무리 (2026-07-28). 명세 변경 시 `Plan.md`를 우선합니다._
