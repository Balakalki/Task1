import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*', // Apply this to API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*' // You can specify a more restrictive origin, like 'https://yourfrontend.vercel.app'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}