/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  staticPageGenerationTimeout: 180,
  staticPages: false,
  images: {
    domains: [
      'example.com',
      'universityimages.blob.core.windows.net',
      'englishimages.blob.core.windows.net'
    ],
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
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_EXPRESS_API_URL + '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
