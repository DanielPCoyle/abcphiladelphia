/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILDER_IO_KEY: process.env.BUILDER_IO_KEY,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
