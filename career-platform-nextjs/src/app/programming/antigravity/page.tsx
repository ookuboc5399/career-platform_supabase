'use client';

import Link from 'next/link';
import { useState } from 'react';

/** 画像表示（public/images/ 以下に配置。例: antigravity/report-mistake.png） */
function CodelabImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const imgPath = `/images/${src}`;

  if (error) {
    return (
      <div className="my-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          [画像: {alt}] — <code className="bg-gray-200 px-1 rounded">{src}</code> を <code className="bg-gray-200 px-1 rounded">public/images/</code> に配置してください
        </p>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgPath}
        alt={alt}
        className="w-full h-auto max-w-2xl object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function AntigravityCodelabPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Link
          href="/programming"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          プログラミングに戻る
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Google Antigravity のスタートガイド</h1>
      </div>

      <article className="prose prose-gray max-w-none space-y-12">
        {/* 1. はじめに */}
        <section id="section-1">
          <h2 className="text-2xl font-bold border-b pb-2">1. はじめに</h2>
          <p>
            この Codelab では、IDE をエージェント ファーストの時代へと進化させるエージェント型開発プラットフォームである Google Antigravity（以降、このドキュメントでは Antigravity と表記）について説明します。
          </p>
          <p>
            行を自動補完するだけの標準的なコーディング アシスタントとは異なり、Antigravity には、計画、コーディング、ウェブの閲覧まで行える自律型エージェントを管理するための「ミッション コントロール」が用意されています。
          </p>
          <p>
            Antigravity はエージェント ファーストのプラットフォームとして設計されています。これは、AI がコードを記述するツールではなく、人間の介入を最小限に抑えながら複雑なエンジニアリング タスクを計画、実行、検証、反復できる自律的なアクターであることを前提としています。
          </p>

          <h3 className="text-xl font-semibold mt-6">学習内容</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Antigravity のインストールと構成。</li>
            <li>エージェント マネージャー、エディタ、ブラウザなど、Antigravity の主要なコンセプトについて説明します。</li>
            <li>独自のルールとワークフローによる Antigravity のカスタマイズとセキュリティに関する考慮事項。</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">必要なもの</h3>
          <p>
            現在、Antigravity は個人用の Gmail アカウントでプレビュー版としてご利用いただけます。最上位モデルを使用するための無料割り当てが付属しています。
          </p>
          <p>
            Antigravity はシステムにローカルにインストールする必要があります。このプロダクトは、Mac、Windows、特定の Linux ディストリビューションで利用できます。ご自身のパソコンに加えて、次のものが必要です。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chrome ウェブブラウザ</li>
            <li>Gmail アカウント（個人用 Gmail アカウント）。</li>
          </ul>
          <p>この Codelab は、初心者を含むあらゆるレベルのユーザーとデベロッパーを対象としています。</p>
          <p>
            <strong>Google Cloud クレジットの場合:</strong> Google Cloud プロジェクトで Antigravity を使用できるように、こちらのリンクを使用して無料の Google Cloud クレジットを利用してください。クレジットを有効にして新しいプロジェクトを作成するには、こちらの手順に沿って操作してください。
          </p>

          <h3 className="text-xl font-semibold mt-6">問題を報告する</h3>
          <p>この Codelab で Antigravity を使用する際に、問題が発生する可能性があります。</p>
          <p>
            Codelab 関連の問題（誤字脱字、誤った手順）については、この Codelab の左下にある <code className="bg-gray-100 px-1 rounded">Report a mistake</code> ボタンを使用してバグを報告してください。
          </p>
          <CodelabImage src="antigravity/report-mistake.png" alt="Report a mistake ボタン" />
          <p>
            Antigravity に関連するバグや機能リクエストについては、Antigravity 内で問題を報告してください。これは、左下隅の <code className="bg-gray-100 px-1 rounded">Provide Feedback</code> リンクを使用して、エージェント マネージャーで行うことができます。
          </p>
          <CodelabImage src="antigravity/provide-feedback.png" alt="Provide Feedback リンク" />
          <p>プロフィール アイコンの下にある <code className="bg-gray-100 px-1 rounded">Report Issue</code> リンクからエディタに移動することもできます。</p>
          <CodelabImage src="antigravity/report-issue.png" alt="Report Issue リンク" />
        </section>

        {/* 2. インストール */}
        <section id="section-2">
          <h2 className="text-2xl font-bold border-b pb-2">2. インストール</h2>
          <p>
            Antigravity がまだインストールされていない場合は、まず Antigravity をインストールします。現在、このプロダクトはプレビュー版として提供されており、個人の Gmail アカウントを使用して開始できます。
          </p>
          <p>
            ダウンロード ページに移動し、ケースに該当するオペレーティング システムのバージョンをクリックします。アプリケーション インストーラを起動し、マシンにインストールします。インストールが完了したら、Antigravity アプリケーションを起動します。次のような画面が表示されます。
          </p>
          <CodelabImage src="antigravity/install-welcome.png" alt="インストール後のウェルカム画面" />
          <p>
            <code className="bg-gray-100 px-1 rounded">Next</code> をクリックして続行してください。主な手順は次のとおりです。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Choose setup flow:</strong> 既存の VS Code または Cursor の設定からインポートするオプションが表示されます。最初からやり直します。</li>
            <li><strong>エディタのテーマの種類を選択する:</strong> ここではダークテーマを選択しますが、お好みで選択してください。</li>
            <li><strong>Antigravity エージェントをどのように使用しますか？</strong></li>
          </ul>
          <CodelabImage src="antigravity/setup-options.png" alt="Antigravity エージェントの使用オプション" />
          <p>もう少し詳しく見ていきましょう。設定は、Antigravity のユーザー設定（<code className="bg-gray-100 px-1 rounded">Cmd + ,</code>）でいつでも変更できます。</p>
          <p>オプションの詳細に入る前に、いくつかの特定のプロパティ（ダイアログの右側に表示されます）を見てみましょう。</p>

          <h4 className="text-lg font-semibold mt-4">ターミナル実行ポリシー</h4>
          <p>これは、エージェントにターミナルでコマンド（アプリケーション/ツール）を実行する権限を付与することに関するものです。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>常に続行:</strong> ターミナル コマンドを常に自動実行します（構成可能な拒否リストにあるコマンドを除く）。</li>
            <li><strong>レビューをリクエスト:</strong> ターミナル コマンドを実行する前に、ユーザーのレビューと承認をリクエストします。</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">確認に関するポリシー</h4>
          <p>エージェントはタスクを実行する際に、さまざまなアーティファクト（タスクプラン、実装プランなど）を作成します。審査ポリシーは、審査が必要かどうかを判断するユーザーを決定できるように設定されています。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>常に続行:</strong> エージェントは審査をリクエストしません。</li>
            <li><strong>エージェントが決定:</strong> エージェントが審査をリクエストするタイミングを決定します。</li>
            <li><strong>審査をリクエスト:</strong> エージェントは常に審査をリクエストします。</li>
          </ul>

          <h4 className="text-lg font-semibold mt-4">JavaScript 実行ポリシー</h4>
          <p>有効にすると、エージェントはブラウザツールを使用して URL を開き、ウェブページを読み取り、ブラウザ コンテンツを操作できます。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>常に続行:</strong> エージェントは、ブラウザで JavaScript を実行する権限を求めるために停止しません。</li>
            <li><strong>レビューをリクエスト:</strong> エージェントは、ブラウザで JavaScript コードを実行する権限を求めるために、常に停止します。</li>
            <li><strong>無効:</strong> エージェントはブラウザで JavaScript コードを実行しません。</li>
          </ul>

          <p className="mt-4">
            次の 4 つのオプションがあります。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>セキュア モード:</strong> セキュア モードでは、エージェントのセキュリティ制御が強化され、外部リソースや機密性の高いオペレーションへのアクセスを制限できます。</li>
            <li><strong>レビュー主導の開発（推奨）:</strong> エージェントは頻繁にレビューを求めます。</li>
            <li><strong>エージェント主導の開発:</strong> エージェントはレビューをリクエストしません。</li>
            <li><strong>カスタム構成</strong></li>
          </ul>
          <p><strong>レビュー主導の開発</strong>オプションは、エージェントが決定を下し、ユーザーに承認を求めることができるため、バランスがよく、推奨されるオプションです。</p>
          <p>次は <strong>エディタを設定</strong> 設定ページです。ここでは、キー バインディング、拡張機能、コマンドライン（<code className="bg-gray-100 px-1 rounded">agy</code> で Antigravity を開く）を選択できます。</p>
          <p>これで、<strong>Google にログイン</strong>する準備が整いました。個人用の Gmail アカウントをお持ちの場合は、プレビュー モードで Antigravity を無料でご利用いただけます。<strong>アカウントで今すぐログインしてください。</strong></p>
          <p>最後に、<strong>利用規約</strong>。オプトインするかどうかを決定し、<code className="bg-gray-100 px-1 rounded">Next</code> をクリックします。</p>
          <p>この瞬間が真実の瞬間であり、Antigravity があなたとのコラボレーションを待っています。</p>
        </section>

        {/* 3. エージェント マネージャー */}
        <section id="section-3">
          <h2 className="text-2xl font-bold border-b pb-2">3. エージェント マネージャー</h2>
          <p>準備が整いました。</p>
          <p>
            Antigravity は、オープンソースの Visual Studio Code（VS Code）の基盤をフォークしますが、ユーザー エクスペリエンスを大幅に変更して、テキスト編集よりもエージェント管理を優先します。インターフェースは、<code className="bg-gray-100 px-1 rounded">Editor</code> と <code className="bg-gray-100 px-1 rounded">Agent Manager</code> の 2 つの異なるメイン ウィンドウに分かれています。
          </p>

          <h3 className="text-xl font-semibold mt-6">エージェント マネージャー: ミッション コントロール</h3>
          <p>Antigravity を起動すると、通常はファイル ツリーではなく、次のようなエージェント マネージャーが表示されます。</p>
          <CodelabImage src="antigravity/agent-manager.png" alt="エージェント マネージャー画面" />
          <p>
            このインターフェースは <code className="bg-gray-100 px-1 rounded">Mission Control</code> ダッシュボードとして機能します。デベロッパーはさまざまなワークスペースやタスクで非同期に動作する複数のエージェントを生成、モニタリング、操作できます。
          </p>
          <p>このビューでは、デベロッパーはアーキテクトとして機能します。大まかな目標を定義します。たとえば：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>認証モジュールをリファクタリングする</li>
            <li>依存関係ツリーを更新する</li>
            <li>課金 API のテストスイートを生成する</li>
          </ul>
          <p>これらのリクエストごとに専用のエージェント インスタンスが生成されます。UI には、各エージェントのステータス、生成されたアーティファクト（プラン、結果、差分）、人間による承認待ちのリクエストが表示されます。</p>
          <p>上記の <code className="bg-gray-100 px-1 rounded">Next</code> をクリックすると、ワークスペースを開くオプションが表示されます。</p>
          <CodelabImage src="antigravity/workspace-select.png" alt="ワークスペース選択" />
          <p>ボタンをクリックしてフォルダを選択すると、ローカル フォルダを開くことができます。この手順は完全にスキップすることもできます。ワークスペースは後でいつでも開くことができます。</p>
          <CodelabImage src="antigravity/agent-manager-window.png" alt="エージェント マネージャー ウィンドウ" />
          <p><code className="bg-gray-100 px-1 rounded">Planning</code> と <code className="bg-gray-100 px-1 rounded">Model Selection</code> の両方のプルダウンを確認してください。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Planning:</strong> エージェントはタスクを実行する前に計画を立てることができます。詳細な調査、複雑なタスク、共同作業に使用します。</li>
            <li><strong>Fast:</strong> エージェントがタスクを直接実行します。変数の名前変更、いくつかの bash コマンドの開始など、より迅速に完了できる簡単なタスクに使用します。</li>
          </ul>
          <p>Agent Manager ウィンドウの構成要素：</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Inbox:</strong> すべての会話を 1 か所で追跡します。</li>
            <li><strong>Start Conversation:</strong> 新しい会話を開始します。</li>
            <li><strong>Workspaces:</strong> 任意のワークスペースで作業できます。</li>
            <li><strong>Playground:</strong> エージェントとの会話を簡単に開始し、その会話をワークスペースに変換できます。</li>
            <li><strong>Editor View:</strong> ワークスペース フォルダと生成されたファイルが表示されます。</li>
            <li><strong>Browser:</strong> Chrome ブラウザとの緊密な統合。</li>
          </ol>
        </section>

        {/* 4. Antigravity ブラウザ */}
        <section id="section-4">
          <h2 className="text-2xl font-bold border-b pb-2">4. Antigravity ブラウザ</h2>
          <p>
            エージェントがブラウザとやり取りする必要がある場合、ブラウザ サブエージェントを呼び出して、当面のタスクを処理します。このサブエージェントは、クリック、スクロール、入力、コンソールログの読み取りなど、ブラウザの制御に必要なさまざまなツールにアクセスできます。また、DOM キャプチャ、スクリーンショット、マークダウン解析を通じて開いているページを読み取ったり、動画を撮影したりすることもできます。
          </p>
          <p>Antigravity ブラウザ拡張機能を起動してインストールする必要があります。<code className="bg-gray-100 px-1 rounded">Playground</code> で会話を開始し、<code className="bg-gray-100 px-1 rounded">go to antigravity.google</code> のようなタスクをエージェントに付与します。</p>
          <CodelabImage src="antigravity/playground-task.png" alt="Playground でタスク送信" />
          <p><strong>タスクを送信</strong>します。しばらくすると、ブラウザ エージェントの設定が必要であることを示すメッセージが表示されます。<code className="bg-gray-100 px-1 rounded">Setup</code> をクリックします。</p>
          <CodelabImage src="antigravity/browser-setup.png" alt="ブラウザ エージェントのセットアップ" />
          <p>ブラウザが起動し、拡張機能をインストールするメッセージが表示されます。<strong>続行</strong>をクリックすると、インストール可能な Chrome 拡張機能が表示されます。</p>
          <CodelabImage src="antigravity/chrome-extension.png" alt="Chrome 拡張機能のインストール" />
          <p>拡張機能を正常にインストールすると、Antigravity Agent が動作を開始し、タスクを実行するための権限を許可するよう求めるメッセージが表示されます。</p>
          <CodelabImage src="antigravity/browser-activity.png" alt="ブラウザでのアクティビティ" />
          <CodelabImage src="antigravity/antigravity-website.png" alt="antigravity.google ウェブサイト" />
        </section>

        {/* 5. アーティファクト */}
        <section id="section-5">
          <h2 className="text-2xl font-bold border-b pb-2">5. アーティファクト</h2>
          <p>
            Antigravity は、作業を計画して実行する際に、作業を伝達して人間ユーザーからフィードバックを得る手段として<strong>アーティファクト</strong>を作成します。リッチ マークダウン ファイル、アーキテクチャ図、画像、ブラウザの録画、コードの差分などがあります。
          </p>
          <p>アーティファクトは「信頼のギャップ」を解消します。エージェントが「バグを修正しました」と主張した場合、以前はデベロッパーがコードを読んで確認する必要がありました。Antigravity では、エージェントがそれを証明するアーティファクトを生成します。</p>
          <p>Antigravity によって生成される主なアーティファクトは次のとおりです。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Task Lists:</strong> コードを記述する前に、エージェントが構造化されたプランを生成します。</li>
            <li><strong>Implementation Plan:</strong> コードベース内の変更を設計してタスクを完了するために使用されます。</li>
            <li><strong>Walkthrough:</strong> エージェントがタスクの実装を完了すると、変更の概要とテスト方法がまとめられたものが作成されます。</li>
            <li><strong>Code diffs:</strong> レビューとコメントが可能なコード差分。</li>
            <li><strong>Screenshots:</strong> エージェントは、変更前後の UI の状態をキャプチャします。</li>
            <li><strong>Browser Recordings:</strong> 動的なインタラクションの場合、エージェントはセッションの動画を録画します。</li>
          </ul>
          <CodelabImage src="antigravity/artifacts-view.png" alt="アーティファクト ビュー" />
        </section>

        {/* 6. 受信トレイを再確認する */}
        <section id="section-6">
          <h2 className="text-2xl font-bold border-b pb-2">6. 受信トレイを再確認する</h2>
          <p>エージェントとの会話をいくつか開始したら、<code className="bg-gray-100 px-1 rounded">Agent Manager</code> ウィンドウで <code className="bg-gray-100 px-1 rounded">Inbox</code> を確認します。すべての会話が表示されます。いずれかの会話をクリックすると、その会話の履歴や生成されたアーティファクトなどを確認できます。ここから会話を続けることもできます。</p>
          <CodelabImage src="antigravity/inbox.png" alt="受信トレイ" />
          <CodelabImage src="antigravity/inbox-detail.png" alt="会話の詳細" />
        </section>

        {/* 7. 編集者 */}
        <section id="section-7">
          <h2 className="text-2xl font-bold border-b pb-2">7. 編集者</h2>
          <p>エディタは VS Code の使い慣れた操作性を維持しているため、熟練したデベロッパーの筋肉記憶を尊重できます。標準のファイル エクスプローラ、構文ハイライト表示、拡張機能エコシステムが含まれています。</p>
          <p>エージェント マネージャーの右上にある <code className="bg-gray-100 px-1 rounded">Open Editor</code> ボタンをクリックすると、エディタに移動できます。</p>
          <h3 className="text-xl font-semibold mt-6">セットアップと拡張機能</h3>
          <p>一般的な設定では、エディタ、ターミナル、エージェントが表示されます。ターミナル パネルは <code className="bg-gray-100 px-1 rounded">Ctrl + `</code>、エージェント パネルは <code className="bg-gray-100 px-1 rounded">Cmd + L</code> で切り替えられます。</p>
          <h3 className="text-xl font-semibold mt-6">予測入力・インポートするタブ・Tab キーでジャンプ</h3>
          <p>エディタでコードを入力すると、スマートなオートコンプリートが起動し、タブで簡単に挿入できます。不足している依存関係を追加するための <strong>tab to import</strong> の提案が表示されます。<strong>タブでジャンプ</strong>の候補で、コード内の次の論理的な場所にカーソルを移動できます。</p>
          <h3 className="text-xl font-semibold mt-6">コマンド</h3>
          <p>エディタまたはターミナルで <code className="bg-gray-100 px-1 rounded">Cmd + I</code> を使用してコマンドをトリガーし、自然言語を使用したインライン補完を行うことができます。</p>
          <h3 className="text-xl font-semibold mt-6">エージェント サイドパネル</h3>
          <p>右側にあるエージェント パネルは、<code className="bg-gray-100 px-1 rounded">Cmd + L</code> ショートカットで手動で切り替えることができます。質問を開始し、<code className="bg-gray-100 px-1 rounded">@</code> を使用してファイル、ディレクトリ、MCP サーバーなどのコンテキストを追加したり、<code className="bg-gray-100 px-1 rounded">/</code> を使用してワークフロー（保存されたプロンプト）を参照したりできます。</p>
          <p><code className="bg-gray-100 px-1 rounded">Fast</code> は簡単なタスクにおすすめです。<code className="bg-gray-100 px-1 rounded">Planning</code> は、エージェントが作成したプランを承認できる複雑なタスクにおすすめです。</p>
          <p>問題にカーソルを合わせて <code className="bg-gray-100 px-1 rounded">Explain and fix</code> を選択する方法もあります。<code className="bg-gray-100 px-1 rounded">Problems</code> セクションから <code className="bg-gray-100 px-1 rounded">Send all to Agent</code> を選択し、エージェントに問題の解決を試みさせることもできます。ターミナル出力の一部を選択して、<code className="bg-gray-100 px-1 rounded">Cmd + L</code> でエージェントに送信することもできます。</p>
          <p><code className="bg-gray-100 px-1 rounded">Cmd + E</code> キーボード ショートカットでエディタ モードとエージェント マネージャー モードを切り替えることができます。</p>
        </section>

        {/* 8. フィードバックを送信する */}
        <section id="section-8">
          <h2 className="text-2xl font-bold border-b pb-2">8. フィードバックを送信する</h2>
          <p>Antigravity の中心となるのは、エクスペリエンスのあらゆる段階でフィードバックを簡単に収集できる機能です。エージェントがタスクを処理する過程で、さまざまなアーティファクトが作成されます。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>実装計画とタスクリスト（コーディング前）</li>
            <li>コードの差分（コードの生成時）</li>
            <li>結果を確認する手順（コーディング後）</li>
          </ul>
          <p>これらのアーティファクトは、Antigravity が計画と進捗状況を伝えるための手段です。また、Google ドキュメントのコメント形式でエージェントにフィードバックを提供することもできます。</p>
          <p>簡単な ToDo リスト アプリケーションを作成しながら、Antigravity にフィードバックを送信する方法を見てみましょう。</p>
          <p>まず、Antigravity が <code className="bg-gray-100 px-1 rounded">Fast</code> モードではなく <code className="bg-gray-100 px-1 rounded">Planning</code> モードになっていることを確認します。次に、<code className="bg-gray-100 px-1 rounded">Create a todo list web app using Python</code> のようなプロンプトを試します。</p>
          <p>実装計画にコメントを追加して、代わりに FastAPI を使用するよう依頼できます。タスクリストにコメントを追加して、より詳細な確認手順を追加することもできます。</p>
          <p>コード変更では、<code className="bg-gray-100 px-1 rounded">Review changes</code> をクリックして変更の詳細を確認し、コードに関する詳細なコメントを追加できます。ウォークスルーでは、スクリーンショットやブラウザの録画にコメントすることもできます。</p>
          <p>各ステップの後に変更に満足できない場合は、チャットで <code className="bg-gray-100 px-1 rounded">Undo changes up to this point</code> を選択して変更を元に戻すことができます。</p>
        </section>

        {/* 9. ルールとワークフロー */}
        <section id="section-9">
          <h2 className="text-2xl font-bold border-b pb-2">9. ルールとワークフロー</h2>
          <p>Antigravity には、<strong>ルール</strong>と<strong>ワークフロー</strong>の 2 つのカスタマイズ オプションがあります。エディタモードで、右上隅の <code className="bg-gray-100 px-1 rounded">...</code> をクリックして <code className="bg-gray-100 px-1 rounded">Customizations</code> を選択すると、<code className="bg-gray-100 px-1 rounded">Rules</code> と <code className="bg-gray-100 px-1 rounded">Workflows</code> が表示されます。</p>
          <p><strong>ルール</strong>は、エージェントがコードとテストを生成する際に従うように指定できるガイドラインです。<strong>ワークフロー</strong>は、<code className="bg-gray-100 px-1 rounded">/</code> でオンデマンドでトリガーできる保存済みのプロンプトです。</p>
          <p>ルールとワークフローは、次の場所に保存できます。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>グローバル ルール: <code className="bg-gray-100 px-1 rounded">~/.gemini/GEMINI.md</code></li>
            <li>グローバル ワークフロー: <code className="bg-gray-100 px-1 rounded">~/.gemini/antigravity/global_workflows/global-workflow.md</code></li>
            <li>ワークスペース ルール: <code className="bg-gray-100 px-1 rounded">your-workspace/.agent/rules/</code></li>
            <li>Workspace ワークフロー: <code className="bg-gray-100 px-1 rounded">your-workspace/.agent/workflows/</code></li>
          </ul>
          <p>例：<code className="bg-gray-100 px-1 rounded">code-style-guide</code> ルールで PEP 8 スタイルガイドと適切なコメントを指定。<code className="bg-gray-100 px-1 rounded">generate-unit-tests</code> ワークフローで単体テストを生成。チャットで <code className="bg-gray-100 px-1 rounded">/generate</code> と入力すると、ワークフローをトリガーできます。</p>
        </section>

        {/* 10. スキル */}
        <section id="section-10">
          <h2 className="text-2xl font-bold border-b pb-2">10. スキル</h2>
          <p>Antigravity の基盤となるモデル（Gemini など）は強力な汎用モデルですが、特定のプロジェクトのコンテキストやチームの標準を把握しているわけではありません。Antigravity Skills は、漸進的開示によってこの問題を解決します。<strong>スキル</strong>は、必要になるまで休眠状態にある専門知識のパッケージです。特定のリクエストがスキルの説明と一致した場合にのみ、エージェントのコンテキストに読み込まれます。</p>
          <p>スキルは次の 2 つのスコープで定義できます。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>グローバル スコープ（<code className="bg-gray-100 px-1 rounded">~/.gemini/antigravity/skills/</code>）</li>
            <li>ワークスペース スコープ（<code className="bg-gray-100 px-1 rounded">&lt;workspace-root&gt;/.agent/skills/</code>）</li>
          </ul>
          <p>スキルの構造例：</p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`my-skill/
├── SKILL.md    # (Required) metadata & instructions.
├── scripts/    # (Optional) Python or Bash scripts
├── references/ # (Optional) text, documentation, or templates.
└── assets/     # (Optional) Images or logos.`}
          </pre>
          <p>例：<code className="bg-gray-100 px-1 rounded">code-review</code> スキルでコード変更をレビュー。<code className="bg-gray-100 px-1 rounded">license-header-adder</code> スキルで新しいソースファイルにライセンス ヘッダーを追加。</p>
        </section>

        {/* 11. エージェントの保護 */}
        <section id="section-11">
          <h2 className="text-2xl font-bold border-b pb-2">11. エージェントの保護</h2>
          <p>AI エージェントにターミナルとブラウザへのアクセス権を付与することは、両刃の剣です。Antigravity は、ターミナル コマンドの自動実行ポリシー、許可リスト、拒否リストを中心としたきめ細かい権限システムを通じて、この問題に対処します。</p>
          <p><code className="bg-gray-100 px-1 rounded">Terminal Command Auto Execution</code> ポリシー：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>オフ:</strong> エージェントは、明示的に許可されない限り、ターミナル コマンドを自動的に実行しません。</li>
            <li><strong>自動:</strong> エージェントは、内部の安全性モデルに基づいて実行するかどうかを決定します。</li>
            <li><strong>ターボ:</strong> エージェントは、明示的に拒否されない限り、常にコマンドを自動的に実行します。</li>
          </ul>
          <p><strong>許可リスト</strong>は、オフ ポリシーで使用されます。明示的に許可されていない限り、すべてが禁止されます。<strong>拒否リスト</strong>は、ターボ ポリシーの保護機能です。rm、sudo、curl、wget などを拒否リストに追加できます。</p>
          <p>ブラウザのセキュリティとして、<strong>ブラウザ URL 許可リスト</strong>を実装し、信頼できるドメインのみにアクセスを制限できます。<code className="bg-gray-100 px-1 rounded">HOME/.gemini/antigravity/browserAllowlist.txt</code> で設定します。</p>
        </section>

        {/* 12. まとめと次のステップ */}
        <section id="section-12">
          <h2 className="text-2xl font-bold border-b pb-2">12. まとめと次のステップ</h2>
          <p>おめでとうございます！これで、Antigravity のインストール、環境の構成、エージェントの制御方法を習得できました。</p>
          <h3 className="text-xl font-semibold mt-6">次のステップ</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Antigravity を使用したビルド: 動的な会議用ウェブサイトや生産性向上アプリなど、いくつかのアプリケーションを構築する方法を示します。</li>
            <li>Antigravity を使用して Google Cloud にビルドしてデプロイする: サーバーレス アプリケーションを設計、ビルドして Google Cloud にデプロイする方法について説明します。</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6">リファレンス ドキュメント</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>公式サイト: <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://antigravity.google/</a></li>
            <li>ドキュメント: <a href="https://antigravity.google/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://antigravity.google/docs</a></li>
            <li>ユースケース: <a href="https://antigravity.google/use-cases" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://antigravity.google/use-cases</a></li>
            <li>ダウンロード: <a href="https://antigravity.google/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://antigravity.google/download</a></li>
            <li>YouTube チャンネル: <a href="https://www.youtube.com/@googleantigravity" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.youtube.com/@googleantigravity</a></li>
          </ul>
        </section>
      </article>

      {/* セクション目次（サイドナビ） */}
      <nav className="mt-12 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">目次</h3>
        <ol className="list-decimal pl-6 space-y-1 text-sm">
          {[
            'はじめに',
            'インストール',
            'エージェント マネージャー',
            'Antigravity ブラウザ',
            'アーティファクト',
            '受信トレイを再確認する',
            '編集者',
            'フィードバックを送信する',
            'ルールとワークフロー',
            'スキル',
            'エージェントの保護',
            'まとめと次のステップ',
          ].map((title, i) => (
            <li key={i}>
              <a href={`#section-${i + 1}`} className="text-blue-600 hover:underline">
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
