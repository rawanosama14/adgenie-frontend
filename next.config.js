/** @type {import('next').NextConfig} */
const rawBackend = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').trim();
const backend = rawBackend
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

const nextConfig = {
  reactStrictMode: true,

  // Keep browser requests same-origin (/api and /media), then proxy them
  // server-side to the FastAPI service. This works on Render for POST bodies,
  // auth headers, query strings, streaming responses, and media files.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backend}/media/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      { source: '/Generator', destination: '/dashboard/generator', permanent: true },
      { source: '/Drafts', destination: '/dashboard/drafts', permanent: true },
      { source: '/CalendarPage', destination: '/dashboard/calendar', permanent: true },
      { source: '/Dashboard', destination: '/dashboard', permanent: true },
      { source: '/Pricing', destination: '/dashboard/billing', permanent: true },
    ];
  },
};

module.exports = nextConfig;
