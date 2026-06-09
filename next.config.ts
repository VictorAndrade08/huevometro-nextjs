import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bioalimentar.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
