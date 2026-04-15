'use client';

export default function JiraServiceManagementIntroGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🎧 Jira Service Management 入門</h2>
      <p className="text-gray-600 mb-8">
        <strong>JSM</strong> は社内外からの依頼を受け付け、チケット化・ルーティング・SLA 追跡まで行うサービス管理製品です。ITIL のインシデント／サービスリクエストの考え方と相性が良いです。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">リクエストタイプとポータル</h3>
        <p className="text-gray-600">
          利用者向けポータルでは「パスワード再発行」「アカウント申請」など<strong>リクエストタイプ</strong>ごとにフォームが分かれ、裏側では Jira の課題として処理されます。
        </p>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">SLA とナレッジ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>優先度やリクエスト種別に応じた<strong>SLA タイマー</strong>で対応遅れを可視化</li>
          <li>
            <strong>Confluence</strong> の記事をポータルから提示し、自己解決率を高める構成が一般的
          </li>
        </ul>
      </section>
    </article>
  );
}
