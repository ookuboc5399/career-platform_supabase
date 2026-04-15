'use client';

/**
 * 管理画面で作成したチャプターと紐づく固定 ID。
 * チャプターを作り直した場合は DB の id とこの定数を揃えてください。
 */
export const GITHUB_COPILOT_ORG_LICENSE_ASSIGNMENT_CHAPTER_ID = 'github-1773730210830-spmg4sd';

export function isGithubCopilotOrgLicenseAssignmentChapterId(id: string): boolean {
  return id === GITHUB_COPILOT_ORG_LICENSE_ASSIGNMENT_CHAPTER_ID;
}

export default function GitHubCopilotOrgLicenseAssignmentGuide() {
  return (
    <article className="prose prose-gray max-w-none dark:prose-invert">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 not-prose">
        🐙 GitHub Copilot ライセンス付与手順（Organization 管理者向け）
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
        この手順は、Organization（組織）の Owner 権限を持つユーザーが、メンバーに GitHub Copilot
        のシート（ライセンス）を割り当てるためのものです。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">前提条件</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>ご自身のアカウントが対象 Organization の Owner 権限を持っていること。</li>
          <li>
            Organization において、すでに GitHub Copilot Business または Enterprise のサブスクリプション契約が完了していること。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">手順</h3>

        <div className="space-y-8 not-prose">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              1. Organization の設定画面を開く
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li>GitHub にログインし、画面右上の自分のプロフィールアイコンをクリックします。</li>
              <li>ドロップダウンメニューから <strong>Your organizations</strong> を選択します。</li>
              <li>ライセンスを付与したい <strong>Organization の名前</strong> をクリックします。</li>
              <li>
                Organization のトップページが表示されたら、右上にある <strong>Settings</strong>（歯車アイコン）をクリックします。
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              2. Copilot のアクセス管理画面へ移動する
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li>設定画面の左側にあるサイドバーを少し下にスクロールします。</li>
              <li>
                <strong>Code, planning, and automation</strong> というセクション内にある <strong>Copilot</strong>{' '}
                をクリックします。
              </li>
              <li>展開されたメニューの中から <strong>Access</strong> をクリックします。</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              3. メンバーにライセンスを割り当てる
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li>
                画面右側に Copilot のアクセス管理に関する設定が表示されます。<strong>User management</strong>{' '}
                などの項目を確認してください。
              </li>
              <li>
                アクセスの許可設定（<strong>Copilot is active for...</strong>）で、以下のいずれかを選択します。
              </li>
            </ul>
            <ul className="list-disc list-outside ml-5 mt-3 text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li>
                <strong>All members：</strong>
                Organization に所属する全員に一括で付与する場合（これを選ぶと個別作業は不要です）。
              </li>
              <li>
                <strong>Selected members：</strong>
                特定のユーザーやチームにのみ個別に付与する場合。（※通常はこちらを使用することが多いです）
              </li>
            </ul>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2 mt-4">
              <li>
                <strong>Selected members</strong> を選択している場合、すぐ下にユーザーやチームを検索するバーが表示されます。
              </li>
              <li>
                検索バー（&quot;Add users or teams...&quot; など）に、付与したいメンバーの{' '}
                <strong>GitHub ユーザー名（またはチーム名）</strong> を入力します。
              </li>
              <li>候補が表示されたら選択し、<strong>Add</strong>（または <strong>Assign</strong>）ボタンをクリックして完了です。</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10 not-prose rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 p-5">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Team 単位のシート割り当て（メンバー追加で自動付与）
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          Copilot の設定で、例として <strong>James Cook Team</strong> のような <strong>Team</strong> にシート割り当てをしておくと、
          その Team にユーザーが追加された時点で<strong>自動的に Copilot ライセンスが付与</strong>されます。個別ユーザーではなく Team
          を登録しておく運用にすると、オンボーディングが簡単になります。
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">具体的な設定手順</p>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2 mb-4">
          <li>
            <strong>Organization Settings</strong> → <strong>Copilot</strong> → <strong>Access</strong> を開く
          </li>
          <li>
            <strong>Enabled for: Selected members</strong>（または同等の「選択したメンバーのみ」）を選択する
          </li>
          <li>対象の <strong>Team</strong> を Copilot のシート割り当てに追加する（検索バーから Team 名で追加）</li>
        </ol>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          この状態にしておけば、以降はその Team にメンバーを追加するだけで Copilot が使えるようになります。
          <strong>Team からメンバーを外せば、シートの割り当ても解除</strong>されます（利用可能なシートが Organization に戻るイメージです）。
        </p>
      </section>
    </article>
  );
}
