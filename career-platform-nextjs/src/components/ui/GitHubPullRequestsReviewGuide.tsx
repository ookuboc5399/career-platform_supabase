'use client';

export default function GitHubPullRequestsReviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔀 プルリクエスト（PR）とコードレビュー
      </h2>
      <p className="text-gray-600 mb-8">
        Pull Request は、あるブランチの変更を別ブランチ（多くは <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">main</code>）へ取り込む前に、差分・議論・CI
        結果をまとめて確認するための仕組みです。チーム開発では品質と知識共有の中心になります。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">典型的な流れ</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>トピック用ブランチを切り、コミットしてリモートへ push</li>
          <li>GitHub で <strong>Compare &amp; pull request</strong> を作成</li>
          <li>説明に「目的・背景・動作確認方法」を書き、レビュアーを指定（または CODEOWNERS で自動）</li>
          <li>Conversation でコメント、Files changed で行単位レビュー</li>
          <li>承認・CI 通過後、マージ（Squash / Merge commit / Rebase の方針はチームで統一）</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Draft PR</h3>
        <p className="text-gray-600 mb-4">
          まだレビュー依頼したくない段階では <strong>Draft pull request</strong> を使います。CI は走らせつつ「WIP」であることが明示され、誤マージを防げます。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">レビューで押さえること</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>仕様どおりか、エッジケースやエラーハンドリングは十分か</li>
          <li>セキュリティ（認可・秘密情報の混入・依存の脆弱性）</li>
          <li>テスト・ドキュメント・リリースノートの要否</li>
          <li>コメントは「何をどう直すか」が伝わるように具体的に</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/pull-requests"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — プルリクエスト
          </a>
        </p>
      </div>
    </article>
  );
}
