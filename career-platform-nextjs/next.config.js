/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig
