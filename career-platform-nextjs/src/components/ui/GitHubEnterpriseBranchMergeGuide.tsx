'use client';

export default function GitHubEnterpriseBranchMergeGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🌿 セキュアなブランチ運用とマージ手法 ガイドライン
      </h2>
      <p className="text-gray-600 mb-8">
        本ガイドラインは、脆弱性の混入を防ぎ、誰が・いつ・なぜ変更を加えたのか（監査ログ）をクリーンに保つための標準化ルールです。
      </p>

      {/* 1. ブランチ戦略 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          1. ブランチ戦略（GitHub Flowの採用）
        </h3>
        <p className="text-gray-600 mb-4">
          複雑なGit-Flowではなく、CI/CDやGHASと最も相性が良く、シンプルでセキュアな「GitHub Flow（機能ブランチ運用）」を標準とします。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          main ブランチ（保護された聖域）
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>常に本番環境へデプロイ可能な、完全にテストされた安全な状態を保ちます。</li>
          <li>直接のコミット（Push）は一切禁止とします。</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          Feature ブランチ（作業用ブランチ）
        </h4>
        <p className="text-gray-600 mb-2">
          開発者は必ず main から新しいブランチを切って作業します。
        </p>
        <p className="text-gray-600 mb-2">
          <strong>命名規則:</strong> 何の作業をしているか明確にするため、プレフィックス（接頭辞）を付けます。
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            <strong>新機能:</strong>{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              feature/チケット番号-機能名
            </code>{' '}
            （例: <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">feature/ISSUE-123-login-page</code>）
          </li>
          <li>
            <strong>バグ修正:</strong>{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              bugfix/チケット番号-バグ名
            </code>
          </li>
          <li>
            <strong>脆弱性対応:</strong>{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              security/CVE番号
            </code>{' '}
            または{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              hotfix/xxx
            </code>
          </li>
        </ul>
      </section>

      {/* 2. マージ手法 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          2. マージ手法の定義（Squash and Mergeの強制）
        </h3>
        <p className="text-gray-600 mb-4">
          Pull Request（PR）を main に合流させる際のマージ手法は、「<strong>Squash and merge</strong>（スクワッシュ・アンド・マージ）」に統一します。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          理由（なぜSquashなのか？）
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            開発中の「wip（作業中）」「typo修正」「テスト失敗のため再プッシュ」といった無数の細かなコミット履歴を、マージ時に「1つの意味のある綺麗なコミット」に圧縮できます。
          </li>
          <li>
            これにより、main ブランチの履歴が「1コミット＝1機能（または1チケット）」となり、万が一障害やセキュリティインシデントが発生した際の「原因の特定（調査）」と「切り戻し（Revert）」が圧倒的に早く、確実になります。
          </li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          ⚙️ GitHubでの設定手順（管理者向け）
        </h4>
        <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
          <li>リポジトリの Settings &gt; General を開きます。</li>
          <li>下にスクロールし、Pull Requests のセクションを見つけます。</li>
          <li>
            <strong>Allow squash merging</strong> のみにチェックを入れ、他の2つ（Allow merge commits / Allow rebase merging）のチェックを外します。
          </li>
          <li>
            その少し下にある <strong>Automatically delete head branches</strong> にもチェックを入れます（マージ後に不要なブランチを自動削除し、整理整頓するためです）。
          </li>
        </ol>
      </section>

      {/* 3. セキュアな開発ワークフロー */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          3. セキュアな開発ワークフロー（開発者の手順）
        </h3>
        <p className="text-gray-600 mb-4">
          開発者は以下のフローに沿って作業を行い、システムによる関門（ゲート）を通過したものだけがマージされます。
        </p>

        <ol className="list-decimal list-inside text-gray-600 space-y-4">
          <li>
            <strong>ブランチの作成:</strong> main から feature/xxx ブランチを作成し、ローカルで作業する。
          </li>
          <li>
            <strong>コミットとプッシュ:</strong>
            <br />
            シークレットスキャン（Push保護）が有効なため、誤ってAPIキーを含めるとこの時点で弾かれます。
          </li>
          <li>
            <strong>Pull Request (PR) の作成:</strong>
            <br />
            作業が完了したら main に向けてPRを作成します。
          </li>
          <li>
            <strong>自動スキャンとテスト（関門1）:</strong>
            <br />
            PRを作成した瞬間に、GitHub Actions（CI）と GHAS（コードスキャン）が自動で走ります。
            <br />
            <span className="font-medium">ルール:</span> すべてのチェックが「Pass（緑色）」にならない限り、マージボタンは押せません。
          </li>
          <li>
            <strong>コードレビュー（関門2）:</strong>
            <br />
            他のエンジニア（またはCODEOWNERSで指定された責任者）にレビューを依頼します。
            <br />
            <span className="font-medium">ルール:</span> 最低1人以上の「Approve（承認）」が得られない限り、マージボタンは押せません。
          </li>
          <li>
            <strong>Squash and Merge:</strong>
            <br />
            すべての関門をクリアしたら、PRの画面で「Squash and merge」をクリックし、1つのコミットとして main に取り込みます。
          </li>
        </ol>
      </section>

      {/* 4. ルールの強制 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          4. ルールの強制（Repository Rulesets の適用）
        </h3>
        <p className="text-gray-600 mb-4">
          上記「関門1」「関門2」を人間のお願いベースではなく、システムとして強制するための設定です。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          ⚙️ GitHubでの設定手順（管理者向け）
        </h4>
        <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
          <li>
            リポジトリ（またはOrganization）の Settings &gt; Rules &gt; Rulesets を開きます。
          </li>
          <li>
            <strong>New branch ruleset</strong> を作成し、ターゲットを Default branch（通常は main）にします。
          </li>
          <li>
            以下の保護ルール（Protections）を有効化します：
          </li>
        </ol>

        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
          <li>
            <strong>Require a pull request before merging:</strong> オン
            <br />
            <span className="text-gray-500">（必須レビュー数を1以上に設定）</span>
            <br />
            開発者が独断でメインブランチを直接書き換えるのを防ぎます。
          </li>
          <li>
            <strong>Require status checks to pass:</strong> オン
            <br />
            <span className="text-gray-500">（CIのテストジョブや、CodeQL などのセキュリティスキャンを必須項目として指定）</span>
            <br />
            GitHub Actionsの自動テストや、GHASの「Code Scanning（脆弱性スキャン）」がすべてグリーン（成功）にならない限り、物理的にマージボタンを押せなくします。
          </li>
          <li>
            <strong>Require conversation resolution:</strong> オン
            <br />
            <span className="text-gray-500">（PR内のコメントがすべて「解決済み」になるまでマージをブロック）</span>
            <br />
            レビュアーがPR内で指摘したコメント（修正依頼や確認事項）が、放置されたままうやむやにマージされるのを防ぎます。
          </li>
        </ul>
      </section>
    </article>
  );
}
