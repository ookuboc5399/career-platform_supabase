'use client';

import type { ReactNode } from 'react';

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

/** MCP 親チャプター（概念・運用の入口）。シリーズ詳細はサブチャプターで扱います。 */
export default function GitHubEnterpriseMcpAiControlsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">MCP（Model Context Protocol）</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
        <strong>Model Context Protocol（MCP）</strong>は、AI クライアント（例: <strong>GitHub Copilot CLI</strong>）が、標準化された方法で<strong>外部ツールやデータソース</strong>
        にアクセスするためのプロトコルです。社内ドキュメント検索、チケットシステム、専用 API などを「MCP
        サーバー」として公開し、エージェントやチャットから安全に呼び出す構成が想定されます。
      </p>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Enterprise で押さえること</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>
            <strong>許可する MCP サーバーとスコープ:</strong> どのツールがどの認証情報・ネットワークに届くかを洗い出す
          </li>
          <li>
            <strong>Copilot CLI × MCP:</strong> ローカルまたはリモートの MCP サーバーを登録する運用と、監査・ログの取り方
          </li>
          <li>
            <strong>サプライチェーン:</strong> サードパーティ MCP 実装の入手元、更新、脆弱性対応
          </li>
          <li>
            <strong>AI Controls / ポリシー:</strong> エージェントや CLI の利用可否とセットで設計する
          </li>
        </ul>
      </section>

      <section className="mb-6 not-prose rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/35 dark:text-amber-100">
        本ページは概念と運用の入口です。Copilot CLI と MATLAB MCP のシリーズは<strong>下位サブチャプター</strong>にあります。その他の組み合わせは社内ガイドやベンダー資料と併せて整理してください。
      </section>

      <section className="mb-6 not-prose text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">参考</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <DocLink href="https://modelcontextprotocol.io/">Model Context Protocol（公式サイト）</DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/copilot">GitHub Copilot ドキュメント</DocLink>（CLI・エージェントの記述は更新が早いため最新版を確認）
          </li>
        </ul>
      </section>
    </article>
  );
}
