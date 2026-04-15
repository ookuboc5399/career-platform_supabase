'use client';

import type { ReactNode } from 'react';

function CodeBlock({ children, lang = '' }: { children: string; lang?: string }) {
  return (
    <div className="not-prose rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-900 my-4">
      {lang && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-medium text-gray-400">
          {lang}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed whitespace-pre-wrap">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline dark:text-blue-400"
    >
      {children}
    </a>
  );
}

export default function LearnClaudeCodeS09Guide() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none text-sm">
      <p className="text-gray-600 dark:text-gray-400 not-prose text-xs mb-6">
        このページは、<strong>Claude Code の Agent Teams（公式機能）</strong>がどういうものかを先に整理し、そのあと{' '}
        <DocLink href="https://learn.shareai.run/ja/s09/">Learn Claude Code s09</DocLink>
        のハンズオン（独自実装のチームメイト・インボックス）に進める構成にしています。
      </p>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-4">
        Claude Code の Agent Teams とは
      </h2>
      <p>
        2026 年 2 月 5 日、<strong>Claude Code v2.1.32</strong> がリリースされ、目玉機能のひとつが{' '}
        <strong>Agent Teams</strong>です。複数の Claude Code インスタンスがチームとして協調する仕組みで、従来の
        サブエージェントとは<strong>設計思想が異なります</strong>。
      </p>
      <p>
        現時点では <strong>Research Preview</strong> のため、挙動や API は今後大きく変わる可能性があります。本番の実戦投入は慎重に、という前提で理解しておくとよいです。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">機能の要点</h3>
      <p>
        Agent Teams は、<strong>複数の Claude Code インスタンスをチームとして動かす</strong>機能です。1
        つのセッションが「チームリード」となり、他のインスタンスが「チームメイト」として参加します。
      </p>
      <p>従来のサブエージェントとの大きな違いは、ざっくり次の 2 点です。</p>
      <ul>
        <li>
          <strong>チームメイト同士が、リードを経由せず直接メッセージをやり取りできる</strong>
        </li>
        <li>
          <strong>ユーザー自身がチームメイトに直接指示を出せる</strong>
        </li>
      </ul>
      <p>
        調整には<strong>共有タスクリスト</strong>が使われ、タスクの依存関係や状態管理も組み込まれている、という説明が公式のイメージに近いです（詳細はリリースノートやドキュメントの更新に追随してください）。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">利用条件と注意点</h3>
      <p>
        Research Preview として提供されており、<strong>実験的機能</strong>です。利用には{' '}
        <strong>Claude Code v2.1.32 以上</strong>に加え、環境変数による有効化が必要です。
      </p>
      <p>
        <code>settings.json</code> に次のような設定を追加する例が案内されています（実際のキー名・配置は公式の最新手順を優先してください）。
      </p>
      <CodeBlock lang="JSON">
{`{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}`}
      </CodeBlock>
      <ul>
        <li>
          各チームメイトは<strong>独立した Claude インスタンス</strong>として動くため、
          <strong>トークン消費量はチームメイトの数に比例して増えます</strong>。単一セッションやサブエージェントと比べてコストが大きく上がりやすい点に注意が必要です。
        </li>
        <li>
          Preview 段階では、<strong>セッション再開や永続化まわりの制約</strong>など、運用上の落とし穴もあり得ます。制約はリリースノートで都度確認するのが安全です。
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">
        サブエージェントとの違い（比較）
      </h3>
      <p>公式ドキュメントの整理に沿った比較のイメージです（文言は要約しています）。</p>
      <div className="not-prose overflow-x-auto my-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                観点
              </th>
              <th className="text-left px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                サブエージェント
              </th>
              <th className="text-left px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                Agent Teams
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900/50">
            <tr>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">コンテキスト</td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                独自のコンテキスト。結果はメインに返る
              </td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                独自のコンテキスト。インスタンスはより独立
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">コミュニケーション</td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                主にメインエージェントへ結果を返す
              </td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                チームメイト同士で直接メッセージング
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">調整方式</td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                メインが作業を取りまとめる
              </td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                共有タスクリストなどで自律的に調整
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-medium">向いている場面</td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                結果だけが重要な集中タスク
              </td>
              <td className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                議論・協調が必要な複雑な作業
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">トークンコスト</td>
              <td className="px-4 py-2">比較的低め（結果がメインに要約されやすい）</td>
              <td className="px-4 py-2">高め（メイトごとに独立インスタンス）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        端的に言えば、サブエージェントは<strong>「結果だけ返す作業者」</strong>、Agent Teams は
        <strong>「議論しながら協調する独立したメンバー」</strong>に近いイメージです。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">
        サブエージェントで感じやすい限界（なぜ Teams が気になるか）
      </h3>
      <p>比較表だけでは伝わりにくい、運用上のモヤモヤの例です。</p>
      <ol>
        <li>
          <strong>不透明さ</strong>：結果は返るが、途中でどんな手順を踏んでいるか細かく追いにくい。進捗や逸脱への不安を抱えたまま完了を待つことになる。Agent
          Teams では <strong>Shift+Up/Down</strong> でチームメイトの作業を直接確認できる、という説明があります。
        </li>
        <li>
          <strong>割り込みのしづらさ</strong>：作業中に「方針を変えたい」と思っても、介入しづらい。Teams
          ではチームメイトに直接メッセージを送れるため、方針転換にも柔軟に対応しやすい、という期待があります。
        </li>
        <li>
          <strong>用途の限界</strong>：コンテキストの重い処理のオフロードには向くが、「PM
          視点」「エンジニア視点」を並行して走らせて突き合わせるような<strong>オーケストレーション</strong>には設計が合いにくい。Agent
          Teams はその種の協調のための仕組み、という位置づけです。
        </li>
      </ol>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">使い道の例</h3>
      <ul>
        <li>
          <strong>上流工程のブレインストーミング</strong>：PM・アーキテクト・Devil&apos;s Advocate・ユーザー代弁・セキュリティレビューなど、複数役割を持たせて議論させ、Design
          Doc や仕様書にまとめる。テキスト中心ならファイル競合リスクも抑えやすい。
        </li>
        <li>
          <strong>API 設計のフロント／バック協調</strong>：Swagger/OpenAPI を、フロント視点とバック視点のメイトが直接やり取りし齟齬を解消し、合意後に並行実装へ、といった流れ。メインが間に挟まると迂遠になりがちな部分を短絡できる、という期待があります。
        </li>
        <li>
          <strong>記事執筆ワークフロー</strong>：リサーチ・構成・執筆・ファクトチェックを分担する場合、サブエージェントだと「著者 → メイン →
          サブ」の往復になりがち。Teams ならリード（著者）から各メイトへ直接フィードバックしやすい。
        </li>
        <li>
          <strong>ナレッジベースの並行整備</strong>：ドメインごとにセッションを分けていた作業を、1
          セッション内で並行しつつ、リードがトーンやルールの統一を握る構成が取りやすい、という発想です。
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">
        Claude Code の進化と OSS エコシステム
      </h3>
      <p>
        Claude Code のアップデート速度は速く、便利な OSS ツールの採用をためらわせる要因にもなり得ます。たとえば{' '}
        <DocLink href="https://github.com/yohey-w/multi-agent-shogun">multi-agent-shogun</DocLink>{' '}
        は、将軍・家老・足軽のような階層で複数の Claude Code を tmux とファイルベース通信で束ねる、エンタメ性の高いマルチエージェント管理ツールです。
      </p>
      <p>
        Agent Teams のような<strong>公式機能がカバー範囲を広げていく一方で、コミュニティ製ツールの役割が変わる</strong>
        というジレンマは、エコシステム全体の共通課題として意識しておくとよいでしょう。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">まとめ</h3>
      <ul>
        <li>
          Agent Teams は、複数の Claude Code インスタンスが独立しつつ協調する仕組み。v2.1.32 から Research Preview として利用できる（要環境変数）。
        </li>
        <li>
          サブエージェントとの最大の違いは、<strong>メイト同士の直接メッセージング</strong>と
          <strong>共有タスクリストによる調整</strong>。
        </li>
        <li>
          上流の議論・API 設計のすり合わせなど、<strong>テキストベースの協調</strong>が主役の場面に相性がよい。
        </li>
        <li>
          <strong>トークン増</strong>や Preview 特有の制約を理解したうえで使う。
        </li>
        <li>公式の急速な進化は、周辺 OSS の寿命設計にも影響しうる。</li>
      </ul>

      <hr className="not-prose my-12 border-gray-200 dark:border-gray-700" />

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-4">
        ハンズオン：チームメイトとインボックス（Learn Claude Code s09）
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        以下は学習パス s09 の内容です。<strong>上記の Agent Teams（公式）とは別物</strong>で、Python と JSONL
        インボックスで「エージェント同士のメール」のような仕組みを自作して理解を深めるパートです。
      </p>

      <div className="not-prose mb-6">
        <a
          href="https://learn.shareai.run/ja/s09/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          📖 出典: Learn Claude Code - s09 エージェントチーム
        </a>
      </div>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
        &quot;一人で終わらないなら、チームメイトに任せる&quot; — 永続チームメイト + 非同期メールボックス。
      </p>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        学習パス: s01 → s02 → s03 → s04 → s05 → s06 | s07 → s08 → <strong>[ s09 ]</strong> → s10 → s11 → s12
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-3">問題</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        サブエージェント(s04)は使い捨てだ: 生成し、作業し、要約を返し、消滅する。アイデンティティもなく、呼び出し間の記憶もない。バックグラウンドタスク(s08)はシェルコマンドを実行するが、LLM
        誘導の意思決定はできない。
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        本物のチームワークには: (1)単一プロンプトを超えて存続する永続エージェント、(2)アイデンティティとライフサイクル管理、(3)エージェント間の通信チャネルが必要だ。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-3">解決策</h3>
      <CodeBlock lang="Teammate lifecycle & Communication">
{`Teammate lifecycle:
  spawn -> WORKING -> IDLE -> WORKING -> ... -> SHUTDOWN

Communication:
  .team/
    config.json           <- team roster + statuses
    inbox/
      alice.jsonl         <- append-only, drain-on-read
      bob.jsonl
      lead.jsonl

              +--------+    send("alice","bob","...")    +--------+
              | alice  | -----------------------------> |  bob   |
              | loop   |    bob.jsonl << {json_line}    |  loop  |
              +--------+                                +--------+
                   ^                                         |
                   |        BUS.read_inbox("alice")          |
                   +---- alice.jsonl -> read + drain ---------+`}
      </CodeBlock>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-3">仕組み</h3>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">1. TeammateManager</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        TeammateManagerがconfig.jsonでチーム名簿を管理する。
      </p>
      <CodeBlock lang="Python">
{`class TeammateManager:
    def __init__(self, team_dir: Path):
        self.dir = team_dir
        self.dir.mkdir(exist_ok=True)
        self.config_path = self.dir / "config.json"
        self.config = self._load_config()
        self.threads = {}`}
      </CodeBlock>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">2. spawn()</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        spawn() がチームメイトを作成し、そのエージェントループをスレッドで開始する。
      </p>
      <CodeBlock lang="Python">
{`def spawn(self, name: str, role: str, prompt: str) -> str:
    member = {"name": name, "role": role, "status": "working"}
    self.config["members"].append(member)
    self._save_config()
    thread = threading.Thread(
        target=self._teammate_loop,
        args=(name, role, prompt), daemon=True)
    thread.start()
    return f"Spawned teammate '` +
          '{name}' +
          `' (role: ` +
          '{role}' +
          `)"`}
      </CodeBlock>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">3. MessageBus</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        追記専用のJSONLインボックス。send() がJSON行を追記し、read_inbox() がすべて読み取ってドレインする。
      </p>
      <CodeBlock lang="Python">
{`class MessageBus:
    def send(self, sender, to, content, msg_type="message", extra=None):
        msg = {"type": msg_type, "from": sender,
               "content": content, "timestamp": time.time()}
        if extra:
            msg.update(extra)
        with open(self.dir / f"` +
          '{' +
          'to' +
          `}.jsonl", "a") as f:
            f.write(json.dumps(msg) + "\\n")

    def read_inbox(self, name):
        path = self.dir / f"` +
          '{' +
          'name' +
          `}.jsonl"
        if not path.exists(): return "[]"
        msgs = [json.loads(l) for l in path.read_text().strip().splitlines() if l]
        path.write_text("")  # drain
        return json.dumps(msgs, indent=2)`}
      </CodeBlock>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">4. _teammate_loop</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        各チームメイトは各LLM呼び出しの前にインボックスを確認し、受信メッセージをコンテキストに注入する。
      </p>
      <CodeBlock lang="Python">
{`def _teammate_loop(self, name, role, prompt):
    messages = [{"role": "user", "content": prompt}]
    for _ in range(50):
        inbox = BUS.read_inbox(name)
        if inbox != "[]":
            messages.append({"role": "user",
                "content": f"<inbox>` +
          '{' +
          'inbox' +
          `}</inbox>"})
            messages.append({"role": "assistant",
                "content": "Noted inbox messages."})
        response = client.messages.create(...)
        if response.stop_reason != "tool_use":
            break
        # execute tools, append results...
    self._find_member(name)["status"] = "idle"`}
      </CodeBlock>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-3">s08からの変更点</h3>
      <div className="not-prose overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Component</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Before (s08)</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">After (s09)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300">
            <tr>
              <td className="px-4 py-3">Tools</td>
              <td className="px-4 py-3">6</td>
              <td className="px-4 py-3">9 (+spawn/send/read_inbox)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Agents</td>
              <td className="px-4 py-3">Single</td>
              <td className="px-4 py-3">Lead + N teammates</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Persistence</td>
              <td className="px-4 py-3">None</td>
              <td className="px-4 py-3">config.json + JSONL inboxes</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Threads</td>
              <td className="px-4 py-3">Background cmds</td>
              <td className="px-4 py-3">Full agent loops per thread</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Lifecycle</td>
              <td className="px-4 py-3">Fire-and-forget</td>
              <td className="px-4 py-3">idle → working → idle</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Communication</td>
              <td className="px-4 py-3">None</td>
              <td className="px-4 py-3">message + broadcast</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-3">試してみる</h3>
      <CodeBlock lang="Shell">
{`cd learn-claude-code
python agents/s09_agent_teams.py`}
      </CodeBlock>
      <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
        <li>Spawn alice (coder) and bob (tester). Have alice send bob a message.</li>
        <li>Broadcast &quot;status update: phase 1 complete&quot; to all teammates</li>
        <li>Check the lead inbox for any messages</li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm">
            /team
          </code>{' '}
          と入力してステータス付きのチーム名簿を確認する
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm">
            /inbox
          </code>{' '}
          と入力してリーダーのインボックスを手動確認する
        </li>
      </ol>

      <div className="not-prose mt-10 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>参考:</strong>{' '}
          <a
            href="https://learn.shareai.run/ja/s09/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            https://learn.shareai.run/ja/s09/
          </a>
        </p>
      </div>
    </article>
  );
}
