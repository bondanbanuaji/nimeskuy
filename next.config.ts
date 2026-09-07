import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
