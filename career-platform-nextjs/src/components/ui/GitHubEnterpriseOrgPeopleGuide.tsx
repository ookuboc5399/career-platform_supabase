'use client';

import { GitHubEnterprisePeopleSubchapterLinks } from '@/components/ui/GitHubEnterprisePeopleChildGuides';

export default function GitHubEnterpriseOrgPeopleGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization の People</h2>
      <p className="text-gray-600 mb-8">
        <strong>People</strong> では、Organization メンバー・ロール（Owner / Member）・招待・2FA 要件など、<strong>人とアカウント単位</strong>の管理を行います。リポジトリ権限の細かい割り当ては Team やリポジトリ設定と組み合わせます。
      </p>

      <GitHubEnterprisePeopleSubchapterLinks />

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">主な作業</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>メンバーの招待とロール確認</li>
          <li>失効した招待の再送・取り消し</li>
          <li>外部コラボレーター（Outside collaborator）と Org メンバーの違いの整理</li>
          <li>Organization 必須の 2FA・SAML SSO などセキュリティポリシーとの整合</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ベース権限（Base permissions）</h3>
        <p className="text-gray-600">
          Organization の <strong>Member privileges</strong> で、メンバー全員にデフォルトで付与するリポジトリ権限の上限を決めます。ここが広すぎると不要な閲覧・書き込みが増えるため、<strong>必要最小限</strong>に抑えるのが一般的です。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/organizations/managing-membership-in-your-organization"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — Organization のメンバーシップ
          </a>
        </p>
      </div>
    </article>
  );
}
