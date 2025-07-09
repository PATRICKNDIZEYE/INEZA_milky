/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to enable server-side features
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
