'use client';

export default function GitHubAuditLogsGuide() {
  return (
    <article className="prose prose-gray max-w-none dark:prose-invert">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 not-prose">
        📋 GitHub のログの種類と活用
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
        GitHub で利用できるログは目的ごとに分かれています。監査・コンプライアンス・セキュリティ運用では、どのログがどこまでをカバーするかを押さえておくと、調査や SIEM 連携の設計がしやすくなります。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. Audit Log（監査ログ）</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          コンプライアンスやインシデント対応で<strong>最も重要なログ</strong>です。スコープは次の 3 層に分かれます。
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-3">
          <li>
            <strong>Enterprise Audit Log</strong> — Enterprise 配下のユーザー、Organization、リポジトリに関するイベントを記録します。デバッグやコンプライアンス対応に使います。
            保持期間はプラン・設定により異なります（例として、過去 180 日分の参照や Git 関連イベントの短期保持などが案内されることがあります。最新は公式ドキュメントで確認してください）。
          </li>
          <li>
            <strong>Organization Audit Log</strong> — Organization の管理者が、メンバーの操作（誰が・何を・いつ行ったか）を確認できます。
          </li>
          <li>
            <strong>個人の Security log</strong> — ユーザー自身のアカウントに対する操作履歴です。
          </li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-4">
          監査ログのイベントは <strong>action</strong> の種類（例: access、authentication、create、modify、remove、restore など）や、
          <strong>対象カテゴリ</strong>（repo、team、org、oauth_application、copilot など）で整理されます。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Git events（Git イベントログ）</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          push、clone、fetch など <strong>Git 操作</strong>の記録です。監査ログの設定で、Git イベントを監査ログに含めるかどうかを構成できます（利用可能な範囲はプランにより異なります）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. Push log（プッシュログ）</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          <strong>GitHub Enterprise Server（GHES）</strong> では、プッシュログやグローバル Webhook などを使ってアクティビティを監視できます（クラウド版 GHEC とは機能セットが異なる場合があります）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. GitHub Actions のワークフローログ</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          各ワークフロー実行の<strong>ステップごとの出力</strong>です。ビルド・テストの失敗調査やスクリプトのデバッグに使います（CI 用。監査ログとは別系統です）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. API request log</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Enterprise の設定で有効化すると、Enterprise および Enterprise が所有するリソースへの <strong>API リクエスト</strong>を記録できます。
          Audit log ストリーミングなどの経路で外部に送って分析する運用も可能です（利用可否は契約・バージョンを確認してください）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">6. Security / Dependabot アラートまわりの監査</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          セキュリティアラート（Dependabot 等）に対して<strong>どんなアクションが取られたか</strong>を、監査ログや関連 UI から追跡できる場合があります。脆弱性対応の説明責任とセットで設計します。
        </p>
      </section>

      <section className="mb-12 not-prose border-t border-gray-200 pt-10 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">各ログの取得方法</h2>

        <div className="space-y-10 text-sm">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Audit Log（監査ログ）</h3>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Web UI</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
              <li>
                <strong>Enterprise:</strong> Enterprise の <strong>Settings</strong> → <strong>Audit log</strong>
              </li>
              <li>
                <strong>Organization:</strong> Organization の <strong>Settings</strong> → <strong>Logs</strong> →{' '}
                <strong>Audit log</strong>
              </li>
              <li>JSON 形式または CSV 形式でエクスポートできる場合があります（画面の案内に従ってください）</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">REST / GraphQL API</p>
            <pre className="mb-3 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto font-mono text-xs leading-relaxed">
              {`# Organization の監査ログ（REST）
curl -H "Authorization: Bearer TOKEN" \\
  https://api.github.com/orgs/{org}/audit-log

# GraphQL API（GitHub Enterprise Cloud 等）
# 取得可能な期間はプラン・エンドポイントにより異なります（例: 90〜120 日分などの案内あり）`}
            </pre>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">GitHub CLI（<code className="rounded bg-gray-100 px-1 dark:bg-gray-800">gh</code>）</p>
            <pre className="mb-4 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto font-mono text-xs leading-relaxed">
              {`gh api /orgs/{org}/audit-log --paginate`}
            </pre>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">ストリーミング（Enterprise Cloud）</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-2">
              <li>
                監査ログや Git イベントを Splunk、Datadog、Azure Event Hubs などへ<strong>リアルタイム</strong>でストリーミングできます
              </li>
              <li>
                <strong>Settings</strong> → <strong>Audit log</strong> → <strong>Log streaming</strong> から設定します
              </li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4">ログフォワーディング（Enterprise Server）</p>
            <p className="text-gray-600 dark:text-gray-300">
              監査ログとシステムログをサードパーティの監視システムに転送できる場合があります（GHES のドキュメントを参照）。
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Workflow Run Logs（Actions 実行ログ）</h3>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Web UI</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
              <li>
                リポジトリの <strong>Actions</strong> タブ → ワークフローを選択 → 実行結果をクリック → ジョブを選び詳細ログを確認
              </li>
              <li>UI からログファイルのダウンロードも可能です</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">REST API</p>
            <pre className="mb-3 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto font-mono text-xs leading-relaxed">
              {`# ワークフロー実行一覧
curl -H "Authorization: Bearer TOKEN" \\
  https://api.github.com/repos/{owner}/{repo}/actions/runs

# 特定の実行のログを ZIP ダウンロード
curl -H "Authorization: Bearer TOKEN" -L \\
  https://api.github.com/repos/{owner}/{repo}/actions/runs/{run_id}/logs \\
  -o logs.zip`}
            </pre>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">GitHub CLI</p>
            <pre className="mb-3 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto font-mono text-xs leading-relaxed">
              {`# 実行一覧
gh run list

# 特定の実行のログを表示
gh run view {run_id} --log

# 失敗したステップのログのみ
gh run view {run_id} --log-failed`}
            </pre>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">デバッグログの有効化</p>
            <p className="text-gray-600 dark:text-gray-300">
              リポジトリの <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong> で{' '}
              <code className="rounded bg-gray-100 px-1 font-mono dark:bg-gray-800">ACTIONS_STEP_DEBUG</code> を{' '}
              <code className="rounded bg-gray-100 px-1 font-mono dark:bg-gray-800">true</code> にすると、ステップの詳細ログが出力されます。
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Git events（Git イベントログ）</h3>
            <pre className="mb-3 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto font-mono text-xs leading-relaxed">
              {`# REST API（Enterprise Cloud 等・利用可能な場合）
curl -H "Authorization: Bearer TOKEN" \\
  "https://api.github.com/orgs/{org}/audit-log?include=git"`}
            </pre>
            <p className="text-gray-600 dark:text-gray-300">
              Git イベントは<strong>短期間のみ</strong>保持されることが多いです（例: 7 日程度の案内）。長期保存が必要ならストリーミングで外部に送る運用を検討してください。
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Security log（個人セキュリティログ）</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>
                <strong>Web UI:</strong> 右上の自分のアイコン → <strong>Settings</strong> → <strong>Security log</strong>
              </li>
              <li>自分のアカウントに対する認証やアクセスの履歴を確認できます</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12 not-prose border-t border-gray-200 pt-10 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Enterprise 監査ログと Organization 監査ログの違い
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
          主な違いは<strong>スコープ（範囲）</strong>・<strong>閲覧権限</strong>・<strong>記録されるイベントの種類</strong>の 3 点です。
        </p>

        <div className="space-y-8 text-sm">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">スコープ</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>
                <strong>Enterprise Audit Log</strong> — Enterprise 配下の<strong>すべての Organization</strong>のアクションを集約して表示します
              </li>
              <li>
                <strong>Organization Audit Log</strong> — <strong>その Organization 内</strong>のメンバーの操作のみが対象です
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Enterprise のログは Organization のログの<strong>上位集約版</strong>に相当します。複数 Org がある場合、Enterprise 側で横断的に追えます。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">閲覧権限</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>
                <strong>Enterprise Audit Log</strong> — <strong>Enterprise Owner</strong> がアクセス可能
              </li>
              <li>
                <strong>Organization Audit Log</strong> — <strong>Organization の管理者</strong>（Owner 等、ロールは設定により異なります）がアクセス可能
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">記録されるイベントの違い（例）</h3>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Enterprise に寄りがちなイベント（例）</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
              <li>Enterprise アカウントのプラン変更、API リクエストログ（有効化時）、監査ログのエクスポート操作、Git イベントのエクスポート</li>
              <li>SAML SSO の有効化／無効化など、Enterprise 全体のポリシー変更</li>
              <li>Enterprise Owner の招待・キャンセル</li>
              <li>Organization の作成・削除・移管</li>
              <li>請求・ライセンスまわりの操作</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Organization に寄りがちなイベント（例）</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
              <li>リポジトリの作成・削除、チーム変更、Webhook の設定変更、メンバーの招待・削除など日常的な Org 内操作</li>
              <li>Dependabot、Code scanning などセキュリティ機能の操作</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">両方に現れることがあるイベント</p>
            <p className="text-gray-600 dark:text-gray-300">
              リポジトリ設定の変更やメンバーのアクセス変更など、多くの Org 内イベントは Enterprise 側の監査ログにも集約されることがあります（表示・フィルタは UI により異なります）。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Enterprise Managed Users（EMU）環境での違い</h3>
            <p className="text-gray-600 dark:text-gray-300">
              EMU を利用している場合、Enterprise Audit Log に<strong>ユーザーイベント</strong>（個人のセキュリティログに近い内容）も含まれることがあります。通常の Enterprise 環境では含まれない場合があります。
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">実務的な使い分け</h3>
            <p className="text-gray-600 dark:text-gray-300">
              中〜大規模で複数 Organization を運用する場合は、<strong>Enterprise Audit Log</strong>で全体を俯瞰しつつ、各 Org の管理者には{' '}
              <strong>Organization Audit Log</strong>で自チームの監視を任せる形が一般的です。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10 not-prose rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">ログの外部連携</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          監査ログや Git イベントを、Splunk、Datadog、Microsoft Sentinel などのデータ管理・ SIEM に<strong>ストリーミング</strong>したり、ログフォワーディングでサードパーティの監視基盤に転送したりできます。
          中〜大規模の Enterprise では、ストリーミングを有効にして SIEM で一元管理する構成が一般的です。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 dark:border-blue-900 dark:bg-blue-950/40 not-prose">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">参考（GitHub Docs）</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>
            <a
              href="https://docs.github.com/ja/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Enterprise の監査ログ
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/ja/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Organization の監査ログ
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              セキュリティログを確認する
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/ja/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/streaming-the-audit-logs-for-your-enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Enterprise の監査ログのストリーミング
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
