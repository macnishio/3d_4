
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  experimental: {
    appDir: false
  }
}

module.exports = nextConfig;
