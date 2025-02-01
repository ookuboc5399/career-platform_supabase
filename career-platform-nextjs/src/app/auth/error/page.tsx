"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            エラーが発生しました
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error === "AccessDenied" 
              ? "アクセスが拒否されました。管理者権限が必要です。"
              : "認証中にエラーが発生しました。もう一度お試しください。"}
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/auth/signin"
            className="group relative flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
