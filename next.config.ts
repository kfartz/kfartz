import withPayload from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  experimental: { cpus: 1 },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
