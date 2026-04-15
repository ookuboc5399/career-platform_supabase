'use client';

export function GitHubEnterpriseGitHubAppsOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">GitHub Apps とは</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        GitHub Apps は、Organization やリポジトリと連携する公式・サードパーティ製の統合機能です。Marketplace で公開されているアプリ（Slack、Datadog、CI/CD 連携など）や、社内で開発した専用アプリを Organization にインストールして利用できます。
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        この章では、<strong>GitHub App の作成</strong>、<strong>Organization へのインストール</strong>、<strong>Webhook の設定・検証</strong>を扱います。セキュリティ上は「最小権限」と「Webhook シークレットによる検証」を意識することが重要です。
      </p>
      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
        <li>
          <strong>作成手順</strong> — Developer settings での新規 App、GHEC と EMU での運用上の違い、読み取り専用レポート連携の実装例
        </li>
        <li>
          <strong>インストール手順</strong> — Marketplace または社内アプリを Organization に導入し、リポジトリ範囲と権限を確認する
        </li>
        <li>
          <strong>Webhook 設定</strong> — URL・シークレット・購読イベントを設定し、配信をテストする
        </li>
      </ul>
    </article>
  );
}

export function GitHubEnterpriseGitHubAppsCreateGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">GitHub Apps の作成手順</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        自社ツールやレポート用に <strong>新規の GitHub App</strong> を登録する手順です。画面の項目名は{' '}
        <strong>GitHub Enterprise Cloud（GHEC）</strong>でも <strong>Enterprise Managed Users（EMU）</strong>
        でも同じですが、<strong>誰が作成・インストールできるか</strong>や<strong>組織ポリシー</strong>は環境で異なります。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. 共通の作成フロー（UI）</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>
            <strong>GitHub Enterprise Cloud</strong> の場合: <strong>Settings → Developer settings → GitHub Apps → New GitHub App</strong>
          </li>
          <li>
            基本情報を入力します（<strong>GitHub App name</strong>、<strong>Homepage URL</strong>、必要なら <strong>User authorization callback URL</strong> など）。
          </li>
          <li>
            Webhook を使わないバッチ／CLI 連携のみの場合は、<strong>Webhook の Active をオフ</strong>にできます（イベント通知が不要なとき）。
          </li>
          <li>
            <strong>Permissions &amp; events</strong> で Organization / Repository / Enterprise など必要な権限を<strong>最小限</strong>に設定します。
          </li>
          <li>
            <strong>Where can this GitHub App be installed?</strong> で、Any account / Only this organization 等、公開範囲を選びます（ポリシーに合わせる）。
          </li>
          <li>
            <strong>Create GitHub App</strong> で保存し、<strong>Private keys</strong> から鍵を生成して安全に保管します。
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. GHEC と EMU で変わりやすいポイント</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          フォームの<strong>項目一覧は同一</strong>です。違いは主に<strong>アイデンティティとガバナンス</strong>です。
        </p>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">観点</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">GitHub Enterprise Cloud（通常）</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">EMU（Enterprise Managed Users）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 font-medium">ユーザー</td>
                <td className="px-4 py-3">個人アカウントと Org メンバーシップが一般的</td>
                <td className="px-4 py-3">ユーザーは IdP 管理の Managed User（企業が所有するアカウント）</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">App の作成者</td>
                <td className="px-4 py-3">ポリシー次第で開発者個人が作成することも多い</td>
                <td className="px-4 py-3">
                  多くの環境で<strong>管理者・専用サービス用アカウント</strong>に限定する運用が推奨される
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">インストール</td>
                <td className="px-4 py-3">Org 単位、または Enterprise レベルで複数 Org に展開するパターンあり</td>
                <td className="px-4 py-3">
                  同様に Org / Enterprise にインストールするが、<strong>承認フローと SSO</strong> の要件が厳格になりやすい
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">権限・API</td>
                <td className="px-4 py-3">契約プラン（例: GHAS）に応じてセキュリティ系権限が使える</td>
                <td className="px-4 py-3">
                  利用可能な権限の<strong>種類はクラウド上は同型</strong>だが、<strong>契約・ポリシーで無効化</strong>されていることがある
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          実際の「誰が Developer settings を開けるか」は Enterprise / Organization のポリシーとロールで決まります。迷った場合は Enterprise 管理者に確認してください。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          3. 実装例: 利用レポート用 GitHub App（ghe-usage-report 想定）
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          オープンソースの <strong>ghe-usage-report</strong>（
          <a
            href="https://github.com/NRI-Oxalis/ghe-usage-report"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            NRI-Oxalis/ghe-usage-report
          </a>
          ）では、<strong>読み取り専用</strong>の GitHub App 認証が推奨されています。以下はその設定の要約です。
        </p>

        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Step 1: New GitHub App</h4>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
          <li>
            <strong>Settings → Developer settings → GitHub Apps → New GitHub App</strong>
          </li>
          <li>
            <strong>GitHub App name</strong>: 例{' '}
            <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">ghe-usage-report</code>
          </li>
          <li>
            <strong>Homepage URL</strong>: リポジトリ URL など任意
          </li>
          <li>
            レポート取得のみで Webhook が不要なら、<strong>Webhook Active のチェックを外す</strong>
          </li>
        </ol>

        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Step 2: Permissions（Read-only の例）</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Organization permissions</strong>
        </p>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/90 font-medium text-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">Permission</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">Access</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">用途（例）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-3 py-2">Administration</td>
                <td className="px-3 py-2">Read-only</td>
                <td className="px-3 py-2">Org 設定、Copilot Seats 取得</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Members</td>
                <td className="px-3 py-2">Read-only</td>
                <td className="px-3 py-2">チーム・メンバー（GraphQL）</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Copilot Metrics</td>
                <td className="px-3 py-2">Read-only</td>
                <td className="px-3 py-2">Copilot 利用メトリクス（v3 API）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Enterprise permissions</strong>
        </p>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/90 font-medium text-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">Permission</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">Access</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 text-left">用途（例）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-3 py-2">Administration</td>
                <td className="px-3 py-2">Read-only</td>
                <td className="px-3 py-2">Org 自動検出、リポジトリ統計、ランナー情報</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Billing</td>
                <td className="px-3 py-2">Read-only</td>
                <td className="px-3 py-2">Enhanced Billing（Actions / Packages / Codespaces 等）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>GHAS を利用する場合のみ（省略可）</strong>
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm mb-4 space-y-1">
          <li>Code scanning alerts — Read</li>
          <li>Dependabot alerts — Read</li>
          <li>Secret scanning alerts — Read</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Step 3: 秘密鍵</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          App 設定の <strong>Private keys → Generate a private key</strong> で <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">.pem</code>{' '}
          をダウンロードし、安全な場所に保管します。
        </p>

        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Step 4: Enterprise / Org にインストール</h4>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
          <li>
            <strong>Install App</strong> から対象の Enterprise または Organization を選択
          </li>
          <li>
            ツールの要件に応じて対象範囲を選ぶ（例: Enterprise 配下の全 Org を対象にする等）
          </li>
          <li>
            インストール後 URL に含まれる <strong>Installation ID</strong> を控える（例:{' '}
            <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">.../installations/67890</code> の <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">67890</code>）
          </li>
        </ol>

        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Step 5: 環境変数（App 認証）</h4>
        <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto">
          {`export GH_APP_ID="12345"
export GH_APP_PRIVATE_KEY_PATH="/path/to/app.pem"
export GH_APP_INSTALLATION_ID="67890"`}
        </pre>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
          3 つとも設定されている場合、ツール側では GitHub App 認証が優先される例が多いです（ツールの README に従ってください）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. PAT で代替する場合（概要）</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          App が使えないポリシーの場合は <strong>Fine-grained PAT</strong> または <strong>Classic PAT</strong> で同等の読み取りを試みます。必要スコープはツールのドキュメント（例:{' '}
          <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">admin:enterprise</code>、<code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">read:org</code> 等）を参照してください。
        </p>
        <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto">
          {`export GITHUB_TOKEN="ghp_xxxx"`}
        </pre>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. ビルド・月次運用・レポート画面（ghe-usage-report）</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">go build</code>、<code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">pricing.yml</code>、
          <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">team_mapping.csv</code>、<code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-1 rounded text-sm">ghe-usage all|fetch|report</code>、GitHub Actions
          による定期実行、HTML ダッシュボードの読み方など、<strong>詳細な Playbook はリポジトリ同梱ドキュメント</strong>を参照してください。
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-900 dark:text-blue-100">
          <strong>参考:</strong>{' '}
          <a
            href="https://github.com/NRI-Oxalis/ghe-usage-report"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium text-blue-800 dark:text-blue-300"
          >
            github.com/NRI-Oxalis/ghe-usage-report
          </a>
        </div>
      </section>
    </article>
  );
}

export function GitHubEnterpriseGitHubAppsInstallGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">GitHub Apps のインストール手順</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        すでに GitHub Marketplace で公開されているアプリ（例：Slack、Datadog、CI/CD ツールなど）、あるいは社内で作成済みのアプリを Organization に導入する手順です。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. インストール画面を開く</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>
            導入したい GitHub App のページ（Marketplace のページ、または社内アプリのインストール URL）にアクセスします。
          </li>
          <li>
            画面の右上、または説明文の横にある<strong>緑色の Install</strong>（または <strong>Install it for free</strong>）ボタンをクリックします。
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. インストール対象（Organization）を選択する</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>複数の Organization に所属している場合、「どこにインストールするか」を聞かれます。</li>
          <li>
            対象となる <strong>Organization 名</strong> の横にある <strong>Install</strong> をクリックします。
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          3. アクセスを許可するリポジトリを選択する（重要）
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          セキュリティのベストプラクティス（<strong>最小権限の原則</strong>）に従い、次の設定を行います。
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Repository access</strong> の項目で、次のいずれかを選択します。
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
          <li>
            <strong>All repositories:</strong> Organization 内の全リポジトリ（今後作成されるものも含む）に権限を与えます。
            <span className="block text-sm text-amber-800 dark:text-amber-200 mt-1">
              ※ 全社横断のセキュリティツール等を除き、原則<strong>非推奨</strong>です。
            </span>
          </li>
          <li>
            <strong>Only select repositories:</strong> 特定のリポジトリにのみ権限を与えます。
            <span className="block text-sm text-green-800 dark:text-green-300 mt-1 font-medium">
              ※ こちらを強く推奨します。
            </span>
          </li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Only select repositories</strong> を選んだ場合、すぐ下の検索バーから、アプリを連携させたいリポジトリを検索して追加します。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. 権限を確認して承認する</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>
            画面下部に、このアプリが要求している権限（例：<em>Read access to code</em>、<em>Write access to issues</em>
            など）の一覧が表示されます。内容が適切か確認します。
          </li>
          <li>
            問題なければ、一番下の <strong>Install</strong>（または <strong>Authorize</strong>）ボタンをクリックします。
          </li>
          <li>
            （必要に応じて）外部サービスのログイン画面にリダイレクトされるので、そちらのアカウントと紐付けを行えば完了です。
          </li>
        </ol>
      </section>
    </article>
  );
}

export function GitHubEnterpriseGitHubAppsWebhookGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">GitHub Apps の Webhook 設定手順</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        自社で専用の GitHub App（内製ツール用など）を開発・管理しており、GitHub 上で起きたイベント（Issue の作成、PR のマージなど）を自社サーバー（ペイロード URL）にリアルタイムで通知させたい場合の手順です。
      </p>
      <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-900 dark:text-amber-100">
        <strong>前提条件:</strong> 対象の GitHub App の作成者、または Organization の Owner 権限が必要です。
      </div>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. アプリの設定画面を開く</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>GitHub の右上プロフィールアイコンから <strong>Settings</strong> をクリックします。</li>
          <li>左側のサイドバーを一番下までスクロールし、<strong>Developer settings</strong> をクリックします。</li>
          <li>
            左側のメニューから <strong>GitHub Apps</strong> を選択し、設定したいアプリの名前をクリックします。
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Webhook の基本情報を設定する</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>
            左側のメニューから <strong>General</strong> が選択されていることを確認し、画面中段の「<strong>Webhook</strong>」セクションまでスクロールします。
          </li>
          <li>
            <strong>Active</strong> のチェックボックスにチェックを入れます。
          </li>
          <li>次の情報を入力します。</li>
        </ol>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4 ml-4">
          <li>
            <strong>Webhook URL:</strong> GitHub からの通知（POST リクエスト）を受け取る自社サーバーや API Gateway のエンドポイント URL を入力します。
          </li>
          <li>
            <strong>Webhook secret（強く推奨）:</strong> 任意の文字列（パスワードのようなもの）を入力します。送られてきたデータが
            <strong>本当に GitHub から送られたものか</strong>を自社サーバー側で検証でき、悪意あるリクエストを弾けます。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. サブスクライブするイベント（通知条件）を選択する</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">「何が起きたときに Webhook を飛ばすか」を設定します。</p>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>
            左側のメニューから <strong>Permissions &amp; events</strong> をクリックします。
          </li>
          <li>画面を一番下までスクロールし、<strong>Subscribe to events</strong> のセクションを開きます。</li>
          <li>
            通知を受け取りたいイベント（例：<strong>Issues</strong>、<strong>Pull request</strong>、<strong>Push</strong> など）にチェックを入れます。
          </li>
        </ol>
        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
          ※ ここにチェックを入れるためには、画面上部の <strong>Permissions</strong> セクションで、該当する項目の Read 権限以上が事前に付与されている必要があります。
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          最後に、画面一番下にある <strong>Save changes</strong> をクリックして完了です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. Webhook の配信テストを行う</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3 mb-4">
          <li>左側のメニューから <strong>Advanced</strong> をクリックします。</li>
          <li>
            「<strong>Recent Deliveries</strong>」セクションに、過去に送信された Webhook の履歴が並びます。
          </li>
          <li>
            履歴がない場合、または再送したい場合は、対象のイベントの横にある <strong>Redeliver</strong> をクリックすると、再度
            Webhook が送信され、自社サーバー側での受信テストが可能です。
          </li>
        </ol>
      </section>
    </article>
  );
}
