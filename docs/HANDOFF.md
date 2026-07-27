# VC Planner — 세션 인수인계 (HANDOFF)

> **작성일**: 2026-07-27  
> **기준 문서**: `Plan.md` v1.5 (Single Source of Truth)  
> **저장소**: https://github.com/lky9464/VC_Planner  
> **직전 커밋**: Phase 6~7 마감 → **이번 커밋**: Phase 8 (배포·라이선스·소스 보호)

---

## 1. 한 줄 요약

비개발자용 AI Agent 명세서 작성 위저드(VC Planner) **Phase 0~8** 구현·DoD 확인 **완료**.  
**다음**: Cloudflare Pages 실제 배포 (`docs/DEPLOY.md` 절차). PDF는 배포 후 선택.

---

## 2. Phase 진행 현황

| Phase | 내용 | 상태 | 비고 |
|-------|------|------|------|
| 0~7 | (이전 HANDOFF 참조) | ✅ 완료 | |
| 8 | 배포·라이선스·소스 보호 | ✅ **완료** | DoD 확인 (2026-07-27) |
| — | Cloudflare Pages 실배포 | ⏳ **다음** | Git 연동 |
| — | PDF 리포트 | ⏸ 보류 | 배포 후 [G8] |

---

## 3. Phase 8 작업 요약

| 항목 | 내용 |
|------|------|
| `LICENSE` | BUSL-1.1 — Licensor `lky9464`, Change Date `2030-07-27`, Change License Apache-2.0 |
| `NOTICE` | React, Next.js, @xyflow/react 등 서드파티 고지 |
| `public/_headers` | Cloudflare Pages 보안 헤더 (12-2장) |
| `docs/DEPLOY.md` | 빌드 명령 `npm run build`, 출력 `out`, NODE_VERSION=20 |
| 푸터 | `Footer.tsx` — Phase 0 자리 확보, 문구 Phase 8 확정 (기존 구현) |
| Prompt.md 하단 | `generate-prompt.ts` 출처 문구 (기존 구현) |
| `next.config.ts` | Static Export·소스맵 off·removeConsole (Phase 0부터 적용) |

---

## 4. Phase 8 DoD 확인

| # | 항목 | 결과 |
|---|------|------|
| 1 | `npm run build` → `out/` 생성 | ✅ |
| 2 | `out/` 내 `.map` 파일 없음 | ✅ |
| 3 | `out/_headers` 복사됨 | ✅ |
| 4 | 푸터 BUSL-1.1 고지 | ✅ |

---

## 5. 주요 파일 (Phase 8)

```
LICENSE
NOTICE
public/_headers
docs/DEPLOY.md
src/components/layout/Footer.tsx
src/lib/markdown/generate-prompt.ts  # Prompt.md 하단 출처
next.config.ts
```

---

## 6. 로컬 실행

```powershell
cd VC_Planner
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 정적 산출물
npx serve out    # 배포본 로컬 미리보기
```

---

## 7. 다음 — Cloudflare Pages 배포

`docs/DEPLOY.md` 체크리스트:

1. Cloudflare Pages → GitHub `lky9464/VC_Planner` 연결
2. 빌드: `npm run build`, 출력: `out`, `NODE_VERSION=20`
3. 배포 URL에서 위저드·다운로드·푸터·새로고침 404 없음 확인

---

## 8. 가드레일

- **[G10]** 외부 네트워크 0건
- **[G12]** Static Export, 소스맵 off, 라이선스 고지 유지

---

_명세 변경 시 `Plan.md`를 우선합니다._
