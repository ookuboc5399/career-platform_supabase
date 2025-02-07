import Link from 'next/link';

import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      title: 'プログラミング',
      description: '最新のプログラミングスキルを習得',
      href: '/programming',
      color: 'bg-[#4CC9F0] hover:bg-[#3DB8DF]',
      textColor: 'text-white'
    },
    {
      title: '英語学習',
      description: 'グローバルな機会のための英語力を身につける',
      href: '/english',
      color: 'bg-[#F77F00] hover:bg-[#E67400]',
      textColor: 'text-white'
    },
    {
      title: '資格・検定',
      description: 'キャリアアップのための資格取得をサポート',
      href: '/certifications',
      color: 'bg-[#90BE6D] hover:bg-[#82AD62]',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-[#E8F9FD]">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 float">
        <div className="w-20 h-20 bg-[#4CC9F0] rounded-full opacity-20"></div>
      </div>
      <div className="absolute top-20 right-20 float delay-1000">
        <div className="w-16 h-16 bg-[#F77F00] rounded-full opacity-20"></div>
      </div>
      <div className="absolute bottom-20 left-1/4 float delay-1500">
        <div className="w-24 h-24 bg-[#90BE6D] rounded-full opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative flex flex-col min-h-screen">
        {/* Main content */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 w-32 h-32">
            <div className="relative w-full h-full float">
              <div className="absolute inset-0 bg-[#4CC9F0] rounded-full opacity-20 pulse"></div>
              <div className="absolute inset-2 bg-[#4CC9F0] rounded-full opacity-40 pulse delay-500"></div>
              <div className="absolute inset-4 bg-[#4CC9F0] rounded-full opacity-60 pulse delay-1000"></div>
            </div>
          </div>
          <h1 className="text-6xl font-bold gradient-text mb-6">
            キャリアプラットフォーム
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            あなたの成長とスキルアップを総合的にサポートするプラットフォーム
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`card-hover rounded-xl p-8 ${feature.color} shadow-lg`}
            >
              <h2 className={`text-2xl font-bold ${feature.textColor} mb-4`}>
                {feature.title}
              </h2>
              <p className={`${feature.textColor} opacity-90`}>
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Robot and character illustrations */}
        <div className="absolute left-0 bottom-0 w-48 h-48 float">
          <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
            <rect x="60" y="40" width="80" height="80" rx="10" fill="#4CC9F0"/>
            <circle cx="80" cy="70" r="10" fill="#FFFFFF"/>
            <circle cx="120" cy="70" r="10" fill="#FFFFFF"/>
            <rect x="85" y="90" width="30" height="5" rx="2.5" fill="#FFFFFF"/>
            <rect x="95" y="20" width="10" height="20" fill="#4CC9F0"/>
            <circle cx="100" cy="15" r="5" fill="#F77F00"/>
            <rect x="70" y="130" width="60" height="50" rx="5" fill="#4CC9F0"/>
            <rect x="40" y="140" width="30" height="10" rx="5" fill="#4CC9F0"/>
            <rect x="130" y="140" width="30" height="10" rx="5" fill="#4CC9F0"/>
            <rect x="80" y="140" width="40" height="20" rx="2" fill="#FFFFFF"/>
            <path d="M85 150 L95 155 L105 145" stroke="#90BE6D" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 w-48 h-48 float delay-1000">
          <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="70" r="40" fill="#FFB5A7"/>
            <path d="M60 70 Q100 20 140 70" fill="#4A4A4A"/>
            <path d="M60 70 Q80 60 85 75" fill="#4A4A4A"/>
            <path d="M140 70 Q120 60 115 75" fill="#4A4A4A"/>
            <circle cx="85" cy="65" r="5" fill="#4A4A4A"/>
            <circle cx="115" cy="65" r="5" fill="#4A4A4A"/>
            <path d="M90 80 Q100 85 110 80" stroke="#4A4A4A" strokeWidth="2"/>
            <rect x="80" y="110" width="40" height="60" fill="#90BE6D"/>
            <path d="M80 110 Q100 120 120 110" fill="#90BE6D"/>
            <rect x="65" y="120" width="15" height="40" rx="5" fill="#FFB5A7"/>
            <rect x="120" y="120" width="15" height="40" rx="5" fill="#FFB5A7"/>
            <rect x="75" y="165" width="50" height="10" fill="#4CC9F0"/>
            <path d="M75 165 L125 165 L125 160 L75 160 Z" fill="#F77F00"/>
          </svg>
        </div>

        {/* フッター */}
        <div className="mt-auto py-8 text-center">
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}
