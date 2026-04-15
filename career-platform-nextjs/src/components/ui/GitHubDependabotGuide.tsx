'use client';

export default function GitHubDependabotGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🛡️ GitHub Advanced Security：Dependabotとは？
      </h2>
      <p className="text-gray-600 mb-4">
        Dependabotは、プロジェクトで使用している外部のオープンソース・ライブラリやパッケージ（npm、PyPI、RubyGems、Mavenなど）に脆弱性がないかを継続的に監視し、安全なバージョンへのアップデートを自動で提案（Pull Requestを作成）してくれる機能です。
      </p>
      <p className="text-gray-600 mb-8">
        現代のソフトウェア開発では、コードの大部分（70〜90%とも言われます）が外部のオープンソースで構成されています。Dependabotは、人間が手作業で追いきれない「外部パッケージの脆弱性監視」を完全に自動化します。
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        ✨ 主な機能とメリット
      </h3>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Dependabot Alerts（脆弱性アラート）
          </h4>
          <p className="text-gray-600">
            プロジェクトの依存関係を定義したファイル（<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">package.json</code>や<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">requirements.txt</code>など）を自動で解析します。世界中の脆弱性データベース（CVEなど）と照らし合わせ、危険なパッケージが使われているとSecurityタブに即座にアラートを出します。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Dependabot Security Updates（自動セキュリティアップデート）
          </h4>
          <p className="text-gray-600">
            ここが最大の強みです。脆弱性が見つかった際、ただ警告するだけでなく「この安全なバージョンにアップデートしてください」という修正用のPull Request（PR）を自動で作成します。開発者は変更内容（と自動テストの結果）を確認してマージするだけで、脆弱性対応が完了します。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Dependabot Version Updates（定期的なバージョン更新）
          </h4>
          <p className="text-gray-600">
            脆弱性の有無にかかわらず、「毎日」「週に1回」などのスケジュールを設定し、使用しているパッケージ群を常に最新状態に保つためのPRを自動作成します。日頃から少しずつアップデートしておくことで、後から一気に更新しようとしてシステムが動かなくなる「技術的負債」を劇的に減らすことができます。
          </p>
        </div>
      </div>
    </article>
  );
}
