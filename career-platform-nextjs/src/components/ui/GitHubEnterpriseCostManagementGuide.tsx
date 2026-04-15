'use client';

export default function GitHubEnterpriseCostManagementGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-gray-600 mb-8 text-sm leading-relaxed not-prose">
        GitHub Enterprise Cloud（GHEC）では、<strong>Billing and licensing</strong> まわりでライセンス・従量（Actions / Packages /
        Codespaces 等）・<strong>GitHub Copilot</strong>（シート・プレミアムリクエスト / PRU）を俯瞰します。
        学習一覧では <strong>GitHub Enterprise</strong> 直下に、<strong>Settings</strong> ハブと同型の<strong>コスト管理（Billing and licensing）</strong>ハブがあり、本チャプターはその<strong>配下</strong>にあります（公式
        UI でも Enterprise の左ナビで <strong>Settings</strong> と <strong>Billing and licensing</strong> は並列で、後者は Settings の中にネストされません）。前半は画面項目の読み方、後半は API・按分などの実務です。
      </p>

      {/* —— 画面ナビ: Enterprise 左ナビで Settings ∥ Billing and licensing —— */}
      <section className="mb-14 not-prose">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enterprise での位置づけ</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">github.com/enterprises/&lt;slug&gt;</code> を開いたとき、左サイドバーには{' '}
          <strong>Settings</strong> と <strong>Billing and licensing</strong>（表記は契約・UI 言語で多少異なることがあります）が<strong>同列</strong>に並ぶ構成が一般的です。
          請求・ライセンス・従量の集約は <strong>Billing and licensing</strong> 側、認証・ポリシー・Hooks などは <strong>Settings</strong> 側、と役割を分けて覚えると迷いにくいです。Enterprise オーナーまたは請求管理者権限が必要な操作が多いです。以下の項目名は英語 UI を基準に記載します。
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Billing and licensing の主な画面</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          契約・プランによりタブやラベルが異なる場合があります。以下はこのメニュー配下に並ぶことが多い項目の意味です。
        </p>

        <div className="space-y-8 border-l-4 border-blue-500 pl-5">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Overview</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                請求・ライセンスの<strong>要約ダッシュボード</strong>です。契約中のプロダクト、次回請求の目安、注意が必要な項目への導線がまとまります。
                詳細な内訳は Usage / Licensing など下位の画面へ進みます。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Usage</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>従量制サービスの消費量</strong>（例: GitHub Actions の分、Packages の転送・ストレージ、Codespaces の利用時間など）を期間別に確認します。
                Copilot のプレミアムリクエストなど、プランに含まれる枠の消化状況もここで追うことが多いです。経理・FinOps 向けの固定レポートには API 併用が実務的です。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Licensing</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>シート型ライセンス</strong>（GHEC ユーザー、Copilot、GitHub Advanced Security 等）の割当・利用状況を扱います。
                誰にシートが付いているか、未使用シートの有無、追加購入の要否の判断材料になります。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Cost centers</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                Enterprise の請求を<strong>社内のコストセンター単位</strong>に紐づけるための機能です（利用可能な契約・設定による）。
                Organization やユーザーをコストセンターに<strong>リソースとして割り当て</strong>、部門ごとの見える化や
                <strong>プレミアムリクエストの予算</strong>管理に使えます（契約・UI による）。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                社内会計コードや事業部コードの<strong>正式マスタ</strong>は GitHub 外にあることが多いので、GitHub 上の Cost center 名と社内コードの対応表を別途管理する運用が一般的です（後述の按分セクション）。
              </p>
              <p className="text-gray-700 text-sm font-semibold mb-1">Organization ベースの管理</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Organization をコストセンターに紐づける方式です。<strong>Copilot</strong> と <strong>GitHub Enterprise</strong>{' '}
                のライセンスコストが、そのコストセンターに割り当てられる整理になります。利用部門ごとに Organization を分けている構成に向きます。
              </p>
              <p className="text-gray-700 text-sm font-semibold mb-1">ユーザーベースの管理</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                ユーザーをコストセンターに直接割り当てる方式です。<strong>すべての有料ライセンス</strong>のコストが、そのコストセンターに集約されるイメージです。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                例: Copilot 利用者 25 名のうち、プレミアムリクエストの追加利用を許可したいのが 10 名だけ、という場合に、該当 10 名を 1
                つのコストセンターに割り当て、残り 15 名を別コストセンターに割り当てて<strong> $0 の予算</strong>を設定する、といった運用が可能です（設定可否は契約による）。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Budgets and alerts</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                利用額や消費量に対して<strong>予算（Budget）</strong>を設定し、しきい値に近づいたときに<strong>アラート通知</strong>を受け取るための領域です。
                Actions や Copilot など対象プロダクトは UI に依存します。予算超過前にプラットフォームチームが介入するトリガーとして使います。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                予算は <strong>Organization</strong>、<strong>Enterprise</strong>、または <strong>cost center</strong>{' '}
                レベルで設定できる場合があります。<strong>「予算上限に達したら利用を停止」</strong>のようなオプションを有効にすると、予算を使い切ったあとに
                <strong>プレミアムリクエストがブロック</strong>されるなど、消費のハードストップとして機能します（表示名・対象は公式 UI に従ってください）。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Payment information（支払い方法）</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Enterprise の請求は <strong>Microsoft Azure Subscription だけではありません。</strong>
                Enterprise アカウントに登録できる支払い方法として、例として次のような選択肢があります（契約・地域・販売チャネルにより利用可否が異なります）。
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 mb-3">
                <li>
                  <strong>クレジットカード</strong>
                </li>
                <li>
                  <strong>PayPal</strong>
                </li>
                <li>
                  <strong>Microsoft Azure Subscription</strong>（Azure 経由で GitHub にリンクしたサブスクリプションで支払う）
                </li>
                <li>
                  <strong>請求書払い（invoice）</strong> — GitHub の Sales チーム経由で Enterprise アカウントを作成・契約した場合に、請求書払いで合意できることがあります
                </li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                請求先住所、請求書・領収書の取得などもこの周辺の画面で扱います。経理・調達との連携時は、ここで表示される請求主体と社内のベンダーマスタを突合します。
              </p>
              <div className="rounded-md border border-blue-100 bg-blue-50/80 px-3 py-2.5 text-sm text-blue-900">
                <strong>Azure で支払っている場合:</strong> プレミアムリクエストなど従量分が <strong>Azure の請求書・コスト管理</strong>に表示される、という<strong>連携上のメリット</strong>があります。一方、支払い手段としては上記のとおり複数あり、Azure 限定ではありません。
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Billing contacts</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                請求関連の<strong>通知先メールアドレスや連絡先</strong>を管理します。請求書送付、カード期限切れ警告、利用枠のアラートが誰に届くかを制御するため、役割（経理・情シス・コストオーナー）ごとに整理しておくと漏れが減ります。
              </p>
            </div>
        </div>
      </section>

      {/* 同じ階層の読み方の例 */}
      <section className="mb-14 not-prose rounded-lg border border-dashed border-gray-300 bg-gray-50/80 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3">画面のたどり方の例（リポジトリ側）</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          GitHub の UI は <strong>Settings → カテゴリ（例: Actions）→ 具体的な項目</strong> のように階層になっています。学習一覧でも同様にセクション分けしてあります。
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>
            <strong>Organization または Repository の Settings</strong>
          </li>
          <li className="ml-4">
            <strong>GitHub Actions</strong>（設定カテゴリ）
          </li>
          <li className="ml-4">
            General / Runner groups / ワークフロー関連など、目的ごとの画面
          </li>
        </ul>
      </section>

      {/* —— 実務: 按分・API —— */}
      <section className="mb-10 not-prose">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">実務: Cost Center 按分と API</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Billing の UI はスナップショット向きです。<strong>月次の固定フォーマット・部門別集計</strong>には、GitHub の Cost centers と社内マスタ、API を組み合わせます。
        </p>

        <div className="border-l-4 border-gray-400 pl-5 space-y-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cost Center との付き合い方（GitHub と社内の両面）</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              GitHub の <strong>Billing and licensing &gt; Cost centers</strong> で部門別のひも付けができる場合と、
              <strong> Organization・Team・リポジトリ ID を社内コストセンターにマッピングする</strong>だけの場合があります。後者のみのときも、FinOps
              の考え方は同じです。
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-4">
              <li>
                <strong>Team / Org 単位の対応表</strong>を CSV や社内マスタで管理し、利用レポート（自社ツールや{' '}
                <a
                  href="https://github.com/NRI-Oxalis/ghe-usage-report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  ghe-usage-report
                </a>
                等）に取り込む
              </li>
              <li>
                <strong>Copilot</strong> はシート数・PRU がコストドライバーになりやすい → チーム別・ユーザー別メトリクスと紐づけて按分
              </li>
              <li>
                <strong>Actions / Packages / Codespaces</strong> は従量要素が大きい → Usage 画面や API 出力を月次で突合
              </li>
            </ul>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
              按分ルール（例: プラットフォーム共通は本部コスト、プロダクトチームは各事業部）は、経理・IT ガバナンスと合意したうえでドキュメント化しておくと、監査や予算説明が楽になります。
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Usage API / Billing 系 API（プログラムで取得）</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              利用量の<strong>自動取得・ダッシュボード化・コストセンター別集計</strong>には、GitHub の REST / GraphQL API を使います。エンドポイント名やプレビューヘッダは公式ドキュメントの最新版を必ず確認してください。
            </p>

            <div className="ml-3 border-l-2 border-gray-200 pl-4 space-y-4">
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Enterprise / Organization の利用・請求関連（例）</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                  <li>
                    <strong>Enhanced billing / usage</strong> 系の REST API（Enterprise スコープ）— Actions・Packages・Codespaces 等の利用データを期間指定で取得
                  </li>
                  <li>
                    <strong>Copilot</strong> — シート情報、メトリクス、チーム別利用など（API バージョンやプレビューが更新されることがある）
                  </li>
                  <li>
                    <strong>GraphQL</strong> — Enterprise 配下の Organization 列挙、チーム・メンバー構成の取得（按分の「ひも付け」に利用）
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">認証と権限</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                  <li>
                    <strong>Fine-grained PAT</strong> または <strong>Classic PAT</strong>、もしくは <strong>GitHub App</strong>（読み取り専用の Organization / Enterprise / Billing 権限）で呼び出す構成が一般的
                  </li>
                  <li>
                    Enterprise 横断で Org を自動検出するツールでは、<code className="bg-gray-100 px-1 rounded text-xs">admin:enterprise</code> 相当や Enterprise レベルの権限が必要になることが多い
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <strong>参考:</strong>{' '}
              <a
                href="https://docs.github.com/en/enterprise-cloud@latest/billing/reference/rest-api-overview-for-the-rest-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                GitHub Docs — Billing / REST API 概要
              </a>
              {' / '}
              <a
                href="https://docs.github.com/en/enterprise-cloud@latest/rest/enterprise-admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Enterprise admin REST
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">運用パターン（FinOps との接続）</h3>
            <ol className="list-decimal list-inside text-gray-600 text-sm space-y-3">
              <li>
                <strong>マスタ整備:</strong> Org / Team slug とコストセンター・事業部コードの対応表（CSV 等）を単一ソースにする
              </li>
              <li>
                <strong>月次ジョブ:</strong> Usage / Billing API と GraphQL で raw JSON を取得し、社内の単価表（Copilot シート単価、PRU 単価、GHEC シートなど）と突合
              </li>
              <li>
                <strong>可視化:</strong> 経営・部門長向けに「プロダクト別・チーム別コスト」「非アクティブシート」「従量の急増」を同じダッシュボードで見せる
              </li>
              <li>
                <strong>ガバナンス:</strong> Budgets and alerts と連動し、非アクティブ Copilot シートの回収、Actions のキャッシュ・並列度の見直し、Codespaces のポリシー化
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">まとめ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Billing and licensing</strong> の各画面で現状を把握し、<strong>Usage / Billing API とチーム構造</strong>を組み合わせて社内の Cost
              Center に落とし込むのが中心です。API は進化が早いため、取得スクリプトは公式ドキュメントとリリースノートを定期的に追従させてください。
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
