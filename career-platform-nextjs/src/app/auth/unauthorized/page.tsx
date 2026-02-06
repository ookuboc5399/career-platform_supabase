'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900">アクセス権限がありません</h1>
        <p className="text-gray-600">
          このページにアクセスするには管理者権限が必要です。
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

