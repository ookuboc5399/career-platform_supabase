'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
      {children}
    </a>
  );
}

function CopilotSettingsIntro() {
  return (
    <p className="text-gray-600 mb-8 text-sm leading-relaxed not-prose">
      Organization または Enterprise の <strong>Settings › Copilot</strong>（名称はプラン・UI で異なる場合があります）に表示される項目の整理です。画面上は
      <strong>Settings</strong> 経由が一般的ですが、学習一覧では <strong>GitHub Enterprise › AI Controls › Copilot</strong> チャプター配下のサブチャプターとして掲載しています。
    </p>
  );
}

/** Privacy & Features（コンテンツ除外・データの扱い・機能有効化） */
export function GitHubEnterpriseCopilotPrivacyFeaturesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Privacy & Features</h2>
      <CopilotSettingsIntro />

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy（プライバシー・データの扱い）</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
          <li>
            <strong>Content exclusion（コンテンツ除外）</strong>：機密リポジトリ・パス・ユーザー単位で、Copilot
            がコンテキストとして参照してよい範囲を制限します。誤学習・漏えいリスクを下げる主要レバーです。
          </li>
          <li>
            <strong>組織ポリシーと個人設定の関係</strong>：管理者が許可した範囲内で、メンバー側の公開範囲や利用可否が決まります（項目は契約により異なります）。
          </li>
          <li>
            <strong>テレメトリ・改善データ</strong>：プロダクト改善に関するデータ送信の扱いは、契約・地域・Enterprise 設定とセットで確認します。
          </li>
        </ul>
        <p className="text-sm text-gray-700 mt-4">
          <DocLink href="https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/customizing-content-exclusions-for-github-copilot">
            Customizing content exclusions for GitHub Copilot
          </DocLink>
        </p>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Features（機能有効化）</h3>
        <p className="text-gray-600 text-sm mb-4">
          <strong>Features</strong> では、組織に対して <strong>どの Copilot 機能をオンにするか</strong> をまとめて制御します。例（表示名は UI により異なります）:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
          <li>
            <strong>コード補完</strong>（エディタ内のインライン提案）
          </li>
          <li>
            <strong>Copilot Chat</strong>（対話型の説明・生成）
          </li>
          <li>
            <strong>Pull request 上の Copilot</strong>（レビューや説明の支援）
          </li>
          <li>
            <strong>Copilot CLI / エージェント系</strong>（契約・プレビュー状況による）
          </li>
        </ul>
        <p className="text-gray-600 text-sm mt-4">
          <strong>AI Controls</strong>（Enterprise 上位）と重複・上書き関係になる項目があるため、変更時は影響範囲を確認してください。
        </p>
        <p className="text-sm text-gray-700 mt-4">
          <DocLink href="https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization">
            Managing policies for Copilot in your organization
          </DocLink>
        </p>
      </section>
    </article>
  );
}

/** Billing（Copilot 設定内のシート・割当 UI） */
export function GitHubEnterpriseCopilotBillingSettingsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Billing</h2>
      <CopilotSettingsIntro />

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings 内の Billing の役割</h3>
        <p className="text-gray-600 text-sm mb-4">
          Copilot の <strong>Billing</strong> タブ／セクションでは、多くの場合 <strong>シート（ライセンス）の利用状況</strong>や
          <strong>          割当先の確認</strong>に近い情報がまとまります。請求書の支払方法や Enterprise 全体の請求は、Enterprise 左ナビで{' '}
          <strong>Settings</strong> と並列にある <strong>Billing and licensing</strong> 側が主となります。
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
          <li>誰に Copilot が付与されているか、空きシートはあるか</li>
          <li>プレミアムリクエスト等の枠と、ダッシュボード（Metrics）への導線</li>
          <li>FinOps・按分の詳細は学習一覧の「コスト管理（Billing and licensing）」チャプターと併読</li>
        </ul>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
          <strong>Enterprise の請求・支払い:</strong> クレジットカード・PayPal・<strong>Azure Subscription</strong>・請求書払い（Sales
          経由の契約など）など、<strong>Azure だけが唯一の手段ではありません。</strong> Cost center や予算によるプレミアムリクエスト制御も含め、全体像は「コスト管理」チャプターの{' '}
          <strong>Payment information</strong> および <strong>Cost centers / Budgets and alerts</strong> を参照してください。
        </div>
      </section>

      <section className="mb-6 not-prose text-sm text-gray-700">
        <DocLink href="https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-access-for-copilot-in-your-organization">
          Managing access to GitHub Copilot in your organization
        </DocLink>
      </section>
    </article>
  );
}

/** Metrics（利用状況・採用メトリクス + Copilot Usage Metrics API） */
export function GitHubEnterpriseCopilotMetricsGuide() {
  const params = useParams();
  const programmingId = typeof params?.id === 'string' ? params.id : 'github';

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Copilot — Metrics</h2>
      <div className="not-prose mb-6 rounded-lg border border-blue-200 bg-blue-50/90 p-4 text-sm text-gray-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-gray-100">
        <p className="m-0 leading-relaxed">
          公式の <strong>copilot-metrics-viewer</strong> を自前ホストする手順は、GitHub Tips の{' '}
          <Link
            href={`/programming/${programmingId}/chapters/github-tips-copilot-metrics-viewer`}
            className="font-semibold text-blue-700 underline dark:text-blue-300"
            scroll={false}
          >
            copilot-metrics-viewer のセットアップ
          </Link>
          にまとめています（右の「関連コンテンツ」からも移動できます）。
        </p>
      </div>
      <CopilotSettingsIntro />

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">見える化の目的</h3>
        <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">
          <strong>Metrics</strong> では、組織または Enterprise 契約に応じて <strong>利用率・機能別の利用</strong>・シート消化などのサマリーが表示されます。
          経営・プラットフォームチームが「導入したが使われていない部署はどこか」を判断するのに使います。
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 dark:text-gray-300">
          <li>Enterprise 全体のダッシュボードは <strong>Enterprise › Insights</strong> に近い情報と重複・連動する場合があります</li>
          <li>指標の定義はプロダクト更新で変わるため、画面のツールチップや公式ドキュメントを優先してください</li>
        </ul>
      </section>

      <section className="mb-10 not-prose border-t border-gray-200 pt-8 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">Copilot Usage Metrics API</h3>
        <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">
          <strong>Copilot の Usage Metrics API</strong> の使い方を整理します。なお、<strong>旧 Copilot Metrics API は 2026 年 4 月 2 日に廃止</strong>
          されているため、<strong>新しい Copilot Usage Metrics API</strong> を利用してください。
        </p>

        <h4 className="mt-6 text-base font-semibold text-gray-900 dark:text-gray-100">前提条件</h4>
        <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">1. 権限</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          <strong>Enterprise owner</strong>、<strong>billing manager</strong>、または fine-grained の「
          <strong>View Enterprise Copilot Metrics</strong>」権限を持つユーザーが、Enterprise レベルのレポートを取得できます。
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Organization レベルでは、<strong>Copilot Metrics API access</strong> ポリシーが Organization で有効になっている必要があり、
          <strong>Organization owner</strong> または親 Enterprise の <strong>owner</strong> と <strong>Billing manager</strong> がアクセスできます。
        </p>

        <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">2. トークン</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          OAuth app トークンや <strong>Personal access token（classic）</strong> の場合は{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">manage_billing:copilot</code> または{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">read:enterprise</code> スコープが必要です。Fine-grained personal access
          token にも対応しています。
        </p>

        <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">3. ダッシュボードの有効化</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          <strong>Enterprise account → AI Controls → Copilot → Metrics → Copilot usage metrics</strong> から有効化します。有効化するとダッシュボードが表示され、
          <strong>API アクセスも利用できるようになります</strong>（画面のラベルは更新で変わることがあります）。
        </p>

        <h4 className="mt-8 text-base font-semibold text-gray-900 dark:text-gray-100">使えるエンドポイント（Enterprise）</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Enterprise レベルでは、主に次のようなレポートを取得できます。プレースホルダ{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">ENTERPRISE</code> は Enterprise のスラッグに置き換え、
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">X-GitHub-Api-Version</code> は利用する REST API バージョンに合わせてください。
        </p>

        <p className="mt-4 text-sm font-medium text-gray-800 dark:text-gray-200">Enterprise 全体のサマリー（1 日単位）</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{`curl -L \\
  -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer <YOUR-TOKEN>" \\
  -H "X-GitHub-Api-Version: 2026-03-10" \\
  "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/enterprise-1-day?day=2025-07-01"`}
        </pre>

        <p className="mt-6 text-sm font-medium text-gray-800 dark:text-gray-200">Enterprise 全体のサマリー（28 日ローリング・最新）</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{`curl -L \\
  -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer <YOUR-TOKEN>" \\
  -H "X-GitHub-Api-Version: 2026-03-10" \\
  https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/enterprise-28-day/latest`}
        </pre>

        <p className="mt-6 text-sm font-medium text-gray-800 dark:text-gray-200">ユーザー単位の詳細（1 日 / 28 日ローリング）</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          パスの <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">enterprise-</code> を{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">users-</code> に置き換えます。
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">.../reports/users-1-day?day=DAY</code>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">.../reports/users-28-day/latest</code>
          </li>
        </ul>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          レスポンスは<strong>ダウンロード用 URL の JSON 配列</strong>などの形で返り、そこから NDJSON 形式のレポートファイルを取得する流れになります（詳細は公式 REST 参照）。
        </p>

        <h4 className="mt-8 text-base font-semibold text-gray-900 dark:text-gray-100">Organization / Team レベル</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Organization やチーム単位の集計は、例えば次のようなパスで取得できるケースがあります（認可・API バージョンは Enterprise 側と同様に確認）。
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">
              {'GET /orgs/{org}/copilot/metrics'}
            </code>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">
              {'GET /orgs/{org}/team/{team_slug}/copilot/metrics'}
            </code>
          </li>
        </ul>

        <h4 className="mt-8 text-base font-semibold text-gray-900 dark:text-gray-100">取得できるメトリクスの種類</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          データは大まかに、<strong>採用（Adoption）</strong>、<strong>エンゲージメント</strong>、<strong>受け入れ率（Acceptance rate）</strong>、
          <strong>コード行数（Lines of Code）</strong>、<strong>PR ライフサイクル</strong>などに分類されます。
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          具体的には、IDE 別・言語別・モデル別のコード補完数・受け入れ数、DAU、チャット利用状況、cloud agent のアクティブユーザー数、CLI
          利用のトークン数、さらに Copilot code review におけるレビュー済み PR のマージ数やマージまでの中央値時間などが含まれる、という説明がドキュメント上で整理されています。
        </p>

        <h4 className="mt-8 text-base font-semibold text-gray-900 dark:text-gray-100">データの注意点</h4>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
          <li>
            データは<strong>約 2 日遅れ</strong>で利用可能になることがあります。ある日の集計は、その日が終わってから数営業日以内に処理される、という説明が公式にあります。
          </li>
          <li>
            <strong>ライセンスやシート管理</strong>の情報は Usage Metrics に含まれません。割当の確認には{' '}
            <strong>Copilot user management API</strong> などを別途利用してください。
          </li>
        </ul>

        <h4 className="mt-8 text-base font-semibold text-gray-900 dark:text-gray-100">可視化ツール</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          API を直接呼ぶ以外に、GitHub が公式に提供している <strong>copilot-metrics-viewer</strong> というダッシュボード用ツールがあり、コンテナイメージとして次のように取得できます。
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
          {`ghcr.io/github-copilot-resources/copilot-metrics-viewer:latest`}
        </pre>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          社内にデプロイすれば部門別の利用状況を視覚的に確認しやすく、<strong>cost center</strong> 管理と組み合わせると運用しやすいです。
        </p>
      </section>

      <section className="mb-6 not-prose text-sm text-gray-700 dark:text-gray-300">
        <p className="mb-2 font-medium text-gray-900 dark:text-gray-100">公式ドキュメント</p>
        <ul className="list-none space-y-2 p-0">
          <li>
            <DocLink href="https://docs.github.com/en/rest/copilot/copilot-metrics">REST API — Copilot metrics</DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/reviewing-github-copilot-activity-in-your-organization">
              Reviewing GitHub Copilot activity in your organization
            </DocLink>
          </li>
        </ul>
      </section>
    </article>
  );
}

/** Copilot Clients（利用を許可するクライアント） */
export function GitHubEnterpriseCopilotClientsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Copilot — Copilot Clients</h2>
      <CopilotSettingsIntro />

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">管理者が制御する理由</h3>
        <p className="text-gray-600 text-sm mb-4">
          <strong>Copilot Clients</strong> では、組織メンバーが <strong>どのエディタ・IDE・クライアントから Copilot を利用できるか</strong> を制限できます。
          標準化（VS Code のみ許可等）、サポートコストの削減、未承認クライアント経由のデータ持ち出しリスクの低減が目的になります。
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
          <li>VS Code、JetBrains 系、Vim/Neovim、Visual Studio など、契約で利用可能なクライアントから選択・禁止を組み合わせます</li>
          <li>変更後は社内ドキュメントとヘルプデスク案内を更新し、ブロックされたユーザーが分かるようにします</li>
        </ul>
      </section>

      <section className="mb-6 not-prose text-sm text-gray-700">
        <DocLink href="https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-access-to-github-copilot-in-your-organization">
          Managing access to GitHub Copilot in your organization
        </DocLink>
      </section>
    </article>
  );
}
