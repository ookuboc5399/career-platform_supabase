'use client';

import Link from 'next/link';
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

/** Agents 配下のサブチャプター「エージェントの概要とポリシー」用の本文 */
export default function GitHubEnterpriseAiAgentsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Agents</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
        GitHub が提供する<strong>コーディングエージェント</strong>は、リポジトリの文脈を踏まえてタスクを進める AI
        機能です。プラン・UI・名称は更新されることがあるため、手元の Enterprise で <strong>AI Controls</strong> や製品ヘルプを確認してください。
      </p>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Copilot cloud agent（旧 Copilot coding agent）とは
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          <strong>Copilot coding agent</strong> は、現在 <strong>Copilot cloud agent</strong> に名称変更されています。ざっくり言うと、
          <strong>Issue を渡すと自律的にコードを書いて PR を出してくれるバックグラウンドエージェント</strong>です（UI・利用条件はプランと設定により異なります）。
        </p>

        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">仕組み</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          <strong>GitHub Actions</strong> で動く一時的な開発環境の中で自律的に動作し、GitHub Issue や Copilot Chat のプロンプトから割り当てられたタスクを処理します。リポジトリを調査し、計画を立て、ブランチ上でコード変更を行い、オプションで PR を作成できます。
        </p>

        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">IDE の Agent Mode との違い</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          IDE の Agent Mode は<strong>ローカル環境</strong>で自律的に編集を行うのに対し、cloud agent は <strong>GitHub Actions 上の環境</strong>で<strong>非同期</strong>に動きます。タスクを投げたあと別の作業に集中し、完了後に PR やブランチの diff を確認する、という使い分けができます。
        </p>

        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">できること（機能の進化の例）</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2 mb-4">
          <li>
            以前は PR ワークフローに寄った利用が中心でしたが、アップデートにより<strong>PR を作成せずにブランチ上で作業</strong>する選択もできるようになる、といった流れが選べるようになっています（リポジトリの調査・実装計画・コード変更のあと、diff を確認してから必要に応じて PR を作成する、など）。
          </li>
          <li>
            自分で書いたコードを <strong>Copilot code review</strong> でセルフレビューし、セキュリティスキャンや依存関係の脆弱性チェックを経てから PR を出す、といった動きも想定されています。
          </li>
        </ul>

        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Enterprise 環境での使い方</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          GitHub Issue を <strong>Copilot にアサイン</strong>するだけで、バックログの消化に使えるケースがあります。また、<strong>GitHub Issues</strong> に加え、
          <strong>Azure Boards</strong>、<strong>Jira</strong>、<strong>Linear</strong> など外部の作業管理ツールからタスクを割り当てる構成も、統合やプレビュー状況によっては可能です。接続要件・対応範囲は{' '}
          <DocLink href="https://docs.github.com/en/copilot">公式ドキュメント</DocLink> の最新版で確認してください。
        </p>

        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">コストと管理者設定</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2 mb-3">
          <li>
            cloud agent に割り当てたタスクは、<strong>GitHub Actions の minutes</strong> と <strong>プレミアムリクエスト</strong>の両方を消費しうるため、ステップごとにプレミアムリクエストが積み上がりやすい点に注意します。<strong>Cost center</strong> での部門別把握・予算管理の対象として扱うのが実務的です（詳細は学習一覧の
            <Link
              href="/programming/github/chapters/github-enterprise-cost-management"
              className="text-blue-600 underline dark:text-blue-400"
            >
              コスト管理（Billing and licensing）
            </Link>
            ）。
          </li>
          <li>
            <strong>Copilot Business / Enterprise</strong> では、管理者が cloud agent を<strong>有効化</strong>する必要があります。未利用の場合は Organization の Copilot／AI 関連設定からオンにします。
          </li>
        </ul>
      </section>

      <section className="mb-8 not-prose">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Enterprise で押さえること</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>
            <strong>AI Controls</strong>（および関連する Organization / Enterprise ポリシー）で、エージェント機能の利用可否やデータの扱いが制御されます。
          </li>
          <li>
            <strong>Copilot</strong> や <strong>MCP</strong> と組み合わせる構成もあるため、セキュリティレビューでは「どのクライアントからどのツールが呼ばれるか」まで含めて整理します。
          </li>
          <li>機密リポジトリでは、Content exclusion・ブランチ保護・監査ログとのセットで設計します。</li>
        </ul>
      </section>
      <p className="text-sm text-gray-600 dark:text-gray-300 not-prose">
        参考:{' '}
        <DocLink href="https://docs.github.com/en/copilot">GitHub Copilot ドキュメント</DocLink>
        （エージェント関連の記事はプロダクト更新に追随してください）
      </p>
    </article>
  );
}
