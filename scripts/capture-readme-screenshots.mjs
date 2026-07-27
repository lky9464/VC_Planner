/**
 * README용 스크린샷 — https://vc-planner.pages.dev/ 에서 캡처
 * 실행: node scripts/capture-readme-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "docs", "screenshots");
const BASE_URL = "https://vc-planner.pages.dev/";
const STORAGE_KEY = "vc-planner:project:v1";

function choice(ids) {
  return {
    selectedIds: ids,
    customEnabled: false,
    customText: "",
    delegated: false,
    delegateHint: "",
  };
}

/** README 스크린샷용 샘플 프로젝트 — 모든 Step 완료 상태 */
function buildDemoState() {
  const now = new Date().toISOString();
  return {
    meta: { version: "1", updatedAt: now },
    basic: {
      serviceName: "FinLab",
      oneLiner: "재무·회계 데이터를 한눈에 보는 내부 대시보드",
      domain: choice(["finance"]),
      sensitiveData: choice(["none"]),
    },
    flowchart: {
      nodes: [
        {
          id: "n1",
          type: "start",
          label: "시작",
          position: { x: 0, y: 80 },
        },
        {
          id: "n2",
          type: "page",
          label: "대시보드",
          position: { x: 200, y: 80 },
        },
        {
          id: "n3",
          type: "database",
          label: "거래 DB",
          position: { x: 400, y: 80 },
        },
        {
          id: "n4",
          type: "end",
          label: "종료",
          position: { x: 600, y: 80 },
        },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
      ],
      deliveryNotes: "",
    },
    wireframe: {
      items: [
        { i: "w1", x: 0, y: 0, w: 12, h: 1, type: "navbar", label: "네비게이션바" },
        { i: "w2", x: 0, y: 1, w: 3, h: 5, type: "sidebar", label: "사이드바" },
        { i: "w3", x: 3, y: 1, w: 9, h: 1, type: "search", label: "검색창" },
        { i: "w4", x: 3, y: 2, w: 9, h: 4, type: "content", label: "KPI · 차트" },
      ],
      cols: 12,
      rowHeight: 30,
      deliveryNotes: "",
    },
    dataIO: {
      input: choice(["csv-excel"]),
      output: choice(["summary-cards", "data-table"]),
    },
    edgeCases: {
      emptyState: choice(["message"]),
      errorState: choice(["toast"]),
    },
    tech: {
      appType: choice(["nextjs-web"]),
      storage: choice(["localstorage"]),
    },
    agentRules: {
      role: choice(["fullstack-senior"]),
      guardrails: choice(["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"]),
    },
    output: {
      includeToolAppendix: true,
      targetAgents: ["cursor"],
    },
  };
}

async function waitForApp(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.body.innerText.includes("저장된 내용을 불러오는 중"),
    { timeout: 30000 },
  );
  await page.waitForTimeout(1000);
}

async function clickStep(page, index) {
  await page.locator('nav[aria-label="진행 단계"] button').nth(index).click();
  await page.waitForTimeout(800);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  await context.addInitScript(
    ({ key, state }) => {
      localStorage.setItem(key, JSON.stringify(state));
    },
    { key: STORAGE_KEY, state: buildDemoState() },
  );

  const page = await context.newPage();
  await waitForApp(page);

  await clickStep(page, 0);
  await page.screenshot({
    path: path.join(OUT_DIR, "step1-overview.png"),
  });

  await clickStep(page, 1);
  await page.screenshot({
    path: path.join(OUT_DIR, "step2-tech.png"),
  });

  await clickStep(page, 2);
  await page.screenshot({
    path: path.join(OUT_DIR, "step3-guardrails.png"),
  });

  await clickStep(page, 3);
  await page.screenshot({
    path: path.join(OUT_DIR, "step4-export.png"),
  });

  await clickStep(page, 0);
  await page.getByRole("button", { name: "Agent 규칙", exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(OUT_DIR, "preview-agent-rules.png"),
  });

  await browser.close();
  console.log("Screenshots saved to docs/screenshots/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
