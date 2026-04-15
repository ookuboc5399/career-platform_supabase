'use client';

export default function GitHubEnterpriseBestPracticesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-gray-600 mb-10 text-lg">
        GitHub Enterprise / Organization を安全かつ運用しやすく保つための実践的なルール集です。組織の土台・セキュリティ・リポジトリ運用の3層で整理しています。
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span aria-hidden>🏢</span> 1. Organization（組織）管理のベストプラクティス
        </h2>
        <p className="text-gray-600 mb-6">
          組織全体のインフラとなるベース部分のルールです。ここが崩れると、後々の管理コストが爆発的に増加します。
        </p>

        <div className="space-y-8 not-prose">
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              権限付与は「人」ではなく「チーム」で行う
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              リポジトリへのアクセス権限をユーザー個人に直接付与してはいけません。必ず「Frontend」「Backend」「Security」といった
              <strong> Team（チーム）</strong>を作成し、チームに対して権限を割り当てます。新入社員や退職者が出た際、チームのメンバーを入れ替えるだけで全リポジトリの権限が自動調整されるため、権限の外し忘れ（ゴーストアカウント化）を防ぎやすくなります。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Owner（管理者）は「2〜5名」に限定する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Organization のすべてを破壊・変更できる特権管理者（Owner）は、最小限に絞る必要があります。1 人だけだと退職時や休暇時にボトルネック（単一障害点）となり、多すぎるとセキュリティリスクが高まります。公式では、組織の規模に関わらず
              <strong> 最大でも 5 名程度</strong>に留めることが強く推奨されています。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              エンタープライズ認証（SAML SSO）との連携
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              企業で利用する場合、個人の GitHub アカウント（プライベートなパスワード）だけで会社のコードにアクセスさせるのは危険です。必ず会社の IdP（
              <strong>Microsoft Entra ID</strong> や <strong>Okta</strong> など）と連携し、社員が会社のアカウントからログアウト（または退職）した瞬間に、GitHub へのアクセスも遮断される仕組みを作ります。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2要素認証（2FA）の強制</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Organization の設定で、参加する全メンバーに対して「2要素認証の有効化」を必須（Require）にします。これを設定しないと、パスワードリスト攻撃などでソースコードが流出するリスクが高まります。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span aria-hidden>🛡️</span> 2. セキュリティのベストプラクティス
        </h2>
        <p className="text-gray-600 mb-6">
          開発のスピードを落とさずに、システム的に防御線を張るためのルールです。
        </p>

        <div className="space-y-8 not-prose">
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              「最小権限の原則（Least Privilege）」を徹底する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              すべてのメンバー、すべてのシステム連携において、「作業を完了するために必要な最低限の権限だけ」を与えます。デフォルトの権限（Base permissions）は
              <strong> None（アクセス不可）</strong>または<strong> Read（読み取り専用）</strong>に設定し、コードの Push が必要な開発チームにのみ
              <strong> Write</strong> を付与します。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              デフォルトブランチを「Rulesets」で保護する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              本番環境に直結するブランチ（<code className="bg-gray-100 px-1 rounded text-xs">main</code> や{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">master</code>
              ）への直接 Push は例外なく禁止します。必ず <strong>Repository Rulesets</strong> を設定し、
              <strong>Pull Request の作成</strong>、<strong>最低 1 人以上のレビュー承認</strong>、
              <strong>CI（自動テスト）の成功</strong> の 3 つが揃わない限りマージできないようにシステムでロックをかけます。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              GitHub Actions のトークン権限を「Read-only」に絞る
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              CI/CD パイプライン用の自動発行トークン（<code className="bg-gray-100 px-1 rounded text-xs">GITHUB_TOKEN</code>
              ）は、初期設定ではリポジトリへの書き込み権限を持っていることがあります。Organization の Actions 設定で、
              <strong>読み取り専用（Read repository contents permission）</strong>に制限し、悪意あるワークフローによるコード改ざんリスクを下げます。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              シークレットスキャンの「Push 保護」を全体適用する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              開発者が誤って AWS キーなどをコミットしてしまった際、GitHub のサーバーに届く前にローカル段階で弾き返す{' '}
              <strong>Push protection</strong> を Organization 全体で有効化します。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span aria-hidden>💻</span> 3. リポジトリ運用のベストプラクティス
        </h2>
        <p className="text-gray-600 mb-6">
          開発者が迷わず、高い品質を保ちながらコラボレーションするためのルールです。
        </p>

        <div className="space-y-8 not-prose">
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              必須のメタファイルを配置する（README / CONTRIBUTING / CODEOWNERS）
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              健全なリポジトリには、次の 3 つがルート（または <code className="bg-gray-100 px-1 rounded text-xs">.github</code>
              ）に置かれることを推奨します。
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>
                <strong>README.md</strong> — プロジェクトの目的、環境構築手順、起動方法
              </li>
              <li>
                <strong>CONTRIBUTING.md</strong> — ブランチの切り方やコミットメッセージのルールなど参加規約
              </li>
              <li>
                <strong>CODEOWNERS</strong> — ディレクトリ別にレビュアー（チーム）を自動アサインする責任者定義
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Issue と Pull Request の「テンプレート」を用意する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              バグ報告や新機能の Pull Request がタイトルだけで作成されるのを防ぐため、
              <code className="bg-gray-100 px-1 rounded text-xs">.github/ISSUE_TEMPLATE</code> などに Markdown テンプレートを配置します。「再現手順」「期待される動作」「テスト項目」などを穴埋め形式にすると、コミュニケーションコストを下げられます。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              不要なリポジトリは「削除」ではなく「アーカイブ」する
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              プロジェクト終了時に Delete すると、Issue の議論やコード履歴が失われます。必ず <strong>Archive（アーカイブ）</strong>{' '}
              を使い、読み取り専用のままナレッジとして残します。
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">意味のある細かいコミットを心がける</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              「1 日の終わりの作業分」のように巨大な単位でコミットせず、「1 つの論理的な変更（例：ログインボタンの追加、特定バグの修正）」ごとに分割します。問題発生時の切り分け（
              <code className="bg-gray-100 px-1 rounded text-xs">git bisect</code> 等）やレビューがしやすくなります。
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
