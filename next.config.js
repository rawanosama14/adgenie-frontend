/** @type {import('next').NextConfig} */

const backendUrl = (
  process.env.BACKEND_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${backendUrl}/media/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
