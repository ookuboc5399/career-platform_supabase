'use client';

import type { ReactNode } from 'react';

export const AI_UI_COURSE_LANGUAGE_IDS = [
  'claude',
  'openai',
  'openclaw',
  'manus',
  'ui-ux-foundations',
  'ui-design-systems',
] as const;

export function isAiUiCourseLanguage(id: string): boolean {
  return (AI_UI_COURSE_LANGUAGE_IDS as readonly string[]).includes(id);
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">
      {children}
    </a>
  );
}

function Article({ children }: { children: ReactNode }) {
  return <article className="prose prose-gray max-w-none dark:prose-invert text-sm">{children}</article>;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="not-prose my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100 dark:bg-gray-950">
      <code>{children}</code>
    </pre>
  );
}

export default function AiUiUxCoursesGuide({ languageId, chapterId }: { languageId: string; chapterId: string }) {
  const body = pickBody(languageId, chapterId);
  if (!body) return null;
  return (
    <div className="w-full max-w-4xl mb-8">
      <Article>{body}</Article>
      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 not-prose">
        製品仕様は更新が早いため、最新は各公式ドキュメントもあわせて確認してください。
      </p>
    </div>
  );
}

function pickBody(languageId: string, chapterId: string): ReactNode {
  switch (languageId) {
    case 'claude':
      switch (chapterId) {
        case 'claude-overview':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Claude の位置づけ</h2>
              <p>
                Claude は Anthropic が提供する大規模言語モデル（LLM）ファミリーです。チャット用途から API
                経由での組み込みまで、同じ安全性方針（Constitutional AI など）を軸に設計されています。
              </p>
              <h3 className="text-lg font-semibold">モデルのイメージ</h3>
              <ul>
                <li>用途に応じてモデル世代・サイズが選べる（契約・リージョン・提供形態はプランにより異なります）</li>
                <li>長文コンテキストを活かした要約・分析・コード支援が典型ユースケース</li>
              </ul>
              <p>
                <DocLink href="https://docs.anthropic.com/">Anthropic ドキュメント</DocLink>
              </p>
            </>
          );
        case 'claude-api-messages':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages API の考え方</h2>
              <p>
                API では多くの場合、<strong>role</strong>（user / assistant 等）と <strong>content</strong> の対話履歴を送り、ストリーミングやツール呼び出し（利用可能な場合）を組み合わせます。
              </p>
              <h3 className="text-lg font-semibold">実装時のポイント</h3>
              <ul>
                <li>システムプロンプトで守るべき境界（個人情報・社内ポリシー）を明示する</li>
                <li>トークン上限とコストを見積もり、履歴のトリミング方針を決める</li>
                <li>本番キーの取り扱い（環境変数・シークレット管理）を徹底する</li>
              </ul>
            </>
          );
        case 'claude-safety-prompts':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">安全・プロンプト設計</h2>
              <p>
                出力の品質は<strong>指示の具体性</strong>と<strong>評価基準</strong>で大きく変わります。機密を扱う場合は、プロンプトに生データを入れない・マスキングするなどの運用ルールを決めます。
              </p>
              <ul>
                <li>役割・前提・出力形式（JSON / 表 / 箇条書き）を最初に固定する</li>
                <li>「不明なら推測せず不明と答える」などフェイルセーフを書く</li>
                <li>人間によるレビューが必要な判断（法務・医療等）は自動化しない</li>
              </ul>
            </>
          );
        case 'claude-academy-3':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                君のアプリに「知能」を。Claude API 実践ワークショップ
              </h2>
              <p>
                「AI を組み込むのって難しそう…」というイメージを手放して、Messages API を使ってアプリを少しずつインテリジェントにしていきましょう。難しい構成は後回しで、まずはつながる体験から始めます。
              </p>
              <p>
                <DocLink href="https://console.anthropic.com/">Anthropic Console</DocLink>
                {' · '}
                <DocLink href="https://docs.anthropic.com/en/api/messages">Messages API リファレンス</DocLink>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 not-prose">
                コード中のモデル ID は例です。利用可能な最新モデル名は公式ドキュメントで確認してください。
              </p>

              <h3 className="text-lg font-semibold mt-8">Step 1: 最初の「Hello Claude」</h3>
              <p className="text-gray-600 dark:text-gray-400">
                わずか数行で、Claude とあなたの PC を接続します。
              </p>
              <p>
                <strong>やること</strong>
              </p>
              <ol>
                <li>Anthropic Console で API キーを発行する（本番では環境変数やシークレット管理に保存）。</li>
                <li>
                  Python ライブラリを入れる：<code className="text-sm">pip install anthropic</code>
                </li>
                <li>次のコードを実行する。</li>
              </ol>
              <CodeBlock>{`import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",  # 最新名はドキュメント参照
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello, Claude!"}],
)

print(message.content[0].text)`}</CodeBlock>
              <p>
                <strong>Point</strong>：この一行立ち上げで、プログラムの中から Claude にメッセージを送り、応答テキストを受け取れます。
              </p>

              <h3 className="text-lg font-semibold mt-8">Step 2: 会話を「記憶」させるテクニック</h3>
              <p>
                API はリクエストごとに状態を持ちません。過去の発言を <code>messages</code> のリストとして毎回送ることで、文脈を読む「記憶」に近い挙動を実現します。
              </p>
              <p>
                <strong>リクエスト構造のコツ</strong>：ユーザーとアシスタントが交互になるように並べます。
              </p>
              <CodeBlock>{`messages = [
    {"role": "user", "content": "私の名前は田中です。"},
    {"role": "assistant", "content": "田中さん、こんにちは！"},
    {"role": "user", "content": "私の名前を覚えていますか？"},
]
# これを messages.create(..., messages=messages) に渡すと
# 「はい、田中さんですね」のように文脈に沿った返答になりやすい`}</CodeBlock>

              <h3 className="text-lg font-semibold mt-8">Step 3: 止まらない文字出力（ストリーミング）</h3>
              <p>
                長文の完了を待つだけだと退屈に感じやすいので、生成されたトークンを順に表示するストリーミングで UX を改善します。
              </p>
              <p>
                <strong>実装イメージ</strong>（SDK のストリーム API を利用）：
              </p>
              <CodeBlock>{`with client.messages.stream(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1000,
    messages=[{"role": "user", "content": "短い物語を書いて"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)`}</CodeBlock>
              <p>チャット UI では、受け取った断片をそのまま追記表示すれば「タイピングされていく」ような見え方にできます。</p>

              <h3 className="text-lg font-semibold mt-8">Step 4: AI の「目」を実装する（Vision）</h3>
              <p>
                画像対応モデルでは、画像データとテキスト指示を同じメッセージに載せて解析できます。領収書の読み取り、UI のラフからコード案を出す、など用途は広いです。
              </p>
              <p>
                <strong>流れのイメージ</strong>
              </p>
              <ul>
                <li>画像を Base64 など API が受け付ける形式にする（または URL が許可される場合はその方式）。</li>
                <li>「この画像について ○○ して」とテキスト指示とセットで <code>messages</code> に載せる。</li>
              </ul>
              <p>
                例：「この冷蔵庫の中身の写真から、作れるレシピを 3 つ提案して」→ 画像内の食材を踏まえた提案が返りやすくなります（精度は画像品質・モデルによります）。
              </p>

              <h3 className="text-lg font-semibold mt-8">Final: 実用アプリへの組み込み</h3>
              <p>本番に近づけるときに押さえておきたいポイントです。</p>
              <ul>
                <li>
                  <strong>エラーハンドリング</strong>：レート制限・タイムアウト・5xx を想定し、リトライやユーザー向けメッセージを用意する。
                </li>
                <li>
                  <strong>システムプロンプト</strong>：<code>system</code> で役割を固定する（例：「あなたはプロの料理研究家です」）。一貫した口調・禁止事項をここに書く。
                </li>
                <li>
                  <strong>トークン節約</strong>：不要な過去ログの要約・削除、<code>max_tokens</code> の見直し、必要ならキャッシュ戦略でコストと遅延を抑える。
                </li>
              </ul>
            </>
          );
        case 'claude-academy-4':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Model Context Protocol（MCP）
              </h2>
              <p>
                MCP は、AI モデル（Claude などの LLM）が、ローカルファイル、データベース、Google Drive、Slack、GitHub
                といった<strong>外部のデータソースやツールとスムーズに連携するための共通規格</strong>です。2024
                年末に Anthropic によって公開され、AI エコシステムにおける「USB
                ポート」のような役割を目指しています。
              </p>
              <p>
                <DocLink href="https://modelcontextprotocol.io/">Model Context Protocol（公式サイト）</DocLink>
                {' · '}
                <DocLink href="https://docs.anthropic.com/">Anthropic ドキュメント</DocLink>
              </p>

              <h3 className="text-lg font-semibold mt-8">1. なぜ MCP が必要なのか</h3>
              <p>従来の AI 連携には、次のような課題がありました。</p>
              <ul>
                <li>
                  <strong>個別開発の負担</strong>：Slack と連携させるなら Slack 用のコードを、GitHub なら GitHub
                  用のコードを、毎回ゼロから書く必要があった。
                </li>
                <li>
                  <strong>断片化</strong>：特定のアプリでしか動かないコネクタが多く、汎用性が低かった。
                </li>
              </ul>
              <p>
                <strong>MCP の登場後</strong>：一度「MCP サーバ」を用意すれば、その規格に対応している Claude
                Desktop、IDE、Cursor などの AI クライアントから、同じやり方でデータにアクセスできるようになります。
              </p>

              <h3 className="text-lg font-semibold mt-8">2. MCP の仕組み（アーキテクチャ）</h3>
              <p>MCP は主に次の 3 要素で構成されます。</p>
              <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                        要素
                      </th>
                      <th className="text-left px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                        役割
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900/50">
                    <tr>
                      <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">
                        MCP Host
                      </td>
                      <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        AI を動かすクライアント（Claude Desktop、IDE など）。ユーザーの指示をサーバーへ伝える。
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">
                        MCP Server
                      </td>
                      <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        特定のデータ（Google Drive、SQL など）への「窓口」。データを AI が扱える形に変換する。
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">MCP Client</td>
                      <td className="px-4 py-2">
                        ホスト内に組み込まれ、サーバーとの通信を確立する。
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mt-8">3. MCP でできることの例</h3>
              <p>チャット画面やエディタ上の AI に対して、次のような指示が自然に行えるようになります。</p>
              <ul>
                <li>
                  <strong>データベース操作</strong>：「顧客 DB から最新の注文 10 件を取得して、傾向を分析して」
                </li>
                <li>
                  <strong>ファイル操作</strong>：「ローカルのこのフォルダ内の全ファイルを読み込んで、バグを探して」
                </li>
                <li>
                  <strong>外部 API 連携</strong>：「Google Drive の議事録と Slack のやり取りをまとめて要約して」
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-8">4. 主なメリット</h3>
              <ul>
                <li>
                  <strong>セキュリティ</strong>：自分の PC 内（ローカル）でサーバーを動かせるため、データを安全に AI
                  へ渡しやすい。
                </li>
                <li>
                  <strong>再利用性</strong>：誰かが作った「PostgreSQL 用 MCP サーバー」などを利用するだけで、すぐに自分の
                  AI と DB をつなげられる。
                </li>
                <li>
                  <strong>オープンソース</strong>：特定の企業に縛られず、コミュニティ全体で拡張していける。
                </li>
              </ul>
            </>
          );
        default:
          return null;
      }
    case 'openai':
      switch (chapterId) {
        case 'openai-overview':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ChatGPT と API</h2>
              <p>
                OpenAI エコシステムでは、ブラウザの ChatGPT と、開発者向けの <strong>API</strong>（Completions / Chat
                Completions / Responses など、エンドポイントは進化に応じて追加・変更）が中心です。
              </p>
              <ul>
                <li>ChatGPT：対話・エージェント機能・コネクタ（プランによる）</li>
                <li>API：自社アプリへの組み込み、バッチ処理、評価パイプライン</li>
              </ul>
              <p>
                <DocLink href="https://platform.openai.com/docs">OpenAI Platform ドキュメント</DocLink>
              </p>
            </>
          );
        case 'openai-models-api':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">モデル選択とトークン</h2>
              <p>
                レイテンシ・コスト・推論品質のトレードオフでモデルを選びます。<strong>コンテキスト長</strong>を超えた履歴は切り捨てられるため、アプリ側で要約や RAG を設計します。
              </p>
              <h3 className="text-lg font-semibold">API 利用のチェックリスト</h3>
              <ul>
                <li>レート制限とリトライ（指数バックオフ）</li>
                <li>ログに API キーや個人情報を残さない</li>
                <li>ストリーミング時の切断・再送の扱い</li>
              </ul>
            </>
          );
        case 'openai-operations':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">運用とコスト</h2>
              <p>
                従量課金モデルでは、<strong>プロンプト＋完了トークン</strong>が課金の基礎になります。ダッシュボードで利用量を監視し、開発・本番でキーとプロジェクトを分離します。
              </p>
              <ul>
                <li>ステージング用の低コストモデルで開発し、本番のみ高性能モデルへ</li>
                <li>キャッシュ可能なシステムメッセージは再利用する</li>
                <li>異常検知（スパイクアラート）を設定する</li>
              </ul>
            </>
          );
        default:
          return null;
      }
    case 'openclaw':
      switch (chapterId) {
        case 'openclaw-overview':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">OpenClaw とは</h2>
              <p>
                OpenClaw は、<strong>自分のマシンや環境で動かす</strong>パーソナル AI アシスタントの一例です。クラウド SaaS に依存せず、メッセージングやローカルツールとつなぐ構成を目指します。
              </p>
              <ul>
                <li>自己ホスト型であることのメリット（データの所在・カスタマイズ）</li>
                <li>運用責任（アップデート、バックアップ、秘密情報の保管）は利用者側に発生</li>
              </ul>
              <p>
                <DocLink href="https://docs.openclaw.ai/">OpenClaw ドキュメント</DocLink>
              </p>
            </>
          );
        case 'openclaw-setup-security':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">セットアップとセキュリティ</h2>
              <p>
                公式のオンボーディング手順に従い、Node バージョンやパッケージマネージャ要件を満たします。外部チャットから操作できる場合は、<strong>誰がボットを操作できるか</strong>を必ず制限します。
              </p>
              <ul>
                <li>トークン・Webhook URL をリポジトリにコミットしない</li>
                <li>ボットが触りうるファイル・API の権限を最小にする</li>
                <li>マルウェア混入パッケージ対策として入手元を固定する</li>
              </ul>
            </>
          );
        case 'openclaw-integrations':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">連携の考え方</h2>
              <p>
                Slack / Discord / その他のチャネルとつなぐと便利ですが、<strong>機密チャンネルへの接続</strong>は情報漏えいリスクが高いです。許可するコマンド・参照パスをホワイトリスト化します。
              </p>
            </>
          );
        default:
          return null;
      }
    case 'manus':
      switch (chapterId) {
        case 'manus-overview':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">エージェント型タスク実行</h2>
              <p>
                Manus のような製品は、ユーザーのゴールに対して<strong>ブラウザ操作・調査・ドキュメント生成</strong>などを自律的に進める UI を持ちます。従来の「1 問 1 答」チャットとは設計思想が異なります。
              </p>
              <p>
                <DocLink href="https://manus.im/">Manus 公式サイト</DocLink>
              </p>
            </>
          );
        case 'manus-agent-workflows':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ワークフロー設計</h2>
              <p>
                指示は<strong>成果物の定義</strong>（形式・長さ・参照ソース）まで具体化します。途中確認が必要なら、人間承認のチェックポイントを会話で明示します。
              </p>
            </>
          );
        case 'manus-governance':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ガバナンス</h2>
              <p>
                社内利用では、<strong>入力してはいけないデータ</strong>（顧客個人情報・未公開財務）と、<strong>エージェントに許可する操作</strong>（外部送信、ログイン）をポリシー化します。
              </p>
            </>
          );
        default:
          return null;
      }
    case 'ui-ux-foundations':
      switch (chapterId) {
        case 'ui-ux-what-is':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">UI と UX</h2>
              <p>
                <strong>UI（ユーザーインターフェース）</strong>は画面上の部品や視覚的な設計、<strong>UX（ユーザーエクスペリエンス）</strong>は利用の前後を含めた体験全体の質を指します。
              </p>
              <ul>
                <li>UI が整っていても、業務フローと合致しなければ UX は悪いまま</li>
                <li>プロトタイプで早期に実ユーザーの反応を取る</li>
              </ul>
            </>
          );
        case 'ui-ux-usability-research':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ユーザビリティとリサーチ</h2>
              <p>
                ニールセンのヒューリスティック等の枠組みで画面レビューをし、必要に応じて<strong>ユーザビリティテスト</strong>（タスク成功率・所要時間）で定量化します。
              </p>
            </>
          );
        case 'ui-ux-accessibility':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">アクセシビリティ</h2>
              <p>
                キーボード操作、コントラスト、スクリーンリーダー向けのセマンティック HTML／ARIA を意識します。法規制・調達要件で WCAG 準拠が求められる場合もあります。
              </p>
            </>
          );
        default:
          return null;
      }
    case 'ui-design-systems':
      switch (chapterId) {
        case 'ui-design-system-intro':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">デザインシステムとは</h2>
              <p>
                色・タイポ・間隔・コンポーネント仕様・ライティングルールを<strong>ドキュメント化</strong>し、プロダクト横断で再利用する仕組みです。実装側では Storybook やデザイントークンで同期します。
              </p>
            </>
          );
        case 'ui-design-tokens-components':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">トークンとコンポーネント</h2>
              <p>
                デザイントークン（色名・spacing 名）をソース・オブ・トゥルースにし、コンポーネントはトークン参照のみにするとテーマ差し替えが容易です。
              </p>
            </>
          );
        case 'ui-design-patterns':
          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">パターンと Material Design</h2>
              <p>
                ナビゲーション、フォーム、エラー表示など<strong>繰り返し現れるパターン</strong>を図示します。公開ガイドライン（例: Material Design）はチームの共通言語として参照します。
              </p>
              <p>
                <DocLink href="https://m3.material.io/">Material Design 3</DocLink>
              </p>
            </>
          );
        default:
          return null;
      }
    default:
      return null;
  }
}
