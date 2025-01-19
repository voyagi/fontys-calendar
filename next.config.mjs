/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/list',
      '@fullcalendar/interaction'
    ],
    reactStrictMode: true,
    swcMinify: true,
  }
  
  export default nextConfig