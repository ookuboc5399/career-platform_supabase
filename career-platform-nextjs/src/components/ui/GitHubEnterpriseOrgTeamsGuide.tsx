'use client';

export default function GitHubEnterpriseOrgTeamsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization の Teams</h2>
      <p className="text-gray-600 mb-8">
        Team は Organization メンバーのグループです。<strong>Team Maintainer</strong> がメンバーやリポジトリアクセスを管理し、リポジトリには Team 単位で権限を付与できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Team の作成</h3>
        <p className="text-gray-600 mb-4">
          Team を作成したユーザーは、通常その Team の <strong>Team Maintainer</strong> になります（設定により異なる場合があります）。
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Organization の <strong>Teams</strong> タブを開く</li>
          <li>
            <strong>New team</strong> を選択する
          </li>
          <li>Team 名・説明・可視性（Visible / Secret）などを入力して作成する</li>
          <li>一覧に Team が表示されることを確認する</li>
          <li>必要に応じてメンバーを追加する（次節）</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Team へのメンバー追加</h3>
        <p className="text-gray-600 mb-4 text-sm">Team Maintainer 権限を持つユーザーが実施します。</p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>対象 Team のページで <strong>Teams</strong> コンテキストを確認する</li>
          <li>
            <strong>Members</strong> または <strong>Add member</strong> に相当する操作を開く
          </li>
          <li>追加する Organization メンバーのユーザー名を入力して招待・追加する</li>
          <li>メンバー一覧に反映されたことを確認する</li>
        </ol>
        <p className="text-gray-600 mt-4 text-sm">
          メール招待のみのユーザーは、Organization に参加済みである必要があります。Enterprise では IdP 連携ポリシーに従ってください。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Team にリポジトリを紐づける</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Team ページの <strong>Repositories</strong> タブを開く</li>
          <li>
            <strong>Add repository</strong> を選択する
          </li>
          <li>リポジトリ名を検索し、付与するロール（Read / Triage / Write / Maintain / Admin）を選んで追加する</li>
          <li>一覧にリポジトリが表示され、意図した権限になっていることを確認する</li>
        </ol>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/organizations/organizing-members-into-teams/about-teams"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — Organization の Team について
          </a>
        </p>
      </div>
    </article>
  );
}
