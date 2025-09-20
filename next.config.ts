import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude Node.js-specific modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@tensorflow/tfjs-node': false,
        '@tensorflow/tfjs-node-gpu': false,
        'fs': false,
        'path': false,
        'os': false,
      };
    }
    return config;
  },
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@tensorflow/tfjs-node'],
  },
};

export default nextConfig;
