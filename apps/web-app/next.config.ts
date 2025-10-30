import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  // Point to the monorepo root for proper file tracing
  outputFileTracingRoot: path.join(__dirname, "../../"),
  // Explicitly include Prisma engine files in the bundle
  outputFileTracingIncludes: {
    "/api/**/*": ["../../packages/db/generated/prisma/**/*"],
    "/(public)/**/*": ["../../packages/db/generated/prisma/**/*"],
  },
};

export default nextConfig;
