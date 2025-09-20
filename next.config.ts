import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    // Hackathon/demo: allow builds to pass even with lint errors
    ignoreDuringBuilds: true,
  },
  // Silence monorepo/root warning
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    // Force browser build of Human and avoid tfjs-node in client bundles
    config.resolve = config.resolve || {} as any;
    config.resolve.alias = {
      ...(config.resolve?.alias || {}),
      // Prefer the browser/ESM build
      "@vladmandic/human/dist/human.node.js": false,
      "@tensorflow/tfjs-node": false,
      fs: false,
      path: false,
    } as any;
    return config;
  },
};

export default nextConfig;
