'use client';

export default function GitHubCodeScanningGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🛡️ GitHub Advanced Security：コードスキャン（Code Scanning）とは？
      </h2>
      <p className="text-gray-600 mb-4">
        コードスキャン（Code Scanning）は、GitHubのリポジトリにあるソースコードを解析し、セキュリティ上の脆弱性や、バグの原因となるコーディングの誤りを自動的に発見する機能です。
      </p>
      <p className="text-gray-600 mb-8">
        開発者が新しく書いたコードが本番環境（メインブランチ）にマージされる「前」の段階で問題を検知し、安全なソフトウェア開発を支援します。
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        ✨ 主な機能とメリット
      </h3>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            強力な「CodeQL」エンジンによる解析
          </h4>
          <p className="text-gray-600">
            GitHubが開発した業界最高水準の解析エンジン「CodeQL」を標準搭載しています。これはソースコードをデータベースのように扱い、「SQLインジェクション」や「クロスサイトスクリプティング（XSS）」といった複雑なセキュリティの脆弱性を、高い精度で検知します。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Pull Request（PR）へのシームレスな統合
          </h4>
          <p className="text-gray-600">
            開発者がコードを書いてPull Requestを作成すると、バックグラウンドで（主にGitHub Actionsを通じて）自動的にスキャンが走ります。もし脆弱性が見つかった場合、PRの画面上に直接アラートとして表示されるため、開発者は普段のレビューと同じ感覚でセキュリティの問題を修正できます。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            「シフトレフト」の実現
          </h4>
          <p className="text-gray-600">
            従来は開発の終盤やリリース後にセキュリティチームが検査を行っていましたが、コードスキャンを使うことで、開発の最初期（コードを書いた直後）に開発者自身で問題を解決できるようになります。これにより、手戻りのコストと修正にかかる時間を劇的に削減できます。
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            柔軟な拡張性（サードパーティ製ツールの統合）
          </h4>
          <p className="text-gray-600">
            CodeQLだけでなく、OSSの静的解析ツール（ESLintやTrivyなど）やサードパーティ製のセキュリティツールの結果も、SARIFという標準フォーマットを使ってGitHub上の同じ画面（Securityタブ）に統合・表示させることが可能です。
          </p>
        </div>
      </div>
    </article>
  );
}
