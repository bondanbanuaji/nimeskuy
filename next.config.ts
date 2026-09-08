import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "otakudesu.blog" },
      { protocol: "https", hostname: "otakudesu.cloud" },
      { protocol: "https", hostname: "**.otakudesu.blog" },
      { protocol: "https", hostname: "**.blog" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "cdn.noitatnemucod.net" },
      { protocol: "https", hostname: "**.noitatnemucod.net" },
      // Sanka may proxy posters via other CDNs — allow generic https
      { protocol: "https", hostname: "**.otakudesu.cloud" },
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "**.anilist.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
