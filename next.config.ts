import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TypeScript errors during build if needed
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
