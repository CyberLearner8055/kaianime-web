/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },
  // Optimize for fast server response
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
