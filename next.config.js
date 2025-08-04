/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import bundleAnalyzer from "@next/bundle-analyzer";

import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "pino-opentelemetry-transport",
  ],
  experimental: {
    optimizePackageImports: [
      "next-themes",
      "clsx",
      "tailwind-merge",
      "zustand/*",
      "@redux-devtools/extension",
      "@radix-ui/*",
      "sonner",
      "class-variance-authority",
      "react-hook-form",
      "cmdk",
      "react-day-picker",
      "next-auth",
      "zod",
      "@hookform/*",
      "@trpc/*",
      "@opentelemetry/*",
      "@paralleldrive/cuid2",
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: env.ANALYZE_BUNDLE,
});

export default withBundleAnalyzer(config);
