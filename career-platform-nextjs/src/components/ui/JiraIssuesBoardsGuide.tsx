'use client';

export default function JiraIssuesBoardsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 課題（Issue）とボード</h2>
      <p className="text-gray-600 mb-8">
        課題は Jira の最小単位です。ストーリー、タスク、バグ、エピックなど<strong>課題タイプ</strong>で性質を区別し、ボード上でワークフローの列に並べます。
      </p>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ボードの種類</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>スクラムボード:</strong> バックログからスプリントへコミットし、スプリント単位で進捗を追う。
          </li>
          <li>
            <strong>カンバンボード:</strong> 継続的なフロー。WIP 制限で滞留を可視化する。
          </li>
          <li>
            <strong>リストビュー:</strong> 表形式で一括編集やフィルタに適する。
          </li>
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">カスタムフィールド</h3>
        <p className="text-gray-600">
          チーム固有の属性（優先度以外の「顧客」「リリース列」など）はカスタムフィールドで表現します。フィールドが増えすぎると運用が重くなるため、本当に必要なものだけに絞るのがコツです。
        </p>
      </section>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://support.atlassian.com/jira-software-cloud/" target="_blank" rel="noopener noreferrer" className="underline">
            Jira Software Cloud サポート
          </a>
        </p>
      </div>
    </article>
  );
}
