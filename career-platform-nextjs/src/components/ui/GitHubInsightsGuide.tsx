'use client';

export default function GitHubInsightsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📊 GitHub Insights とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Insights は、リポジトリや Organization の活動を可視化する分析機能です。コミット数、PR のマージ状況、コントリビューターの活動などをグラフやレポートで確認できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📈 リポジトリレベルの Insights
        </h3>
        <p className="text-gray-600 mb-4">
          リポジトリの <strong>Insights</strong> タブでは、以下を確認できます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
          <li><strong>Pulse:</strong> 直近の PR、Issue、コミットのサマリー</li>
          <li><strong>Contributors:</strong> コントリビューターごとの追加・削除行数</li>
          <li><strong>Commits:</strong> 日別のコミット数</li>
          <li><strong>Code frequency:</strong> コードの追加・削除の推移</li>
          <li><strong>Network:</strong> ブランチとマージのグラフ</li>
          <li><strong>Traffic:</strong> クローン数、訪問者数（リポジトリオーナー向け）</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🏢 Organization レベルの Insights（Enterprise）
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Enterprise では、Organization 全体の活動を分析する <strong>Insights</strong> が利用可能です。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
          <li><strong>コントリビューション:</strong> メンバーごとのコミット、PR、レビュー数</li>
          <li><strong>リポジトリ活動:</strong> リポジトリごとのアクティビティ推移</li>
          <li><strong>コードレビュー:</strong> レビュー時間、待ち時間の分析</li>
          <li><strong>カスタムレポート:</strong> データのエクスポートやダッシュボードのカスタマイズ（Enterprise プランによる）</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔒 プライバシーと権限
        </h3>
        <p className="text-gray-600 mb-4">
          Traffic や一部の Insights は、リポジトリの Admin 権限を持つユーザーのみが閲覧できます。Organization の Insights は、管理者や特定のロールに制限される場合があります。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/repositories/viewing-activity-and-data-in-your-repository/about-repository-graphs" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - About repository graphs
          </a>
        </p>
      </div>
    </article>
  );
}
