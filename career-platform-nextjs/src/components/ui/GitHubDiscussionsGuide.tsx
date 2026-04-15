'use client';

export default function GitHubDiscussionsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 GitHub Discussions とは？</h2>
      <p className="text-gray-600 mb-8">
        Discussions は、バグやタスクの <strong>Issues</strong> とは別に、Q&amp;A・アイデア・告知・雑談など「対話ベースのスレッド」を置く場所です。オープンソースではコミュニティ窓口としてよく使われます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Issues との使い分け（目安）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Issues:</strong> 再現手順のある不具合、実装タスク、マイルストーン管理
          </li>
          <li>
            <strong>Discussions:</strong> 仕様の相談、使い方の質問、ロードマップ議論、ブログ的告知
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">有効化とカテゴリ</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>リポジトリの <strong>Settings</strong> → <strong>Features</strong> で Discussions を有効化</li>
          <li>
            <strong>Discussions</strong> タブでカテゴリ（例: 一般、Q&amp;A、アイデア）を整理
          </li>
          <li>Q&amp;A カテゴリでは「ベストアンサー」をマークできるため、後から見た人が答えに辿り着きやすくなります</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Issue への変換</h3>
        <p className="text-gray-600">
          議論の結果「実装が必要になった」ときは、Discussion から <strong>Issue を作成</strong> してトラッキングに移すと、PR とつなげやすくなります。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — Discussions
          </a>
        </p>
      </div>
    </article>
  );
}
