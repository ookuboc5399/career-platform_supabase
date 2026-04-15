'use client';

export default function AzureScimGitHubProvisioningGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔄 Azure SCIM と GitHub のプロビジョニング設定
      </h2>
      <p className="text-gray-600 mb-8">
        SCIM（System for Cross-domain Identity Management）を使うと、Microsoft Entra ID のユーザー・グループを GitHub Organization のメンバーに自動でプロビジョニングできます。退職者のアカウント削除や、組織変更の反映を手動ではなく自動化できます。
      </p>

      {/* 前提条件 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📋 前提条件
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
          <li>GitHub Enterprise Cloud の Organization を利用していること</li>
          <li>Organization の Owner 権限があること</li>
          <li>Microsoft Entra ID（旧 Azure AD）のテナントがあること</li>
          <li>Entra ID の全体管理者またはアプリケーション管理者の権限があること</li>
        </ul>
      </section>

      {/* Step 1: GitHub 側の設定 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Step 1: GitHub で SCIM を有効化
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
          <li>GitHub の Organization ページで <strong>Settings</strong> を開く</li>
          <li>左サイドバーの <strong>Authentication security</strong> をクリック</li>
          <li><strong>Enable SAML single sign-on</strong> を有効にし、IdP の情報（Entra ID の SSO URL、証明書など）を設定</li>
          <li>同じ画面で <strong>Enable SCIM</strong> を有効にする</li>
          <li>表示される <strong>SCIM endpoint URL</strong> と <strong>Access token</strong> をコピー（後で Entra ID で使用）</li>
        </ol>
        <p className="text-gray-600 mb-4">
          <strong>注意:</strong> SCIM は SAML SSO が有効な Organization でのみ利用可能です。先に SAML SSO を設定してください。
        </p>
      </section>

      {/* Step 2: Entra ID でアプリを追加 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Step 2: Entra ID で GitHub Enterprise Cloud アプリを追加
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
          <li>Azure ポータル（<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">portal.azure.com</code>）にログイン</li>
          <li><strong>Microsoft Entra ID</strong> → <strong>エンタープライズアプリケーション</strong> → <strong>新しいアプリケーション</strong></li>
          <li>「GitHub Enterprise Cloud - Organization」を検索して追加（またはギャラリー外アプリとして手動で SAML + SCIM を設定）</li>
          <li>アプリを開き、<strong>プロビジョニング</strong> をクリック</li>
        </ol>
      </section>

      {/* Step 3: プロビジョニング設定 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Step 3: プロビジョニングの設定
        </h3>
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">管理者の資格情報</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li><strong>テナント URL:</strong> GitHub の SCIM endpoint URL（例: <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">https://api.github.com/scim/v2/organizations/your-org-id</code>）</li>
          <li><strong>シークレット トークン:</strong> GitHub で発行した SCIM の Access token</li>
        </ul>
        <p className="text-gray-600 mb-4">
          「接続テスト」を実行し、成功することを確認してから保存します。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">マッピング</h4>
        <p className="text-gray-600 mb-4">
          デフォルトのマッピングで、Entra ID の <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">userPrincipalName</code> や <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">mail</code> が GitHub の <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">userName</code> にマッピングされます。必要に応じてカスタマイズ可能です。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">スコープ</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li><strong>同期するユーザーのみ:</strong> 特定のユーザーやグループを選択してプロビジョニング対象にできる</li>
          <li><strong>割り当てられたユーザーとグループのみ:</strong> アプリに割り当てられたユーザー・グループのみ同期</li>
        </ul>
      </section>

      {/* Step 4: プロビジョニングの開始 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Step 4: プロビジョニングの開始
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
          <li>プロビジョニング設定画面で <strong>プロビジョニング状態</strong> を「オン」にする</li>
          <li>初回は「今すぐプロビジョニング」で全ユーザーを同期することも可能</li>
          <li>以降は定期的（約 40 分間隔）に自動同期される</li>
        </ol>
      </section>

      {/* グループベースのプロビジョニング */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📂 グループベースのプロビジョニング（GitHub EMU の場合）
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Enterprise Managed Users（EMU）を利用している場合、Entra ID のグループを GitHub の Team にマッピングできます。グループにユーザーを追加すると、対応する GitHub Team に自動でメンバーが追加されます。
        </p>
        <p className="text-gray-600 mb-4">
          EMU では、GitHub 側のユーザーは Entra ID 経由でしか作成されません。SCIM のグループマッピングを設定することで、組織の部門構造を GitHub の Team 構造に反映できます。
        </p>
      </section>

      {/* トラブルシューティング */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚠️ よくある問題
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li><strong>接続テストが失敗する:</strong> SCIM URL とトークンが正しいか確認。GitHub のトークンは再発行すると古いものは無効になる</li>
          <li><strong>ユーザーがプロビジョニングされない:</strong> スコープで対象ユーザーが含まれているか、アプリに割り当てられているか確認</li>
          <li><strong>既存の GitHub ユーザーと競合:</strong> SAML の識別子（userName）が既存アカウントのメールと一致する必要がある</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/managing-iam-with-enterprise-managed-users/configuring-scim-provisioning-for-enterprise-managed-users" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - SCIM プロビジョニング
          </a>
          、
          <a href="https://learn.microsoft.com/ja-jp/entra/app-provisioning/github-connector" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Microsoft Learn - GitHub コネクタ
          </a>
        </p>
      </div>
    </article>
  );
}
