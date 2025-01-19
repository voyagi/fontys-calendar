/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@fullcalendar/common',
    '@fullcalendar/core',
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/timegrid',
    '@fullcalendar/list',
    '@fullcalendar/interaction'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    // Add support for CommonJS modules
    config.module.rules.push({
      test: /\.cjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    })
    return config
  },
}

module.exports = nextConfig 