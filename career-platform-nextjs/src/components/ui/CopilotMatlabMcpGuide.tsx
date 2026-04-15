'use client';

/**
 * Copilot CLI × MATLAB MCP Server 学習コンテンツ（セキュリティ分析ドキュメントを要約・構成化）
 */
type ChapterId =
  | 'github-copilot-cli-matlab-mcp-server'
  | 'github-copilot-matlab-mcp-01-overview'
  | 'github-copilot-matlab-mcp-02-architecture'
  | 'github-copilot-matlab-mcp-03-mcp-tools'
  | 'github-copilot-matlab-mcp-04-risks'
  | 'github-copilot-matlab-mcp-05-mitigations'
  | 'github-copilot-matlab-mcp-06-operations';

export default function CopilotMatlabMcpGuide({ chapterId }: { chapterId: ChapterId }) {
  return (
    <article className="prose prose-gray max-w-none text-gray-800">
      {chapterId === 'github-copilot-cli-matlab-mcp-server' && <SeriesHub />}
      {chapterId === 'github-copilot-matlab-mcp-01-overview' && <Overview />}
      {chapterId === 'github-copilot-matlab-mcp-02-architecture' && <Architecture />}
      {chapterId === 'github-copilot-matlab-mcp-03-mcp-tools' && <McpTools />}
      {chapterId === 'github-copilot-matlab-mcp-04-risks' && <Risks />}
      {chapterId === 'github-copilot-matlab-mcp-05-mitigations' && <Mitigations />}
      {chapterId === 'github-copilot-matlab-mcp-06-operations' && <Operations />}
    </article>
  );
}

function SeriesHub() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Copilot CLI × MATLAB MCP Server</h2>
      <p className="text-gray-600 mb-6">
        <strong>GitHub Copilot CLI</strong> と <strong>MathWorks 公式 MATLAB MCP Core Server</strong> を組み合わせた利用について、構成・ツール連携・リスク・対策・運用を
        <strong>6 つのサブチャプター</strong>で整理します。セキュリティレビューや社内承認のたたき台として利用してください。
      </p>
      <ol className="list-decimal list-inside text-gray-600 text-sm space-y-2 not-prose">
        <li>概要と要件</li>
        <li>システム構成</li>
        <li>MCP ツールと接続</li>
        <li>セキュリティリスク</li>
        <li>対策</li>
        <li>運用と展開</li>
      </ol>
    </>
  );
}

export const COPILOT_MATLAB_MCP_CHAPTER_IDS: ChapterId[] = [
  'github-copilot-matlab-mcp-01-overview',
  'github-copilot-matlab-mcp-02-architecture',
  'github-copilot-matlab-mcp-03-mcp-tools',
  'github-copilot-matlab-mcp-04-risks',
  'github-copilot-matlab-mcp-05-mitigations',
  'github-copilot-matlab-mcp-06-operations',
];

export function isCopilotMatlabMcpChapterId(id: string): id is ChapterId {
  return id === 'github-copilot-cli-matlab-mcp-server' || (COPILOT_MATLAB_MCP_CHAPTER_IDS as readonly string[]).includes(id);
}

function Overview() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">概要と背景</h2>
      <p className="text-gray-600 mb-6">
        本シリーズでは、<strong>GitHub Copilot CLI</strong> と <strong>MathWorks 公式の MATLAB MCP Core Server</strong>
        を組み合わせ、設計仕様から Simulink モデル等を扱う際の<strong>セキュリティ上の論点</strong>を整理します。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">利用シナリオ（典型）</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            <strong>入力:</strong> 設計仕様書の要件テキスト
          </li>
          <li>
            <strong>処理:</strong> Copilot CLI が MCP 経由で MATLAB / Simulink を操作
          </li>
          <li>
            <strong>出力:</strong> Simulink モデル（.slx）や MATLAB スクリプト（.m）
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">想定環境（目安）</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">項目</th>
                <th className="text-left p-3 font-semibold">内容</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 whitespace-nowrap">クライアント</td>
                <td className="p-3">Windows 10/11、インターネット接続あり</td>
              </tr>
              <tr>
                <td className="p-3">MATLAB</td>
                <td className="p-3">R2024b 以降 + Simulink + 必要な Toolbox</td>
              </tr>
              <tr>
                <td className="p-3">Copilot</td>
                <td className="p-3">GitHub Copilot Business / Enterprise（Org ポリシー利用のため）</td>
              </tr>
              <tr>
                <td className="p-3">MCP</td>
                <td className="p-3">MATLAB MCP Core Server（例: v0.6.1 前後、公式 Go バイナリ）</td>
              </tr>
              <tr>
                <td className="p-3">通信</td>
                <td className="p-3">GitHub API への HTTPS が必要（Copilot 利用時）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">押さえるべき制約（3点）</h3>
        <ol className="list-decimal list-inside space-y-3 text-gray-600">
          <li>
            <strong>アカウント・ポリシー:</strong> GitHub Organization レベルで MCP 利用を制御する必要がある（後述）。
          </li>
          <li>
            <strong>情報区分:</strong> 設計仕様に含まれる情報は社外秘以上になり得る。プロンプトに載せる前に分類・マスキングを検討する。
          </li>
          <li>
            <strong>ライセンス:</strong> MathWorks の「Personal Automation Server」等の利用条件に合致するか、事前に営業・規程で確認する。
          </li>
        </ol>
      </section>
    </>
  );
}

function Architecture() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">システム構成とデータの流れ</h2>
      <p className="text-gray-600 mb-6">
        セキュリティを考えるうえで、「どこがローカルで、どこがクラウドか」「どこに機密が載るか」を切り分けます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">主要コンポーネント</h3>
        <ul className="space-y-3 text-gray-600">
          <li>
            <strong>Copilot CLI</strong> — MCP クライアント兼 LLM 呼び出し。設定は <code className="bg-gray-100 px-1 rounded">~/.copilot/mcp-config.json</code> など。
          </li>
          <li>
            <strong>MATLAB MCP Core Server</strong> — MCP サーバー（stdio）。MathWorks 公式の Go 製バイナリ。
          </li>
          <li>
            <strong>MATLAB / Simulink</strong> — 実際の計算・モデル操作。COM / Engine API で MCP から呼ばれる。
          </li>
          <li>
            <strong>GitHub Copilot API</strong> — LLM 推論（Azure OpenAI 上のモデル等）。ユーザープロンプトがここを通る。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">通信経路のイメージ</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">経路</th>
                <th className="text-left p-3 font-semibold">特徴</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              <tr>
                <td className="p-3">Copilot CLI ↔ GitHub API</td>
                <td className="p-3">HTTPS（TLS）。GitHub トークンで認証。<strong>プロンプト・仕様テキストがここを通る</strong>点に注意。</td>
              </tr>
              <tr>
                <td className="p-3">CLI ↔ MCP Server</td>
                <td className="p-3">stdio（JSON-RPC）。同一マシン内のプロセス間通信。</td>
              </tr>
              <tr>
                <td className="p-3">MCP Server ↔ MATLAB</td>
                <td className="p-3">COM / Engine。ローカル。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">学習のポイント</h3>
        <p className="text-gray-600">
          stdio 区間は「ネットワーク上に出ない」一方、<strong>Copilot への送信</strong>はクラウド側のリスク（機密・DLP）の中心になる。次章では MCP が提供するツールと、Copilot 側の接続設定を扱う。
        </p>
      </section>
    </>
  );
}

function McpTools() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">MATLAB MCP と Copilot 接続</h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">MathWorks 公式 MCP Core Server</h3>
        <p className="text-gray-600 mb-3">
          サードパーティではなく MathWorks が提供するサーバーである点が、サプライチェーン上の信頼の足がかりになる。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>トランスポートは基本的に <strong>stdio</strong>（ローカル実行前提）</li>
          <li>バージョン・リリースは GitHub Releases で確認し、導入時はハッシュ記録を推奨</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">提供ツールとリスクの目安</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">ツール（例）</th>
                <th className="text-left p-3 font-semibold">内容</th>
                <th className="text-left p-3 font-semibold">リスク感</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              <tr>
                <td className="p-3 font-mono text-xs">detect_matlab_toolboxes</td>
                <td className="p-3">インストール済み Toolbox の一覧</td>
                <td className="p-3">低（読み取り）</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">check_matlab_code</td>
                <td className="p-3">構文チェック・Lint</td>
                <td className="p-3">低（読み取り）</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">run_matlab_test_file</td>
                <td className="p-3">テストファイル実行</td>
                <td className="p-3">中（テストに限定）</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">evaluate_matlab_code</td>
                <td className="p-3">コード実行</td>
                <td className="p-3 text-amber-800 font-medium">高（任意コード実行）</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">run_matlab_file</td>
                <td className="p-3">.m ファイル実行</td>
                <td className="p-3 text-amber-800 font-medium">高</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          PoC 初期は「読み取り系のみ」に絞り、段階的に許可を広げるのが安全側の定石である。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">mcp-config.json（概念）</h3>
        <p className="text-gray-600 mb-2">
          ローカル MCP を <code className="bg-gray-100 px-1 rounded">type: local</code>、<code className="bg-gray-100 px-1 rounded">command</code>、
          <code className="bg-gray-100 px-1 rounded">args</code>（例: <code className="bg-gray-100 px-1 rounded">--matlab-root</code>、
          <code className="bg-gray-100 px-1 rounded">--disable-telemetry=true</code>）、
          <strong>tools のホワイトリスト</strong> で定義する。
        </p>
        <p className="text-gray-600">
          CLI では <code className="bg-gray-100 px-1 rounded">/mcp add</code> / <code className="bg-gray-100 px-1 rounded">show</code> /{' '}
          <code className="bg-gray-100 px-1 rounded">edit</code> / <code className="bg-gray-100 px-1 rounded">disable</code> /{' '}
          <code className="bg-gray-100 px-1 rounded">delete</code> 等で管理する（公式ドキュメントに従う）。
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">GitHub Organization ポリシー</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Organization の Copilot 設定で MCP サーバー利用を制御できる（既定は無効にし、必要なら有効化）</li>
          <li>Business / Enterprise など、プラン要件を満たす必要がある</li>
          <li>「特定チームだけ」などは Org 分割や権限設計とセットで検討する（後章の全社展開とも関連）</li>
        </ul>
      </section>
    </>
  );
}

function Risks() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">セキュリティリスク（代表）</h2>
      <p className="text-gray-600 mb-8">ドキュメントで整理される主な論点を、対策章につながる形で要約する。</p>

      <section className="mb-8 p-4 rounded-lg border border-red-100 bg-red-50/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">1. 設計仕様・機密の外部送信</h3>
        <p className="text-gray-600 text-sm">
          プロンプトに含めた仕様・顧客名・型番等が Copilot API 経由でクラウドに送られる。<strong>DLP・契約・知財</strong>の観点で最重要。
        </p>
      </section>

      <section className="mb-8 p-4 rounded-lg border border-amber-100 bg-amber-50/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">2. モデル改変・プロンプトインジェクション</h3>
        <p className="text-gray-600 text-sm">
          <code className="bg-white px-1 rounded text-xs">evaluate_matlab_code</code> 等を許可すると、LLM が生成したコードが実行され、
          Simulink モデルやファイルに意図しない変更が入るリスクがある。
        </p>
      </section>

      <section className="mb-8 p-4 rounded-lg border border-amber-100 bg-amber-50/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">3. MATLAB の強い権限</h3>
        <p className="text-gray-600 text-sm">
          Engine 経由でファイル・ネットワーク・外部プロセス等にアクセスし得る。OS 層の防御（ファイアウォール、AppLocker 等）とセットで考える。
        </p>
      </section>

      <section className="p-4 rounded-lg border border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">4. テレメトリ</h3>
        <p className="text-gray-600 text-sm">
          MCP Core Server の利用状況が MathWorks 側に送られる既定挙動に注意し、起動引数やネットワーク制御で方針に合わせる。
        </p>
      </section>
    </>
  );
}

function Mitigations() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">対策の考え方</h2>
      <p className="text-gray-600 mb-8">「情報を出さない」「ツールを絞る」「OS で囲む」の三層で整理する。</p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Copilot Content Exclusion</h3>
        <p className="text-gray-600 mb-2">
          機密パス（例: <code className="bg-gray-100 px-1 rounded text-xs">specs/**</code>、<code className="bg-gray-100 px-1 rounded text-xs">requirements/**</code>）を
          Copilot の参照対象から除外する。併せて、リポジトリ外ファイル参照のポリシーや、補完のスニペット送信設定も確認する。
        </p>
        <p className="text-gray-600 text-sm">
          注意: ユーザーが仕様をプロンプトに直接貼る場合は除外だけでは防げない → <strong>マスキング・抽象化したテキスト</strong>での運用ルールが必要。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. MCP ツールのホワイトリスト</h3>
        <p className="text-gray-600 mb-2">
          <code className="bg-gray-100 px-1 rounded">tools</code> に許可ツールを明示する。<code className="bg-gray-100 px-1 rounded">[&quot;*&quot;]</code> は避け、
          アップデートで危険なツールが自動有効化されないようにする。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">3. 段階的許可（Phase 設計）</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Phase 1: 読み取り系のみ（例: detect / check）</li>
          <li>Phase 2: テスト実行（例: run_matlab_test_file）を追加</li>
          <li>Phase 3: コード実行（evaluate）を承認フロー・HITL とともに慎重に</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">4. ネットワーク・OS</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Windows ファイアウォールで MATLAB / MCP バイナリの外向き通信を制限（ライセンス例外は別途検証）</li>
          <li>AppLocker / WDAC で <code className="bg-gray-100 px-1 rounded text-xs">system()</code> 経由の子プロセス起動を抑止する検討</li>
          <li>作業ディレクトリを <code className="bg-gray-100 px-1 rounded text-xs">--initial-working-folder</code> で固定し ACL で範囲を限定</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">5. テレメトリ無効化</h3>
        <p className="text-gray-600">
          起動引数 <code className="bg-gray-100 px-1 rounded">--disable-telemetry=true</code> を指定し、必要ならパケット監視で実効性を確認する。
        </p>
      </section>
    </>
  );
}

function Operations() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">制限・展開・チェックリストの視点</h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">ライセンス・EULA</h3>
        <p className="text-gray-600 mb-2">
          MCP Core Server は「Personal Automation Server」に該当する MATLAB 利用形態との整合が求められる記載がある。
          共有 PC・Concurrent ライセンス等は <strong>MathWorks に確認</strong>することが推奨される。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">GitHub Apps の限界</h3>
        <p className="text-gray-600">
          リポジトリ操作の監査には GitHub Apps が有効な一方、<strong>Copilot CLI ↔ API</strong> や <strong>ローカル stdio</strong> の区間は
          GitHub Apps だけではカバーできない。Org ポリシー・端末設定・運用で補完する。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">導入ロードマップ（イメージ）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>準備: ライセンス確認、mcp-config 草案、ポリシーたたき</li>
          <li>Phase 1: 読み取りツールの PoC</li>
          <li>Phase 2: テスト実行の PoC</li>
          <li>Phase 3: コード実行の本番運用（承認・ログ・監査）</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">全社展開（将来）</h3>
        <p className="text-gray-600 mb-2">
          端末ごとの <code className="bg-gray-100 px-1 rounded text-xs">mcp-config.json</code> 管理が破綻しやすい規模では、
          MCP Gateway（例: agentgateway 等）による集中管理・RBAC・監査ログ・トランスポート変換（stdio → HTTP）の議論がドキュメントに含まれる。
        </p>
        <p className="text-gray-600">
          Org を部門ごとに分け、MCP 有効範囲を混在させない設計も検討対象になる。
        </p>
      </section>

      <section className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">実務でのチェック（抜粋）</h3>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>バイナリの SHA 記録と配置パス管理</li>
          <li><code className="bg-white px-1 rounded text-xs">tools</code> にワイルドカードを使っていないか</li>
          <li>Org の Content exclusion・MCP ポリシー・Copilot プラン</li>
          <li>ファイアウォール・テレメトリ・端末アカウント分離</li>
          <li>PoC 前の顧客・社内ヒアリング（データ区分、承認者、ネットワーク制約）</li>
        </ul>
      </section>
    </>
  );
}
