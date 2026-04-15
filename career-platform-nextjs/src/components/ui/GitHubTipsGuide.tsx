'use client';

import Link from 'next/link';

/** Tips ハブ（github-tips）— 左ナビから各トピックへ */
export function GitHubTipsHubGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub Tips</h2>
      <p className="text-gray-600 dark:text-gray-300">
        現場で混同しやすい境界（Enterprise と Organization、GitHub と GitLab など）を、短いトピックに分けて整理しています。
        左のサイドバーから項目を選ぶと、該当トピックだけが表示されます。
      </p>
      <ul className="text-gray-600 dark:text-gray-300">
        <li>
          <strong>Enterprise / Organization</strong> — 上位ポリシー層と実行レベルの管理層の関係、Copilot の例、比較表
        </li>
        <li>
          <strong>GitHub / GitLab</strong> — プロダクトの位置づけ、CI/CD・セキュリティ・セルフホストの比較の考え方
        </li>
        <li>
          <strong>Copilot metrics viewer</strong> — Nuxt ダッシュボード・PostgreSQL・同期ジョブの構成、PAT / GitHub
          App 認証、Azure ワンクリックや Docker での立ち上げ方
        </li>
      </ul>
    </article>
  );
}

/** Enterprise と Organization の役割分担（従来の Tips 本文） */
export function GitHubTipsEnterpriseOrganizationGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enterprise と Organization</h2>

      <p className="text-gray-600 dark:text-gray-300">
        同じように見える設定もありますが、役割はかなり違います。これは「ほぼ同じ設定が2箇所にある」のではなく、
        <strong>Enterprise が上位のポリシー層</strong>、<strong>Organization が実行レベルの管理層</strong>
        という階層構造です。
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">基本的な関係性</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Enterprise owner は Enterprise 内の全 Organization に対してポリシーを設定できます。その際、Organization
          owner に判断を委任するか、Enterprise 側で強制するかを選択できます。Organization owner は Enterprise
          レベルで強制された設定を変更できません。同名設定でも「Enterprise 側で強制 → Org 側はグレーアウト」か
          「Enterprise 側で Let organizations decide → Org 側で設定可能」という関係です。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Enterprise レベルにしかないもの</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>IP 許可リスト、Copilot ポリシー（機能・モデル制御）、リポジトリポリシー、ルールセット</li>
          <li>cost center による支出按分、Azure 請求時の Subscription 分割</li>
          <li>Enterprise 全体の Audit Log、複数 Organization 横断の請求管理、Enterprise Teams</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Organization レベルにしかないもの</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>リポジトリの直接管理、チーム構成とネスト、リポジトリ単位権限</li>
          <li>Outside collaborator 招待、GitHub Actions の有効/無効、Runner 設定</li>
          <li>日常の開発運用に直結する実務設定</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Copilot の具体例（cloud agent）</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Enterprise Settings → Copilot ポリシーで「cloud agent を有効にするか」「どの Organization
          に許可するか」を決めます（上位方針）。Organization Settings → Copilot → Cloud
          agent で「どのリポジトリで使えるか」「ファイアウォール」「ランナー」を設定します（運用）。さらに
          Repository Settings は Enterprise / Org が「Let repositories decide」の場合に個別設定できます。
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">まとめ</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">観点</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Enterprise</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Organization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">役割</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">ガバナンス・ポリシーの強制</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">実運用の管理</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">請求</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">一括管理・cost center</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise 配下では設定不可</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">Audit Log</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise 全体</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Org 単位</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">ポリシー</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">強制 or 委任を選択</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise 強制時は変更不可</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">リポジトリ管理</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">直接持たない</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">直接所有・管理</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">チーム管理</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise Teams（横断）</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Organization Teams（Org 内）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

/** GitHub と GitLab の違い（概念整理・選定の話し方まで） */
export function GitHubTipsGitHubVsGitlabGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub と GitLab の違い</h2>
      <p className="text-gray-600 dark:text-gray-300">
        どちらも Git ホスティングに加え、Issue・MR/PR・CI/CD・パッケージ・セキュリティを束ねた DevOps
        プラットフォームです。以下は業界メディア等でよく対比される<strong>物語（ナラティブ）</strong>と、会話で使える整理です。
        <strong>無料枠の分数・価格・SKU は頻繁に変わる</strong>ため、最終判断は必ず各社の公式サイトで確認してください。
      </p>

      <section className="mb-8 not-prose rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm leading-relaxed text-slate-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-slate-200">
        <h3 className="mt-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
          根本的な違い（これだけ覚えておけば OK）
        </h3>
        <p className="mb-3 mt-2">
          <strong>GitHub</strong> は、エコシステムの広さ・マーケットプレイスの深さ・1.5
          億人以上規模の開発者コミュニティへの引力に賭けた戦略が語られることが多いです（業界記事の整理例: Tech Insider）。
        </p>
        <p className="mb-3">
          一方 <strong>GitLab</strong> は、Issue・CI・セキュリティを<strong>一つのアプリケーションに統合した DevSecOps スイート</strong>として揃え、ティアに応じてエンタープライズ向けセキュリティ機能を組み込み、<strong>セルフマネージド</strong>で規制業界にも訴求する立ち位置が強調されやすいです（同様に業界記事での対比）。
        </p>
        <p className="mb-0 font-medium text-slate-900 dark:text-slate-100">
          つまり、<strong>GitHub ＝ベストオブブリードのツールを組み合わせるハブ型</strong>、<strong>GitLab ＝全部入りのワンプラットフォーム型</strong>、という覚え方がしっくりきます。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">GitHub が強いとされる領域</h3>
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">AI / Copilot</h4>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>GitHub Copilot</strong> は、エージェント的な利用体験・ワークスペース認識・IDE
          連携の面で、競合の AI アシスタントより先行・成熟している、という評価が DevOps 系の解説記事（例: DevOps Daily）でよく見られます。AI
          支援開発を最優先するなら、まず GitHub 側の体験を触って比較する価値があります。
        </p>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">コミュニティとエコシステム</h4>
        <p className="text-gray-600 dark:text-gray-300">
          SCM 市場シェアで GitHub が約 38% といった推計が紹介されたり、オープンソースの事実上のホームとしての存在感が強調されたりします（例: Tech
          Insider）。採用・外部コラボ・OSS 参加のしやすさでは、開発者プロフィールとして GitHub が選ばれやすい、という説明も現場で通りやすいです。
        </p>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">GitHub Actions の無料枠（CI 分数）</h4>
        <p className="text-gray-600 dark:text-gray-300">
          無料プランにおけるホスト型 CI の分数は、記事上の対比では GitLab が月 400 分程度、GitHub が 2,000
          分程度とされる例があり、小規模チームの「とりあえず回す」検証には GitHub 側が有利に見えることがあります（例: Tech Insider）。{' '}
          <strong>現在値はプラン改定で変わる</strong>ので、必ず公式の利用制限ページで確認してください。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">GitLab が強いとされる領域</h3>
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">統合 DevSecOps と価格イメージ</h4>
        <p className="text-gray-600 dark:text-gray-300">
          GitLab Ultimate では、SAST・DAST・依存関係スキャン・コンテナスキャン・シークレット検出などが<strong>ユーザー単価に含まれる</strong>、という説明が記事対比でよく出ます（例として
          DevOps Daily では Ultimate を <strong>$99/ユーザー/月</strong> 前後の文脈で、セキュリティスイート込みと紹介）。一方 GitHub では{' '}
          <strong>GitHub Advanced Security（GHAS）</strong>が Enterprise ライセンスに加え、<strong>コミッター単位の追加課金</strong>
          になる、といった比較（例: Enterprise ベース <strong>$21/ユーザー/月</strong> に加え <strong>$49/コミッター/月</strong>
          等）が並べられることがあります。
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          「セキュリティスイートを幅広く揃えたいが、ツール課金の積み上げを抑えたい」という議論では、GitLab
          側の方がコスト効率の説明がつきやすい、という結論に記事が寄ることがあります。{' '}
          <strong>実際の見積もりは契約形態・席数・コミッター数で大きく変わる</strong>ため、ここは必ず営業・公式料金で裏取りしてください。
        </p>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">セルフホスト / エアギャップ</h4>
        <p className="text-gray-600 dark:text-gray-300">
          GitLab はエディションに応じてセルフマネージドを選びやすく、<strong>Community Edition（CE）</strong>は無料でオンプレに置ける、という説明がインフラ系記事（例:
          Spacelift）でよく対比されます。GitHub のオンプレは <strong>GitHub Enterprise Server（GHES）</strong>のような商用プランが前提で、GitLab
          CE のような「無料の完全セルフホスト」との並べ方は<strong>比較の軸として注意深く使う</strong>必要があります。
        </p>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">CI/CD の柔軟性</h4>
        <p className="text-gray-600 dark:text-gray-300">
          GitLab CI/CD の <code>include</code>、パイプラインテンプレート、親子パイプライン、<strong>merge trains</strong>{' '}
          などは、複雑なパイプラインをコードで再利用・分割しやすい、と解説されることがあります（例: DevOps Daily）。GitHub Actions
          でも再利用ワークフローや concurrency 等で表現できますが、「パイプライン言語としての一体感」を重視する組織では GitLab の説明に傾きやすいです。
        </p>
      </section>

      <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-slate-200">
        <h3 className="mt-0 text-lg font-semibold text-slate-900 dark:text-slate-100">聞かれたときの答え方テンプレート</h3>
        <p className="mt-2 mb-3">
          「目的による」だけで終わらせず、<strong>相手の制約に合わせて判断軸を返す</strong>と会話が前に進みます。まずハブ型かワンプラットフォーム型かを一文で置き、そのうえで次のような分岐を示します。
        </p>
        <p className="mb-2 font-medium text-slate-900 dark:text-slate-100">GitHub 寄りになりやすいケース</p>
        <ul className="mt-0 mb-4 list-disc space-y-1 pl-5">
          <li>OSS コミュニティや外部コントリビューターとの連携が生命線になっている</li>
          <li>AI 支援開発（Copilot エコシステム）を最大限活かしたい</li>
          <li>すでに Microsoft 系（Azure・Entra ID 等）と一体化した ID・請求・開発体験を重視する</li>
          <li>採用・パートナー連携で「GitHub アカウントがあるか」が有利に働く</li>
        </ul>
        <p className="mb-2 font-medium text-slate-900 dark:text-slate-100">GitLab 寄りになりやすいケース</p>
        <ul className="mt-0 mb-0 list-disc space-y-1 pl-5">
          <li>セキュリティスキャン込みの DevSecOps を、できるだけ一つの UI / ライフサイクルで完結させたい</li>
          <li>セルフホストやエアギャップが必須（金融・防衛・閉域など）</li>
          <li>パイプラインが複雑で、include・親子・merge trains などの統合モデルに魅力を感じる</li>
          <li>ベンダー数とツール間連携の運用コストを削りたい</li>
        </ul>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">ざっくり対応（覚え方用）</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">観点</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">GitHub</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">GitLab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">パイプライン定義</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Actions ワークフロー（YAML）</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300"><code>.gitlab-ci.yml</code> など</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">マージリクエスト</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Pull Request</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Merge Request</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">多拠点ガバナンス</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise / Org ポリシー</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">グループ・プロジェクト階層、コンプライアンス設定</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">セルフホスト製品名</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">GitHub Enterprise Server</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">GitLab Self-Managed / CE 等</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

/** copilot-metrics-viewer のセットアップ（公式 OSS ダッシュボード） */
export function GitHubTipsCopilotMetricsViewerGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">copilot-metrics-viewer のセットアップ</h2>
      <p className="text-gray-600 dark:text-gray-300">
        GitHub が公開している <strong>copilot-metrics-viewer</strong> は、Copilot Usage Metrics API
        由来のデータを可視化するための参考実装です。本プラットフォームの{' '}
        <Link
          href="/programming/github/chapters/github-enterprise-copilot-metrics"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Copilot — Metrics（Usage Metrics API の整理）
        </Link>
        とあわせて読むと、API とダッシュボードの対応が把握しやすくなります。
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">アーキテクチャ（3 コンポーネント）</h3>
        <p className="text-gray-600 dark:text-gray-300">
          アプリケーションは次の 3 つで構成されています。
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <strong>Nuxt 3 ダッシュボード</strong>（Web アプリ。ポート 3000 / 80）
          </li>
          <li>
            <strong>PostgreSQL</strong>（メトリクス履歴の保存用データベース）
          </li>
          <li>
            <strong>Sync Service</strong>（GitHub API から PostgreSQL にメトリクスを取り込むスケジュールジョブ。デフォルトで UTC 2
            時に毎日実行）
          </li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          Docker コンテナで動くため、AWS / GCP / Azure / Kubernetes など、コンテナを載せられる環境ならホスティング先を選べます。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">認証方式は 2 つ</h3>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">方式 1：Personal Access Token（PAT）</h4>
        <p className="text-gray-600 dark:text-gray-300">
          バックエンドに PAT を保存して API を呼ぶシンプルな方式です。<strong>Enterprise レベルのメトリクスも取得可能</strong>
          です。エンドユーザー向けのログイン UI はありません（viewer 側でユーザー認証は行いません）。
        </p>
        <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          方式 2：GitHub App 登録 + OAuth 認証
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          ユーザーを認証し、メトリクス閲覧権限を検証できるため推奨される運用になりがちですが、<strong>Organization レベルのみ</strong>
          対応で、<strong>Enterprise には非対応</strong>です。Enterprise レベルで OAuth 的なユーザーフローを載せる場合は、GitHub の OAuth
          Apps 側の設計が必要になります。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">デプロイ方法</h3>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">最も簡単：Azure ワンクリックデプロイ</h4>
        <p className="text-gray-600 dark:text-gray-300">
          「Deploy to Azure」ボタンから、おおよそ次のリソースが自動作成されます。Azure Container App（消費プラン）、Container App
          Job（Sync Service）、PostgreSQL Flexible Server（Burstable B1ms）、Log Analytics Workspace。
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          公開情報では月額おおよそ 15 USD 程度とされることがありますが、リージョン・為替・利用量により変動します。
        </p>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>PAT を使う場合は、そのまま「Deploy to Azure」を実行</li>
          <li>GitHub App 認証を使う場合は、先に GitHub App を登録してから「Deploy to Azure」</li>
          <li>
            GitHub App 方式の場合、デプロイ後にリダイレクト URI をコンテナアプリの URL に更新します（例:{' '}
            <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800">
              https://&lt;container-app-name&gt;.azurecontainerapps.io/auth/github
            </code>
            ）
          </li>
        </ol>

        <h4 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
          より制御が必要な場合：azd（Azure Developer CLI）
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          Azure Bicep を使った Infrastructure as Code で、ソースからローカルでコンテナをビルドしてデプロイします。公開情報では月額おおよそ
          25 USD 程度とされる構成もあります（変動に注意）。<code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800">azd up</code>{' '}
          を実行し、プロンプトに従います。
        </p>

        <h4 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-200">Docker で直接起動（Azure 以外）</h4>
        <p className="text-gray-600 dark:text-gray-300">
          イメージは{' '}
          <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800">
            ghcr.io/github-copilot-resources/copilot-metrics-viewer:latest
          </code>{' '}
          で公開されています。<code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800">docker pull</code> 後、環境変数を設定すれば起動できます。PostgreSQL
          は別途用意が必要です。
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">主な環境変数</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">変数名</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">説明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">NUXT_GITHUB_TOKEN</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">PAT</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">NUXT_GITHUB_ORG</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Organization 名（Org レベルの場合）</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">NUXT_GITHUB_ENT</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">Enterprise スラッグ（Enterprise レベルの場合）</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">DATABASE_URL</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">PostgreSQL 接続文字列</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">USE_LEGACY_API</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">true</code> で旧 API を使用。旧 Copilot Metrics API は{' '}
                  <strong>2026 年 4 月 2 日に廃止済み</strong>のため、<code className="rounded bg-gray-100 px-1 dark:bg-gray-800">false</code>{' '}
                  相当（新 API）を推奨します。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ダッシュボードで見えるもの</h3>
        <p className="text-gray-600 dark:text-gray-300">
          受け入れ率（Acceptance Rate）、総提案数、総受け入れ数、提案行数、受け入れ行数などが可視化されます。日付範囲フィルタ（最大 100
          日）、チーム間比較、GitHub.com の機能別統計（Chat、PR サマリー等）、モデル使用分析、CSV エクスポートにも対応しています。
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Enterprise 環境での注意点</h3>
        <p className="text-gray-600 dark:text-gray-300">
          プライベートネットワークにデプロイする場合は、Azure Container Apps Environment にサブネット（最低 /23）を指定し、デプロイ後にプライベート
          DNS ゾーンを別途構成する必要がある、という説明が公式リソース側にあります。既に Azure を利用している場合は、試しやすさの観点から
          <strong>ワンクリックデプロイ + PAT</strong> が手軽です。
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Enterprise レベルのメトリクスが必要なら PAT 方式</strong>が現実的で、{' '}
          <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800">NUXT_GITHUB_ENT</code> に Enterprise スラッグを設定します。
        </p>
      </section>
    </article>
  );
}
