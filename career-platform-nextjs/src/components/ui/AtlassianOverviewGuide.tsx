'use client';

export default function AtlassianOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🏢 Atlassian エコシステムの概要</h2>
      <p className="text-gray-600 mb-8">
        <strong>Atlassian</strong> は Jira・Confluence を中心に、開発・ドキュメント・IT 運用を横断するクラウド製品群を提供します。1 つの <strong>サイト</strong> に複数製品を載せ、シングルサインオンで使うのが一般的です。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">製品の役割（例）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Jira:</strong> 課題・プロジェクト・サービスデスク
          </li>
          <li>
            <strong>Confluence:</strong> 仕様書、議事録、ナレッジベース
          </li>
          <li>
            <strong>Bitbucket / Compass / Atlas 等:</strong> ソース管理、サービスカタログ、目標共有など（プランによる）
          </li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">導入パターン</h3>
        <p className="text-gray-600">
          小規模では「Jira + Confluence」から始め、IT サービスが増えたら JSM、セキュリティ要件で Guard や Access を検討する、といった段階的拡張が多いです。
        </p>
      </section>
    </article>
  );
}
