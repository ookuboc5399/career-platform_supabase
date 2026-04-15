'use client';

export default function GitHubCopilotSetupVscodeGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🚀 GitHub Copilot 初期セットアップ手順（VS Code編）
      </h2>
      <p className="text-gray-600 mb-8">
        管理部門から GitHub Copilot のライセンスを付与された開発者が、自身のローカルエディタ（VS Code）で AI によるコーディング支援を利用できるようにするための手順です。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📋 前提条件
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>ご自身の GitHub アカウントに、社内から Copilot のライセンスが付与されていること（付与されると GitHub から招待メールが届きます）</li>
          <li>PC に Visual Studio Code (VS Code) の最新版がインストールされていること</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🛠️ セットアップ手順
        </h3>

        <div className="space-y-8">
          {/* 手順1 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              1. 拡張機能（Extensions）画面を開く
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>VS Code を起動します</li>
              <li>画面左側の Activity Bar（アイコンが並んでいる縦列）から、ブロックが 4 つ組み合わさったアイコンの <strong>Extensions（拡張機能）</strong> をクリックします</li>
              <li>ショートカット: <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">Ctrl+Shift+X</code>（Mac の場合は <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">Cmd+Shift+X</code>）</li>
            </ul>
          </div>

          {/* 手順2 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              2. GitHub Copilot 拡張機能をインストールする
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>上部の検索バーに <strong>GitHub Copilot</strong> と入力します</li>
              <li>検索結果の一番上に出てくる <strong>GitHub Copilot</strong>（提供元が GitHub になっているもの）を選択し、<strong>Install（インストール）</strong> ボタンをクリックします</li>
              <li><strong>推奨:</strong> 同時に検索結果に表示される <strong>GitHub Copilot Chat</strong> もインストールしておきましょう。エディタ内で ChatGPT のように AI と会話しながらコード生成やリファクタリングができます</li>
            </ul>
          </div>

          {/* 手順3 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              3. GitHub アカウントでサインイン（認証）する
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>インストールが完了すると、VS Code の画面右下に「Sign in to use GitHub Copilot」という通知（トースト）が表示されます。その通知内の <strong>Sign in to GitHub</strong> をクリックします</li>
              <li>（通知が出ない場合は、VS Code 左下の「人型アイコン（Accounts）」をクリックし、「Sign in with GitHub to use Copilot」を選択してください）</li>
              <li>ブラウザが自動的に開き、GitHub のログイン画面または認証の許可画面（Authorize Visual Studio Code）が表示されます</li>
              <li>ライセンスが付与されている社用の GitHub アカウントでログインし、<strong>Authorize（許可）</strong> をクリックします</li>
              <li>「VS Code を開きますか？」というポップアップが出たら、<strong>開く（Open）</strong> を選択してエディタに戻ります</li>
            </ul>
          </div>

          {/* 手順4 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              4. 稼働状況を確認する
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>VS Code の画面右下のステータスバー（青い帯の部分）に、Copilot のアイコン（顔のようなマーク）が表示されていればセットアップは完了です</li>
              <li>アイコンに斜線が入っている場合は、クリックして設定やエラーメッセージを確認してください</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">プレミアムリクエスト（Premium Requests）について</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          GitHub Copilot では、契約プランに応じて<strong>月間のプレミアムリクエスト枠</strong>が付与されることがあります。枠の数え方・対象モデル・乗数は GitHub
          側のプロダクト更新で変わるため、運用前は必ず{' '}
          <a
            href="https://docs.github.com/ja/billing/concepts/product-billing/github-copilot-premium-requests"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:no-underline"
          >
            公式ドキュメント（プレミアムリクエスト）
          </a>
          で最新値を確認してください。以下は教材用の整理です。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-8">各プランの月間プレミアムリクエスト数（目安）</h4>
        <p className="text-gray-600 text-sm mb-3">
          無料枠として月あたりのプレミアムリクエストがプランに含まれるイメージです（Business / Enterprise はユーザーあたりの配分）。
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full min-w-[32rem] text-sm border-collapse border border-gray-200 text-left">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900">プラン</th>
                <th className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900">月間プレミアムリクエスト（目安）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Copilot Free</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">50 回</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Copilot Pro</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">300 回</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Copilot Pro+</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">1,500 回</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Copilot Business</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">ユーザーあたり 300 回</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Copilot Enterprise</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">ユーザーあたり 1,000 回</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">プレミアムリクエストとは何か</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-4">
          <li>
            <strong>有料プラン（Pro / Pro+ / Business / Enterprise など）:</strong> 契約に含まれる
            <strong>ベースモデル</strong>（例: GPT-5 mini、GPT-4.1、GPT-4o など、当時点で GitHub が「ベース」として提供するモデル）は、原則としてプレミアムリクエストを<strong>消費せず</strong>利用できる整理になっていることが多いです。
          </li>
          <li>
            一方、<strong>Claude Sonnet</strong> や <strong>Claude Opus</strong>、<strong>Gemini Pro</strong> など、より高度なモデルに Copilot Chat
            などで切り替えると、そのやり取りで<strong>月間のプレミアムリクエスト枠</strong>が消費されます。
          </li>
          <li>
            <strong>Copilot Free:</strong> ベース／プレミアムの区別なく、<strong>チャット操作が原則プレミアムリクエストとしてカウント</strong>される整理です。そのため同じ回数でも体感では枠が早く減りやすい点に注意してください。
          </li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">モデルごとの消費量（乗数）の例</h4>
        <p className="text-gray-600 text-sm mb-3">
          1 回の操作で消費するプレミアムリクエストは、<strong>モデルごとの乗数</strong>が掛かります（例: 乗数 3 なら 1 往復で 3 消費）。実数は公式の課金・モデル一覧に従います。
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full min-w-[28rem] text-sm border-collapse border border-gray-200 text-left">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900">例（モデル・利用イメージ）</th>
                <th className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900">乗数（例）</th>
                <th className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900">1 往復あたりの消費（例）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Claude Opus 4.5（Copilot Chat など）</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">3 倍</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">3 プレミアムリクエスト</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">Gemini 2.0 Flash</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">0.25 倍</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">0.25 消費（4 回で 1 相当）</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">GPT-4.5（高コスト扱いの例）</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">50 倍</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">50 プレミアムリクエスト</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          VS Code では Chat やエージェントで<strong>モデル選択 UI</strong>から切り替えます。高乗数モデルを試す前に、残枠とチーム方針を確認する習慣があると安全です。
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">枠を使い切った場合</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-4">
          <li>
            <strong>有料プラン:</strong> プレミアムリクエストを使い切っても、契約に含まれる<strong>ベースモデル</strong>であれば、多くの場合<strong>月末まで Copilot を継続利用</strong>できます（インライン補完や Chat のベースモデル利用など）。
          </li>
          <li>
            追加のプレミアムリクエストは、<strong>1 回あたり約 $0.04</strong> で購入できるオプションがある場合があります（地域・請求設定・プランにより異なるため公式を確認）。
          </li>
        </ul>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 mb-4">
          <strong>Copilot Free の注意:</strong> 月 50 回のプレミアムリクエストは「無料で試せる枠」としては十分ですが、チャットがすべてカウント対象になりやすいため、<strong>高乗数モデルや長いスレッド</strong>ではあっという間に枯渇しがちです。まずはベースに近い運用や、社内で推奨されたモデルから使うとよいです。
        </div>

        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-4">
          <li>
            <strong>Organization / Enterprise:</strong> 管理者が利用状況やポリシーを確認できます。FinOps・課金担当と利用ルールをすり合わせてください。
          </li>
          <li>
            <strong>コスト管理:</strong> コストセンター・予算・支払い方法（クレジットカード / PayPal / Azure Subscription / 請求書など）は、別チャプター「
            <strong>コスト管理（Billing and licensing）</strong>」で整理しています。Enterprise の支払いは Azure だけに限りません。
          </li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
        <p className="text-sm text-blue-800">
          <strong>参考（VS Code セットアップ）:</strong>{' '}
          <a href="https://docs.github.com/ja/copilot/getting-started-with-github-copilot/getting-started-with-github-copilot-in-visual-studio-code" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - VS Code で GitHub Copilot を使ってみる
          </a>
        </p>
        <p className="text-sm text-blue-800">
          <strong>参考（プレミアムリクエスト）:</strong>{' '}
          <a
            href="https://docs.github.com/ja/billing/concepts/product-billing/github-copilot-premium-requests"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Copilot のプレミアムリクエスト（概念）
          </a>
          {' · '}
          <a
            href="https://docs.github.com/ja/copilot/how-tos/manage-and-track-spending/monitor-premium-requests"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            使用状況の監視
          </a>
        </p>
      </div>
    </article>
  );
}
