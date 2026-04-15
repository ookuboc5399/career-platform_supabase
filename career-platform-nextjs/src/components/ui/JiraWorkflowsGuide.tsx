'use client';

export default function JiraWorkflowsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔀 ワークフローとステータス</h2>
      <p className="text-gray-600 mb-8">
        ワークフローは課題の<strong>ステータス</strong>と、ステータス間の<strong>トランジション</strong>（誰が・どの操作で移れるか）を定義します。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">よくあるステータス例</h3>
        <p className="text-gray-600 mb-4">
          例: 未対応 → 進行中 → レビュー中 → 完了。チームの実際の工程に合わせて列を増減します。
        </p>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">解決（Resolution）</h3>
        <p className="text-gray-600">
          「完了」でも<strong>解決理由</strong>（修正済み、重複、却下など）を分けると、後からレポートで分析しやすくなります。ステータスと Resolution は別概念なので混同しないようにします。
        </p>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">運用上の注意</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>トランジションに条件（権限・フィールド必須）を付けすぎると現場が回らなくなる</li>
          <li>本番プロジェクトのワークフロー変更は既存課題への影響を必ず確認する</li>
        </ul>
      </section>
    </article>
  );
}
