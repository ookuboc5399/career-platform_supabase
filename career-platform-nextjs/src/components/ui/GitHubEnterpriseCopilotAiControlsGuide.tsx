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

/** Copilot 親チャプター（入口）。詳細はサブチャプターで扱います。 */
export default function GitHubEnterpriseCopilotAiControlsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Copilot</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
        <strong>GitHub Copilot</strong>は、IDE・チャット・CLI・Pull Request 上の提案など、開発フローに埋め込まれた AI
        アシスタントです。画面上の設定は多くの場合 <strong>Organization または Enterprise の Settings › Copilot</strong>（ラベルはプラン・UI
        で異なることがあります）からたどります。学習一覧では <strong>GitHub Enterprise › AI Controls › Copilot</strong> を親チャプターとし、初期セットアップや
        Privacy / Billing などは<strong>下位のサブチャプター</strong>で整理しています。
      </p>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">管理者・オーナーが見る領域（要約）</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>
            <strong>Privacy &amp; Features:</strong> コンテンツ除外、データの扱い、Chat・PR・CLI など<strong>機能のオンオフ</strong>
          </li>
          <li>
            <strong>Billing:</strong> Copilot シートの割当・利用状況（Enterprise 全体の請求 UI とは役割が分かれることが多い）
          </li>
          <li>
            <strong>Metrics:</strong> 採用・利用のサマリー（Enterprise Insights と重複・補完しうる）
          </li>
          <li>
            <strong>Copilot Clients:</strong> 利用を許可するエディタ・IDE の制限
          </li>
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
          いずれも <strong>AI Controls</strong> や Enterprise ポリシーと整合させ、変更時は影響範囲を確認します。
        </p>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">開発者向け：初期セットアップ（VS Code の例）</h3>
        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>GitHub アカウントに Copilot ライセンスが付与されていることを確認</li>
          <li>VS Code の Extensions から公式 <strong>GitHub Copilot</strong> 拡張をインストール</li>
          <li>GitHub にサインインし、チャット／インライン提案が有効か確認</li>
          <li>プレミアムリクエストやモデル選択はプラン・ポリシーに依存 — 組織の案内に従う</li>
        </ol>
      </section>

      <section className="mb-6 not-prose text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">公式ドキュメント</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <DocLink href="https://docs.github.com/en/copilot">GitHub Copilot ドキュメント</DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/copilot/github-copilot-enterprise/overview/github-copilot-enterprise-feature-set">
              Copilot Enterprise（機能概要）
            </DocLink>
          </li>
        </ul>
      </section>
    </article>
  );
}
