'use client';

export default function AzureOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔷 Azure とは？
      </h2>
      <p className="text-gray-600 mb-8">
        Microsoft Azure は、Microsoft が提供するクラウドプラットフォームです。仮想マシン、ストレージ、データベース、AI/ML、IoT など、多様なサービスをオンデマンドで利用できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主なサービスカテゴリ
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Compute:</strong> 仮想マシン（VM）、App Service、Azure Functions、Container Instances</li>
          <li><strong>Storage:</strong> Blob Storage、File Storage、Queue Storage、Disk Storage</li>
          <li><strong>Database:</strong> Azure SQL Database、Cosmos DB、Azure Database for PostgreSQL/MySQL</li>
          <li><strong>Identity:</strong> Microsoft Entra ID（旧 Azure AD）— SSO、MFA、条件付きアクセス</li>
          <li><strong>AI/ML:</strong> Azure OpenAI Service、Cognitive Services、Machine Learning</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🏢 企業での活用
        </h3>
        <p className="text-gray-600 mb-4">
          Entra ID を IdP として利用し、GitHub、Slack、Salesforce など各種 SaaS と SSO や SCIM で連携する構成が一般的です。Azure ポータルや Azure CLI でリソースを管理できます。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://learn.microsoft.com/ja-jp/azure/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Microsoft Learn - Azure ドキュメント
          </a>
        </p>
      </div>
    </article>
  );
}
