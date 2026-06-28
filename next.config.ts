import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "87f4ba8a8424b13d3864dbf05aecda94.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-859a76e5e2da4b999774aa69bfbc6476.r2.dev",
      },
    ],
  },
};

export default nextConfig;
