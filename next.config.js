/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

    return [
      // Application API proxy: browser calls /api/* on Next.js,
      // Next forwards it to the FastAPI /api/v1/* router.
      {
        source: '/api/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
      // Generated media proxy: the backend persists images as
      // /media/images/<file>. Without this rule the browser would request
      // localhost:3000/media/... instead of FastAPI on port 8000.
      {
        source: '/media/:path*',
        destination: `${backend}/media/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
