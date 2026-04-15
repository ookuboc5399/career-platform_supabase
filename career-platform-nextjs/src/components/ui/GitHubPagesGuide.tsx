'use client';

import Image from 'next/image';

export default function GitHubPagesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🌐 GitHub Pages（静的サイトホスティング）とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Pages は、GitHubのリポジトリにプッシュされた静的ファイル（HTML、CSS、JavaScriptなど）を、そのままWebサイトとして公開・ホスティングしてくれるサービスです。
      </p>

      {/* 主な機能とメリット */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主な機能とメリット
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              サーバー構築・保守が一切不要
            </h4>
            <p className="text-gray-600">
              リポジトリの設定を数回クリックするだけで、HTTPS化されたWebサイトが即座に立ち上がります。インフラの管理コストはゼロです。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              CI/CD（GitHub Actions）とのシームレスな連携
            </h4>
            <p className="text-gray-600">
              単純なHTMLだけでなく、React、Vue.js、Next.js（静的エクスポート）、Hugoといったモダンなフレームワークを使ったサイトも、GitHub Actionsのワークフローを使って自動ビルド＆自動デプロイが可能です。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              Enterpriseならではの「アクセス制限（Private Pages）」
            </h4>
            <p className="text-gray-600">
              通常のGitHub Pagesはインターネット全体に公開されますが、GitHub Enterprise Cloudを利用している場合、「Organizationの所属メンバーしかアクセスできないWebサイト」を構築できます。これにより、機密性の高い社内限定のドキュメントポータルや設計書を安全にホスティングできます。
            </p>
          </div>
        </div>
      </section>

      {/* 公開手順 */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 GitHub Pages 公開手順（基本編）
        </h3>
        <p className="text-gray-600 mb-4">
          ここでは最もシンプルな、リポジトリ内のHTMLファイルをそのまま公開する手順を解説します。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          前提条件
        </h4>
        <p className="text-gray-600 mb-6">
          対象のリポジトリに、トップページとなる <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">index.html</code> ファイルがプッシュされていること。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          手順
        </h4>

        <div className="space-y-6">
          <div>
            <h5 className="text-base font-semibold text-gray-800 mb-2">
              1. リポジトリのPages設定画面を開く
            </h5>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>GitHub上で、公開したいWebサイトのファイルが入っている リポジトリのトップページ を開きます。</li>
              <li>画面上部のタブメニューから <strong>Settings</strong>（歯車アイコン）をクリックします。</li>
              <li>左側のサイドバーを下にスクロールし、「Code and automation」セクション内の <strong>Pages</strong> をクリックします。</li>
            </ul>
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src="/images/github-pages/github-pages-settings.png"
                alt="GitHub Pages 設定画面"
                width={800}
                height={450}
                className="w-full h-auto"
              />
            </div>
            <div className="mt-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>① Organizationのポリシーにおいて</strong> Organization設定でPages自体が制限されていると、InternalではPagesが有効化できません。
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-base font-semibold text-gray-800 mb-2">
              2. 公開元（Source）を設定する
            </h5>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>「Build and deployment」という項目の下にある <strong>Source</strong> のプルダウンメニューをクリックします。</li>
              <li><strong>Deploy from a branch</strong>（ブランチからデプロイ）を選択します。</li>
              <li>その下に現れる <strong>Branch</strong> のセクションで、公開したいファイルがあるブランチ（例：main）を選択します。</li>
              <li>ブランチの横にあるフォルダ選択のプルダウンで、ファイルが存在する場所（リポジトリの直下なら <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">/ (root)</code>、docsフォルダ内なら <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">/docs</code>）を選択します。</li>
              <li><strong>Save</strong>（保存）ボタンをクリックします。</li>
            </ul>
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src="/images/github-pages/github-pages-source.png"
                alt="Build and deployment の Source 設定"
                width={800}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div>
            <h5 className="text-base font-semibold text-gray-800 mb-2">
              3. Webサイトへのアクセスを確認する
            </h5>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>保存ボタンを押すと、バックグラウンドで自動的にデプロイ（公開準備）が開始されます。</li>
              <li>そのままの画面で数分待ち、ページを再読み込み（リロード）します。</li>
              <li>デプロイが完了すると、画面上部に &quot;Your site is live at https://[組織名].github.io/[リポジトリ名]/&quot; というメッセージとURLが表示されます。</li>
              <li><strong>Visit site</strong> ボタン、または表示されているURLをクリックして、Webサイトが正しく表示されるか確認します。</li>
            </ul>
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src="/images/github-pages/github-pages-live.png"
                alt="GitHub Pages デプロイ完了画面"
                width={800}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
