/** @type {import('next').NextConfig} */

const BASE = "/en";

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: BASE,
        permanent: true,
      },
    ];
  },

  experimental: {},
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
