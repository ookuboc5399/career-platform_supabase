'use client';

export default function JiraOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Jira の概要と製品ライン</h2>
      <p className="text-gray-600 mb-8">
        <strong>Jira</strong> は Atlassian の課題追跡・プロジェクト管理の中核製品です。用途に応じて製品が分かれており、契約・画面で見える機能が異なります。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">主な製品</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Jira Software:</strong> 開発チーム向け。スクラム・カンバン、バックログ、スプリントが中心。
          </li>
          <li>
            <strong>Jira Work Management:</strong> ビジネスチーム向けの軽めのタスク管理（マーケ・人事・法務など）。
          </li>
          <li>
            <strong>Jira Service Management:</strong> IT・ビジネス向けサービスデスク。リクエスト、SLA、承認フロー。
          </li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Cloud と Data Center</h3>
        <p className="text-gray-600">
          <strong>Cloud</strong> は Atlassian がホストするサブスクリプション型。新規はほぼ Cloud です。
          <strong> Data Center</strong> は自社または指定環境に設置する自己管理型で、大規模・規制要件に選ばれることがあります。
        </p>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://www.atlassian.com/ja/software/jira" target="_blank" rel="noopener noreferrer" className="underline">
            Atlassian — Jira
          </a>
        </p>
      </div>
    </article>
  );
}
