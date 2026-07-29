# Cloudflare Pages 배포 가이드

VC Planner는 Next.js **Static Export**(`out/`)로 빌드되며, 백엔드·환경 변수·비밀값 없이 Cloudflare Pages에 배포할 수 있습니다 [G10][G12].

## 사전 조건

- GitHub 저장소: https://github.com/lky9464/VC_Planner
- Node.js 20 이상 (로컬 실측 v24, Cloudflare는 `NODE_VERSION=20` 권장)

## Cloudflare Pages 설정

| 항목 | 값 |
|---|---|
| 프레임워크 프리셋 | **Next.js (Static HTML Export)** |
| 빌드 명령 | `npm run build` |
| 빌드 출력 디렉터리 | `out` |
| Node 버전 | 환경 변수 `NODE_VERSION` = `20` (또는 `22`) |
| 환경 변수 (선택) | `NEXT_PUBLIC_SITE_URL` — canonical·sitemap·OG URL. 기본 `https://vc-planner.pages.dev`. 커스텀 도메인 시 변경 후 재배포 (`Plan.md` 12-5장) |

### 연결 절차 (요약)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub 저장소 `lky9464/VC_Planner` 선택
3. 위 표의 빌드 설정 입력
4. **Save and Deploy** — 첫 배포 완료 후 `*.pages.dev` URL에서 확인

## 로컬 빌드 확인

```powershell
cd VC_Planner
npm install
npm run build
```

`out/` 폴더가 생성되면 배포 산출물이 준비된 것입니다. 로컬에서 미리 보려면 정적 서버로 `out/`을 서빙하면 됩니다.

```powershell
npx serve out
```

## 보안 헤더

`public/_headers` 파일이 빌드 시 `out/_headers`로 복사됩니다. Cloudflare Pages가 아래 헤더를 모든 경로에 적용합니다.

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

소스맵(`.map`) 차단 규칙은 **넣지 않습니다**. 애초에 `productionBrowserSourceMaps: false`로 소스맵을 생성하지 않는 것이 정답입니다 (`Plan.md` 12-2장).

## 배포 DoD 체크리스트

- [ ] `npm run build` 성공, `out/` 생성
- [ ] 배포 URL에서 Step 1~4 위저드·미리보기·Step 4 다운로드 동작
- [ ] 새로고침 시 404 없음 (`trailingSlash: true` 적용됨)
- [ ] 브라우저 DevTools → Sources에 `.map` / 원본 TypeScript 노출 없음
- [ ] 화면 하단 푸터에 BUSL-1.1 라이선스 고지 표시

## SEO (배포 후)

- [ ] `https://(your-domain)/robots.txt` · `/sitemap.xml` 접속 확인
- [ ] [Google Search Console](https://search.google.com/search-console) sitemap 제출
- [ ] (선택) 네이버 서치어드바이저 sitemap 제출
- [ ] 커스텀 도메인 전환 시: `NEXT_PUBLIC_SITE_URL` 설정 → 재배포 → Search Console 속성 추가

## 라이선스 고지

배포본에도 다음이 포함되어야 합니다 [G12].

- 웹 UI 푸터 (`src/components/layout/Footer.tsx`)
- 저장소 루트 `LICENSE`, `NOTICE`
- 생성 `Prompt.md` 하단 출처 문구 (`generate-prompt.ts`)

자세한 정책은 `Plan.md` 12-3장을 참조하세요.
