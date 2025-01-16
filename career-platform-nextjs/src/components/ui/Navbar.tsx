import Link from 'next/link';

const Navbar = () => {
  const navItems = [
    { href: '/career', label: '大学・キャリア' },
    { href: '/english', label: '英語学習' },
    { href: '/programming', label: 'プログラミング' },
    { href: '/certifications', label: '資格' },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold">キャリアプラットフォーム</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
