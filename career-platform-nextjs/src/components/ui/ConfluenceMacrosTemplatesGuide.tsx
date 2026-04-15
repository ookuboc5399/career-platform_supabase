'use client';

export default function ConfluenceMacrosTemplatesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧩 マクロとテンプレート</h2>
      <p className="text-gray-600 mb-8">
        <strong>マクロ</strong> はページに動的な部品（目次、情報パネル、Jira フィルター、コードブロックなど）を挿入する機能です。<strong>テンプレート／ブループリント</strong> でページのひな型を共通化できます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">よく使うマクロの例</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>目次（TOC）— 長文の読みやすさ向上</li>
          <li>展開— 詳細を折りたたみ、スクロールを短く</li>
          <li>Jira Issues— クエリ結果を表やリストで表示</li>
          <li>ステータス／情報・注意・警告パネル— 読み手の注意を引く</li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">テンプレート運用</h3>
        <p className="text-gray-600">
          「議事録」「リリースノート」「ADR（Architecture Decision Record）」など、繰り返し作るページはテンプレート化し、必須見出しを揃えると品質と検索性が上がります。スペース管理者がテンプレートをメンテする役割を決めると長く使えます。
        </p>
      </section>
    </article>
  );
}
