/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: { 
    optimizePackageImports: ['react-quill']
  },
  images: {
    domains: [
      'example.com',
      'universityimages.blob.core.windows.net',
      'englishimages.blob.core.windows.net',
      'gsp-image-cdn.wmsports.io',
      'media.bleacherreport.com',
      'static.foxnews.com',
      'a.espncdn.com',
      'cdn.cnn.com',
      'nypost.com',
      'www.reuters.com',
      'www.bbc.co.uk',
      'ichef.bbci.co.uk',
      'www.aljazeera.com',
      'www.theguardian.com',
      's.yimg.com',
      'dmxg5wxfqgb4u.cloudfront.net',
      'media.cnn.com',
      's.w-x.co',
      'cdn.vox-cdn.com',
      'cdn.mlbtraderumors.com',
      'media.d3.nhle.com'
    ],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
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
    
    // Next.js APIルート（/app/api/*/route.ts）が存在する場合は、そちらが優先されます
    // /api/english/movies と /api/admin/english/movies は Next.js API ルートで処理されるため、
    // rewrites ではプロキシされません
    
    // 注意: Next.jsのAPIルートは rewrites より優先されるはずですが、
    // 問題が発生している場合は、rewrites を一時的に無効化してください
    
    // 一時的に rewrites を無効化して、Next.js APIルートを優先
    // 他のAPIリクエストがExpressサーバーにプロキシされなくなりますが、
    // まずは Next.js APIルートが正しく動作することを確認してください
    return [];
    
    // 他のAPIリクエストをExpressサーバーにプロキシする必要がある場合は、
    // 以下のコードを有効化してください（ただし、/api/english/movies は除外）
    // return [
    //   {
    //     source: '/api/:path*',
    //     destination: `${apiUrl}/api/:path*`,
    //   },
    // ];
  },
}

module.exports = nextConfig
