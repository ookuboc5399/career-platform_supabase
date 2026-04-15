'use client';

export default function JiraFiltersJqlGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 フィルターと JQL 入門</h2>
      <p className="text-gray-600 mb-8">
        <strong>JQL（Jira Query Language）</strong> は課題を検索するためのクエリ言語です。保存フィルターにするとダッシュボードのガジェットやボードのフィルタとして再利用できます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">基本の例</h3>
        <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-x-auto text-gray-800">
{`project = PROJ AND status = "In Progress"
assignee = currentUser() AND resolution = Unresolved
created >= -7d ORDER BY created DESC`}
        </pre>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">活用シーン</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>自分の未解決課題、今スプリントのスコープ、ブロッカーの一覧</li>
          <li>リリース前の「未マージだが Jira は完了」などの突合（他ツールと組み合わせ）</li>
        </ul>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/" target="_blank" rel="noopener noreferrer" className="underline">
            JQL による高度な検索（Atlassian サポート）
          </a>
        </p>
      </div>
    </article>
  );
}
