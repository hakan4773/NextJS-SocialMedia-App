import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};


export default nextConfig;
