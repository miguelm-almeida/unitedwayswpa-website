/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  // The proxy builds its cache paths at runtime, so Next's file tracing cannot
  // see page-cache and would leave it out of the deployed bundle. Every request
  // would then fall through to the rate-limited upstream on a read-only disk.
  outputFileTracingIncludes: {
    "/**": ["./page-cache/**"],
  },
};

module.exports = nextConfig;
