import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
    images: {
    domains: ['res.cloudinary.com'],
  },
};


export default nextConfig;
