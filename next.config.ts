import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://imagep-api.zhunismp.dev/api/:path*",
      },
    ];
  },
};

export default nextConfig;