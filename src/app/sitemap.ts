import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site/config";

/** Static Export 호환 [G12] */
export const dynamic = "force-static";

/** Plan 12-5 — 빌드 시 out/sitemap.xml 생성 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
