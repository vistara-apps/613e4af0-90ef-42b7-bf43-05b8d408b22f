/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_MINIKIT_API_KEY: process.env.NEXT_PUBLIC_MINIKIT_API_KEY,
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  },
};

export default nextConfig;
