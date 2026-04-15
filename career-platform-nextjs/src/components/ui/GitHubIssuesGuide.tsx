'use client';

export default function GitHubIssuesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🐛 GitHub Issues とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Issues は、バグ報告、機能要望、タスク管理をリポジトリ単位で行うための機能です。ラベル、マイルストーン、担当者を割り当て、プロジェクトの進捗を可視化できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主な機能
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Issue の作成:</strong> タイトル、本文（Markdown）、ラベル、担当者、マイルストーンを設定</li>
          <li><strong>テンプレート:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">.github/ISSUE_TEMPLATE/</code> でバグ報告・機能要望などのテンプレートを定義</li>
          <li><strong>リンク:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">#123</code> で Issue を、<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">owner/repo#123</code> で他リポジトリの Issue を参照</li>
          <li><strong>PR 連携:</strong> PR の説明に <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">Closes #123</code> と書くとマージ時に自動クローズ</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📋 ラベルとマイルストーンの活用
        </h3>
        <p className="text-gray-600 mb-4">
          ラベル（bug, enhancement, documentation など）で Issue を分類し、マイルストーンでリリース単位にまとめると、進捗の把握がしやすくなります。Organization レベルでラベルを統一することも可能です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔗 GitHub Projects との連携
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Projects では、Issue や PR をカードとして追加し、カンバンやテーブル形式で管理できます。Organization のプロジェクトに複数リポジトリの Issue を集約することも可能です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚙️ 設定のヒント
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Settings &gt; General で「Issues」を無効にすると Issue タブを非表示にできる</li>
          <li>Issue テンプレートを設定すると、新規作成時に種類を選べる</li>
          <li>Discussions を有効にすると、Q&amp;A 形式の議論と Issue を用途で使い分け可能</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/issues" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - Issues
          </a>
        </p>
      </div>
    </article>
  );
}
