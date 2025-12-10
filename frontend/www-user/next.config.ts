import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'api.ubdelivery.xyz',
      },
      {
        protocol: 'https',
        hostname: 'ubdelivery.xyz',
      },
      {
        protocol: 'https',
        hostname: 'www.ubdelivery.xyz',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Environment variables validation (only in production)
  ...(process.env.NODE_ENV === 'production' && {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.ubdelivery.xyz/api',
    },
  }),
};

export default nextConfig;
