# VC Planner

비개발자가 단계별 질문·업무 흐름도·와이어프레임으로 서비스를 설계하고, AI Coding Agent에 붙여넣을 수 있는 **표준 Markdown 개발 명세서**(`Prompt.md` + Agent 규칙 파일)를 생성하는 웹 앱입니다.

- 입력·저장은 **브라우저 LocalStorage**만 사용합니다. 외부 서버로 데이터가 전송되지 않습니다.
- 배포는 **Cloudflare Pages(Static Export)** 를 전제로 합니다.

## 개발 환경

| 항목 | 버전 |
|---|---|
| Node.js | ≥ 20 (실측 v24) |
| Next.js | 15 (App Router) |
| React | 19 |

```powershell
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 빌드

```powershell
npm run build
```

정적 산출물은 `out/` 폴더에 생성됩니다.

## 주요 기능

1. **Step 1~4 위저드** — 서비스 개요, 기술·저장 방식, AI 가드레일, 최종 출력
2. **업무 흐름도** — React Flow 편집 → Mermaid `flowchart TD` 자동 변환
3. **와이어프레임** — 그리드 레이아웃 편집 → ASCII 다이어그램 자동 변환
4. **Step 4 출력** — Agent 규칙 복사, Prompt md/txt 다운로드

## 문서

- **개발 계획·명세**: [`Plan.md`](Plan.md) (Single Source of Truth)
- **세션 인수인계**: [`docs/HANDOFF.md`](docs/HANDOFF.md)

## 라이선스

이 저장소의 **소스코드**는 **BUSL-1.1 (source-available)** 로 보호됩니다. OSI 승인 오픈소스가 **아닙니다**.

- 웹 서비스 **이용**은 자유롭게 할 수 있습니다.
- 소스코드의 **무단 재배포·재가공·상업적 재호스팅**은 금지됩니다.
- 이 도구로 **생성한 명세서(`Prompt.md` 등)의 저작권은 작성자 본인**에게 있으며, 자유롭게 사용·수정·배포할 수 있습니다.

자세한 조항은 루트 `LICENSE`(Phase 8) 및 `Plan.md` 12-3장을 참조하세요.
