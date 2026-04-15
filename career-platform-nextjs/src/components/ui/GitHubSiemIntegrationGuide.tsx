'use client';

export default function GitHubSiemIntegrationGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📡 GHASとSIEMを連携するための3つのアプローチ
      </h2>

      {/* 1. 公式インテグレーション */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          1. 公式インテグレーション（専用コネクタ）を利用する【最もおすすめ】
        </h3>
        <p className="text-gray-600 mb-4">
          お使いのSIEMツールがGitHub公式のコネクタ（App）を提供している場合、これが一番簡単で確実です。面倒な設定を自動でやってくれます。
        </p>
        <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">
          やるべきこと:
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Microsoft Sentinel の場合:</strong> Sentinelのデータコネクタから「GitHub」を選択し、Organizationのアクセストークンを入力して連携を許可するだけです。
          </li>
          <li>
            <strong>Splunk の場合:</strong> Splunkbaseから「Splunk App for GitHub」をインストールし、トークンとWebhookの設定を行います。
          </li>
          <li>
            <strong>Datadog の場合:</strong> DatadogのIntegrations画面からGitHubアプリをインストールし、対象のリポジトリやOrgを紐付けます。
          </li>
        </ul>
      </section>

      {/* 2. Webhook */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          2. Webhook（ウェブフック）を設定する【リアルタイム検知向け】
        </h3>
        <p className="text-gray-600 mb-4">
          公式コネクタがない場合や、リアルタイムでアラートの詳細情報（どのコードの何行目に脆弱性があるか等）をSIEMに送りたい場合は、Webhookを使用します。
        </p>
        <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">
          やるべきこと:
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>SIEM側での準備:</strong> GitHubから送られてくるJSONデータを受け取るための「HTTPエンドポイント（URL）」を発行します（AWS API Gateway + Lambda 経由でSIEMに流す構成もよく使われます）。
          </li>
          <li>
            <strong>GitHub側での設定:</strong> Organizationの「Settings」&gt;「Webhooks」から新しいWebhookを作成します。
          </li>
          <li>
            <strong>イベントの選択:</strong> 送信するイベントとして <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">code_scanning_alert</code>、<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">secret_scanning_alert</code>、<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">dependabot_alert</code> にチェックを入れて保存します。これでアラート発生時に即座にSIEMへデータが飛びます。
          </li>
        </ul>
      </section>

      {/* 3. 監査ログストリーミング */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          3. 監査ログストリーミング（Audit Log Streaming）を利用する【監査・ログ保管向け】
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Enterprise Cloud（GHEC）を利用している場合、Enterprise全体の操作ログを直接SIEMやクラウドストレージに流し込み続ける標準機能が使えます。
        </p>
        <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">
          やるべきこと:
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>GitHub Enterpriseの設定画面から「Settings」&gt;「Audit log」&gt;「Log streaming」を開きます。</li>
          <li>送信先（Amazon S3、Azure Event Hubs、Datadog、Splunkなど）を選択し、連携用のキーやエンドポイントを入力します。</li>
        </ul>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>⚠️ 注意点:</strong> この機能は「誰がアラートをクローズしたか」「誰が設定を変更したか」といった監査ログ（操作履歴）がメインです。脆弱性自体の詳細なペイロード（中身）を取得するには、2のWebhookか、REST APIとの併用が必要になることが多いです。
          </p>
        </div>
      </section>
    </article>
  );
}
