import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Allow the /widget/ route to be embedded everywhere
        source: "/widget/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *", // This allows ANY site to embed your widget
          },
        ],
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
