import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ["@devflow/shared", "@devflow/ui"]
};

export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true
});
