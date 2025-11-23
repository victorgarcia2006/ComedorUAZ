import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["localhost", "127.0.0.1", "cdn.pixabay.com"],
  },
};

export default nextConfig;
