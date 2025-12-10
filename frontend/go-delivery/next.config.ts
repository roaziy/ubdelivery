import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      'localhost',
      'api.ubdelivery.xyz',
    ],
  },
};

export default nextConfig;
