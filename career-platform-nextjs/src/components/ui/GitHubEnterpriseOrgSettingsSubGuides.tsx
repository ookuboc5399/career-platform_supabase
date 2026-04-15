'use client';

import Link from 'next/link';

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:no-underline dark:text-blue-400"
    >
      {children}
    </a>
  );
}

/** `**太字**` を <strong> に展開（単純な偶数ペア想定） */
function TextWithBold({ text }: { text: string }) {
  const parts = text.split(/\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        Organization の <strong>Settings › Repository</strong> では、ベース権限と連動したリポジトリ作成・フォーク・デフォルトブランチ名、リポジトリの可視性ルールなど、組織横断のリポジトリポリシーをまとめて管理します。
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
        <li>メンバーが作成できるリポジトリの種類・可視性の上限</li>
        <li>フォークや削除に関する許可範囲</li>
        <li>新規リポジトリのデフォルトブランチ名などの既定値</li>
      </ul>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-general"
              className="text-blue-600 underline dark:text-blue-400"
            >
              General
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-topics"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Topics
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-rulesets"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Rulesets
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-rule-insights"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Rule insights
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-bypass-requests"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Bypass requests
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-repository-custom-properties"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Custom properties
            </Link>
          </li>
        </ul>
      </section>
      <p className="text-sm text-gray-500">
        ブランチ保護や CODEOWNERS などリポジトリ単位の詳細は、{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-org-repositories"
          className="text-blue-600 underline dark:text-blue-400"
        >
          Repositories
        </Link>{' '}
        チャプターと併せて整理すると運用しやすくなります。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/organizations/managing-organization-settings/managing-repository-settings-for-your-organization">
            Organization のリポジトリ設定の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryGeneralGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — General</h2>
      <p className="text-gray-600 mb-6">
        Repository の <strong>General</strong> では、デフォルトブランチ名、コミット signoff、リリース不変化、新規リポジトリの既定ラベルなど、Organization 全体の既定値を管理します。
      </p>
      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Repository default branch
        </h3>
        <p className="text-gray-600 mb-4">
          新規リポジトリのデフォルトブランチ名を選択します。ワークフロー都合や既存連携が{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">master</code>{' '}
          を必要とする場合は変更が必要になることがあります。個別リポジトリ側で後から変更も可能です。
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Commit signoff</h3>
        <p className="text-gray-600 mb-4">
          GitHub Web UI からのコミット時に signoff を必須化するかを設定します。signoff は、コミットがリポジトリ規約（代表例: DCO）に準拠していることを貢献者が表明する仕組みです。
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Releases</h3>
        <p className="text-gray-600 mb-4">
          immutable releases（不変リリース）を許可するかを設定します。不変リリースを有効にすると、公開後のタグやアセット改変を防ぎ、サプライチェーン観点の安全性を高められます。
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Repository labels</h3>
        <p className="text-gray-600 mb-3">
          新規リポジトリ作成時に自動で入る既定ラベルを管理します（例: 9 labels）。
        </p>
        <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">bug</dt>
            <dd>Something isn't working</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">documentation</dt>
            <dd>Improvements or additions to documentation</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">duplicate</dt>
            <dd>This issue or pull request already exists</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">enhancement</dt>
            <dd>New feature or request</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">good first issue</dt>
            <dd>Good for newcomers</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">help wanted</dt>
            <dd>Extra attention is needed</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">invalid</dt>
            <dd>This doesn't seem right</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">question</dt>
            <dd>Further information is requested</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">wontfix</dt>
            <dd>This will not be worked on</dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/organizations/managing-organization-settings/managing-repository-settings-for-your-organization">
            Organization のリポジトリ設定の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryTopicsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — Topics</h2>
      <p className="text-gray-600 mb-6">
        <strong>Topics</strong> は、リポジトリの分類・検索性を高めるためのタグ運用です。組織で命名規則を決めると、横断検索や所有管理がしやすくなります。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryRulesetsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — Rulesets</h2>
      <p className="text-gray-600 mb-6">
        <strong>Rulesets</strong> では、ブランチ保護やプッシュ制限などのルールをまとめて適用します。例外運用を減らし、組織標準のガードレールを実装します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryRuleInsightsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — Rule insights</h2>
      <p className="text-gray-600 mb-6">
        <strong>Rule insights</strong> では、ルール適用状況や拒否イベントを確認し、どのポリシーが開発フローに影響しているかを分析できます。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryBypassRequestsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — Bypass requests</h2>
      <p className="text-gray-600 mb-6">
        <strong>Bypass requests</strong> は、Rulesets の例外申請フローです。緊急対応時の回避を許容しつつ、承認ログを残して統制と速度を両立します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsRepositoryCustomPropertiesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository — Custom properties</h2>
      <p className="text-gray-600 mb-6">
        <strong>Custom properties</strong> でリポジトリに独自メタデータ（例: システム区分、データ分類、オーナーチーム）を付け、ポリシー適用や棚卸しを自動化しやすくします。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCodespacesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Codespaces（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Codespaces</strong> では、Organization 内で Codespaces を誰が使えるか、課金・シークレット・開発コンテナ既定（devcontainer）やマシンタイプの方針など、組織レベルの利用条件を設定します。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-codespaces-general"
              className="text-blue-600 underline dark:text-blue-400"
            >
              General
            </Link>
            <span className="text-gray-600 dark:text-gray-400">
              {' '}
              — 基本設定・既定値・利用対象などの土台を整理
            </span>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-codespaces-policies"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Policies
            </Link>
            <span className="text-gray-600 dark:text-gray-400">
              {' '}
              — セキュリティと利用制御（アクセス範囲・制限）を整理
            </span>
          </li>
        </ul>
      </section>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
        <li>利用者の範囲（シート・ポリシーはプラン・契約に依存）</li>
        <li>Organization シークレットや prebuild など運用面の前提</li>
        <li>セキュリティ（アクセス可能なリポジトリ範囲、監査との連携）</li>
      </ul>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/codespaces/managing-codespaces-for-your-organization">
            Organization の Codespaces の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCodespacesGeneralGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Codespaces — General</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Codespaces › General</strong>{' '}
        では、Organization の Codespaces 利用における基本設定をまとめます。誰が使えるか、どのリポジトリで有効化するか、既定の開発体験をどう揃えるかを決める入口です。
      </p>
      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Codespaces access</h3>
        <p className="text-gray-600 mb-3">
          Organization メンバーの Codespaces 利用可否を、<strong>private / internal リポジトリ</strong>に対して制御します。public リポジトリでは常に利用可能です。
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Codespaces を有効化すると、GitHub の追加プロダクト・機能の利用規約に同意し、Organization を代表して承認する扱いになります。
        </p>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Disabled</dt>
            <dd>Organization 所有の private / internal リポジトリで Codespaces を無効化します。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">
              Enable for specific members or teams
            </dt>
            <dd>
              指定したメンバーまたは Team に対して、Organization 所有の private / internal リポジトリで利用を許可します。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Enable for all members</dt>
            <dd>
              すべての Organization メンバーに対して、Organization 所有の private / internal リポジトリで利用を許可します。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">
              Enable for all members and outside collaborators
            </dt>
            <dd>
              すべての Organization メンバーと outside collaborators に対して利用を許可します。
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Codespace ownership
        </h3>
        <p className="text-gray-600 mb-4">
          Organization メンバーが Organization 所有リポジトリで作成した codespace の所有者を制御します。所有者により、課金先・適用ポリシー・監査ログ送信先が決まります。
        </p>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Organization ownership</dt>
            <dd>
              メンバーが Organization リポジトリ上で作成したすべての codespace は Organization 所有になります。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">User ownership</dt>
            <dd>作成したメンバー本人の所有になります。</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Access and security（Deprecated）
        </h3>
        <p className="text-gray-600 mb-4">
          旧設定として、codespace から他の Organization 所有リポジトリへの読み取りアクセス範囲を制御する項目があります。
        </p>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Disabled</dt>
            <dd>作成元リポジトリのみにアクセスを制限します。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">All repositories</dt>
            <dd>
              Organization 内のリポジトリで作成された codespace が、他の Organization 所有リポジトリへアクセスできます。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Selected repositories</dt>
            <dd>
              指定されたリポジトリで作成された codespace のみ、他の Organization 所有リポジトリへアクセスできます。
            </dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/codespaces/managing-codespaces-for-your-organization">
            Organization の Codespaces の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCodespacesPoliciesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Codespaces — Policies</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Codespaces › Policies</strong>{' '}
        では、Codespaces の利用ポリシーを組織で統一します。アクセス可能リポジトリ、ネットワーク境界、セキュリティ関連ルールを決め、利便性と統制のバランスを取ります。
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
        <li>利用可能なリポジトリ範囲とアクセス制御</li>
        <li>機密情報取り扱いとシークレット運用ルール</li>
        <li>監査・コンプライアンス要件に合わせた制限</li>
      </ul>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/codespaces/reference/security-in-github-codespaces">
            GitHub Codespaces のセキュリティ
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPlanningGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Planning（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Planning</strong> では、Issues・Projects など計画系機能に関する Organization 既定や権限に近い項目をまとめて扱います（UI のラベルは変更されることがあるため、実際の左ナビで確認してください）。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-planning-projects"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Projects
            </Link>
            <span className="text-gray-600 dark:text-gray-400"> — Organization の Planning における Projects 関連設定の整理</span>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-planning-issue-types"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Issue Types
            </Link>
            <span className="text-gray-600 dark:text-gray-400"> — 組織共通の issue の種類の作成・編集・無効化</span>
          </li>
        </ul>
      </section>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
        <li>Organization 横断のプロジェクト運用とリポジトリ権限の関係</li>
        <li>テンプレートやワークフロー自動化との役割分担</li>
      </ul>
      <p className="text-sm text-gray-500">
        Organization 横断の GitHub Projects の操作手順は{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-org-projects"
          className="text-blue-600 underline dark:text-blue-400"
        >
          Organizations › Projects
        </Link>{' '}
        チャプターも参照してください。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/issues">GitHub Issues と Projects（ドキュメント入口）</DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPlanningProjectsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Planning — Projects</h2>
      <p className="text-gray-600 mb-6">
        <strong>Projects</strong> は、GitHub 上で作業を整理し優先順位づけするための機能です。特定機能の実装管理、包括的なロードマップ、リリースチェックリストなど、用途に応じてプロジェクトを作成できます。
      </p>
      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Enable Projects for the organization
        </h3>
        <p className="text-gray-600 mb-4">
          この設定を有効にすると、Organization メンバーがプロジェクトを作成できるようになります。メンバーは Organization 所有リポジトリの issue を横断的に集約し、進捗トラッキングに利用できます。
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Allow members to change project visibilities for this organization
        </h3>
        <p className="text-gray-600 mb-0">
          有効時は、プロジェクトの管理権限を持つメンバーが公開範囲（public / private）を変更できます。無効時は、公開範囲の変更は Organization Owner のみ可能です。なお、プロジェクトは既定で private です。
        </p>
      </section>
      <p className="text-sm text-gray-500 mb-6">
        画面操作の詳細は{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-org-projects"
          className="text-blue-600 underline dark:text-blue-400"
        >
          Organizations › Projects
        </Link>{' '}
        を参照してください。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects">
            Projects について
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPlanningIssueTypesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Planning — Issue Types</h2>
      <p className="text-gray-600 mb-6">
        <strong>Issue types</strong> では、Organization 向けの issue 種別をカスタマイズします。Issue type は Organization 配下のリポジトリで issue を分類・管理するために使います。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">3 types（max 25）</p>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Task</dt>
            <dd>A specific piece of work</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Bug</dt>
            <dd>An unexpected problem or behavior</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Feature</dt>
            <dd>A request, idea, or new functionality</dd>
          </div>
        </dl>
      </section>
      <p className="text-sm text-gray-500 mb-6">
        既定の 3 種類に加え、組織の運用に合わせて最大 25 種類まで追加できます。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/issues/tracking-your-work-with-issues/configuring-issues/managing-issue-types-in-an-organization">
            組織での課題の種類の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsActionsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Actions</strong> では、Actions の利用可否、実行元の制御、許可アクション、Runner 方針などを Organization レベルで管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsModelsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Models（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Models</strong> では、利用可能モデル、既定モデル、モデル利用の統制を Organization 単位で揃えます。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsWebhooksGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Webhooks（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Webhooks</strong> では、Organization 全体のイベント配信先、署名検証、再配信時の運用方針を管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsDiscussionsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussions（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Discussions</strong> では、Discussion の有効化・カテゴリ運用・モデレーション方針を Organization で統一します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPackagesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Packages（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Packages</strong> では、パッケージ公開範囲、アクセス制御、削除・復元の運用方針を管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPagesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pages（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Pages</strong> では、Pages の公開方針、ビルド運用、ドメイン・証明書管理のガイドラインを組織として定義します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsHostedComputeNetworkingGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Hosted compute networking（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Hosted compute networking</strong>{' '}
        では、GitHub ホスト実行環境と組織ネットワークの接続制御、IP 許可、プライベートネットワーク連携を管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCustomPropertiesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Custom properties（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Custom properties</strong>{' '}
        では、リポジトリや運用対象に付与する組織共通メタデータを定義し、分類・統制・自動化に活用します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAuthenticationSecurityGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Authentication security（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Authentication security</strong>{' '}
        では、2FA・SAML SSO・IP allow list など、Organization の認証とアクセス制御を管理します。以下は設定画面に沿った要点です。
      </p>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Two-factor authentication
        </h3>
        <p className="text-gray-600 mb-3">
          2FA（二要素認証）は、Organization のセキュリティを一段強化します。全員必須にすると、2FA 未設定メンバーは
          Organization リソースへアクセスできなくなります（メンバー自体は設定更新まで残る）。Outside collaborator は
          2FA 未設定時に削除され、通知されます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-3">
          <li>
            <strong>Require two-factor authentication for everyone</strong> — 全メンバーへ 2FA を必須化
          </li>
          <li>
            <strong>Only allow secure two-factor methods（推奨）</strong> — 認証アプリ、passkey、security key、GitHub
            mobile app など安全な方式のみ許可
          </li>
        </ul>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          SAML single sign-on
        </h3>
        <p className="text-gray-600 mb-3">
          SAML SSO を有効化すると、Azure / Okta / OneLogin / Ping Identity / 独自 SAML 2.0
          IdP を使ってメンバーシップ管理と認証強化を行えます。
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Enable SAML authentication</strong> で Organization の SAML 認証を有効にします。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Team synchronization</h3>
        <p className="text-gray-600 mb-3">
          Team synchronization は、構成済み IdP 経由で Team メンバーシップを同期する機能です。
        </p>
        <p className="text-sm text-gray-500">
          現在は <strong>Entra ID</strong> と <strong>Okta</strong> のみ対応（Unsupported identity provider
          表示時は GitHub Support への問い合わせが必要）。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          SSH certificate authorities
        </h3>
        <p className="text-gray-600">
          Organization に紐づく SSH CA の登録状況を管理します。画面で「There are no SSH certificate authorities...」
          と出る場合は未登録状態です。
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IP allow list</h3>
        <p className="text-gray-600 mb-3">
          IP allow list を使うと、アクセス元 IP で Organization リソースへのアクセスを制限できます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-3">
          <li>
            <strong>Enable IP allow list</strong> — 組織リソースへのアクセスを許可 IP のみに制限
          </li>
          <li>
            <strong>Enable IP allow list configuration for installed GitHub Apps</strong> — インストール済み GitHub
            Apps の IP 許可リスト設定を自動構成（App 側がエントリ定義している場合）
          </li>
          <li>
            <strong>Check IP address</strong> — 入力した IP が有効エントリで許可されるか確認
          </li>
        </ul>
        <p className="text-sm text-gray-500">
          まだエントリがない場合は「There are no IP addresses on the allow list yet.」と表示されます。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization">
            Organization のセキュリティ設定を管理する
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAdvancedSecurityGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Advanced Security（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Advanced Security</strong> では、Code scanning、Secret scanning、Dependabot などのセキュリティ機能を組織として統制します。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-advanced-security-configurations"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Configurations
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-advanced-security-global-settings"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Global settings
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAdvancedSecurityConfigurationsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Advanced Security — Configurations
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Security configurations</strong> では、リポジトリ保護状態を揃えるためにセキュリティ設定を定義して適用します。
      </p>

      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">保護状況（例）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>Dependabot:</strong> 100% of repositories protected
          </li>
          <li>
            <strong>Code scanning:</strong> 0% of repositories protected
          </li>
          <li>
            <strong>Secret scanning:</strong> 50% of repositories protected
          </li>
        </ul>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Enterprise configurations（Managed by Nomura Research Institute, Ltd.-ptn (Demo)）
        </h3>
        <p className="text-gray-600 mb-2">
          <strong>GitHub recommended — GitHub Advanced Security</strong>
        </p>
        <p className="text-gray-600 mb-3">
          Dependabot / secret scanning / code scanning の推奨設定をまとめた構成です（例: 0 repositories）。
        </p>
        <p className="text-sm text-gray-500">
          Tip: As a Nomura Research Institute, Ltd.-ptn (Demo) admin, you can manage okubo-test
          configurations in enterprise settings.
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Apply configurations
        </h3>
        <p className="text-gray-600">
          19 GitHub Advanced Security licenses available, 1 in use by Nomura Research Institute,
          Ltd.-ptn (Demo). リポジトリを選択して構成を適用し、ライセンス消費状況を確認します。
        </p>
      </section>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAdvancedSecurityGlobalSettingsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Advanced Security — Global settings
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Global Advanced Security settings</strong>{' '}
        は、親機能が有効なこの Organization の全リポジトリに適用されます。これらを有効にすると、GitHub が
        Organization リポジトリに対して読み取り専用の分析を実行することに同意する形になります。
      </p>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Dependabot</h3>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Dependabot rules</dt>
            <dd>Create your own custom rules and manage alert presets.（例: 1 rule enabled）</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Grouped security updates</dt>
            <dd>
              Dependabot alert を解決する更新を、パッケージマネージャー/requirements ディレクトリ単位で 1 つの PR にまとめます。
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">dependabot.yml</code>{' '}
              の group rules で上書きされる場合があります（例: Off）。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Runner type</dt>
            <dd>
              Dependabot のスキャン、version/security update で使うランナーを選択します（例: Standard GitHub runner）。
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Code scanning</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>Recommend the extended query suite</strong> — default setup のリポジトリに extended query
            suite（既定 + 低重大度/低精度クエリ）を推奨。
          </li>
          <li>
            <strong>Copilot Autofix</strong> — CodeQL alert の修正提案を AI で提示（CodeQL default/advanced setup が前提）。
          </li>
          <li>
            <strong>Expand CodeQL analysis</strong> — default setup 時に、より多くのライブラリ/フレームワークを認識。
          </li>
        </ul>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Secret scanning</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm mb-4">
          <li>
            <strong>Push protection</strong>
          </li>
          <li>
            <strong>Pattern configurations</strong> — push protection でブロックするパターンを選択（例: 498 patterns enabled）
          </li>
          <li>
            <strong>Add a resource link in the CLI and web UI when a commit is blocked</strong>
          </li>
          <li>
            <strong>Custom patterns</strong> — 最大 500 パターン定義可能（例: 現在は no custom patterns）
          </li>
        </ul>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          GitHub Advanced Security repositories
        </h3>
        <p className="text-gray-600 mb-3">
          GHAS は private/internal リポジトリの active committer（過去 90 日で push 実績があるユーザー）単位で課金されます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>In Use:</strong> 1 license（organization の unique committers が使用）
          </li>
          <li>
            <strong>Unused:</strong> 19 licenses（available）
          </li>
          <li>
            <strong>Purchased:</strong> 20 licenses（enterprise 購入数）
          </li>
          <li>
            <strong>1 repository:</strong> <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">github_test</code>
          </li>
          <li>
            <strong>1 active committer / 1 unique committer</strong>
          </li>
        </ul>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Grant Dependabot access to repositories
        </h3>
        <p className="text-gray-600 mb-3">
          依存関係更新のため、Dependabot は public と選択された internal/private リポジトリへアクセスします。これらの内容は
          Dependabot update を通じて Organization ユーザーに見えるため、共有したくない場合は private registries の利用を検討してください。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>Repository access</strong> — Dependabot がアクセスできるリポジトリ範囲を選択
          </li>
          <li>
            <strong>Select additional repositories</strong> — 追加対象リポジトリを選択
          </li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/code-security/getting-started/github-security-features">
            GitHub のセキュリティ機能（Dependabot / Code scanning / Secret scanning）
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsDeployKeysGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deploy keys（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Deploy keys</strong> では、リポジトリ連携用の鍵の発行・管理ポリシーを整理し、不要鍵の棚卸しと最小権限を徹底します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsComplianceGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Compliance</strong> では、監査・規制要件に合わせた組織設定と証跡管理を扱います。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsVertifiedApprovedDomainsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vertified and approved domains（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Vertified and approved domains</strong>{' '}
        では、Organization で承認済みドメインを管理し、招待・メール整合性・所属統制に活用します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsSecretsVariablesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Secrets and variables（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Secrets and variables</strong>{' '}
        では、Actions などで使うシークレットと変数のスコープ・配布先・更新運用を組織単位で管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsGitHubAppsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">GitHub Apps（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › GitHub Apps</strong> では、アプリのインストール、権限、承認フローを管理し、外部連携の安全性を担保します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsOauthAppPolicyGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">OAuth app policy（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › OAuth app policy</strong>{' '}
        では、OAuth アプリのアクセス要求を承認制にするか、利用条件をどう制御するかを定義します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPersonalAccessTokensGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Personal access tokens（Organization Settings）
      </h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Personal access tokens</strong> では、PAT の利用可否、スコープ制限、承認ワークフローを組織として統制します。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-personal-access-tokens-settings"
              className="text-blue-600 underline dark:text-blue-400"
            >
              settings
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-personal-access-tokens-active-tokens"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Active tokens
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-personal-access-tokens-prnding-requests"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Prnding requests
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPatSettingsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal access tokens — settings</h2>
      <p className="text-gray-600 mb-6">
        <strong>Personal access tokens</strong>
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
        <li>Fine-grained tokens</li>
        <li>Tokens (classic)</li>
      </ul>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Fine-grained personal access tokens
        </h3>
        <p className="text-gray-600 mb-3">
          By default, fine-grained personal access tokens cannot access content owned by your
          enterprise via the Public API or Git. This includes both public and private resources such
          as repositories.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>Allow access via fine-grained personal access tokens</strong> — API and Git
            access will be allowed using approved organization member&apos;s fine-grained personal access
            tokens.
          </li>
          <li>
            <strong>Restrict access via fine-grained personal access tokens</strong> — Organization
            members will not be allowed to access your organization using a fine-grained personal access
            token.
          </li>
        </ul>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Require approval of fine-grained personal access tokens
        </h3>
        <p className="text-gray-600 mb-3">
          Access requests by organization members can be subject to review by administrator before
          approval.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>
            <strong>Require administrator approval</strong> — All access requests by organization
            members to this organization must be approved before the token is usable.
          </li>
          <li>
            <strong>Do not require administrator approval</strong> — Tokens requested for this
            organization will work immediately, and organization members are not required to provide a
            justification when creating the token.
          </li>
        </ul>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Set maximum lifetimes for personal access tokens
        </h3>
        <p className="text-gray-600 mb-3">
          Control the maximum lifetime for fine-grained personal access tokens in your organizations.
          If set, your organization members can only use fine-grained personal access tokens against
          your resources if the tokens are set to expire within the period you provide.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>Maximum lifetime of fine-grained personal access tokens must be 366 days or less.</li>
          <li>This limit is controlled by your nri-demo enterprise.</li>
          <li>
            <strong>Fine-grained personal access tokens must expire</strong> — Select a maximum
            lifetime for fine-grained personal access tokens to be allowed to access your organizations.
          </li>
        </ul>
      </section>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPatActiveTokensGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal access tokens — Active tokens</h2>
      <p className="text-gray-600 mb-6">
        発行済み token の利用状況・権限・失効期限を確認し、不要 token の失効と定期棚卸しを行います。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsPatPrndingRequestsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Personal access tokens — Prnding requests
      </h2>
      <p className="text-gray-600 mb-6">
        承認待ち token リクエストをレビューし、必要性・スコープ・有効期限を確認して承認/却下します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsScheduledRemindersGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheduled reminders（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Scheduled reminders</strong>{' '}
        では、Issue や Pull Request の定期リマインド配信を組織単位で管理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAnnouncementGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Announcement（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Announcement</strong>{' '}
        では、組織向けアナウンスの配信内容と通知方針を確認します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsLogsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logs（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Logs</strong>{' '}
        では、組織運用に関するログを確認します。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">このチャプターのサブ項目</h3>
        <ul className="m-0 list-none space-y-2 p-0 text-sm">
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-logs-sponsorship-log"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Sponsorship log
            </Link>
          </li>
          <li>
            <Link
              href="/programming/github/chapters/github-enterprise-org-settings-logs-audit-log"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Audit log
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAnnouncementLogsSponsorshipLogGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logs — Sponsorship log</h2>
      <p className="text-gray-600 mb-6">
        Organization の Sponsorship 関連イベントログを確認し、変更履歴を追跡します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsAnnouncementLogsAuditLogGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Logs — Audit log</h2>
      <p className="text-gray-600 mb-6">
        Organization の監査イベントを検索し、設定変更や操作履歴の証跡を確認します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsDeletedRepositoriesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deleted repositories（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Deleted repositories</strong>{' '}
        では、削除済みリポジトリの確認や復元フローを扱います。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsDeveloperSettingsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer settings（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        <strong>Settings › Developer settings</strong>{' '}
        では、開発者向けトークンや連携設定の組織運用ポイントを整理します。
      </p>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotHubGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot（Organization Settings）</h2>
      <p className="text-gray-600 mb-6">
        Organization の <strong>Settings › Copilot</strong> では、シート割当・ポリシー・モデル選択・カスタム指示・コンテンツ除外、クラウドエージェントなど、Copilot 利用の「組織ルール」を一括で管理します。左のシリーズナビから各サブ項目へ進めます。
      </p>
      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">サブ項目の目安</h3>
        <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Access</dt>
            <dd>誰に Copilot ライセンスを割り当てるか、利用の可否の入口です。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Policies</dt>
            <dd>Chat・PR・CLI・Suggestions など機能単位の許可や制限を Organization で統制します。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Models</dt>
            <dd>利用可能なモデルや既定モデルの範囲を組織として揃えます（提供状況はプラン次第）。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Custom instructions</dt>
            <dd>組織共通の指示文で、回答のトーンや守るべき規約を揃えます。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Content exclusion</dt>
            <dd>索引・学習対象から除外するパス等を定め、機密コードの露出リスクを下げます。</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Cloud agent</dt>
            <dd>クラウド上で動くコーディングエージェントの利用可否やポリシーと連携します。</dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/github-copilot-enterprise/overview/github-copilot-enterprise-features">
            GitHub Copilot の Enterprise 機能
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotAccessGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Access</h2>
      <p className="text-gray-600 mb-6">
        <strong>Access</strong> では、Copilot のシートをメンバー・Team にどう割り当てるか、組織としての利用入口を制御します。Enterprise 配下では上位アカウントのポリシーが優先される場合があります。
      </p>
      <p className="text-sm text-gray-500 mb-6">
        請求やシート数の全体像は{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-cost-management"
          className="text-blue-600 underline dark:text-blue-400"
        >
          コスト管理
        </Link>
        、ライセンス割当の考え方は{' '}
        <Link
          href="/programming/github/chapters/github-1773730210830-spmg4sd"
          className="text-blue-600 underline dark:text-blue-400"
        >
          Copilot のライセンス割当
        </Link>
        も参照してください。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/managing-copilot/managing-github-copilot-in-your-organization">
            Organization での GitHub Copilot の管理
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotPoliciesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Policies</h2>
      <p className="text-gray-600 mb-6">
        Organization の <strong>Settings › Copilot › Policies</strong>（画面によっては「GitHub Copilot」見出しの下）では、<strong>アクセスと機能の許可</strong>をメンバー単位で揃えます。ここでの説明は、GitHub の設定 UI に並ぶ項目に対応しています。
      </p>
      <section className="mb-8 not-prose rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="m-0 font-semibold">利用範囲について</p>
        <p className="mt-2 mb-0 text-amber-900/90 dark:text-amber-100/90">
          他 Organization に所属するユーザーが、<strong>自分の側の管理者の許可</strong>によって Copilot 機能にアクセスできる場合があります。Enterprise に接続している環境では、画面上に<strong>管理上の表示</strong>（親 Enterprise 名など）が出ることがあります。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Billing</h3>
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Premium request paid usage
        </h4>
        <p className="text-gray-600 mb-3">
          オンにすると、組み込み枠を超えた<strong>プレミアムリクエスト</strong>が<strong>従量課金</strong>として Enterprise に請求される動きになります（文言は「Enterprise レベルで制御」と表示されることがあります）。組織オーナーは<strong>予算（budget）</strong>を設定して、最大支出を抑えられます。
        </p>
        <p className="text-sm text-gray-500 mb-0">
          請求の全体像は{' '}
          <Link
            href="/programming/github/chapters/github-enterprise-cost-management"
            className="text-blue-600 underline dark:text-blue-400"
          >
            コスト管理
          </Link>
          チャプターも参照してください。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
        <p className="text-gray-600 mb-6 text-sm">
          以下はいずれも、<strong>オン</strong>で Organization メンバー（ライセンス条件を満たす者）に機能を開き、<strong>オフ</strong>で利用を止めるイメージです。プレビュー項目は利用規約（pre-release terms）に同意する意味合いが付くことがあります。
        </p>

        <dl className="space-y-6 text-gray-600 text-sm">
          <PolicyItem
            title="Copilot in GitHub.com"
            body="ブラウザ上の GitHub.com で Copilot Chat を使えるようにします。サブ項目として、自由記述のユーザー<strong>フィードバック収集</strong>（機密が含まる可能性あり）や、GitHub.com 上の<strong>プレビュー機能</strong>の利用を別トグルで切り替えられることがあります。"
          />
          <PolicyItem
            title="Copilot Chat in the IDE"
            body="IDE 内の Copilot Chat を Organization で許可します。**Editor preview features** をオンにすると、エディタのプレビュー機能（<strong>MCP サーバー</strong>を含む）にもアクセスできます。セキュリティレビューとセットで判断してください。"
          />
          <PolicyItem
            title="Copilot Agent Mode in IDE Chat"
            body="IDE のチャットで<strong>エージェントモード</strong>を使い、リクエストの推論・タスク計画・コードベース変更まで Copilot と対話できるようにします。"
          />
          <PolicyItem
            title="Copilot Chat in GitHub Mobile"
            body="GitHub Mobile アプリから Copilot Chat を利用できるようにします。"
          />
          <PolicyItem
            title="Copilot CLI"
            body="ターミナルで **GitHub Copilot CLI** をアシスタントとして使えるようにします。**Remote Control（プレビュー）** をオンにすると、github.com から CLI セッションを閲覧・操作（ステア）できるモードが有効になります。監査・サポート用途と権限濫用リスクの両面を検討します。"
          />
          <PolicyItem
            title="Copilot in GitHub Desktop"
            body="GitHub Desktop 上で Copilot の支援機能を使えるようにします。"
          />
          <PolicyItem
            title="Copilot can search the web"
            body="新しいトレンドの質問などに答えるため、<strong>Bing</strong> 経由でウェブ検索できるようにします。Microsoft のプライバシーステートメントが関係します。"
          />
          <PolicyItem
            title="Copilot can search the web using model native search（プレビュー）"
            body="モデル組み込みの検索能力でウェブに基づく回答を補強します。提供形態はプレビュー扱いのことがあります。"
          />
          <PolicyItem
            title="Copilot metrics API"
            body="Organization 管理者が <strong>Copilot Metrics API</strong> をクエリし、利用状況のインサイトを取れるようにします。"
          />
          <PolicyItem
            title="Copilot usage metrics"
            body="Organization 管理者と権限のあるユーザーが <strong>Copilot Usage API</strong> にアクセスできるようにします。"
          />
          <PolicyItem
            title="Copilot code review"
            body="ライセンスを持つメンバーが、所属リポジトリで <strong>Copilot code review</strong> および <strong>Copilot for pull requests</strong> を使えるようにします。別トグルで、<strong>ライセンスなしメンバー</strong>にも github.com 上の code review を許可する選択肢があり、その場合のプレミアムリクエストは組織の有料利用として請求される旨が表示されます。<strong>Automatic code review</strong> がオンなら Organization 内の PR で自動実行される場合があります。コードレビュー系の<strong>プレビュー機能</strong>は別スイッチで制御されることがあります。"
          />
          <PolicyItem
            title="Copilot cloud agent"
            body="この Organization からライセンスが割り当てられたユーザーが、<strong>有効なリポジトリ</strong>で Copilot cloud agent にアクセスできるようにします。利用モデルは <strong>Models</strong> ページで有効になっていないものが使われる場合がある旨が UI に記載されることがあります。"
          />
          <PolicyItem
            title="Copilot Memory（プレビュー）"
            body="エージェント対話をまたいで<strong>リポジトリ文脈を記憶</strong>する Copilot Memory を Organization で許可します。"
          />
          <PolicyItem
            title="MCP servers in Copilot"
            body="すべての Copilot エディタおよび Coding Agent で、<strong>Model Context Protocol（MCP）</strong> サーバー（サードパーティ含む）を設定できるようにします。"
          />
          <PolicyItem
            title="MCP registry URL（任意・プレビュー）"
            body="仕様に準拠した <strong>MCP レジストリ</strong>の URL を登録すると、対応エディタでメンバーがそのレジストリに載ったサーバーを一覧できるようになります。**Restrict MCP access to registry servers** で、レジストリ設定に基づき許可サーバーを絞り込めます（例: Allow all）。"
          />
          <PolicyItem
            title="Copilot-generated commit messages"
            body="GitHub.com 上で行った変更に対し、Copilot が<strong>コミットメッセージ案</strong>を出せるようにします。"
          />
          <PolicyItem
            title="Copilot Spaces"
            body="メンバーが Copilot Spaces を<strong>閲覧・作成</strong>できるようにします。オフにすると Spaces を見たり作ったりできません。"
          />
          <PolicyItem
            title="Copilot Spaces Individual Access"
            body="メンバーが<strong>個人所有</strong>の Copilot Space を作成できるかを制御します。"
          />
          <PolicyItem
            title="Copilot Spaces Individual Sharing"
            body="個人所有の Copilot Space を<strong>他者と共有</strong>できるかを制御します。"
          />
          <PolicyItem
            title="Duplicate Detection Filter — Suggestions matching public code"
            body="公開コードと一致度の高い候補を、<strong>許可する／ブロックする</strong>（例: Blocked）などの方針で制御します。コンプライアンス要件に合わせて選びます。"
          />
        </dl>
      </section>

      <section className="mb-10 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
        <p className="m-0">
          <strong>データと利用規約:</strong>{' '}
          Copilot in GitHub.com や GitHub Mobile のチャットを有効にすると、<strong>追加データの収集</strong>や製品利用規約の更新が適用される旨が UI に表示されることがあります。プレビュー機能をオンにすると <strong>pre-release terms</strong> に同意した扱いになる場合があります。組織が受け取るデータの詳細は{' '}
          <DocLink href="https://docs.github.com/ja/site-policy/privacy-policies/github-privacy-statement">
            GitHub のプライバシーステートメント
          </DocLink>
          を参照してください。Bing 経由のウェブ検索を有効にする場合は{' '}
          <DocLink href="https://privacy.microsoft.com/privacystatement">Microsoft のプライバシーステートメント</DocLink>
          も関係します。
        </p>
      </section>

      <div className="mt-8 space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization">
            Organization における Copilot のポリシーの管理
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide#agent-mode">
            Asking Copilot questions in your IDE — Agent mode（公式・英語）
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/how-tos/set-up/install-copilot-cli">
            GitHub Copilot CLI をインストールする
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/how-tos/use-copilot-agents/use-copilot-cli">
            GitHub Copilot CLI を使用する
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/rest/copilot/copilot-metrics">
            REST API — Copilot metrics
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/customizing-copilot/extending-copilot-chat-with-mcp">
            MCP サーバーで Copilot Chat を拡張する
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/concepts/context/mcp">
            モデル コンテキスト プロトコル（MCP）について
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/concepts/agents/about-copilot-coding-agent">
            Copilot coding agent について
          </DocLink>
        </p>
      </div>
    </article>
  );
}

function PolicyItem({ title, body }: { title: string; body: string }) {
  return (
    <>
      <dt className="font-semibold text-gray-900 dark:text-white mb-1">{title}</dt>
      <dd className="leading-relaxed">
        <TextWithBold text={body} />
      </dd>
    </>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotModelsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Models</h2>
      <p className="text-gray-600 mb-6">
        <strong>Models</strong> では、利用を許可するモデルや既定モデルを Organization レベルで揃えられます。利用可能なモデル一覧は契約・プレビュー状況により変わります。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat">
            Copilot Chat の AI モデルを変更する
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotCustomInstructionsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Custom instructions</h2>
      <p className="text-gray-600 mb-6">
        <strong>Custom instructions</strong> では、組織共通のシステム的な指示（コーディング規約の参照、禁止事項、言語の既定など）を登録し、メンバー間で Copilot の振る舞いを揃えます。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot">
            リポジトリカスタム指示（関連ドキュメント）
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotContentExclusionGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Content exclusion</h2>
      <p className="text-gray-600 mb-6">
        <strong>Content exclusion</strong>（コンテンツ除外）では、指定したパスやリポジトリ範囲を Copilot のコンテキストや索引の対象外にし、機密コードの取り扱いリスクを下げます。運用ではパターンのレビューと定期見直しが重要です。
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/managing-copilot/managing-github-copilot-in-your-organization/excluding-content-from-github-copilot">
            GitHub Copilot からコンテンツを除外する
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsCopilotCloudAgentGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Cloud agent</h2>
      <p className="text-gray-600 mb-6">
        Organization の <strong>Settings › Copilot › Cloud agent</strong> では、クラウド上で動作する Copilot エージェントの<strong>対象リポジトリ</strong>、<strong>インターネット（ファイアウォール・許可リスト）</strong>、<strong>ランナー種別</strong>、<strong>パートナー製エージェント</strong>を組織単位で揃えます。ここでの説明は GitHub の設定画面の区分に対応しています。
      </p>
      <p className="text-sm text-gray-500 mb-8">
        エージェント全般の位置づけは{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-ai-agents-intro"
          className="text-blue-600 underline dark:text-blue-400"
        >
          エージェントの概要とポリシー
        </Link>
        も併せて参照してください。
      </p>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Copilot cloud agent（概要）
        </h3>
        <p className="text-gray-600 mb-3">
          <strong>Copilot cloud agent</strong> を使うと、開発者は作業の一部を Copilot に任せ、自分は創造的で影響の大きい仕事に集中しやすくなります。典型的な流れは次のとおりです。
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
          <li>Issue などにタスクを割り当てる（または依頼する）</li>
          <li>エージェントがレビューを求めてきたらプルリクエストで確認する</li>
          <li>PR 上のフィードバックで反復し、仕上げる</li>
        </ol>
        <p className="text-sm text-gray-500">
          詳細なワークフローは公式ドキュメントの「Copilot cloud agent / coding agent」を参照してください。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Repository access</h3>
        <p className="text-gray-600 mb-3">
          <strong>どのリポジトリで Copilot cloud agent を有効にするか</strong>を選びます。次の両方を満たす必要があります。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>ユーザーが Copilot cloud agent に<strong>アクセスできる</strong>（ライセンス・ポリシー側の条件）</li>
          <li>そのリポジトリで cloud agent 機能が<strong>有効</strong>になっている</li>
        </ul>
        <p className="text-gray-600 mt-3">
          Issue を Copilot に割り当てるには、上記に加えてユーザーが当該リポジトリへ適切にアクセスできている必要があります。運用では「試すリポジトリを少数に絞る → 問題なければ拡大」が安全です。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Internet access</h3>
        <p className="text-gray-600 mb-4">
          組織内の<strong>すべてのリポジトリ</strong>にまたがって、Copilot cloud agent の外向き通信をファイアウォールで制御します。任意ホストへの接続を許すと機密流出リスクが上がるため、公式ではファイアウォール有効化が推奨されます。
        </p>
        <dl className="space-y-4 text-gray-600 text-sm">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white mb-1">
              Enable firewall（推奨）
            </dt>
            <dd>
              Copilot cloud agent のインターネットアクセスを、<strong>許可リストに載った宛先だけ</strong>に制限します。オフにするとエージェントが広範なホストへ接続できるため、データ流出リスクが高まります。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white mb-1">Recommended allowlist</dt>
            <dd>
              ツール・パッケージ・依存関係の取得でよく使われる宛先への接続を許す<strong>推奨許可リスト</strong>です。開発体験とセキュリティのバランスを取るための既定寄りの選択肢として用意されています。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white mb-1">
              Allow repository custom rules
            </dt>
            <dd>
              オンにすると、<strong>リポジトリ管理者</strong>が組織の許可リストに<strong>加えて</strong>、リポジトリ独自の許可ルールを追加できます。オフにするとリポジトリ側の追加ルールは使えません。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white mb-1">
              Organization custom allowlist
            </dt>
            <dd>
              組織全体に共通する<strong>ドメイン・IP・URL</strong>を登録し、組織内すべてのリポジトリのエージェントからその宛先への通信を許可します。リポジトリ単位では組織に追加したルールを削除できません。組織ルールとリポジトリルールは組み合わされて適用されます。
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Runner type</h3>
        <p className="text-gray-600 mb-3">
          Copilot cloud agent のセッションで使う<strong>既定のランナー種別</strong>を Organization で選びます。リポジトリは通常この既定を使い、必要に応じて<strong>リポジトリレベルで上書き</strong>できる場合があります（組織の「Allow repositories to customize the runner type」がオンなど）。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-3">
          <li>
            <strong>Standard GitHub runner</strong> — 標準の GitHub ホスト型 Actions ランナーでエージェントが動作します。
          </li>
          <li>
            <strong>Allow repositories to customize the runner type</strong> — オンにすると、リポジトリ側で{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
              .github/workflows/copilot-setup-steps.yml
            </code>{' '}
            などを通じてランナー指定をカスタマイズできるようになります（大きなランナーやセルフホスト等は別途 Actions 側の準備が必要です）。
          </li>
        </ul>
        <p className="text-sm text-gray-500">
          ランナーは GitHub Actions の実行環境上で動く前提のため、Actions のランナー種別・課金・セキュリティ方針とあわせて設計してください。
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Partner agents（プレビュー）
        </h3>
        <p className="text-gray-600 mb-3">
          パートナー製のコーディングエージェントを<strong>有効にすると</strong>、Issue やプルリクエストでメンションしたり、Issue やオープンな PR に<strong>割り当てたり</strong>できるようになります。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-3">
          <li>
            トリガーできるのは<strong>Organization メンバー</strong>および<strong>リポジトリのコラボレーター</strong>に限られます。
          </li>
          <li>
            利用できるのは、この Organization のリポジトリのうち、<strong>cloud agent 機能が有効なリポジトリ</strong>に限られます。
          </li>
        </ul>
        <p className="text-gray-600 mb-2">
          設定画面では例として次のようなトグルが並びます（表示名・利用可否はプランやプレビュー状況で変わることがあります）。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>
            <strong>Allow Claude coding agent</strong> — Claude ベースのコーディングエージェントを Organization で許可するか（{' '}
            <DocLink href="https://docs.github.com/ja/copilot/concepts/agents/anthropic-claude">
              Anthropic Claude
            </DocLink>
            ）。
          </li>
          <li>
            <strong>Allow Codex coding agent</strong> — OpenAI Codex 系のコーディングエージェントを Organization で許可するか（{' '}
            <DocLink href="https://docs.github.com/ja/copilot/concepts/agents/openai-codex">OpenAI Codex</DocLink>
            ）。
          </li>
        </ul>
        <p className="text-sm text-gray-500 mt-3">
          第三者エージェントの概念と制約は公式の「サードパーティ エージェント」ドキュメントも参照してください。
        </p>
      </section>

      <div className="mt-8 space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <DocLink href="https://docs.github.com/ja/copilot/concepts/agents/about-copilot-coding-agent">
            Copilot coding agent について
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent">
            Copilot クラウド エージェントのファイアウォールのカスタマイズまたは無効化
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/how-tos/administer-copilot/manage-for-organization/configure-runner-for-coding-agent">
            GitHub Copilot クラウド エージェント用ランナーを組織に構成する
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/how-tos/use-copilot-agents/cloud-agent/customize-the-agent-environment">
            Copilot クラウド エージェントの環境をカスタマイズする（copilot-setup-steps など）
          </DocLink>
        </p>
        <p className="text-sm text-blue-800 m-0">
          <DocLink href="https://docs.github.com/ja/copilot/concepts/agents/about-third-party-agents">
            サードパーティ エージェントについて
          </DocLink>
        </p>
      </div>
    </article>
  );
}

export function GitHubEnterpriseOrgSettingsTopSubGuideBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-repository':
      return <GitHubEnterpriseOrgSettingsRepositoryGuide />;
    case 'github-enterprise-org-settings-codespaces':
      return <GitHubEnterpriseOrgSettingsCodespacesGuide />;
    case 'github-enterprise-org-settings-planning':
      return <GitHubEnterpriseOrgSettingsPlanningGuide />;
    case 'github-enterprise-org-settings-copilot':
      return <GitHubEnterpriseOrgSettingsCopilotHubGuide />;
    case 'github-enterprise-org-settings-actions':
      return <GitHubEnterpriseOrgSettingsActionsGuide />;
    case 'github-enterprise-org-settings-models':
      return <GitHubEnterpriseOrgSettingsModelsGuide />;
    case 'github-enterprise-org-settings-webhooks':
      return <GitHubEnterpriseOrgSettingsWebhooksGuide />;
    case 'github-enterprise-org-settings-discussions':
      return <GitHubEnterpriseOrgSettingsDiscussionsGuide />;
    case 'github-enterprise-org-settings-packages':
      return <GitHubEnterpriseOrgSettingsPackagesGuide />;
    case 'github-enterprise-org-settings-pages':
      return <GitHubEnterpriseOrgSettingsPagesGuide />;
    case 'github-enterprise-org-settings-hosted-compute-networking':
      return <GitHubEnterpriseOrgSettingsHostedComputeNetworkingGuide />;
    case 'github-enterprise-org-settings-custom-properties':
      return <GitHubEnterpriseOrgSettingsCustomPropertiesGuide />;
    case 'github-enterprise-org-settings-authentication-security':
      return <GitHubEnterpriseOrgSettingsAuthenticationSecurityGuide />;
    case 'github-enterprise-org-settings-advanced-security':
      return <GitHubEnterpriseOrgSettingsAdvancedSecurityGuide />;
    case 'github-enterprise-org-settings-deploy-keys':
      return <GitHubEnterpriseOrgSettingsDeployKeysGuide />;
    case 'github-enterprise-org-settings-compliance':
      return <GitHubEnterpriseOrgSettingsComplianceGuide />;
    case 'github-enterprise-org-settings-vertified-approved-domains':
      return <GitHubEnterpriseOrgSettingsVertifiedApprovedDomainsGuide />;
    case 'github-enterprise-org-settings-secrets-and-variables':
      return <GitHubEnterpriseOrgSettingsSecretsVariablesGuide />;
    case 'github-enterprise-org-settings-github-apps':
      return <GitHubEnterpriseOrgSettingsGitHubAppsGuide />;
    case 'github-enterprise-org-settings-oauth-app-policy':
      return <GitHubEnterpriseOrgSettingsOauthAppPolicyGuide />;
    case 'github-enterprise-org-settings-personal-access-tokens':
      return <GitHubEnterpriseOrgSettingsPersonalAccessTokensGuide />;
    case 'github-enterprise-org-settings-scheduled-reminders':
      return <GitHubEnterpriseOrgSettingsScheduledRemindersGuide />;
    case 'github-enterprise-org-settings-announcement':
      return <GitHubEnterpriseOrgSettingsAnnouncementGuide />;
    case 'github-enterprise-org-settings-logs':
      return <GitHubEnterpriseOrgSettingsLogsGuide />;
    case 'github-enterprise-org-settings-deleted-repositories':
      return <GitHubEnterpriseOrgSettingsDeletedRepositoriesGuide />;
    case 'github-enterprise-org-settings-developer-settings':
      return <GitHubEnterpriseOrgSettingsDeveloperSettingsGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsPlanningChildGuideBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-planning-projects':
      return <GitHubEnterpriseOrgSettingsPlanningProjectsGuide />;
    case 'github-enterprise-org-settings-planning-issue-types':
      return <GitHubEnterpriseOrgSettingsPlanningIssueTypesGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsCodespacesChildGuideBody({
  chapterId,
}: {
  chapterId: string;
}) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-codespaces-general':
      return <GitHubEnterpriseOrgSettingsCodespacesGeneralGuide />;
    case 'github-enterprise-org-settings-codespaces-policies':
      return <GitHubEnterpriseOrgSettingsCodespacesPoliciesGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsRepositoryChildGuideBody({
  chapterId,
}: {
  chapterId: string;
}) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-repository-general':
      return <GitHubEnterpriseOrgSettingsRepositoryGeneralGuide />;
    case 'github-enterprise-org-settings-repository-topics':
      return <GitHubEnterpriseOrgSettingsRepositoryTopicsGuide />;
    case 'github-enterprise-org-settings-repository-rulesets':
      return <GitHubEnterpriseOrgSettingsRepositoryRulesetsGuide />;
    case 'github-enterprise-org-settings-repository-rule-insights':
      return <GitHubEnterpriseOrgSettingsRepositoryRuleInsightsGuide />;
    case 'github-enterprise-org-settings-repository-bypass-requests':
      return <GitHubEnterpriseOrgSettingsRepositoryBypassRequestsGuide />;
    case 'github-enterprise-org-settings-repository-custom-properties':
      return <GitHubEnterpriseOrgSettingsRepositoryCustomPropertiesGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsAdvancedSecurityChildGuideBody({
  chapterId,
}: {
  chapterId: string;
}) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-advanced-security-configurations':
      return <GitHubEnterpriseOrgSettingsAdvancedSecurityConfigurationsGuide />;
    case 'github-enterprise-org-settings-advanced-security-global-settings':
      return <GitHubEnterpriseOrgSettingsAdvancedSecurityGlobalSettingsGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsPatChildGuideBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-personal-access-tokens-settings':
      return <GitHubEnterpriseOrgSettingsPatSettingsGuide />;
    case 'github-enterprise-org-settings-personal-access-tokens-active-tokens':
      return <GitHubEnterpriseOrgSettingsPatActiveTokensGuide />;
    case 'github-enterprise-org-settings-personal-access-tokens-prnding-requests':
      return <GitHubEnterpriseOrgSettingsPatPrndingRequestsGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsLogsChildGuideBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-logs-sponsorship-log':
      return <GitHubEnterpriseOrgSettingsAnnouncementLogsSponsorshipLogGuide />;
    case 'github-enterprise-org-settings-logs-audit-log':
      return <GitHubEnterpriseOrgSettingsAnnouncementLogsAuditLogGuide />;
    default:
      return null;
  }
}

export function GitHubEnterpriseOrgSettingsCopilotSeriesBody({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case 'github-enterprise-org-settings-copilot':
      return <GitHubEnterpriseOrgSettingsCopilotHubGuide />;
    case 'github-enterprise-org-settings-copilot-access':
      return <GitHubEnterpriseOrgSettingsCopilotAccessGuide />;
    case 'github-enterprise-org-settings-copilot-policies':
      return <GitHubEnterpriseOrgSettingsCopilotPoliciesGuide />;
    case 'github-enterprise-org-settings-copilot-models':
      return <GitHubEnterpriseOrgSettingsCopilotModelsGuide />;
    case 'github-enterprise-org-settings-copilot-custom-instructions':
      return <GitHubEnterpriseOrgSettingsCopilotCustomInstructionsGuide />;
    case 'github-enterprise-org-settings-copilot-content-exclusion':
      return <GitHubEnterpriseOrgSettingsCopilotContentExclusionGuide />;
    case 'github-enterprise-org-settings-copilot-cloud-agent':
      return <GitHubEnterpriseOrgSettingsCopilotCloudAgentGuide />;
    default:
      return null;
  }
}
