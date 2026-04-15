'use client';

import Link from 'next/link';

const POLICY_CHAPTER_COPY: Record<string, { heading: string; body: string }> = {
  'github-enterprise-sec-policies-repository': {
    heading: 'Policies — Repository',
    body: 'Enterprise スコープで、リポジトリの作成可否・既定可視性・フォーク方針・外部コラボレーター扱いなどを横断的に揃え、組織ごとのブレとセキュリティリスクを抑えます。',
  },
  'github-enterprise-sec-policies-repository-repository': {
    heading: 'Policies — Repository — Repository',
    body: 'リポジトリの作成・削除・可視性の既定、フォーク許可、ベース権限との関係など、Enterprise レベルで揃えるリポジトリ方針の要点を整理します。',
  },
  'github-enterprise-sec-policies-repository-code': {
    heading: 'Policies — Repository — Code',
    body: 'デフォルトブランチ、マージ方式、リポジトリアーカイブ、コミット署名の推奨など、コード運用に直結するポリシーを Enterprise 観点で学びます。',
  },
  'github-enterprise-sec-policies-repository-code-insights': {
    heading: 'Policies — Repository — Code insights',
    body: 'ルールセットの適用状況や拒否イベントの傾向を把握し、例外運用とルール改善のサイクルを Enterprise で回す考え方を学びます。',
  },
  'github-enterprise-sec-policies-repository-code-ruleset-bypasses': {
    heading: 'Policies — Repository — Code ruleset bypasses',
    body: 'バイパス申請の承認者・証跡・期限と、緊急時のみに限定する運用を Enterprise ポリシーとして定義します。',
  },
  'github-enterprise-sec-policies-repository-custom-properties': {
    heading: 'Policies — Repository — Custom properties',
    body: 'リポジトリに付与するメタデータのスキーマ設計、自動化（ルール・API）との連携、誤設定時の影響範囲を Enterprise で管理します。',
  },
  'github-enterprise-sec-policies-copilot': {
    heading: 'Policies — Copilot',
    body: 'ライセンス割当、機能のオン/オフ、データ取り扱いやモデル利用に関する Enterprise の Copilot ポリシーを整理します。',
  },
  'github-enterprise-sec-policies-hosted-compute-networking': {
    heading: 'Policies — Hosted compute networking',
    body: 'ホスト型ランナーや larger runners とネットワーク境界（許可 IP・プライベート networking 等）のポリシーを、監査要件とあわせて整理します。',
  },
  'github-enterprise-sec-policies-code-quality': {
    heading: 'Policies — Code Quality',
    body: 'ブランチ保護、必須レビュー、ステータスチェック、merge queue など、コード品質とリリース品質を支えるポリシー群を Enterprise 方針として捉えます。',
  },
  'github-enterprise-sec-policies-sponsors': {
    heading: 'Policies — Sponsors',
    body: 'スポンサー機能の利用可否、公開情報とコンプライアンス（職務・利益相反）の観点から、Enterprise での扱いを整理します。',
  },
};

const GH_DOCS_JA = 'https://docs.github.com/ja/enterprise-cloud@latest';

/** Enterprise Policies › Member privileges */
function PoliciesMemberPrivilegesArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — メンバー権限</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise 全体でメンバーに許す操作の下限・上限をまとめて制御する <strong>メンバー権限（Member privileges）</strong>
        の各項目の意味です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">メンバー権限</h3>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">未所属ユーザー（Unaffiliated users）</h3>
          <p className="mt-2 mb-0">
            メンバーがすべての Organization から外されると、Enterprise 上では「未所属ユーザー」と扱われます。Enterprise
            にユーザーを残すか、完全に削除するかを選びます。{' '}
            <a
              href={`${GH_DOCS_JA}/admin/user-management/managing-users-in-your-enterprise`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              未所属ユーザーについて（公式ドキュメント）
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">ベース権限（Base permissions）</h3>
          <p className="mt-2 mb-0">
            Organization のリポジトリに対するベース権限は、すべてのメンバーに適用され、外部コラボレーターには適用されません。メンバーは複数の経路で権限を持てるため、ベース権限より高い権限が付与されているメンバー・コラボレーターは、その高い権限が維持されます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">リポジトリの作成（Repository creation）</h3>
          <p className="mt-2 mb-0">
            有効にするとメンバーはリポジトリを作成できます。外部コラボレーターがリポジトリを作成することはありません。
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>ポリシーなし（No policy）</strong> — Organization のオーナーが、メンバーのリポジトリ作成を許すかどうかを選べます。
            </li>
            <li>
              <strong>無効（Disabled）</strong> — メンバーはリポジトリを作成できません。
            </li>
            <li>
              <strong>メンバーがリポジトリを作成可能（Members can create repositories）</strong> —
              指定した種類のリポジトリだけメンバーが作成できます。
              <ul className="mt-2 list-disc pl-5">
                <li>パブリック（Public）</li>
                <li>プライベート（Private）</li>
                <li>インターナル（Internal）</li>
              </ul>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">リポジトリのフォーク（Repository forking）</h3>
          <p className="mt-2 mb-0">
            有効にすると、この Enterprise に属するすべてのプライベートおよびインターナルリポジトリでフォークが許可されます。無効にすると、それらのリポジトリではフォークが禁止されます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">外部コラボレーター（Outside collaborators）</h3>
          <p className="mt-2 mb-0">
            誰がリポジトリへ外部コラボレーターを招待できるかを制限します。{' '}
            <a
              href="https://docs.github.com/ja/organizations/managing-outside-collaborators"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              外部コラボレーターについて（公式ドキュメント）
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">デフォルトブランチ名（Default branch name）</h3>
          <p className="mt-2 mb-0">
            この Enterprise に属する新規リポジトリのデフォルトブランチ名を指定します。ワークフローや既存連携の都合で
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">master</code> など別名にしたい場合に変更します。個別リポジトリでは後からいつでも変更できます。{' '}
            <a
              href="https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              デフォルトブランチについて（公式ドキュメント）
            </a>
          </p>
          <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">Enterprise 全体に強制（Enforce across this enterprise）</p>
          <p className="mt-1 mb-0">
            このデフォルトブランチ名を、Enterprise 内のすべての Organization に強制するかどうかを選びます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">デプロイキー（Deploy keys）</h3>
          <p className="mt-2 mb-0">
            デプロイキーは SSH キーで、単一リポジトリへの読み取り専用または書き込みアクセスを付与します。権限を細かく分けたい場合は GitHub App の利用を検討してください（
            <a href="https://docs.github.com/ja/apps" target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub Apps のドキュメント
            </a>
            ）。デプロイキーはパスフレーズで保護されないため、サーバーが侵害されるとリスクになります。詳しくは{' '}
            <a
              href="https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/managing-deploy-keys"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              デプロイキーの管理
            </a>
            を参照してください。
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>ポリシーなし（No policy）</strong> — 各 Organization がデプロイキーポリシーを自前で設定します。新規
              Organization は既定で無効です。
            </li>
            <li>
              <strong>無効（Disabled）</strong> — Enterprise が所有するリポジトリではデプロイキーの作成・利用ができません。パブリックリポジトリのクローンには影響しません。
            </li>
            <li>
              <strong>有効（Enabled）</strong> — Enterprise 内でデプロイキーの作成・利用が許可されます。
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            リポジトリ管理者向け権限（Admin repository permissions）
          </h3>

          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">可視性の変更（Repository visibility change）</h4>
          <p className="mt-1 mb-0">
            有効にすると、リポジトリの管理者権限を持つメンバーが可視性を変更できます。無効にすると、Organization のオーナーのみが可視性を変更できます。
          </p>

          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
            削除と譲渡（Repository deletion and transfer）
          </h4>
          <p className="mt-1 mb-0">
            有効にすると、管理者権限を持つメンバーがパブリック・プライベートリポジトリの削除や譲渡ができます。無効にすると、オーナーのみが削除・譲渡できます。
          </p>

          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Issue の削除（Repository issue deletion）</h4>
          <p className="mt-1 mb-0">
            有効にすると、管理者権限を持つメンバーが Issue を削除できます。無効にすると、オーナーのみが Issue を削除できます。
          </p>
        </div>
      </section>
    </article>
  );
}

/** Enterprise Policies › Codespaces */
function PoliciesCodespacesArticle() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — Codespaces</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise 内のどの Organization が <strong>GitHub Codespaces</strong> を使えるかをまとめて制御する設定の意味です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">GitHub Codespaces</h3>
          <p className="mt-2 mb-0 font-medium text-slate-900 dark:text-slate-100">
            Organization ごとの Codespaces 利用の割り当て
          </p>
          <p className="mt-2 mb-0">
            Enterprise 内のどの Organization に GitHub Codespaces を許可するかを指定します。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">すべての Organization で有効</h3>
          <p className="mt-2 mb-0">
            将来作成される Organization を含め、すべての Organization が GitHub Codespaces を利用できます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">特定の Organization のみ有効</h3>
          <p className="mt-2 mb-0">
            ここで選んだ Organization と、パブリックリポジトリだけが GitHub Codespaces を利用できます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">無効（Disabled）</h3>
          <p className="mt-2 mb-0">
            この Enterprise では、パブリックリポジトリに限り GitHub Codespaces が利用可能な状態になります。
          </p>
        </div>
      </section>
    </article>
  );
}

/** Enterprise Policies › Actions */
function PoliciesActionsArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — Actions</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise スコープで <strong>GitHub Actions</strong> の利用可否・許可するアクション・ランナー・キャッシュ等をどう揃えるかの要点です。
      </p>

      <section className="not-prose mt-8 space-y-10 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Actions 設定の構成</h3>
          <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400">
            Enterprise の設定画面では、大まかに次の領域に分かれます。ポリシー（Policies）、ランナー（Runners）、ランナーグループ（Runner
            groups）、カスタムイメージ（Custom images）、OIDC の設定（OIDC Configuration）です。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">ポリシー（Policies）</h3>
          <p className="mt-2 mb-0">
            Actions を「すべての Organization で有効」「特定の Organization のみ」などに分けられます。無効にすると GitHub
            Actions 自体が実行できません。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            すべてのアクションと再利用可能ワークフローを許可
          </h4>
          <p className="mt-1 mb-0">
            誰が作成したか・どこで定義されているかに関わらず、任意のアクションおよび再利用可能ワークフローが使えます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Enterprise 内のアクションと再利用可能ワークフローのみ許可
          </h4>
          <p className="mt-1 mb-0">
            Enterprise 内のリポジトリで定義されたアクションおよび再利用可能ワークフローだけが使えます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Enterprise 内に加え、条件に合う外部アクションも許可
          </h4>
          <p className="mt-1 mb-0">
            指定した条件に合うアクション・再利用可能ワークフローに加え、Enterprise 内リポジトリで定義されたものも使えます。{' '}
            <a
              href={`${GH_DOCS_JA}/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-github-actions-policies-for-your-enterprise#allowing-specific-actions-and-reusable-workflows-to-run`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              特定のアクションのみ許可する方法（公式）
            </a>
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            アクションを完全なコミット SHA に固定することを必須にする
          </h4>
          <p className="mt-1 mb-0 text-slate-600 dark:text-slate-400">
            参照するアクションのバージョンを、フル長のコミット SHA にピン留めすることを求めるポリシーです（タグやブランチ参照の緩和を防ぐ目的）。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">ランナー（Runners）</h3>
          <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">リポジトリ単位のセルフホストランナー</h4>
          <p className="mt-1 mb-0">
            どの Organization が、リポジトリレベルでセルフホストランナーを自前管理できるかを選びます。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">すべての Organization で無効</h4>
          <p className="mt-1 mb-0">
            Enterprise 内のすべての Organization で、リポジトリレベルのランナーが使えなくなります。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">カスタムイメージ（Custom images）</h3>
          <p className="mt-2 mb-0">
            ランナーに割り当てるカスタムイメージの作成を、どの Organization に許可するかを選びます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">すべての Organization で有効</h4>
          <p className="mt-1 mb-0">
            将来作られる Organization を含め、すべてがカスタムイメージの利用・作成ができます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">特定の Organization のみ有効</h4>
          <p className="mt-1 mb-0">ここで選んだ Organization だけが、カスタムイメージの利用・作成ができます。</p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">すべての Organization で無効</h4>
          <p className="mt-1 mb-0">どの Organization もカスタムイメージを利用・作成できません。</p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">カスタムイメージの保持（retention）</h4>
          <p className="mt-1 mb-0">この Enterprise におけるイメージ保持の既定値を決めます。</p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">イメージあたりの最大バージョン数</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: バージョン数</p>
          <p className="mt-1 mb-0">
            各イメージについて保存するバージョン数の上限です。超えた場合、最も古く未使用のバージョンから削除されます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">未使用バージョンの保持期間</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: 日</p>
          <p className="mt-1 mb-0">
            未使用のイメージバージョンを何日間残すかです。ポリシーが効くと、指定日数より長く使われていないバージョンは削除されます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">バージョンの最大経過日数</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: 日</p>
          <p className="mt-1 mb-0">
            イメージバージョンの「寿命」の上限です。経過後は無効化され、ランナーからは使えなくなります。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">成果物とログの保持（Artifact and log retention）</h3>
          <p className="mt-2 mb-0">
            Organization ごとの成果物・ログの既定の保持期間の上限を Enterprise で決めます。各 Organization はこれより短くは設定できますが、長くはできません。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">成果物とログの最大保持日数</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: 日</p>
          <p className="mt-1 mb-0">
            成果物とログを最大何日保持できるかの上限です。{' '}
            <a
              href={`${GH_DOCS_JA}/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-artifacts-and-logs-in-your-enterprise`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              公式の保持ポリシー解説
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">キャッシュ（Cache）</h3>
          <p className="mt-2 mb-0">
            キャッシュに関する上限を Enterprise で定めます。リポジトリや Organization は独自の上限を持てますが、ここで決めた最大値を超えられません。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">キャッシュの保持期間</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: 日</p>
          <p className="mt-1 mb-0">最大 365 日まで設定できます。</p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">キャッシュサイズによる追い出しのしきい値</h4>
          <p className="mt-1 mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">単位: GB</p>
          <p className="mt-1 mb-0">
            この上限を超えると、最も最近使われていないキャッシュから追い出し（eviction）が起きます。コスト管理には向かず、あくまで容量制御用です。合計キャッシュは最大
            10000 GB まで設定可能です。{' '}
            <a
              href="https://docs.github.com/ja/actions/using-workflows/caching-dependencies-to-speed-up-workflows"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              キャッシュの詳細（公式）
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            フォーク由来の PR でワークフローを走らせる際の承認
          </h3>
          <p className="mt-2 mb-0">
            どのユーザー層に対して、PR 上でワークフローを実行する前の承認を必須にするかを選びます。PR の作者と、イベントを起こしたアクターの両方が判定対象になります。承認が必要な場合、リポジトリへの書き込み権限を持つユーザーが PR
            のワークフロー実行を承認する必要があります。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            GitHub でも初めての貢献者に限り承認を求める
          </h4>
          <p className="mt-1 mb-0">
            GitHub 上でも新しく、かつこのリポジトリに一度もコミットやマージ済み PR がないユーザーだけが、実行前に承認を要します。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">このリポジトリでは初めての貢献者に承認を求める</h4>
          <p className="mt-1 mb-0">
            このリポジトリに一度もコミットやマージ済み PR がないユーザーだけが、実行前に承認を要します。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">すべての外部コラボレーターに承認を求める</h4>
          <p className="mt-1 mb-0">
            リポジトリのメンバー・オーナーでも Organization のメンバーでもないユーザーは、すべて実行前に承認を要します。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            プライベート／インターナルリポジトリでのフォーク PR ワークフロー
          </h3>
          <p className="mt-2 mb-0">
            プライベートおよびインターナルリポジトリ向けの設定です。ここで有効にした項目だけ、Organization／リポジトリの管理者がさらに変更できます。
          </p>
          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">フォーク由来の PR でワークフローを実行する</h4>
          <p className="mt-1 mb-0">
            フォークから開かれた PR に対してもワークフローを実行します。有効にすると、フォーク側のメンテナが元リポジトリに対する読み取り権限を持つトークンを使える点に注意が必要です。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">ワークフロー権限（Workflow permissions）</h3>
          <p className="mt-2 mb-0">
            この Enterprise でワークフロー実行時に <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">GITHUB_TOKEN</code>{' '}
            に与える既定の権限を選びます。YAML ではより細かい権限も指定できます。{' '}
            <a
              href={`${GH_DOCS_JA}/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#enforcing-a-policy-for-workflow-permissions-in-your-enterprise`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              権限の管理（公式）
            </a>
          </p>
          <p className="mt-3 mb-0">
            Organization／リポジトリの管理者が変えられるのは、既定より厳しい方向だけです（緩めることはできません）。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">読み取りと書き込み</h4>
          <p className="mt-1 mb-0">すべてのスコープについて、リポジトリに対する読み取りと書き込みが可能です。</p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            コンテンツとパッケージの読み取りのみ
          </h4>
          <p className="mt-1 mb-0">
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">contents</code> と{' '}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">packages</code> スコープに限り、読み取りだけが可能です。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
            PR の作成や承認レビューの可否
          </h4>
          <p className="mt-1 mb-0">
            GitHub Actions がプルリクエストを作成したり、承認レビューを付けられるかどうかを選びます。オプション例として「Actions
            による PR 作成と承認を許可」があります。
          </p>
        </div>
      </section>
    </article>
  );
}

/** Enterprise Policies › Projects */
function PoliciesProjectsArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — Projects</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise 全体に適用される <strong>GitHub Projects</strong> 関連ポリシーの意味です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Projects のポリシー</h3>
          <p className="mt-2 mb-0">
            GitHub の Projects は、作業の整理や優先順位付けに使えます。特定機能の開発用、全体のロードマップ、リリース前のチェックリストなど、目的に応じたプロジェクトを作成できます。ここで設定するポリシーは、特に書かれていない限り、この
            Enterprise に属するすべての Organization と、すべてのプロジェクトに適用されます。
          </p>
          <p className="mt-3 mb-0">
            <a
              href="https://docs.github.com/ja/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Projects の概要（公式ドキュメント）
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Organization のプロジェクト</h3>
          <p className="mt-2 mb-0">
            有効にすると、この Enterprise に含まれるすべての Organization で、メンバーが Organization レベルのプロジェクトを作成できます。メンバーは、その
            Organization が所有するリポジトリ由来の Issue を取り込み、整理・追跡するプロジェクトを作成できます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            プロジェクトの可視性を変える権限（Project visibility change permission）
          </h3>
          <p className="mt-2 mb-0">
            有効にすると、この Enterprise 内のすべての Organization で、プロジェクトに対する管理者権限を持つメンバーが、そのプロジェクトをパブリックまたはプライベートに変更できます。無効にすると、可視性を変更できるのは
            Organization のオーナーのみです。プロジェクトは作成時点では既定でプライベートになります。
          </p>
        </div>
      </section>
    </article>
  );
}

/** Enterprise Policies › Advanced Security（GHAS） */
function PoliciesAdvancedSecurityArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — Advanced Security</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise で <strong>GitHub Advanced Security（GHAS）</strong> まわりをどう許可・統制するかの要点です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Advanced Security と設定の構成</h3>
          <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400">
            Enterprise の画面では、大まかに <strong>Policies（ポリシー）</strong>、<strong>Security features（セキュリティ機能）</strong>、
            <strong>General（一般）</strong>、<strong>Availability（利用可否）</strong> などの領域に分かれます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">利用可否（Availability）</h3>
          <p className="mt-2 mb-0">
            どの Advanced Security のプランを、Organization が利用できるようにするかを選びます。ここでアクセス権を変更しても、各リポジトリで
            Advanced Security の機能が自動的にオン/オフになるわけではありません。実際の有効化は{' '}
            <strong>Configurations（構成）</strong> から Advanced Security を有効にして行います。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            リポジトリ管理者による GitHub Advanced Security の有効化・無効化
          </h3>
          <p className="mt-2 mb-0">
            このポリシーを許可すると、リポジトリ管理者が Organization が所有するリポジトリに対して、GitHub Advanced Security を有効または無効にできるようになります。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">シークレット保護（Secret Protection）</h3>
          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
            リポジトリ管理者による Secret Protection の有効化・無効化
          </h4>
          <p className="mt-1 mb-0">
            このポリシーを許可すると、リポジトリ管理者が Organization が所有するリポジトリで、シークレットスキャン（secret scanning）、プッシュ保護（push
            protection）、および有効性チェック（validity checks）を有効または無効にできるようになります。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            シークレットスキャンにおける AI 検出（AI detection in secret scanning）
          </h4>
          <p className="mt-1 mb-0">
            このポリシーを許可すると、リポジトリ管理者が Organization が所有するリポジトリで、追加パターンを見つけるための AI
            検出を有効または無効に選べるようになります。
          </p>
          <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400">
            注意: このポリシーを変更しただけでは、AI 検出の有効/無効は切り替わりません。許可したうえで、リポジトリ管理者がリポジトリ側で選べるようにするための Enterprise 側の枠組みです。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">コードセキュリティ（Code Security）</h3>
          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Copilot Autofix</h4>
          <p className="mt-1 mb-0">
            このポリシーを許可すると、Organization 管理者およびリポジトリ管理者が、CodeQL によるコードスキャンで検出されたアラートに対する Copilot
            Autofix（AI が生成する修正案の提案）を、有効または無効に選べるようになります。{' '}
            <a
              href="https://docs.github.com/ja/code-security/code-scanning/managing-code-scanning-alerts/responsible-use-of-github-copilot-autofix-for-code-scanning"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Autofix の制限・責任ある利用について（公式）
            </a>
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            リポジトリ管理者による Dependabot アラートの有効化・無効化
          </h4>
          <p className="mt-1 mb-0">
            許可すると、リポジトリ管理者が Dependabot アラートを有効または無効にできます。許可しない場合、リポジトリ管理者は Dependabot
            アラートのオン/オフを変更できません。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">Dependency Insights</h4>
          <p className="mt-1 mb-0">
            Dependency Insights は、リポジトリが依存するパッケージを一覧で確認できる場所です。セキュリティアドバイザリやライセンスに関する集約情報も扱えます。
          </p>
        </div>

        <p className="mb-0">
          <a
            href={`${GH_DOCS_JA}/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-advanced-security-in-your-enterprise`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Enterprise での Advanced Security ポリシー（公式）
          </a>
        </p>
      </section>
    </article>
  );
}

/** Enterprise Policies › Personal access tokens */
function PoliciesPersonalAccessTokensArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — パーソナルアクセストークン</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise での <strong>パーソナルアクセストークン（PAT）</strong> に関する統制の意味です。画面は主に{' '}
        <strong>Fine-grained tokens</strong> と <strong>Tokens (classic)</strong> に分かれます。以下は fine-grained
        中心の説明です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Fine-grained PAT による Organization リソースへのアクセス
          </h3>
          <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400">
            既定では、Organization は fine-grained PAT を使ったリソースへのアクセスを有効にできます。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Organization に要件の設定を任せる
          </h4>
          <p className="mt-1 mb-0">
            Organization の管理者が、fine-grained PAT によるアクセスを制限するか許可するかを設定できるようにします。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Fine-grained PAT によるアクセスを禁止する
          </h4>
          <p className="mt-1 mb-0">
            メンバーが fine-grained PAT 経由で Organization のリソースにアクセスできないようにします。Organization
            の管理者はこの制限を解除できません。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Fine-grained PAT によるアクセスを許可する
          </h4>
          <p className="mt-1 mb-0">
            メンバーが fine-grained PAT 経由で Organization のリソースにアクセスできるようにします。Organization
            の管理者はこの設定を上書きできません。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Fine-grained PAT の承認（Require approval）
          </h3>
          <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400">
            既定では、その Organization にアクセスする各パーソナルアクセストークンについて、Organization の管理者による承認が必要になることがあります。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Organization に承認要件の設定を任せる
          </h4>
          <p className="mt-1 mb-0">
            Organization の管理者が、fine-grained PAT に対する承認プロセスを有効または無効にできるようにします。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            すべての Organization で承認フローを必須にする
          </h4>
          <p className="mt-1 mb-0">
            Enterprise 内のいずれかの Organization にアクセスする fine-grained PAT について、すべてのメンバーに承認を求めます。Organization
            の管理者は承認フローを無効にできません。
          </p>

          <h4 className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
            すべての Organization で承認フローを無効にする
          </h4>
          <p className="mt-1 mb-0">
            Enterprise に含まれるすべての Organization で、承認要件を無効にします。メンバーは、理由の入力や承認なしに、対象
            Organization 向けの fine-grained PAT を作成できます。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            パーソナルアクセストークンの最大有効期限
          </h3>
          <p className="mt-2 mb-0">
            Fine-grained PAT には失効日が必要です。Organization へのアクセスを許可するトークンについて、許容する最大の寿命を選びます。
          </p>
          <p className="mt-3 mb-0 text-slate-600 dark:text-slate-400">
            選択肢の例: 7 日、30 日、60 日、90 日、366 日、またはカスタム。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">ポリシーからの免除（Exempt）</h3>
          <p className="mt-2 mb-0">
            Enterprise のオーナーは、ユーザー provisioning（SCIM）やその他の長期間動かす自動化のためにパーソナルアクセストークンを使うことがあります。まだ
            GitHub App への移行が済んでいない自動化がある場合は、該当する管理者などをこのポリシーから免除する設定を検討できます（画面で対象を指定します）。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Classic トークン（Tokens classic）</h3>
          <p className="mt-2 mb-0">
            Classic PAT に関する別のポリシー項目は、同じ Personal access token policies 画面の「Tokens (classic)」側で設定します。
          </p>
        </div>

        <p className="mb-0">
          <a
            href={`${GH_DOCS_JA}/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Enterprise での PAT ポリシー（公式）
          </a>
        </p>
      </section>
    </article>
  );
}

/** Enterprise Policies › Models */
function PoliciesModelsArticle() {
  const linkClass = 'font-medium text-blue-700 underline dark:text-blue-400';
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ポリシー — Models</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enterprise での <strong>GitHub Models</strong> および <strong>カスタムモデル</strong> に関するポリシーの意味です。
      </p>

      <section className="not-prose mt-8 space-y-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Enterprise における Models</h3>
          <p className="mt-2 mb-0">
            Enterprise で GitHub Models を有効にすると、ユーザーがコードを扱いながらモデルと対話できるようになります。この一連の
            AI 開発向け機能は、主にリポジトリ単位で利用されます。{' '}
            <a
              href="https://docs.github.com/ja/github-models/about-github-models"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Models の概要（公式）
            </a>
          </p>
          <p className="mt-3 mb-0">
            有効にした場合、ユーザーはコードを送信し、<strong>Microsoft Azure</strong> 上でホストされる第三者の AI
            モデルとやり取りできます。その利用は{' '}
            <a
              href="https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Microsoft の製品条項
            </a>
            および{' '}
            <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className={linkClass}>
              プライバシーに関する声明
            </a>
            の対象となり得ます。また Models の利用は{' '}
            <a
              href="https://docs.github.com/ja/site-policy/github-terms/github-pre-release-license-terms"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub のプレリリース条項
            </a>
            の対象です。
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">カスタムモデル（Custom models）</h3>
          <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">カスタムモデルを有効にする</h4>
          <p className="mt-1 mb-0">
            有効にすると、各 Organization が API キーを用いてカスタムモデルを構成し利用できるようになります。カスタムモデルを使う場合、提供したキーを通じて
            GitHub がデータを <strong>Azure</strong> や <strong>OpenAI</strong> などの第三者サービスと共有してよい、という扱いになります。{' '}
            <a
              href="https://docs.github.com/ja/github-models/github-models-at-scale/using-your-own-api-keys-in-github-models"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              カスタムモデル・独自 API キー（公式）
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}

function PoliciesRepositorySubchapterLinks() {
  const items: { id: string; label: string }[] = [
    { id: 'github-enterprise-sec-policies-repository-repository', label: 'Repository' },
    { id: 'github-enterprise-sec-policies-repository-code', label: 'Code' },
    { id: 'github-enterprise-sec-policies-repository-code-insights', label: 'Code insights' },
    { id: 'github-enterprise-sec-policies-repository-code-ruleset-bypasses', label: 'Code ruleset bypasses' },
    { id: 'github-enterprise-sec-policies-repository-custom-properties', label: 'Custom properties' },
  ];
  return (
    <section className="mb-8 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Repository ポリシーのサブチャプター
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

export function GitHubEnterprisePoliciesChildGuideBody({ chapterId }: { chapterId: string }) {
  if (chapterId === 'github-enterprise-sec-policies-repository') {
    const copy = POLICY_CHAPTER_COPY[chapterId];
    return (
      <article className="prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">{copy.heading}</h2>
        <p className="text-gray-600 leading-relaxed dark:text-gray-300">{copy.body}</p>
        <PoliciesRepositorySubchapterLinks />
      </article>
    );
  }

  if (chapterId === 'github-enterprise-sec-policies-member-privileges') {
    return <PoliciesMemberPrivilegesArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-codespaces') {
    return <PoliciesCodespacesArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-actions') {
    return <PoliciesActionsArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-projects') {
    return <PoliciesProjectsArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-advanced-security') {
    return <PoliciesAdvancedSecurityArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-personal-access-tokens') {
    return <PoliciesPersonalAccessTokensArticle />;
  }

  if (chapterId === 'github-enterprise-sec-policies-models') {
    return <PoliciesModelsArticle />;
  }

  const copy = POLICY_CHAPTER_COPY[chapterId];
  if (!copy) return null;
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">{copy.heading}</h2>
      <p className="text-gray-600 leading-relaxed dark:text-gray-300">{copy.body}</p>
    </article>
  );
}
