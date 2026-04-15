'use client';

export default function GitHubActionsCicdPipelineGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>🚀</span>
        GitHub Actions CI/CDパイプライン作成手順
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Actionsのパイプラインは、リポジトリ内の{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
          .github/workflows/
        </code>{' '}
        ディレクトリに YAMLファイル（.yml） を配置するだけで機能します。
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">手順</h3>

      <ol className="space-y-8 list-decimal list-inside">
        {/* 手順1 */}
        <li className="pl-2">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            Actionsタブを開く
          </h4>
          <p className="text-gray-600 mb-2">
            GitHub上で、CI/CDを設定したいリポジトリのトップページを開きます。
          </p>
          <p className="text-gray-600">
            画面上部のタブメニューから <strong>Actions</strong> をクリックします。
          </p>
        </li>

        {/* 手順2 */}
        <li className="pl-2">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            ワークフローを作成する
          </h4>
          <p className="text-gray-600 mb-2">
            初めて開く場合、リポジトリのコード（言語）を自動判定して、おすすめのテンプレートが提案されます。
          </p>
          <p className="text-gray-600">
            今回は仕組みを理解するために、画面上部または左上にある{' '}
            <strong>set up a workflow yourself</strong>（自分でワークフローをセットアップする）
            というリンクをクリックします。
          </p>
        </li>

        {/* 手順3 */}
        <li className="pl-2">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            YAMLファイルを編集する
          </h4>
          <p className="text-gray-600 mb-4">
            エディタ画面が開きます。ファイル名（デフォルトは main.yml）はそのままでも、
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm mx-1">
              ci.yml
            </code>
            などの分かりやすい名前に変更しても構いません。
          </p>
          <p className="text-gray-600 mb-4">
            エディタの中身をすべて消し、以下の基本テンプレートをコピー＆ペーストします。
            （※今回は、どんな環境でも動くシンプルな「テストの実行を模した処理」を記述しています）
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-900">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">YAML</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
              <code>{`name: CI Pipeline

# いつこのワークフローを動かすか（トリガー）
on:
  push:
    branches: [ "main" ] # mainブランチにPushされた時
  pull_request:
    branches: [ "main" ] # mainブランチへ向けたPRが作成された時

# 何を実行するか
jobs:
  build-and-test:
    runs-on: ubuntu-latest # GitHubが用意する仮想サーバー（Ubuntu）を使用

    steps: # 実行する手順（ステップ）
      # 1. リポジトリのコードを仮想サーバーにチェックアウト（ダウンロード）する
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. 必要な環境をセットアップする（例としてNode.js）
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # 3. 依存パッケージのインストール（ダミーコマンド）
      - name: Install dependencies
        run: echo "npm install を実行します..."

      # 4. テストの実行（ダミーコマンド）
      - name: Run tests
        run: echo "npm test を実行します... テスト成功！"`}</code>
            </pre>
          </div>
        </li>

        {/* 手順4 */}
        <li className="pl-2">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            コードをコミットして保存する
          </h4>
          <p className="text-gray-600 mb-2">
            画面右上の緑色の <strong>Commit changes...</strong> ボタンをクリックします。
          </p>
          <p className="text-gray-600">
            コミットメッセージ（例：「Create CI pipeline」）を入力し、もう一度{' '}
            <strong>Commit changes</strong> をクリックします。これで設定は完了です！
          </p>
        </li>

        {/* 手順5 */}
        <li className="pl-2">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            パイプラインの実行結果を確認する
          </h4>
          <p className="text-gray-600 mb-2">
            コミットした直後、main ブランチに変更が加わったため、自動的にワークフローが走り始めます。
          </p>
          <p className="text-gray-600 mb-2">
            再度、リポジトリのタブメニューから <strong>Actions</strong> をクリックします。
          </p>
          <p className="text-gray-600 mb-2">
            リストの一番上に、今作成した「CI Pipeline」が実行中（または完了）の状態で表示されます。
          </p>
          <p className="text-gray-600">
            クリックして詳細を開き、左側の <strong>build-and-test</strong> というジョブをクリックすると、
            黒い画面で実行ログ（テストが成功した様子など）を確認できます。
          </p>
        </li>
      </ol>
    </article>
  );
}
