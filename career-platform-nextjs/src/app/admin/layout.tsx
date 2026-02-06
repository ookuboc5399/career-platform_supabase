'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        // 認証エラーまたはユーザーがいない場合はmiddlewareがリダイレクトするので、ここでは何もしない
        setLoading(false);
        return;
      }
      
      // ユーザー情報を設定（管理者権限チェックはmiddlewareで既に行われている）
      // ここに到達できるということは、既にmiddlewareで管理者として認証されている
      
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // セッションが切れた場合はmiddlewareがリダイレクトする
        setUser(null);
        return;
      }
      
      // セッションがある場合はユーザー情報を設定
      // 管理者権限チェックはmiddlewareで既に行われている
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/signin');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* サイドバー */}
        <div className="w-64 min-h-screen bg-gray-800 text-white">
          <div className="p-4">
            <h1 className="text-xl font-bold">管理画面</h1>
            {user && (
              <div className="mt-2 text-sm text-gray-300">
                <div>{user.email}</div>
              </div>
            )}
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

            <div className="px-4 py-2 mt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                ログアウト
              </button>
            </div>
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
