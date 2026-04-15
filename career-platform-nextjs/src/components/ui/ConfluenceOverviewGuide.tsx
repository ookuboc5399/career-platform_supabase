'use client';

export default function ConfluenceOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 Confluence の概要</h2>
      <p className="text-gray-600 mb-8">
        <strong>Confluence</strong> はチーム向けのドキュメント・ナレッジ共有ツールです。Wiki のようにページをリンクしながら階層化でき、Jira の課題と相互に埋め込み連携できます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Jira との連携</h3>
        <p className="text-gray-600">
          仕様書に Jira の課題一覧や単一課題を埋め込み、ステータスをページを開かずに確認できます。スプリントレビュー資料を Confluence にまとめる運用もよく見られます。
        </p>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">その他の機能の位置づけ</h3>
        <p className="text-gray-600">
          ホワイトボード、データベース、自動化など、クラウド版ではページ以外のオブジェクトも増えています。まずは「スペース＋ページ＋マクロ」の基本に慣れてから拡張するのがおすすめです。
        </p>
      </section>
    </article>
  );
}
