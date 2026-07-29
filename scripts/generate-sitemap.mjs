/**
 * public/sitemap.xml 생성 — Cloudflare Pages 정적 제공용 (Plan 12-5)
 * NEXT_PUBLIC_SITE_URL 미설정 시 pages.dev 기본값
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT = "https://vc-planner.pages.dev";
const base = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT).replace(
  /\/+$/,
  "",
);
const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(path.join(__dirname, "..", "public", "sitemap.xml"), xml, "utf8");
console.log(`Wrote public/sitemap.xml (${base}/)`);
