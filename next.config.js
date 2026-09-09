/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
