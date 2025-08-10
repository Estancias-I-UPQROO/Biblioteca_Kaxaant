import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠ fuerza a ignorar errores de tipos
  },
  eslint: {
    ignoreDuringBuilds: true, // ignora ESLint en el build
  },
};

export default nextConfig;