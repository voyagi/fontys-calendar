/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here
    return config
  },
}

module.exports = nextConfig 