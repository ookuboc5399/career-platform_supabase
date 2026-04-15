'use client';

export default function ConfluenceSpacesPagesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🗂️ スペースとページ構成</h2>
      <p className="text-gray-600 mb-8">
        <strong>スペース</strong> はページのまとまり（プロジェクト単位、部署単位、製品単位など）。各スペースにホームがあり、その下にツリー状にページをぶら下げます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">スペースの種類（例）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>チームスペース:</strong> 部門やプロダクトチームの定常ドキュメント
          </li>
          <li>
            <strong>個人スペース:</strong> メモや下書き（公開範囲に注意）
          </li>
          <li>
            <strong>ナレッジベース:</strong> 外部・内部向けヘルプ記事の整理に特化したテンプレート
          </li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">権限</h3>
        <p className="text-gray-600 mb-4">
          デフォルトはスペース単位の権限です。機密ページだけ閲覧を絞りたい場合は<strong>ページ制限</strong>を使いますが、運用が複雑になるため「スペースを分ける」方がわかりやすいこともあります。
        </p>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ラベル</h3>
        <p className="text-gray-600">
          横断検索やレポート用に <code className="px-1 bg-gray-100 rounded text-sm">how-to</code> や{' '}
          <code className="px-1 bg-gray-100 rounded text-sm">deprecated</code> などのラベルを付けると、後からの整理が楽になります。
        </p>
      </section>
    </article>
  );
}
