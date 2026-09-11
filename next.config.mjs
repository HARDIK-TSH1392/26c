/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // geoip-lite reads its .dat files via __dirname at runtime — webpack
  // bundling breaks that path resolution, so it has to stay a normal
  // require() from node_modules instead of being bundled, same as pg.
  serverExternalPackages: ["pg", "geoip-lite"],
  // Next's standalone-output file tracer only follows static require()/
  // import calls — it won't see geoip-lite's runtime fs.readFileSync() of
  // its .dat data files, so they'd otherwise be silently missing from the
  // Docker image (works locally with the full node_modules, breaks once
  // deployed with the pruned standalone output).
  outputFileTracingIncludes: {
    "/api/geo": ["./node_modules/geoip-lite/data/**"],
  },
  async headers() {
    return [
      {
        source: "/:path((?:checkout|account|admin).*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/nh-26c-ecommerce-products/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
