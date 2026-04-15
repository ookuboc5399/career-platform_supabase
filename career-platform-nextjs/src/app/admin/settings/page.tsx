import Link from 'next/link';

/**
 * サーバーコンポーネントのみ（クライアント固有の値を描画しない）→ ハイドレーション不一致を避ける
 */
export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">設定</h1>
      <p className="text-gray-600 mb-6">
        管理機能で利用する環境変数は Next.js のホスト（<code className="text-sm bg-gray-100 px-1 rounded">.env.local</code> 等）に設定します。
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-3 mb-8">
        <li>
          <code className="text-sm bg-gray-100 px-1 rounded">ADMIN_EMAILS</code> — 管理画面に入れるメールアドレス（カンマ区切り）
        </li>
        <li>
          <code className="text-sm bg-gray-100 px-1 rounded">OBSIDIAN_VAULT_PATH</code> — Obsidian Vault の絶対パス（省略時は{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">~/Documents/Obsidian Vault</code> 相当の既定）。チャプター生成 API が参照します。
        </li>
        <li>
          <code className="text-sm bg-gray-100 px-1 rounded">GITHUB_DOCS_OBSIDIAN_DEST</code> — GitHub 公式 docs の同期先フォルダ（省略時は Vault 内{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">GitHub/GitHub-docs</code>）
        </li>
        <li>
          <code className="text-sm bg-gray-100 px-1 rounded">GITHUB_BLOG_OBSIDIAN_DEST</code> — GitHub Blog の日本語メモ保存先（省略時は Vault 内{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">GitHub/GitHub-blog-ja</code>）
        </li>
        <li>
          <code className="text-sm bg-gray-100 px-1 rounded">OPENAI_API_KEY</code> — チャプター自動生成 API 用
        </li>
      </ul>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h2 className="font-semibold text-gray-900 mb-2">学習ナレッジ</h2>
        <p className="text-sm text-gray-600 mb-3">
          GitHub 公式ドキュメントの同期と Vault の状態確認は、サイドバーの「学習ナレッジ」から行います。
        </p>
        <Link
          href="/admin/knowledge"
          className="inline-flex text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          学習ナレッジを開く
        </Link>
      </div>
    </div>
  );
}
