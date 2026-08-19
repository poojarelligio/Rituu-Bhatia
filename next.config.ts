import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Admin-uploaded images are served from /uploads (same origin, no
      // config needed). This entry only matters if you later point
      // image_url fields at an external host (e.g. object storage/CDN) —
      // add that host here so next/image is allowed to optimize it.
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
