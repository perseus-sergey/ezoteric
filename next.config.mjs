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
      {
        source: '/:lang/blog/page/(1|0)',
        destination: '/:lang/blog',
        permanent: true,
      },
      {
        source: '/:lang/tests/page/(1|0)',
        destination: '/:lang/tests',
        permanent: true,
      },
      {
        source: '/:lang/blog/tag/:slug/page/(1|0)',
        destination: '/:lang/blog/tag/:slug',
        permanent: true,
      },
      {
        source: '/:lang/tests/category/:slug/page/(1|0)',
        destination: '/:lang/tests/category/:slug',
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
