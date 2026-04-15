'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

const REST_ROOT_JA_GHEC = 'https://docs.github.com/ja/enterprise-cloud@latest/rest';
const ABOUT_REST_JA = 'https://docs.github.com/ja/enterprise-cloud@latest/rest/about-the-rest-api';
const REPOS_REST_JA = 'https://docs.github.com/ja/enterprise-cloud@latest/rest/repos';
const PULLS_REST_JA = 'https://docs.github.com/ja/enterprise-cloud@latest/rest/pulls';
const ORGS_REST_JA = 'https://docs.github.com/ja/enterprise-cloud@latest/rest/orgs';

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">
      {children}
    </a>
  );
}

function useProgrammingLanguageId(): string {
  const params = useParams();
  return typeof params?.id === 'string' ? params.id : 'github';
}

/** シリーズ親 — 目次と役割分担 */
export function GitHubRestApiHubGuide() {
  const lang = useProgrammingLanguageId();
  const ch = (id: string) => `/programming/${lang}/chapters/${id}`;

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub REST API（Enterprise Cloud）</h2>
      <p className="text-gray-600 dark:text-gray-300">
        このシリーズは、公式の{' '}
        <DocLink href={REST_ROOT_JA_GHEC}>GitHub REST API（日本語・Enterprise Cloud）</DocLink>
        の<strong>地図</strong>として使うためのハブです。エンドポイントの全文転載はせず、カテゴリごとの要点・運用上の注意・公式ページへのリンクを中心にまとめます（公式ドキュメントが常に正です）。
      </p>

      <section className="not-prose mb-8 rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="m-0 font-medium">CLI や curl の実務入門は別チャプター</p>
        <p className="mt-2 mb-0 text-amber-900/90 dark:text-amber-100/90">
          <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">gh</code> のセットアップや PAT での手早い呼び出しは{' '}
          <Link href={ch('github-cli-api')} className="font-semibold underline" scroll={false}>
            GitHub CLI と API と SDK の使い分け
          </Link>
          を参照してください。本シリーズは REST リファレンスの<strong>読み方とカテゴリ導線</strong>に寄せています。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">フェーズ1のカテゴリ</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <Link href={ch('github-rest-api-overview')} className="font-medium text-blue-600 dark:text-blue-400" scroll={false}>
              概要・認証・バージョン・ページネーション
            </Link>
            — REST の前提と共通パターン
          </li>
          <li>
            <Link href={ch('github-rest-api-repos')} className="font-medium text-blue-600 dark:text-blue-400" scroll={false}>
              リポジトリとプルリクエスト
            </Link>
            — <code className="text-sm">repos</code> / <code className="text-sm">pulls</code> の公式 REST
          </li>
          <li>
            <Link href={ch('github-rest-api-orgs')} className="font-medium text-blue-600 dark:text-blue-400" scroll={false}>
              Organization
            </Link>
            — <code className="text-sm">orgs</code> の公式 REST
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">学習内で REST を扱っているチャプター</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <Link href={ch('github-enterprise-copilot-metrics')} scroll={false}>
              Copilot — Metrics
            </Link>
            （Usage Metrics API の curl 例と公式 REST へのリンク）
          </li>
          <li>
            <Link href={ch('github-audit-logs-overview')} scroll={false}>
              監査ログ・ログの種類
            </Link>
            （監査ログ・Actions ログ取得の REST 例）
          </li>
        </ul>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        上のサブナビから各カテゴリへ進むか、左のチャプターツリーから子項目を選べます。
      </p>
    </article>
  );
}

/** 概要・認証・バージョン・ページネーション */
export function GitHubRestApiOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">REST API — 概要・認証・バージョン</h2>
      <p className="text-gray-600 dark:text-gray-300">
        起点は公式の{' '}
        <DocLink href={ABOUT_REST_JA}>REST について（About the REST API）</DocLink>
        です。ここでは自動化や運用で詰まりやすい点だけを短く整理します。
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ベース URL とメディアタイプ</h3>
        <p className="text-gray-600 dark:text-gray-300">
          GitHub.com / GHEC では通常 <code className="text-sm">https://api.github.com</code> を使います。リクエストヘッダーでは{' '}
          <code className="text-sm">Accept: application/vnd.github+json</code> が推奨されます。詳細は公式の説明に従ってください。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">認証の俯瞰</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <strong>Personal access token（classic / fine-grained）</strong> — スクリプトや小規模ツールで最も扱いやすい一方、権限設計と保管が重要です。
          </li>
          <li>
            <strong>GitHub App</strong> — 組織に導入し、インストールトークンで API を呼ぶ。中長期の統合向き。
          </li>
          <li>
            <strong>OAuth App</strong> — ユーザーコンテキストで同意された操作に使う。用途によって Apps と使い分けます。
          </li>
        </ul>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          各エンドポイントが要求するスコープや権限は公式の当該操作の説明を確認してください。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">API バージョニング</h3>
        <p className="text-gray-600 dark:text-gray-300">
          多くの REST 操作では <code className="text-sm">X-GitHub-Api-Version</code> で利用する API バージョンを指定します。バージョンごとに利用可能なパスやフィールドが異なるため、プロダクト更新時は{' '}
          <DocLink href="https://docs.github.com/ja/rest/overview/api-versions">API バージョン</DocLink>
          とリリースノートをあわせて追うのが安全です。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ページネーションとレート制限</h3>
        <p className="text-gray-600 dark:text-gray-300">
          一覧系は <code className="text-sm">Link</code> ヘッダやクエリパラメータでページングされることがあります。レート制限に達すると{' '}
          <code className="text-sm">403</code> や <code className="text-sm">429</code>、{' '}
          <code className="text-sm">Retry-After</code> などが返るので、バッチ処理では指数バックオフやキャッシュを検討してください（公式のレート制限ガイドを参照）。
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">最小の curl 例（雛形）</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{`curl -L \\
  -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "X-GitHub-Api-Version: 2022-11-28" \\
  https://api.github.com/user`}
        </pre>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          実際のバージョン文字列やパスは操作ごとに公式ドキュメントの例に合わせてください。
        </p>
      </section>
    </article>
  );
}

/** リポジトリとプルリクエスト */
export function GitHubRestApiReposGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">REST API — リポジトリとプルリクエスト</h2>
      <p className="text-gray-600 dark:text-gray-300">
        リポジトリ本体の操作は{' '}
        <DocLink href={REPOS_REST_JA}>REST API — Repositories</DocLink>
        、プルリクエストは{' '}
        <DocLink href={PULLS_REST_JA}>REST API — Pull requests</DocLink>
        にまとまっています。ブランチ・コミット・チェックランなど近接トピックも左ナビから辿れます。
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">運用でよく使う観点</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <strong>リポジトリの作成・設定・可視性</strong> — テンプレート運用や IaC と組み合わせる場合のエンドポイントは公式一覧から選択します。
          </li>
          <li>
            <strong>PR の一覧・レビュー・マージ</strong> — CI 連携やボットでは、まず必要なフィールドだけを取得するようにし、ページネーションに注意します。
          </li>
          <li>
            <strong>権限</strong> — トークンまたは App の権限が不足していると 404 になることがあります（情報漏えい防止の挙動）。権限表は各操作の公式ページを確認してください。
          </li>
        </ul>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        画面操作との対応は{' '}
        <DocLink href="https://docs.github.com/ja/enterprise-cloud@latest/rest/quickstart">REST のクイックスタート</DocLink>
        も参照してください。
      </p>
    </article>
  );
}

/** Organization */
export function GitHubRestApiOrgsGuide() {
  const lang = useProgrammingLanguageId();

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">REST API — Organization</h2>
      <p className="text-gray-600 dark:text-gray-300">
        組織レベルのエンドポイントは{' '}
        <DocLink href={ORGS_REST_JA}>REST API — Organizations</DocLink>
        配下にあります。メンバー・チーム・設定・Webhook など、UI の「Organization settings」に近い操作が API にも存在します。
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Organization と Enterprise の境界</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Enterprise 全体にまたがる操作は <code className="text-sm">/enterprises/&#123;enterprise&#125;/...</code> 系のパスになり、Organization API
          とは別カテゴリです。ガバナンスや課金の取得は Enterprise 側の REST を開く必要があることがあります。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">監査ログなど横断機能</h3>
        <p className="text-gray-600 dark:text-gray-300">
          監査ログの REST は orgs 以外のカテゴリに分類される場合があります。本プラットフォームでは{' '}
          <Link
            href={`/programming/${lang}/chapters/github-audit-logs-overview`}
            className="text-blue-600 dark:text-blue-400"
            scroll={false}
          >
            監査ログ・ログの種類
          </Link>
          で curl 例と説明をまとめています。
        </p>
      </section>
    </article>
  );
}
