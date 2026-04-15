'use client';

import type { ReactNode } from 'react';

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      {children}
    </a>
  );
}

/** Enterprise アカウントの Overview（ダッシュボード）に対応 */
export function GitHubEnterpriseOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise の Overview（概要）</h2>
      <p className="text-gray-600 mb-8">
        GitHub Enterprise Cloud（GHEC）では、エンタープライズオーナーが{' '}
        <strong>github.com/enterprises/&lt;slug&gt;</strong> を開くと、まず{' '}
        <strong>Overview</strong>（概要）が表示されます。ここは「今の Enterprise
        全体の状態を一目で掴む」ための入口です。<strong>GitHub Enterprise Server（GHES）</strong>は別製品のため、学習一覧では{' '}
        <strong>トップレベルの「GitHub Enterprise Server（GHES）」チャプター</strong>で扱います（URL・メニューはインスタンスごとに異なります）。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">画面で確認できること（GHEC 想定）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>
            <strong>所属 Organization の一覧</strong> と、Enterprise に参加待ちの招待などのサマリー
          </li>
          <li>
            <strong>利用状況・ライセンス</strong> への導線（詳細は Insights や Billing / Usage と連動）
          </li>
          <li>
            <strong>設定（Settings）</strong> や <strong>Insights</strong> など、他タブへの起点
          </li>
        </ul>
        <p className="text-gray-600 mb-4">
          学習の単位としては「Enterprise アカウントを開いた直後の 1 画面」を押さえ、次に Settings /
          Insights / 各 Organization に進む流れにすると、公式 UI と対応しやすくなります。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">公式ドキュメント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts">
              About enterprise accounts（GitHub Docs）
            </DocLink>
          </li>
        </ul>
      </section>
    </article>
  );
}

/** Enterprise アカウントの Insights タブに対応（リポジトリの Insights タブとは別チャプター） */
export function GitHubEnterpriseInsightsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise の Insights</h2>
      <p className="text-gray-600 mb-8">
        <strong>Enterprise &gt; Insights</strong> は、Enterprise アカウント配下の利用状況や採用状況をまとめて見るための領域です（プランや機能により表示項目は異なります）。コース内の{' '}
        <strong>リポジトリの Insights タブ</strong>（Pulse / Contributors など）とは別物なので、チャプターも分けています。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Insights 内の主要指標（GHEC）</h3>
        <p className="text-gray-600 mb-6">
          GitHub Enterprise Cloud の Insights では、契約に応じて <strong>Copilot usage</strong>、<strong>Code generation</strong>、<strong>Actions usage metrics</strong>、<strong>Actions performance metrics</strong> などが表示されます。以下はそれぞれの役割の整理です（画面ラベルは英語のまま記載します）。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Copilot usage</h4>
        <p className="text-gray-600 mb-4">
          Enterprise における <strong>GitHub Copilot の利用状況のサマリー</strong>です。ライセンス（シート）の割当て、実際に利用しているユーザー規模、エディタや機能別の利用傾向などを把握し、「導入したが使われていない組織はどこか」「どの程度コストに見合っているか」を判断するのに使います。プレミアムリクエストやプラン種別によって見える指標が増減する場合があります。
        </p>
        <p className="text-gray-600 mb-6">
          運用では、経営・情シスが <strong>採用率・継続利用</strong> を見るダッシュボードとして使い、現場リーダーは必要に応じて Organization やチーム単位の詳細（利用可能な場合）まで掘ります。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">Code generation</h4>
        <p className="text-gray-600 mb-4">
          Copilot によって <strong>どれだけコードが生成・提案され、どれがエディタ上で採用されたか</strong> に焦点を当てた指標群です。「usage」がシートやユーザー単位の利用の広がりを見るのに対し、code generation は <strong>提案と採用のボリューム</strong>（言語別・期間別など）を追い、生産性やスタイルガイド遵守の議論の材料にします。
        </p>
        <p className="text-gray-600 mb-6">
          解釈の注意: 行数や採用率だけで品質を測れないため、レビュー文化やセキュリティポリシー（秘密の混入防止など）とセットで見るのが実務的です。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">Actions usage metrics</h4>
        <p className="text-gray-600 mb-4">
          <strong>GitHub Actions の「量」の利用状況</strong>です。ビルドやデプロイなどで消費した <strong>分（minutes）</strong>、ワークフロー実行回数、Organization やリポジトリ横断での利用の偏りなどが分かります。請求やクォータ（含む従量課金）と直結するため、FinOps やプラットフォームチームが「どこで Actions が膨らんでいるか」を特定するのに使います。
        </p>
        <p className="text-gray-600 mb-6">
          Self-hosted runner を併用している場合は、ホステッドランナー分の消費と合わせて読み解く必要があります。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">Actions performance metrics</h4>
        <p className="text-gray-600 mb-4">
          Actions の <strong>「速さ・安定性」</strong> に関する指標です。ジョブやワークフローの所要時間、キュー待ち、成功率・失敗率の傾向などを通じて、「ランナー不足で待ちが長くなっていないか」「特定のワークフローが遅い・壊れやすい箇所はないか」を把握します。usage metrics が請求・消費量寄りであるのに対し、performance は <strong>開発者体験（DX）と信頼性</strong> 寄りです。
        </p>
        <p className="text-gray-600 mb-6">
          ボトルネックがホステッドランナーの混雑なのか、ジョブ設計（並列度・キャッシュ・テスト分割）なのかを切り分ける手がかりになります。
        </p>

        <p className="text-gray-600 mb-2">
          実際のメニュー名やグラフは UI の更新で変わるため、手元の Enterprise で表示を確認し、必要に応じて{' '}
          <DocLink href="https://docs.github.com/en/billing">Billing and usage</DocLink> や{' '}
          <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts">
            Enterprise の概要
          </DocLink>
          とあわせて読むと整理しやすいです。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">リポジトリの Insights との違い</h3>
        <p className="text-gray-600 mb-4">
          リポジトリ画面の <strong>Insights</strong> は、そのリポジトリ内の Pulse・Traffic などに特化しています。混同しないよう、本チャプターでは{' '}
          <strong>Enterprise アカウントの Insights タブ</strong>のみを扱います。
        </p>
      </section>
    </article>
  );
}

/** Enterprise Settings の Announcements に対応 */
export function GitHubEnterpriseAnnouncementsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">お知らせ（Announcements）</h2>
      <p className="text-gray-600 mb-8">
        Enterprise 管理者は、<strong>Enterprise の Settings</strong> からメンバー向けの{' '}
        <strong>お知らせ（Announcements）</strong> を掲出できます。メンテナンス予定、セキュリティポリシー変更、SSO
        切り替えの案内など、全員に届けたい内容に使います。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">画面の場所（GHEC）</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
          <li>
            Enterprise アカウントに移動:{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">github.com/enterprises/&lt;slug&gt;</code>
          </li>
          <li>
            <strong>Settings</strong>（Enterprise の設定）を開く
          </li>
          <li>
            サイドバーの <strong>Announcements</strong>（お知らせ）で作成・編集
          </li>
        </ol>
        <p className="text-gray-600 mb-4">
          表示対象（Enterprise 内のどの範囲に出すか）や利用可能なフォーマットはプラン・UI
          により異なる場合があります。作成後、メンバー側でバナーや通知としてどう見えるかも確認してください。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">運用のヒント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>緊急度が高い内容は、お知らせに加えメールや社内チャネルでも二重に伝える</li>
          <li>SSO や 2FA 変更は、実施日時とロールバック方針を短く明記する</li>
          <li>古いお知らせは定期的に整理し、最新の 1〜2 件が一目で分かるようにする</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">公式ドキュメント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/user-management/managing-announcements-in-your-enterprise">
              Managing announcements in your enterprise
            </DocLink>
          </li>
        </ul>
      </section>
    </article>
  );
}

/** Enterprise Settings の Hooks（Enterprise レベルの Webhook）に対応 */
export function GitHubEnterpriseHooksGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hooks（Enterprise Webhooks）</h2>
      <p className="text-gray-600 mb-8">
        <strong>Enterprise の Settings &gt; Hooks</strong> では、Enterprise
        アカウントレベルのイベントを外部 URL に配送する <strong>Webhook</strong> を設定します。Organization や
        Repository の Webhook とは <strong>スコープが異なる</strong> ため、別チャプターにしています。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Organization / Repository の Hooks との違い</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>
            <strong>Enterprise Hooks:</strong> Enterprise 管理イベント（監査・メンバー・設定変更など、利用可能なイベントはドキュメント参照）
          </li>
          <li>
            <strong>Organization Webhooks:</strong> Organization 内のリポジトリ活動など
          </li>
          <li>
            <strong>Repository Webhooks:</strong> 単一リポジトリの push、PR など
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">設定の流れ（一般的な手順）</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
          <li>受け口となる HTTPS エンドポイントを用意し、ペイロード検証用のシークレットを決める</li>
          <li>
            Enterprise <strong>Settings &gt; Hooks</strong> で Payload URL と Content type、シークレットを入力
          </li>
          <li>購読するイベントを最小限に絞る（セキュリティとノイズ削減）</li>
          <li>「Recent deliveries」等でテストイベントの成否を確認</li>
        </ol>
        <p className="text-gray-600 mb-4">
          GitHub App の Webhook とは設定画面もイベントも異なります。コース内の「GitHub Apps の
          Webhook 設定」と混同しないでください。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">公式ドキュメント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <DocLink href="https://docs.github.com/en/webhooks">Webhooks の概要</DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/overview/managing-your-enterprise-account">
              Managing your enterprise account
            </DocLink>
            （Enterprise レベルの統合・Webhook まわりの説明への入口）
          </li>
        </ul>
      </section>
    </article>
  );
}
