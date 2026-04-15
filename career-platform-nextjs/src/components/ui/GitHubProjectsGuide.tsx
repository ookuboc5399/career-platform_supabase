'use client';

import Image from 'next/image';

export default function GitHubProjectsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📋 GitHub Projects（プロジェクト）利用手順
      </h2>
      <p className="text-gray-600 mb-8">
        この手順は、Organization（または特定のリポジトリ）内に新しいプロジェクトを作成し、日々のタスクを管理可能な状態にするためのものです。
      </p>

      {/* サイドバーで設定できること */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          サイドバーで設定できること
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Projects の画面左側のサイドバーでは、以下の項目を切り替え・設定できます。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          プロジェクト一覧画面のサイドバー
        </h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            <strong>Projects（プロジェクト）:</strong> 組織内の全プロジェクト一覧を表示。アクティブなプロジェクトを選択して開きます。
          </li>
          <li>
            <strong>Templates（テンプレート）:</strong> 組織で共有するプロジェクトテンプレートの作成・管理。ワークフローを標準化する際に使用します。
          </li>
        </ul>

        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src="/images/github-projects/projects-landing.png"
            alt="GitHub Projects ランディング画面とサイドバー"
            width={800}
            height={500}
            className="w-full h-auto"
          />
        </div>

        <h4 className="text-lg font-medium text-gray-800 mt-8 mb-2">
          「Create project」モーダル内のサイドバー
        </h4>
        <p className="text-gray-600 mb-2">
          <strong>New project</strong> ボタンをクリックすると表示されるモーダルでは、左サイドバーで以下を選択できます。
        </p>

        <h5 className="text-base font-semibold text-gray-700 mt-4 mb-2">
          Project templates（プロジェクトテンプレート）
        </h5>
        <ul className="list-disc list-inside text-gray-600 mb-2 space-y-1">
          <li>
            <strong>Featured（おすすめ）:</strong> GitHubが厳選した高品質テンプレート。Team planning、Kanban、Feature release、Bug tracker などが含まれます。
          </li>
          <li>
            <strong>All templates（すべてのテンプレート）:</strong> 利用可能な全テンプレートの一覧。
          </li>
          <li>
            <strong>From your organization（組織のテンプレート）:</strong> 自組織で作成・共有したカスタムテンプレートを選択。組織内のワークフローを統一する際に使用します。
          </li>
        </ul>

        <h5 className="text-base font-semibold text-gray-700 mt-4 mb-2">
          Start from scratch（ゼロから開始）
        </h5>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            <strong>Table（テーブル）:</strong> スプレッドシート形式の空白プロジェクト。大量のタスクを一覧で管理するのに最適。
          </li>
          <li>
            <strong>Board（ボード）:</strong> カンバン形式の空白プロジェクト。Todo / In Progress / Done などの列でワークフローを可視化。
          </li>
          <li>
            <strong>Roadmap（ロードマップ）:</strong> ガントチャート形式の空白プロジェクト。スケジュールとマイルストーンを管理するのに最適。
          </li>
        </ul>

        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src="/images/github-projects/projects-templates.png"
            alt="Create project テンプレート選択画面"
            width={800}
            height={500}
            className="w-full h-auto"
          />
        </div>

        <h5 className="text-base font-semibold text-gray-700 mt-6 mb-2">
          プロジェクト作成時の設定項目（New table 選択時）
        </h5>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>
            <strong>Project name（プロジェクト名）:</strong> プロジェクトの名前を入力します。
          </li>
          <li>
            <strong>Import items from repository（リポジトリからアイテムをインポート）:</strong> チェックを入れると、既存のIssue/PRを自動でプロジェクトに取り込めます。
            <ul className="list-[circle] list-inside ml-4 mt-2 space-y-1">
              <li><strong>Open issues:</strong> オープンなIssueのみをインポート</li>
              <li><strong>Open pull requests:</strong> オープンなPRのみをインポート</li>
              <li><strong>Open issues and pull requests:</strong> 両方をインポート</li>
            </ul>
          </li>
          <li>
            <strong>from（リポジトリ）:</strong> インポート元のリポジトリを選択します。
          </li>
        </ul>

        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src="/images/github-projects/projects-create.png"
            alt="Create project 詳細設定画面"
            width={800}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* 手順1 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          手順
        </h3>
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          1. 新しいプロジェクトを作成する
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>GitHub上で、対象となる Organization（またはリポジトリ）のトップページを開きます。</li>
          <li>画面上部のタブメニューから <strong>Projects</strong> をクリックします。</li>
          <li>画面右側にある緑色の <strong>New project</strong> ボタンをクリックします。</li>
          <li>テンプレートの選択画面が表示されます。まずは標準的な <strong>Table</strong>（表形式）か <strong>Board</strong>（カンバン形式）を選択し、右下の <strong>Create</strong> をクリックします。</li>
        </ul>
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            ※作成後、左上の「Untitled project」をクリックして、分かりやすいプロジェクト名に変更しておきましょう。
          </p>
        </div>
      </section>

      {/* 手順2 */}
      <section className="mb-10">
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          2. プロジェクトにタスク（アイテム）を追加する
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>プロジェクト画面の下部にある <strong>+ Add item</strong> の入力欄をクリックします。</li>
          <li>以下のいずれかの方法でタスクを追加します。</li>
        </ul>
        <div className="ml-4 mt-2">
          <p className="text-gray-600 mb-1">
            <strong>既存のIssue/PRを紐づける:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">#</code>（シャープ）を入力すると、リポジトリ内の既存のIssueやPull Requestが候補として表示されるので、選択してEnterキーを押します。
          </p>
        </div>
      </section>

      {/* 手順3 */}
      <section className="mb-10">
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          3. ビュー（表示形式）を切り替える・追加する
        </h4>
        <p className="text-gray-600 mb-2">
          チームの目的に合わせて、タスクの表示方法をいつでも切り替えられます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>画面左上、現在のビューの名前（例：View 1）の右横にある <strong>▼（ドロップダウンメニュー）</strong> をクリックします。</li>
          <li><strong>Layout</strong> メニューから、以下の好きな形式に変更します。</li>
        </ul>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
          <li>
            <strong>Board（ボード）:</strong> Trelloのような直感的なカンバン形式。現在のステータス（Todo/In Progress/Done）をドラッグ＆ドロップで動かしたい時に最適です。
          </li>
          <li>
            <strong>Table（テーブル）:</strong> Excelのような一覧形式。複数のタスクの優先度や担当者を一気に編集・ソートしたい時に最適です。
          </li>
          <li>
            <strong>Roadmap（ロードマップ）:</strong> ガントチャート形式。期間（開始日・終了日）を設定してスケジュールを引く時に使います。
          </li>
        </ul>
      </section>

      {/* 手順4 */}
      <section className="mb-10">
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          4. カスタムフィールド（独自の管理項目）を作成する
        </h4>
        <p className="text-gray-600 mb-2">
          標準の「Status（状態）」や「Assignees（担当者）」以外に、自社独自の項目を追加できます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Tableビューの画面右端にある <strong>+（Add column）</strong> をクリックします。</li>
          <li>メニューの一番下にある <strong>New field</strong> を選択します。</li>
          <li>Field name（項目名、例：「優先度」「見積もり工数」など）を入力し、Field type（単一選択、数値、日付など）を選んで <strong>Save</strong> をクリックします。</li>
        </ul>
      </section>
    </article>
  );
}
