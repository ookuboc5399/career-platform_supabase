'use client';

import Link from 'next/link';

export default function AzureEntraIdGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🏢 Microsoft Entra ID（旧 Azure AD）とは？
      </h2>
      <p className="text-gray-600 mb-8">
        Microsoft Entra ID は、Microsoft が提供するクラウド型のアイデンティティ・アクセス管理（IAM）サービスです。ユーザー認証、SSO、MFA、条件付きアクセス、アプリケーションのプロビジョニング（SCIM）などを提供します。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主な機能
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>SSO（シングルサインオン）:</strong> 一度のログインで複数のアプリにアクセス</li>
          <li><strong>MFA（多要素認証）:</strong> パスワードに加えて SMS、認証アプリ、ハードウェアキーで強化</li>
          <li><strong>条件付きアクセス:</strong> デバイス、場所、リスクに応じたアクセス制御</li>
          <li><strong>エンタープライズアプリケーション:</strong> SaaS アプリの追加、SAML/OIDC 設定</li>
          <li><strong>SCIM プロビジョニング:</strong> ユーザー・グループの自動作成・更新・削除</li>
        </ul>
      </section>

      <section className="mb-10 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-2">関連チャプター</p>
        <p>
          ユーザーを<strong>一括で登録</strong>する手順（CSV・ゲスト招待・Graph 等）は{' '}
          <Link href="/programming/azure/chapters/azure-entra-bulk-user-registration" className="text-blue-600 underline hover:no-underline">
            ユーザー一括登録
          </Link>
          を参照してください。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔗 GitHub との連携
        </h3>
        <p className="text-gray-600 mb-4">
          Entra ID を IdP として GitHub Organization の SAML SSO に設定すると、社内アカウントで GitHub にログインできます。SCIM を有効にすると、Entra ID のユーザー・グループを GitHub の Organization メンバーに自動プロビジョニングできます。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://learn.microsoft.com/ja-jp/entra/identity/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Microsoft Learn - Microsoft Entra ID
          </a>
        </p>
      </div>
    </article>
  );
}
