/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@fullcalendar/core': '@fullcalendar/core/index.js',
        '@fullcalendar/react': '@fullcalendar/react/index.js',
        '@fullcalendar/daygrid': '@fullcalendar/daygrid/index.js',
        '@fullcalendar/timegrid': '@fullcalendar/timegrid/index.js',
        '@fullcalendar/list': '@fullcalendar/list/index.js',
        '@fullcalendar/interaction': '@fullcalendar/interaction/index.js',
      }
      return config
    },
    transpilePackages: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/list',
      '@fullcalendar/interaction'
    ],
  }
  
  export default nextConfig