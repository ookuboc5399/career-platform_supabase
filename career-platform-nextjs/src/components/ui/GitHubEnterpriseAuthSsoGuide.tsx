'use client';

import { Suspense, useCallback, useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import GitHubOutsideCollaboratorsGuide from '@/components/ui/GitHubOutsideCollaboratorsGuide';

const SECTION_QUERY = 'section';

const DEFAULT_SECTION = 'overview';

const VALID_SECTIONS = new Set([
  'overview',
  'sso-saml-oidc',
  'entra-id',
  'okta-id',
  'outside-collaborators',
  'two-factor-personal',
  'two-factor-org',
  'ip-allow-enable-add',
  'ip-allow-ops',
  'enterprise-managed-users',
  'architecture-patterns',
]);

type NavGroup = {
  title?: string;
  items: { id: string; label: string }[];
};

const NAV_GROUPS: NavGroup[] = [
  { items: [{ id: 'overview', label: 'はじめに' }] },
  {
    items: [
      { id: 'sso-saml-oidc', label: 'SSO（SAML / OIDC）' },
      { id: 'entra-id', label: 'Microsoft Entra ID' },
      { id: 'okta-id', label: 'Okta' },
      { id: 'outside-collaborators', label: '外部コラボレーター' },
    ],
  },
  {
    title: '2FA / MFA',
    items: [
      { id: 'two-factor-personal', label: '個人アカウントで有効化' },
      { id: 'two-factor-org', label: 'Organization での必須化' },
    ],
  },
  {
    title: 'IP アドレス制限',
    items: [
      { id: 'ip-allow-enable-add', label: '有効化とエントリ追加' },
      { id: 'ip-allow-ops', label: '運用上の注意' },
    ],
  },
  {
    items: [
      { id: 'enterprise-managed-users', label: 'Enterprise Managed Users' },
      { id: 'architecture-patterns', label: '構成の組み合わせ例' },
    ],
  },
];

const codeBox =
  'px-1.5 py-0.5 rounded font-mono text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';

function DocLinksFooter() {
  return (
    <div className="not-prose mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
      <p className="text-sm text-blue-800 dark:text-blue-200">
        <strong>参考（GitHub Docs）:</strong>{' '}
        <a
          href="https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-saml-single-sign-on"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          SAML SSO
        </a>
        {' · '}
        <a
          href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          2FA
        </a>
        {' · '}
        <a
          href="https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Organization IP allow list
        </a>
        {' · '}
        <a
          href="https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/restricting-network-traffic-to-your-enterprise"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Enterprise ネットワーク制限
        </a>
        {' · '}
        <a
          href="https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/managing-iam-with-enterprise-managed-users"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Enterprise Managed Users
        </a>
      </p>
    </div>
  );
}

function renderSectionBody(section: string): ReactNode {
  switch (section) {
    case 'overview':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            🔐 認証とセキュリティ（Authentication and security）
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            本チャプターは、GitHub の UI でいう <strong>Settings &gt; Authentication and security</strong>（Enterprise
            アカウントまたは Organization の設定サイドバー）に対応する内容です。GHEC と GHES でメニュー名や項目の並びが一部異なる場合があります。
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            IdP（アイデンティティプロバイダ）との連携、SSO、2 要素認証、IP 制限、EMU などを組み合わせて、Enterprise 全体のセキュアなアクセス制御を実現します。
          </p>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            左のマニュアルから項目を選ぶと、<strong>同じチャプター内</strong>で表示が切り替わります（ページ全体の読み込みは行いません）。URL の{' '}
            <code className={codeBox}>?section=</code> からも直接開けます。
          </p>
          <DocLinksFooter />
        </>
      );
    case 'sso-saml-oidc':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            🔑 SSO ログイン（SAML / OIDC）
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Organization または Enterprise レベルで SAML SSO または OIDC を有効にすると、メンバーは GitHub のパスワードではなく、社内の IdP（Entra ID、Okta など）で認証してログインします。
          </p>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">設定の流れ</h3>
          <ol className="mb-4 list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-300">
            <li>IdP 側で GitHub 用の SAML/OIDC アプリケーションを作成</li>
            <li>IdP から Issuer URL、SSO URL、証明書（SAML）または Client ID/Secret（OIDC）を取得</li>
            <li>
              GitHub で Organization の場合は <strong>Organization settings &gt; Authentication security</strong>、Enterprise
              の場合は <strong>Enterprise settings</strong> 配下の SAML / OIDC 設定から、取得した値を入力
            </li>
            <li>メンバーに「Configure SSO」を促し、IdP 経由で認証を完了させる</li>
          </ol>
        </>
      );
    case 'entra-id':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            🏢 Microsoft Entra ID（旧 Azure AD）との連携
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Microsoft Entra ID を IdP として使用する場合、Azure ポータルで「エンタープライズアプリケーション」を追加し、SAML または OIDC で GitHub と連携します。
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              <strong>アプリの登録:</strong> Azure AD &gt; エンタープライズアプリケーション &gt; 新規作成 &gt; ギャラリー外 &gt;
              GitHub Enterprise Cloud を検索または手動設定
            </li>
            <li>
              <strong>属性マッピング:</strong> 必要に応じて <code className={codeBox}>user.mail</code> や{' '}
              <code className={codeBox}>user.userprincipalname</code> をマッピング
            </li>
            <li>
              <strong>条件付きアクセス:</strong> Entra ID の条件付きアクセスポリシーで、デバイス準拠や MFA を強制可能
            </li>
          </ul>
        </>
      );
    case 'okta-id':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">🔷 Okta との連携</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Okta を IdP として使用する場合、Okta のアプリケーションカタログから「GitHub Enterprise Cloud」を追加するか、SAML 2.0
            アプリを手動で設定します。
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              <strong>アプリの追加:</strong> Okta Admin &gt; Applications &gt; Create App Integration &gt; SAML 2.0
            </li>
            <li>
              <strong>Single sign-on URL:</strong> GitHub の SAML SSO URL（例:{' '}
              <code className={codeBox}>https://github.com/orgs/your-org/sso/saml/consume</code>）
            </li>
            <li>
              <strong>属性:</strong> <code className={codeBox}>username</code> または <code className={codeBox}>email</code>{' '}
              を GitHub の識別子にマッピング
            </li>
            <li>
              <strong>Okta Verify / MFA:</strong> Okta 側で MFA を有効にすると、GitHub ログイン時にも 2 段階認証が求められる
            </li>
          </ul>
        </>
      );
    case 'outside-collaborators':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">👥 外部コラボレーターと SSO</h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            Organization のメンバーではないが特定リポジトリにだけアクセスするユーザーの扱いです。SAML SSO 必須の Organization でも、外部コラボレーターはメンバーと要件が異なります。
          </p>
          <GitHubOutsideCollaboratorsGuide headingLevel="h3" />
        </>
      );
    case 'two-factor-personal':
      return (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">📱 2要素認証（2FA / MFA）</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">個人アカウントで有効化する（操作手順）</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            2要素認証は、パスワードに加えて TOTP（認証アプリ）や WebAuthn（セキュリティキー）による第二要素を要求し、アカウントの乗っ取りを防ぎます。
          </p>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            各ユーザーは GitHub.com にサインインしたうえで、次のメニューから設定します（画面ラベルは英語のまま記載します）。
          </p>
          <ol className="mb-4 list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              右上のプロフィール画像から <strong>Settings</strong> を開く
            </li>
            <li>
              左サイドバーで <strong>Password and authentication</strong> を選択
            </li>
            <li>
              <strong>Two-factor authentication</strong> セクションで <strong>Enable two-factor authentication</strong>{' '}
              をクリック
            </li>
            <li>
              表示されたウィザードに従い、<strong>Authenticator app（TOTP）</strong> または{' '}
              <strong>Security keys（WebAuthn）</strong> のいずれか（または両方）を登録
            </li>
            <li>
              登録完了後に表示される <strong>recovery codes（リカバリコード）</strong> をダウンロードまたはコピーし、社内のパスワードマネージャー等の
              <strong>安全な場所</strong>に保管（紛失するとアカウント復旧が困難になります）
            </li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            参考:{' '}
            <a
              href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:no-underline dark:text-blue-400"
            >
              Securing your account with two-factor authentication（GitHub Docs）
            </a>
          </p>
        </>
      );
    case 'two-factor-org':
      return (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">📱 2要素認証（2FA / MFA）</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Organization で 2FA を必須にする</p>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            Organization のオーナー（または権限のある管理者）は、メンバー全員の 2FA 設定を義務付けられます。
          </p>
          <ol className="mb-4 list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              Organization のトップページで <strong>Settings</strong> を開く
            </li>
            <li>
              左サイドバーで <strong>Authentication security</strong>（名称は「Authentication and security」に近いラベルのこともあります）を選択
            </li>
            <li>
              <strong>Two-factor authentication</strong> 関連のセクションで、
              <strong>Require two-factor authentication</strong> を有効化
            </li>
            <li>
              保存後、2FA 未設定のメンバーには猶予期間ののち Organization からの除去や、設定促進の表示が行われます。運用前に関係者へ周知してください
            </li>
          </ol>
          <p className="text-gray-600 dark:text-gray-300">
            Enterprise レベルでポリシーを掛ける場合は、<strong>Enterprise settings &gt; Authentication security</strong>{' '}
            など、Enterprise 用のメニューから同様の要件を設定できることがあります（プラン・UI により異なります）。
          </p>
        </>
      );
    case 'ip-allow-enable-add':
      return (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">🌐 IP アドレス制限（IP allow list）</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">有効化とエントリ追加（操作手順の例）</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            GitHub Enterprise Cloud では、Organization または Enterprise で許可する IP レンジを登録し、それ以外からの GitHub
            へのアクセスをブロックできます。
          </p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            <strong>Organization</strong> では多くの場合、<strong>Organization settings &gt; Authentication and security &gt;
            IP allow list</strong> にあります（旧 UI やプロダクトによっては <strong>Security</strong> 配下の表記のこともあります）。
          </p>
          <p className="mb-3 text-gray-600 dark:text-gray-300">Organization の IP allow list を例にした流れです。</p>
          <ol className="mb-4 list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              Organization の <strong>Settings</strong> を開く
            </li>
            <li>
              左サイドバーで <strong>Authentication and security</strong> を選択し、<strong>IP allow list</strong> を開く
            </li>
            <li>
              <strong>Enable IP allow list</strong>（IP allow list を有効にするチェックボックス）にチェックを入れる。オフのままではリストを編集しても制限は適用されません
            </li>
            <li>
              <strong>Add</strong> または同等のボタンから、許可する IPv4 アドレスまたは CIDR（例:{' '}
              <code className={codeBox}>203.0.113.10/32</code>、<code className={codeBox}>192.168.1.0/24</code>
              ）を追加
            </li>
            <li>
              説明（Description）を付けて保存し、変更が反映されるまで少し待つ（反映遅延がある場合があります）
            </li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            参考:{' '}
            <a
              href="https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:no-underline dark:text-blue-400"
            >
              Managing allowed IP addresses for your organization
            </a>
            {' · '}
            <a
              href="https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/restricting-network-traffic-to-your-enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:no-underline dark:text-blue-400"
            >
              Restricting network traffic to your enterprise
            </a>
          </p>
        </>
      );
    case 'ip-allow-ops':
      return (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">🌐 IP アドレス制限（IP allow list）</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">運用上の注意</p>
          <ul className="mb-2 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <strong>ロックアウト防止:</strong> 制限を有効にする前に、管理者がアクセスに使う IP（オフィス、VPN、踏み台など）を必ずリストに含めます。誤設定すると
              GitHub の Web・API・Git 操作が利用できなくなります
            </li>
            <li>
              <strong>Enterprise と Organization:</strong> Enterprise レベルで制限している場合と Organization 単体の allow
              list は役割が異なります。どちらが効いているか、ドキュメントと実際のポリシー画面で確認してください
            </li>
            <li>
              <strong>GHES:</strong> GitHub Enterprise Server では Management Console やサイト設定で IP 許可を扱う場合があり、GitHub.com
              の画面と項目名が一致しません
            </li>
            <li>
              <strong>GitHub Actions / 連携サービス:</strong> ランナーや外部連携が別 IP から GitHub API にアクセスする場合、それらの出口 IP
              も許可リストに含める必要があることがあります（公式の IP レンジ一覧の確認が必要です）
            </li>
          </ul>
        </>
      );
    case 'enterprise-managed-users':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">👤 Enterprise Managed Users（EMU）</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            EMU は、GitHub のユーザーアカウントを Enterprise が IdP 経由で一元管理する機能です。メンバーは自分で GitHub
            アカウントを作成せず、IdP のユーザーが自動的に GitHub の「マネージドユーザー」としてプロビジョニングされます。
          </p>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">主な特徴</h3>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
            <li>IdP（Entra ID、Okta など）でユーザーを作成・削除すると、GitHub 側にも自動反映</li>
            <li>マネージドユーザーは GitHub.com のパブリックな機能（例: 他 Organization への参加）に制限がかかる</li>
            <li>SCIM によるプロビジョニングで、グループベースの Organization 参加も可能</li>
            <li>Enterprise 契約が必要で、設定は Enterprise レベルで行う</li>
          </ul>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
            EMU におけるリポジトリ単位の協力者（<strong>repository collaborator</strong>）と、通常の外部コラボレーターの違いは、左メニューの{' '}
            <strong>外部コラボレーター</strong> にまとめています。
          </p>
        </>
      );
    case 'architecture-patterns':
      return (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">📋 構成の組み合わせ例</h2>
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              <strong>基本:</strong> SAML SSO（Entra ID / Okta）+ Organization での 2FA 強制
            </li>
            <li>
              <strong>厳格:</strong> 上記 + IP allow list（オフィス / VPN のみ許可）
            </li>
            <li>
              <strong>完全管理:</strong> EMU + SCIM + 条件付きアクセス（IdP 側の MFA、デバイス準拠）
            </li>
          </ul>
        </>
      );
    default:
      return null;
  }
}

type ManualNavProps = {
  activeSection: string;
  onSelect: (id: string) => void;
};

function ManualNav({ activeSection, onSelect }: ManualNavProps) {
  return (
    <div className="space-y-4">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {group.title ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {group.title}
            </p>
          ) : null}
          <ul className="space-y-1 text-sm">
            {group.items.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'w-full rounded-md px-2 py-1.5 text-left transition-colors',
                      isActive
                        ? 'bg-blue-100 font-medium text-blue-900 dark:bg-blue-950/60 dark:text-blue-100'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/80'
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GitHubEnterpriseAuthSsoGuideInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const raw = searchParams.get(SECTION_QUERY);
  const activeSection =
    raw && VALID_SECTIONS.has(raw) ? raw : DEFAULT_SECTION;

  useEffect(() => {
    if (raw && !VALID_SECTIONS.has(raw)) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete(SECTION_QUERY);
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
  }, [raw, pathname, router, searchParams]);

  const selectSection = useCallback(
    (id: string) => {
      if (!VALID_SECTIONS.has(id)) return;
      const next = new URLSearchParams(searchParams.toString());
      if (id === DEFAULT_SECTION) {
        next.delete(SECTION_QUERY);
      } else {
        next.set(SECTION_QUERY, id);
      }
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      if (detailsRef.current) detailsRef.current.open = false;
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    panelRef.current?.focus();
  }, [activeSection]);

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/60 lg:p-8">
      <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-center">
        <details
          ref={detailsRef}
          className="group w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/50 lg:hidden"
        >
          <summary className="flex cursor-pointer list-none select-none items-center gap-2 font-medium text-gray-800 dark:text-gray-200 [&::-webkit-details-marker]:hidden">
            <svg
              className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-90 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            マニュアル目次
          </summary>
          <nav
            className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700"
            aria-label="マニュアル目次"
          >
            <ManualNav activeSection={activeSection} onSelect={selectSection} />
          </nav>
        </details>

        <nav
          className="hidden w-56 shrink-0 pr-2 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          aria-label="マニュアル目次"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            マニュアル
          </p>
          <ManualNav activeSection={activeSection} onSelect={selectSection} />
        </nav>

        <article
          ref={panelRef}
          id="manual-panel"
          tabIndex={-1}
          className="prose prose-gray min-w-0 max-w-none flex-1 outline-none lg:max-w-3xl"
          aria-live="polite"
        >
          <div key={activeSection}>{renderSectionBody(activeSection)}</div>
        </article>
      </div>
    </div>
  );
}

function GuideFallback() {
  return (
    <div className="flex h-64 w-full max-w-6xl items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
    </div>
  );
}

export default function GitHubEnterpriseAuthSsoGuide() {
  return (
    <Suspense fallback={<GuideFallback />}>
      <GitHubEnterpriseAuthSsoGuideInner />
    </Suspense>
  );
}
