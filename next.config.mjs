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
        hostname: 'ezoteric.net',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'blfrxltqylipwrwp.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
