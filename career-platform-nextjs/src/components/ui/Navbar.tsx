'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Navbar = () => {
  const navItems = [
    { href: '/career', label: '大学・キャリア' },
    { href: '/english', label: '英語学習' },
    { href: '/programming', label: 'プログラミング' },
    { href: '/certifications', label: '資格' },
  ];

  return (
    <nav className="border-b border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="gradient-text text-xl font-bold">キャリアプラットフォーム</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-3">
                {navItems.map((item, index) => {
                  const colors = [
                    'bg-[#4CC9F0] hover:bg-[#3DB8DF]',
                    'bg-[#F77F00] hover:bg-[#E67400]',
                    'bg-[#90BE6D] hover:bg-[#82AD62]',
                    'bg-[#F9C74F] hover:bg-[#E8B63E]',
                  ];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-md ${colors[index]}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
