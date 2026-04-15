'use client';

export default function AzureEntraBulkUserRegistrationGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Microsoft Entra ID でのユーザー一括登録</h2>
      <p className="text-gray-600 mb-8">
        テナントに多数のユーザーを登録する場合、管理センター上の<strong>一括操作（CSV）</strong>や、<strong>ゲストの一括招待</strong>、
        <strong>Microsoft Graph / PowerShell</strong> による自動化が使われます。ここでは代表的な手段と運用上の注意を整理します。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">メンバーとゲストの違い（前提）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>メンバー:</strong> 自社テナントのユーザーを一括で作成・更新するシナリオ（新入社員、子会社統合など）
          </li>
          <li>
            <strong>ゲスト（外部ユーザー）:</strong> パートナー等を B2B で招待するシナリオ。一括招待用の CSV フローがあります
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">管理センターでの一括作成（CSV）</h3>
        <p className="text-gray-600 mb-4">
          Microsoft Entra 管理センターの <strong>ユーザー</strong> から、テンプレートに沿った CSV をダウンロードし、複数行を編集してアップロードする方法です。初回パスワードや使用場所の制限はポリシーとセットで設計します。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>必須列（表示名、UPN、初期パスワードなど）はテンプレートと公式ドキュメントの最新版に合わせる</li>
          <li>大量行は検証用に少数行で試してから本番投入する</li>
          <li>誤った UPN や重複はインポート結果・監査ログで確認する</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ゲスト（B2B）の一括招待</h3>
        <p className="text-gray-600 mb-4">
          外部ユーザーをまとめて招待する場合、管理センターの一括招待機能や CSV ベースのフローを利用できます。招待後の権限はグループ・ロール・アプリの割り当てで制御します。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Microsoft Graph / PowerShell（自動化）</h3>
        <p className="text-gray-600 mb-4">
          HR システムやワークフローと連携する場合、<strong>Microsoft Graph API</strong>（例: ユーザーの作成）や{' '}
          <strong>Microsoft Graph PowerShell</strong> でスクリプト化します。アプリ登録に適切なアプリケーション権限と管理者同意が必要です。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>スクリプトに資格情報を埋め込まず、マネージド ID やシークレット管理（Key Vault 等）を検討する</li>
          <li>スロットリングと再試行、冪等性（同じ工員番号の二重作成防止）を設計する</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ライセンスとグループ</h3>
        <p className="text-gray-600 mb-4">
          ユーザーを作成しただけではライセンスが付かない場合があります。<strong>グループベースのライセンス</strong>や、動的グループとの組み合わせで、一括登録後のオンボーディングを整えます。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 font-medium mb-2">参考（Microsoft Learn）</p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <a
              href="https://learn.microsoft.com/ja-jp/entra/fundamentals/add-users"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              ユーザーを追加または削除する（一括操作の案内含む）
            </a>
          </li>
          <li>
            <a
              href="https://learn.microsoft.com/ja-jp/entra/external-identities/tutorial-bulk-invite"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              チュートリアル: Microsoft Entra 外部 ID でユーザーを一括招待する
            </a>
          </li>
          <li>
            <a
              href="https://learn.microsoft.com/ja-jp/graph/api/user-post-users"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Microsoft Graph — ユーザーの作成
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
