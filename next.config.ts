import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 등 정적 호스팅용 산출물(out/)을 생성한다 [G12]
  output: "export",

  // 정적 내보내기에서는 Next.js 이미지 최적화 서버를 쓸 수 없다
  images: { unoptimized: true },

  // 프로덕션 소스맵 비활성화 — 원본 코드 노출 방지
  productionBrowserSourceMaps: false,

  // 정적 호스팅에서 새로고침 404를 피하기 위해 디렉터리형 URL 사용
  trailingSlash: true,

  // 프로덕션 번들에서 console.* 호출 제거 — 내부 상태 노출 방지
  // console.error는 남겨 두어야 실사용 중 오류 신고를 받을 수 있다
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
