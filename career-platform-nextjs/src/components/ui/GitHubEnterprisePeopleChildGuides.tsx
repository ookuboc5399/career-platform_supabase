'use client';

import Link from 'next/link';

export function GitHubEnterprisePeopleChildGuideBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-sec-people-members':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Members</h2>
          <p className="text-gray-600 mb-6">
            Enterprise または Organization の <strong>Members</strong>{' '}
            一覧で、所属メンバー・ロール・最終アクティビティを確認し、棚卸しと権限の見直しを行います。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-administrators':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Administrators</h2>
          <p className="text-gray-600 mb-6">
            <strong>Administrators</strong>（Enterprise 管理者・Organization Owner
            など）は設定変更や請求・セキュリティポリシーに強い権限を持つため、人数と継承ルールを明確にします。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-enterprise-teams':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Enterprise teams</h2>
          <p className="text-gray-600 mb-6">
            <strong>Enterprise teams</strong> を使うと、複数 Organization にまたがるメンバー構成を Enterprise
            側で揃え、監査とオンボーディングを簡素化できます。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-outside-collaborators':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Outside collaborators</h2>
          <p className="text-gray-600 mb-6">
            <strong>Outside collaborators</strong> は Organization メンバーではなく特定リポジトリのみアクセスするアカウントです。メンバー化の判断と監査ログ上の区別が重要です。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-enterprise-roles':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Enterprise roles</h2>
          <p className="text-gray-600 mb-6">
            Enterprise レベルのロール（例: 請求・監査・サポートに関する権限）を整理し、職務分離と最小権限の原則に沿って割り当てます。
          </p>
          <EnterpriseRolesSubchapterLinks />
        </article>
      );
    case 'github-enterprise-sec-people-enterprise-roles-role-management':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise roles — Role management</h2>
          <p className="text-gray-600 mb-6">
            ロールの<strong>作成・編集・削除</strong>、Enterprise ポリシーとの整合、不要ロールの棚卸しなど、ロール定義そのものの管理を行います。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-enterprise-roles-role-assignments':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise roles — Role assignments</h2>
          <p className="text-gray-600 mb-6">
            ユーザーまたはグループへの<strong>ロール割り当て</strong>の追加・変更・解除をレビューし、監査証跡と照らして過剰権限を減らします。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-organization-roles':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Organization roles</h2>
          <p className="text-gray-600 mb-4">
            Organization の <strong>Owner / Member</strong> に加え、下記の <strong>Organization roles</strong>{' '}
            で組織・リポジトリ設定への権限を細かく付与できます。リポジトリ権限は、原則として組織内の<strong>すべてのリポジトリ</strong>にまたがって付与されます。
          </p>

          <section className="mb-10 rounded-lg border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-600 dark:bg-slate-900/40">
            <h3 className="mt-0 text-lg font-semibold text-slate-900 dark:text-slate-100">Organization roles</h3>
            <p className="mb-0 text-slate-700 dark:text-slate-300 leading-relaxed">
              Organization roles are used to grant access to specific organization and repository settings.
              Repository permissions are granted across every repository in the organization.{' '}
              <a
                href="https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/using-custom-organization-roles"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 underline dark:text-blue-400"
              >
                Learn more about custom organization roles
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Custom organization roles</h3>
            <p className="text-gray-600">
              Create a role and add permissions to it. You can create up to <strong>20 custom roles</strong> in
              your enterprise.
            </p>
            <div className="not-prose mt-4 rounded-md border border-dashed border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="m-0 font-medium">0 custom roles</p>
              <p className="mt-1 mb-0 text-amber-800/90 dark:text-amber-200/90">You do not have any custom roles</p>
              <p className="mt-2 mb-0 text-xs text-amber-900/80 dark:text-amber-200/80">
                管理画面上の初期状態の例です。必要に応じてロールを作成し、権限を積み上げます。
              </p>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pre-defined roles</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              以下は GitHub が用意する定義済みロールと、その説明（公式 UI の文言に沿った英語）です。
            </p>
            <ul className="list-none space-y-5 pl-0 text-gray-700 dark:text-gray-300">
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">All-repository read</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants read access to all repositories in the organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">All-repository write</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants write access to all repositories in the organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">All-repository triage</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants triage access to all repositories in the organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">All-repository maintain</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants maintenance access to all repositories in the organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">All-repository admin</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants admin access to all repositories in the organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">Apps manager</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants the ability to manage all GitHub Apps owned by an organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">CI/CD Admin</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants admin access to manage Actions policies, runners, runner groups, network configurations,
                  secrets, variables, and usage metrics for an organization.
                </p>
              </li>
              <li>
                <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">Security manager</p>
                <p className="mt-1 mb-0 text-sm leading-relaxed">
                  Grants the ability to manage security policies, security alerts, and security configurations for an
                  organization and all its repositories.
                </p>
              </li>
            </ul>
          </section>
        </article>
      );
    case 'github-enterprise-sec-people-invitations':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Invitations</h2>
          <p className="text-gray-600 mb-6">
            保留中の <strong>Invitations</strong> をレビューし、期限切れ・不要招待の取り消し、再送ポリシーを運用に落とし込みます。
          </p>
        </article>
      );
    case 'github-enterprise-sec-people-failed-invitations':
      return (
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">People — Failed invitations</h2>
          <p className="text-gray-600 mb-6">
            <strong>Failed invitations</strong> の原因（メール未到達・SSO 制約・既存アカウントとの衝突など）を確認し、再招待または別フロー（EMU / IdP）へ切り替えます。
          </p>
        </article>
      );
    default:
      return null;
  }
}

/** Enterprise roles 配下のサブチャプターへのリンク */
function EnterpriseRolesSubchapterLinks() {
  const items: { id: string; label: string }[] = [
    {
      id: 'github-enterprise-sec-people-enterprise-roles-role-management',
      label: 'Role management',
    },
    {
      id: 'github-enterprise-sec-people-enterprise-roles-role-assignments',
      label: 'Role assignments',
    },
  ];
  return (
    <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Enterprise roles のサブチャプター
      </h3>
      <ul className="m-0 list-none space-y-2 p-0 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/programming/github/chapters/${item.id}`}
              className="text-blue-600 underline dark:text-blue-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** People 概要（github-enterprise-org-people）内のサブ項目リンク */
export function GitHubEnterprisePeopleSubchapterLinks() {
  const items: { id: string; label: string }[] = [
    { id: 'github-enterprise-sec-people-members', label: 'Members' },
    { id: 'github-enterprise-sec-people-administrators', label: 'Administrators' },
    { id: 'github-enterprise-sec-people-enterprise-teams', label: 'Enterprise teams' },
    { id: 'github-enterprise-sec-people-outside-collaborators', label: 'Outside collaborators' },
    { id: 'github-enterprise-sec-people-enterprise-roles', label: 'Enterprise roles' },
    { id: 'github-enterprise-sec-people-organization-roles', label: 'Organization roles' },
    { id: 'github-enterprise-sec-people-invitations', label: 'Invitations' },
    { id: 'github-enterprise-sec-people-failed-invitations', label: 'Failed invitations' },
  ];
  return (
    <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
      <ul className="m-0 list-none space-y-2 p-0 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/programming/github/chapters/${item.id}`}
              className="text-blue-600 underline dark:text-blue-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
