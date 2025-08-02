import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/address/:address*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/address/:address*', // Proxy to Backend
        //destination: "http://localhost:5000/api/:path*", // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
