/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'example.com',
      'universityimages.blob.core.windows.net',
      'englishimages.blob.core.windows.net'
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /react-quill/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    });

    return config;
  },
  transpilePackages: ['react-quill'],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'https://career-platform-express-a4bwhcbwf6cmaegs.eastus2-01.azurewebsites.net';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
