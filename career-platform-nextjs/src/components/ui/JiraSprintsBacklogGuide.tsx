'use client';

export default function JiraSprintsBacklogGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🏃 スプリントとバックログ</h2>
      <p className="text-gray-600 mb-8">
        スクラムでは<strong>プロダクトバックログ</strong>に優先順位付きの課題を並べ、スプリント計画で<strong>スプリントバックログ</strong>に引き込みます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">スプリント計画のポイント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>スプリントゴールを一文で決め、チームで合意する</li>
          <li>見積もり（ストーリーポイントや時間）を参考に、過去のベロシティと照らす</li>
          <li>スコープは固定ではなく、学習に応じて Product Owner と調整する</li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">完了の定義（DoD）</h3>
        <p className="text-gray-600">
          「レビュー済み」「テスト済み」「ドキュメント更新済み」など、スプリント内で<strong>完了</strong>とみなす条件をチームで共有しておきます。Jira ではチェックリストやサブタスクで表現することも多いです。
        </p>
      </section>
    </article>
  );
}
