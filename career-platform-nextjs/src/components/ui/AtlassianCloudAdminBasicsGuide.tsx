'use client';

export default function AtlassianCloudAdminBasicsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Cloud サイトとユーザー管理の基礎</h2>
      <p className="text-gray-600 mb-8">
        Atlassian Cloud では <strong>Organization</strong>（組織）の下に <strong>サイト</strong>（製品がぶら下がる URL）があり、管理者ロールが階層的に分かれます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ユーザーとグループ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>ユーザーを招待し、<strong>グループ</strong>に入れて権限をまとめて付与する</li>
          <li>製品ごと（Jira / Confluence）に「その製品を使えるか」を制御</li>
          <li>SCIM や IdP（Google Workspace、Entra ID 等）と連携してプロビジョニングする構成も一般的</li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">監査とコンプライアンス</h3>
        <p className="text-gray-600">
          管理者は監査ログでログイン・権限変更・データエクスポートなどを追跡します。企業ポリシーに合わせて IP 許可や 2FA 要件を Organization レベルで揃えます。
        </p>
      </section>
    </article>
  );
}
