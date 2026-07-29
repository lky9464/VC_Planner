import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site/config";

/** Static Export 호환 [G12] */
export const dynamic = "force-static";

/** Plan 12-5 — 빌드 시 out/robots.txt 생성 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
