'use client';

/**
 * 外部コラボレーター（Outside Collaborator）の説明。
 * リポジトリ運用・認証チャプターなどから共通利用。
 */
export default function GitHubOutsideCollaboratorsGuide({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const mainClass =
    headingLevel === 'h2'
      ? 'text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'
      : 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4';
  const sectionClass =
    headingLevel === 'h2'
      ? 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'
      : 'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3';
  const subClass = 'text-lg font-medium text-gray-800 dark:text-gray-200 mt-6 mb-2';
  const DetailTag = headingLevel === 'h2' ? 'h4' : 'h5';

  return (
    <section className="not-prose">
      {headingLevel === 'h2' ? (
        <h2 className={mainClass}>外部コラボレーター（Outside Collaborator）</h2>
      ) : (
        <h3 className={mainClass}>外部コラボレーター（Outside Collaborator）</h3>
      )}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
        <strong>外部コラボレーター（Outside Collaborator）</strong>は、Organization のメンバーではないが、Organization
        内の<strong>特定のリポジトリ</strong>にアクセス権を持つユーザーのことです。外部の委託先や一時的なパートナーに、必要なリポジトリだけアクセスさせたい場合に使います。
      </p>

      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-6">
        <div>
          {headingLevel === 'h2' ? (
            <h3 className={sectionClass}>Org メンバーとの主な違い</h3>
          ) : (
            <h4 className={sectionClass}>Org メンバーとの主な違い</h4>
          )}

          <DetailTag className={subClass}>アクセス範囲</DetailTag>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              外部コラボレーターは<strong>明示的に追加されたリポジトリにのみ</strong>アクセスでき、Team には参加できず、Org の{' '}
              <strong>People</strong> タブにも表示されません
            </li>
            <li>
              Org メンバーはベースパーミッションに応じて Org 内のリポジトリに広くアクセスでき、Team にも参加できます
            </li>
          </ul>

          <DetailTag className={subClass}>権限の付与方法</DetailTag>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>リポジトリごとに個別にアクセスレベル（Read / Write / Admin 等）を設定します</li>
            <li>
              Team に追加することはできません。Team のメンバーシップは <strong>Org メンバー</strong>に限定されます
            </li>
          </ul>

          <DetailTag className={subClass}>ライセンスコスト</DetailTag>
          <p className="mb-4">
            <strong>Private</strong> または <strong>Internal</strong> リポジトリに外部コラボレーターを追加すると、有料ライセンスを 1
            つ消費します（契約・プランの詳細は公式ドキュメントで確認してください）。
          </p>

          <DetailTag className={subClass}>SSO</DetailTag>
          <p>
            外部コラボレーターは <strong>SAML SSO</strong> を使って Organization のリソースにアクセスする<strong>必要がありません</strong>。Org
            メンバーとの大きな違いです。
          </p>
        </div>

        <div>
          {headingLevel === 'h2' ? (
            <h3 className={sectionClass}>典型的なユースケース</h3>
          ) : (
            <h4 className={sectionClass}>典型的なユースケース</h4>
          )}
          <ul className="list-disc list-inside space-y-2">
            <li>コンサルタントや一時的な従業員など、特定のリポジトリだけにアクセスが必要な場合</li>
            <li>外部ベンダーとの共同開発</li>
            <li>業務委託先への限定的なコードアクセス提供</li>
          </ul>
        </div>

        <div>
          {headingLevel === 'h2' ? (
            <h3 className={sectionClass}>メンバーから外部コラボレーターへの変換</h3>
          ) : (
            <h4 className={sectionClass}>メンバーから外部コラボレーターへの変換</h4>
          )}
          <p>
            既存の Org メンバーを外部コラボレーターに変換することもできます。変換すると、<strong>全 Team から削除</strong>され、<strong>直接追加されたリポジトリ</strong>へのアクセスのみ残ります。元のメンバー権限は<strong>3
            ヶ月間</strong>保存されるため、その間に再招待すれば復元可能です。
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/35">
          {headingLevel === 'h2' ? (
            <h3 className="text-lg font-semibold text-amber-950 dark:text-amber-100 mb-2">EMU 環境での注意</h3>
          ) : (
            <h4 className="text-lg font-semibold text-amber-950 dark:text-amber-100 mb-2">EMU 環境での注意</h4>
          )}
          <p className="text-amber-900 dark:text-amber-100">
            EMU 環境では「<strong>repository collaborator</strong>」という名称になり、<strong>Enterprise
            内のユーザーアカウント</strong>しか追加できません。Enterprise 外部の人をコラボレーターにすることはできないので、外部ベンダーとの協業には
            EMU は<strong>不向きな場合</strong>があります。
          </p>
        </div>
      </div>
    </section>
  );
}
