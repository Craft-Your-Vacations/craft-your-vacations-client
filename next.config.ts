import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /register is gone: signing in by phone creates the account (signInWithOtp
  // with shouldCreateUser), and Google sign-in always did. One page now covers
  // both, so old links and bookmarks land on it instead of a 404.
  async redirects() {
    return [{ source: "/register", destination: "/login", permanent: false }];
  },
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
