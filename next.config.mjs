/** @type {import('next').NextConfig} */

const BASE = '/en';

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: BASE,
        permanent: true,
      },
    ];
  },

  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
