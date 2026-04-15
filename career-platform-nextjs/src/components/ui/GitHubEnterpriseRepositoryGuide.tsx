'use client';

import GitHubOutsideCollaboratorsGuide from '@/components/ui/GitHubOutsideCollaboratorsGuide';

export default function GitHubEnterpriseRepositoryGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        GitHub Enterprise リポジトリ運用ルール
      </h2>

      {/* 1. リポジトリの作成ルール */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          1. リポジトリの作成ルール（Naming &amp; Visibility）
        </h3>
        <p className="text-gray-600 mb-4">
          リポジトリを新規作成する際は、以下のルールを遵守してください。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          命名規則（プレフィックスの強制）
        </h4>
        <p className="text-gray-600 mb-2">
          リポジトリ名を見ただけで「どの領域の、何のシステムか」が判別できるように、以下のフォーマットで命名します。
        </p>
        <p className="text-gray-600 mb-2 font-medium">
          フォーマット: [領域/プラットフォーム]-[役割]-[具体的なシステム名]
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-2 space-y-1">
          <li>
            <strong className="text-green-700">良い例:</strong>{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              frontend-app-ios
            </code>
            ,{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              backend-api-auth
            </code>
            ,{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              infra-terraform-aws
            </code>
          </li>
          <li>
            <strong className="text-red-700">悪い例:</strong>{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              test
            </code>
            ,{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              my-project
            </code>
            ,{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
              api
            </code>
            （※名前が一般的すぎて後から検索・特定できません）
          </li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          可視性（Visibility）の設定
        </h4>
        <p className="text-gray-600 mb-2">
          デフォルトは必ず <strong>Private</strong> または <strong>Internal</strong>（Enterprise環境のみ）に設定します。
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-2 space-y-1">
          <li>
            <strong>Internal:</strong> 社内の全メンバーに対してコードを公開・共有して良い場合（社内オープンソース文化を促進するため、基本はこちらを推奨）。
          </li>
          <li>
            <strong>Private:</strong> 特定のプロジェクトメンバー以外には絶対にコードを見せてはいけない場合（秘匿性の高い新規事業など）。
          </li>
          <li>
            <strong>Public:</strong> 意図的にオープンソースとして外部公開する場合のみ使用（※管理者の事前承認を必須とします）。
          </li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          初期ファイルの作成（Initialize this repository with...）
        </h4>
        <p className="text-gray-600">
          作成時に必ず <strong>Add a README file</strong> と <strong>Add .gitignore</strong> にチェックを入れます（言語に合ったgitignoreを選択してください）。
        </p>
      </section>

      {/* 2. リポジトリの基本設定 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          2. リポジトリの基本設定（Configuration）
        </h3>
        <p className="text-gray-600 mb-4">
          リポジトリ作成直後に、Settings タブから以下の設定を必ず行ってください。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          Description と Topics の記載
        </h4>
        <p className="text-gray-600 mb-4">
          リポジトリの概要（Description）を1〜2文で書き、検索用のタグ（Topics）を付与します（例: react, aws, authentication）。これにより、社内の他のエンジニアが類似コードを探しやすくなります。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          不要な機能の無効化（Features）
        </h4>
        <p className="text-gray-600 mb-4">
          プロジェクト管理やバグトラッキングにJiraや社内標準のツールを使っている場合、情報が分散するのを防ぐため、GitHub側の <strong>Wikis</strong> や <strong>Projects</strong> のチェックを外し、無効化します。（※GitHub Projectsを標準とする場合は有効のままで構いません）
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          自動削除設定（Pull Requests）
        </h4>
        <p className="text-gray-600">
          「<strong>Automatically delete head branches</strong>」にチェックを入れます。これにより、PRがマージされた後に不要な作業ブランチが自動削除され、リポジトリが綺麗に保たれます。
        </p>
      </section>

      {/* 3. 権限管理とアクセス制御 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          3. 権限管理とアクセス制御（Permissions）
        </h3>
        <p className="text-gray-600 mb-4">
          セキュリティ事故（退職者のアクセス権残りなど）を防ぐため、権限管理は以下の厳格なルールで運用します。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          「個人」への直接付与の禁止（Org メンバー向け）
        </h4>
        <p className="text-gray-600 mb-4">
          <strong>Organization メンバー</strong>については、リポジトリの Collaborators として個人（ユーザー名）を直接追加せず、必ず下記の
          Team 経由で付与します。一方、<strong>外部コラボレーター</strong>は Organization メンバーではないため、リポジトリ単位での招待という別ルートになります（詳細はこのセクション末尾の「外部コラボレーター」を参照）。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          「Team」ベースの権限付与
        </h4>
        <p className="text-gray-600 mb-4">
          必ず Organization に作成された Team（例: Backend-Dev-Team）をリポジトリに追加し、Team経由で権限を付与してください。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          最小権限の原則（Least Privilege）
        </h4>
        <p className="text-gray-600 mb-2">
          Teamに付与する権限（Role）は、業務に必要な最低限のものにします。
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            <strong>Read:</strong> コードの閲覧やCloneのみ必要なメンバー（デフォルト）。
          </li>
          <li>
            <strong>Write:</strong> コードのPush（PRの作成）が必要な開発メンバー。
          </li>
          <li>
            <strong>Admin:</strong> リポジトリの設定変更や削除が必要なプロジェクトリーダーのみ（※原則1リポジトリにつき2〜3名まで）。
          </li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          責任者の明文化（CODEOWNERS）
        </h4>
        <p className="text-gray-600">
          リポジトリのルート（または <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">.github/</code>）に <strong>CODEOWNERS</strong> ファイルを配置し、「誰がこのコードの品質に責任を持つか（誰のレビューが必須か）」をシステム的に定義します。
        </p>

        <div className="mt-10 border-t border-gray-200 pt-10">
          <GitHubOutsideCollaboratorsGuide headingLevel="h2" />
        </div>
      </section>

      {/* 4. リポジトリのライフサイクル管理 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          4. リポジトリのライフサイクル管理（Archive）
        </h3>
        <p className="text-gray-600 mb-4">
          プロジェクトが終了した、または別のシステムに移行して使われなくなったリポジトリの取り扱いルールです。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          削除（Delete）の原則禁止
        </h4>
        <p className="text-gray-600 mb-4">
          過去のIssueのやり取りやコードの履歴は重要な社内資産です。原則としてリポジトリの「削除」は行わないでください。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          アーカイブ（Archive）の実施
        </h4>
        <p className="text-gray-600">
          開発が終了したリポジトリは、Settings の一番下にある <strong>Archive this repository</strong> を実行します。これにより、コードやIssueは「読み取り専用」として安全に保存され、誤って更新される事故を防ぐことができます。
        </p>
      </section>
    </article>
  );
}
