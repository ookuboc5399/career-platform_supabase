/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/express/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig
