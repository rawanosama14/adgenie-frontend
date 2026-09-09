/** next.config.ts — Next.js runtime and backend proxy configuration. */
import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/backend/:path*', destination: `${backendUrl}/api/v1/:path*` },
      { source: '/backend-media/:path*', destination: `${backendUrl}/media/:path*` },
    ];
  },
};

export default nextConfig;
