/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILDER_IO_KEY: process.env.BUILDER_IO_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
