'use client';

export default function GitHubBranchProtectionRulesetsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🛡️ ブランチ保護とルールセット</h2>
      <p className="text-gray-600 mb-8">
        本番や共有のデフォルトブランチに、未レビューのコードや壊れた CI がそのまま入らないようにするのが <strong>ブランチ保護</strong> です。従来の「ブランチ保護ルール」に加え、複数ブランチやパターンへまとめて適用できる{' '}
        <strong>ルールセット（rulesets）</strong> が利用できます（プラン・権限による）。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">よく使う制約</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Pull Request 経由でのみマージ（直 push 禁止）</li>
          <li>承認レビュー必須（人数・CODEOWNERS による必須レビュー）</li>
          <li>特定のステータスチェック（CI）が成功するまでマージ不可</li>
          <li>ブランチが最新のベースより遅れている場合はマージ不可（up to date 要求）</li>
          <li>管理者にも適用するかどうか（バイパスを残さない運用が安全な場合が多い）</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ブランチ保護ルール vs ルールセット</h3>
        <p className="text-gray-600 mb-4">
          <strong>ブランチ保護ルール</strong> はリポジトリ単体で、ブランチ名パターンごとに細かく設定するイメージです。
        </p>
        <p className="text-gray-600">
          <strong>ルールセット</strong> は Organization レベルで複数リポジトリ・ブランチパターンに横断適用でき、評価順や例外の扱いをまとめやすいです。新規リポジトリにも同じ基準を当てたいときに有効です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">運用上のコツ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>チェック名の変更に CI が追従していないとマージが詰まるため、名前は安定させる</li>
          <li>緊急ホットフィックス用の例外は「ルールよりプロセス」を決め、監査ログで追えるようにする</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — 保護ブランチ
          </a>
          {' · '}
          <a
            href="https://docs.github.com/ja/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Organization のルールセット
          </a>
        </p>
      </div>
    </article>
  );
}
