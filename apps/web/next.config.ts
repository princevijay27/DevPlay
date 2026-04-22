import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ["@devflow/shared", "@devflow/ui"]
};

export default nextConfig;
