import Link from 'next/link';

const Navbar = () => {
  const navItems = [
    { href: '/career', label: '大学・キャリア' },
    { href: '/english', label: '英語学習' },
    { href: '/programming', label: 'プログラミング' },
    { href: '/certifications', label: '資格' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold gradient-text">キャリアプラットフォーム</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => {
                const colors = [
                  'bg-[#4CC9F0] hover:bg-[#3DB8DF]',
                  'bg-[#F77F00] hover:bg-[#E67400]',
                  'bg-[#90BE6D] hover:bg-[#82AD62]',
                  'bg-[#F9C74F] hover:bg-[#E8B63E]'
                ];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white ${colors[index]} transition-all duration-300 hover:shadow-md`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
