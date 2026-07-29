/** Cloudflare Pages 기본 URL. 커스텀 도메인 전환 시 빌드 env만 바꾸면 된다. */
const DEFAULT_SITE_URL = "https://vc-planner.pages.dev";

/** trailing slash 없이 반환 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = raw && raw.length > 0 ? raw : DEFAULT_SITE_URL;
  return url.replace(/\/+$/, "");
}

/** SEO·OG·sitemap·JSON-LD 공통 설정 (UI 언어와 분리, 영어 우선) */
export const siteConfig = {
  name: "VC Planner",
  get url() {
    return getSiteUrl();
  },
  seo: {
    /** 검색·OG 제목 — 국가별 검색 대비 영어 우선 */
    title:
      "VC Planner — AI Development Spec Builder | Prompt.md for Cursor, Claude & Agents",
    /** 검색 스니펫 — 영어(주), 한국어 UI와 별개 */
    description:
      "Free web tool to build Prompt.md and Agent rule files for AI coding assistants (Cursor, Claude Code, Windsurf, Lovable, Bolt.new). Flowcharts, wireframes, guardrails. Data stays in your browser.",
    keywords: [
      "AI development spec",
      "Prompt.md generator",
      "Cursor rules",
      "Claude Code AGENTS.md",
      "AI coding agent",
      "wireframe tool",
      "flowchart markdown",
      "vibe coding",
      "개발 명세서",
      "AI 코딩",
    ],
    ogImagePath: "/og-image.png",
    ogImageAlt:
      "VC Planner — step-by-step wizard to create AI agent development specifications",
  },
} as const;
