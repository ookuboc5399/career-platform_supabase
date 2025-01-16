import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* サイドバー */}
        <div className="w-64 min-h-screen bg-gray-800 text-white">
          <div className="p-4">
            <h1 className="text-xl font-bold">管理画面</h1>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2 text-gray-400 text-sm font-medium uppercase">
              コンテンツ管理
            </div>
            <Link
              href="/admin/english"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              英語学習
            </Link>
            <Link
              href="/admin/programming"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              プログラミング
            </Link>
            <Link
              href="/admin/certifications"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              資格試験
            </Link>

            <div className="px-4 py-2 mt-4 text-gray-400 text-sm font-medium uppercase">
              大学・プログラム管理
            </div>
            <Link
              href="/admin/universities"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              大学・プログラム一覧
            </Link>

            <div className="px-4 py-2 mt-4 text-gray-400 text-sm font-medium uppercase">
              システム管理
            </div>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              設定
            </Link>
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
