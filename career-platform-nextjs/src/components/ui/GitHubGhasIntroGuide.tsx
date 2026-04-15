'use client';

export default function GitHubGhasIntroGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        1. GHASとは？（コンセプト）
      </h2>
      <p className="text-gray-600 mb-4">
        GitHub Advanced Security (GHAS) は、ソースコードの管理基盤であるGitHubに直接統合された、開発者主導のセキュリティソリューションです。
      </p>
      <p className="text-gray-600 mb-8">
        従来、セキュリティチェックは「開発の終盤（テスト・リリース前）」にセキュリティ担当者が行うのが一般的でしたが、これでは問題発覚時の手戻りコストが膨大になります。 GHASは、コードを書いている最中やPull Requestの段階で脆弱性を自動検知する「シフトレフト（セキュリティの早期化）」を実現し、開発のスピードを落とさずに安全なソフトウェアを構築するためのツール群です。
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        2. GHASを構成する主要機能
      </h3>
      <p className="text-gray-600 mb-6">
        GHASは、主に以下の機能群で構成され、システムを多角的に防御します。
      </p>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            🔑 Secret Scanning（シークレットスキャン）
          </h4>
          <p className="text-gray-600 mb-1">
            <strong>役割:</strong> クラウドの認証キーやパスワードなどの機密情報が、コード内に誤って混入するのを防ぎます。
          </p>
          <p className="text-gray-600">
            <strong>特長:</strong> Push時にリアルタイムで検知し、ブロックする「プッシュ保護」機能を備えています。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            🐛 Code Scanning（コードスキャン）
          </h4>
          <p className="text-gray-600 mb-1">
            <strong>役割:</strong> 自社で開発したコード自体に潜むセキュリティ上の欠陥（脆弱性）やバグを解析します。
          </p>
          <p className="text-gray-600">
            <strong>特長:</strong> GitHub独自の強力な解析エンジン「CodeQL」を使用し、Pull Requestの画面上で直接アラートを通知します。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            📦 Dependabot（ディペンダボット）
          </h4>
          <p className="text-gray-600 mb-1">
            <strong>役割:</strong> 使用している外部のオープンソースパッケージ（依存関係）の脆弱性を監視します。
          </p>
          <p className="text-gray-600">
            <strong>特長:</strong> 脆弱性が発見されると、安全なバージョンへアップデートするためのPull Requestを自動で作成します。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            📊 Security Overview（セキュリティの概要）
          </h4>
          <p className="text-gray-600">
            <strong>役割:</strong> 組織全体のリスク状況を俯瞰するための管理者向けダッシュボードです。
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        3. GHAS導入の3つのメリット
      </h3>
      <p className="text-gray-600 mb-4">
        <strong>開発フローへの完全な統合（コンテキストスイッチの排除）</strong> 開発者は使い慣れたGitHubの画面（Pull Requestなど）から離れることなく、コードレビューの一環としてセキュリティの問題を修正できます。別のセキュリティツールにログインし直す必要がありません。
      </p>
      <p className="text-gray-600 mb-4">
        <strong>自動化による運用コストの削減</strong> スキャンの実行や、外部ライブラリのアップデートPRの作成が自動化されるため、セキュリティ対応にかかる作業時間を大幅に削減できます。
      </p>
      <p className="text-gray-600 mb-8">
        <strong>組織全体のガバナンス強化</strong> 「Security Overview」を活用することで、経営層や監査部門は「現在どこにリスクがあるか」「対応が進んでいるか」をリアルタイムで可視化・管理できます。
      </p>

      {/* 有効化手順 - Organization */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚙️ GHASの有効化手順
        </h3>
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 mb-6">
          <p className="text-sm text-amber-800">
            <strong>※前提条件:</strong> プライベートリポジトリでGHASを利用するには、GitHub Enterpriseライセンスに加え、GHASのアドオンライセンスが必要です（パブリックリポジトリは無料で利用可能）。また、設定にはOrganizationのOwner権限が必要です。
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          特定のOrganization全体に対して、一括でGHASを有効化する手順は以下の通りです。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          1. セキュリティ設定画面を開く
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>GitHubにログインし、対象の Organization のトップページを開きます。</li>
          <li>画面右上の <strong>Settings</strong>（歯車アイコン）をクリックします。</li>
          <li>左側のサイドバーを少し下にスクロールし、「Security」セクション内の <strong>Code security and analysis</strong>（コードのセキュリティと分析）をクリックします。</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          2. GHASを有効化する
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>画面右側の設定一覧から、GitHub Advanced Security の項目を見つけます。</li>
          <li>右側にある <strong>Enable all</strong>（すべて有効化）ボタンをクリックします。</li>
          <li>確認のダイアログが表示されるので、内容を確認して <strong>Enable for all eligible repositories</strong> をクリックします。</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          3. 各スキャン機能を有効化する（推奨）
        </h4>
        <p className="text-gray-600 mb-2">
          GHASの基盤が有効化されたら、同じ画面内で続けて以下の機能もオンにしておくことを強く推奨します。
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li><strong>Dependabot alerts / security updates:</strong> 右側の Enable all をクリックします。</li>
          <li><strong>Secret scanning:</strong> 右側の Enable all をクリックし、続けてその下にある Push protection（プッシュ保護）も Enable all にします。</li>
          <li><strong>Code scanning (Default setup):</strong> 右側の Enable all をクリックします。</li>
        </ul>
        <p className="text-gray-600 font-medium">
          これで、Organization内のすべてのリポジトリに対する強固なセキュリティ基盤が有効化されました！
        </p>
      </section>

      {/* 有効化手順 - リポジトリ単位 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚙️ リポジトリ単位でGHASを有効化する手順
        </h3>
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 mb-6">
          <p className="text-sm text-amber-800">
            <strong>※前提条件:</strong> プライベートリポジトリで利用する場合は、対象のEnterpriseでGHASライセンスが利用可能であり、かつご自身が対象リポジトリの Admin（管理者） 権限を持っている必要があります。（パブリックリポジトリの場合は無料で利用可能です）
          </p>
        </div>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          1. リポジトリのセキュリティ設定画面を開く
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>GitHub上で、対象となる リポジトリのトップページを開きます。</li>
          <li>画面上部のタブメニューから <strong>Settings</strong>（歯車アイコン）をクリックします。</li>
          <li>左側のサイドバーを下にスクロールし、「Security」セクション内の <strong>Code security and analysis</strong>（コードのセキュリティと分析）をクリックします。</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          2. GHASの基盤を有効化する
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>画面右側に並んでいる機能一覧から、GitHub Advanced Security の項目を見つけます。</li>
          <li>右側にある <strong>Enable</strong>（有効化）ボタンをクリックします。</li>
          <li>（※パブリックリポジトリの場合は最初から無料提供されているため、この「GHASのEnableボタン」は存在せず、最初から次のステップの個別機能が設定できる状態になっています）</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          3. 各スキャン機能を有効化する（推奨）
        </h4>
        <p className="text-gray-600 mb-2">
          GHASの機能がアンロックされたら、続けて画面を下へスクロールし、具体的な防御機能をオンにしていきます。
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li><strong>Dependabot alerts / security updates:</strong> それぞれ右側の Enable をクリックします。</li>
          <li><strong>Secret scanning（シークレットスキャン）:</strong> 右側の Enable をクリックし、続けてそのすぐ下にある Push protection（プッシュ保護）も Enable にします。</li>
          <li><strong>Code scanning（コードスキャン）:</strong> 右側の Set up ボタンをクリックし、Default（デフォルトセットアップ）を選択します。画面の指示に従って進めるだけで、自動的に最適なスキャン設定が適用されます。</li>
        </ul>
        <p className="text-gray-600 font-medium">
          これで、このリポジトリに対する強固なセキュリティ設定が完了しました！
        </p>
      </section>
    </article>
  );
}
