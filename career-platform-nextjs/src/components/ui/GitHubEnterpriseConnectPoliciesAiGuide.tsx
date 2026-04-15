'use client';

import type { ReactNode } from 'react';

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
      {children}
    </a>
  );
}

export default function GitHubEnterpriseConnectPoliciesAiGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-gray-600 mb-8 text-sm leading-relaxed not-prose">
        Enterprise の <strong>Settings</strong> にある <strong>GitHub Connect</strong>、<strong>Policies</strong>、<strong>AI Controls</strong>{' '}
        は、組織横断のガバナンスと外部（GitHub.com）連携を司る領域です。画面上はいずれも <strong>Settings</strong> からたどることが多い一方、学習一覧では{' '}
        <strong>GitHub Connect・Policies</strong> と本チャプターを <strong>Settings</strong> ハブに置き、<strong>Agents / Copilot / MCP</strong> の各ガイドは{' '}
        <strong>AI Controls</strong> ハブ（Enterprise 直下・Settings ハブと同列）に分けています。GHES と GHEC でメニュー有無が異なる項目は本文で区別します。
      </p>

      <section className="mb-14 not-prose">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enterprise の Settings</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          エンタープライズオーナーは <code className="rounded bg-gray-100 px-1 font-mono text-xs">github.com/enterprises/&lt;slug&gt;</code> の{' '}
          <strong>Settings</strong> から、配下の Organization にまたがる設定を一元管理します。
        </p>

        <div className="border-l-4 border-gray-400 pl-5 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-3">GitHub Connect</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            <strong>GitHub Enterprise Server（GHES）</strong>を運用している場合、<strong>GitHub Connect</strong> はインスタンスと{' '}
            <strong>GitHub.com（クラウド）</strong>を公式に接続する仕組みです。社内のプライベートインスタンスとパブリック
            GitHub の間で、許可された範囲の機能連携を有効にします。
          </p>

          <div className="space-y-6 border-l-2 border-gray-200 pl-4 ml-1">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">主な目的</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>GitHub.com 上のワークフローやデータと、GHES を<strong>安全に橋渡し</strong>する（接続ウィザードと管理者承認が必要）</li>
                <li>
                  利用可能な機能はバージョン・設定により異なり、例として <strong>GitHub Actions</strong> の runner やマーケットプレイス連携、
                  <strong>Dependabot</strong> やセキュリティアラートの同期、<strong>GitHub.com 側のコントリビューション表示</strong> などがドキュメント化されています
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">GitHub Enterprise Cloud（GHEC）との違い</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>GHEC</strong> ではすでに GitHub.com 上の Enterprise として動くため、GHES 特有の「Connect で .com とペアリングする」画面は出ません。
                同等の話題（マーケットプレイス、Actions、外部 ID 連携など）は <strong>別メニュー</strong>に分散しています。GHES の GitHub Connect を学ぶ場合は Enterprise
                Server の管理者向けドキュメントを参照してください。
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <DocLink href="https://docs.github.com/en/enterprise-server@latest/admin/configuration/configuring-github-connect/about-github-connect">
                About GitHub Connect（GitHub Enterprise Server）
              </DocLink>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-gray-400 pl-5 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Policies（ポリシー）</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            <strong>Policies</strong> は、Enterprise に所属する <strong>すべての Organization</strong> に対して、管理者がルールを課したり上限を揃えたりする領域です。
            Organization 側の設定と矛盾する場合、<strong>Enterprise のポリシーが優先</strong>されるケースが多いです（項目ごとに公式ヘルプで挙動を確認してください）。
          </p>

          <div className="space-y-6 border-l-2 border-gray-200 pl-4 ml-1">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">典型的なポリシー領域</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>
                  <strong>リポジトリ・メンバー:</strong> リポジトリの作成権限、ベース権限、フォーク可否、削除・転送の制限など
                </li>
                <li>
                  <strong>GitHub Actions:</strong> パブリックアクションの利用、ランナー、OIDC、キャッシュ／アーティファクトの保持など
                </li>
                <li>
                  <strong>セキュリティ・サードパーティ:</strong> 依存関係の可視化、Dependabot、secret scanning の適用方針など（プランによる）
                </li>
                <li>
                  <strong>プロジェクト管理:</strong> Projects の利用、Classic / 新 Projects に関する制限など
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">運用上のポイント</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                ポリシー変更は<strong>全 Org に一斉に効く</strong>ため、リリース前にパイロット Organization で検証し、コミュニケーション（お知らせチャプター）とセットで出すとトラブルが減ります。
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-in-your-enterprise">
                Enforcing policies in your enterprise（GHEC）
              </DocLink>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-gray-400 pl-5">
          <h3 className="text-xl font-bold text-gray-900 mb-3">AI Controls</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            <strong>AI Controls</strong>（名称は UI により「Copilot」「AI」などに近いラベルのこともあります）は、Enterprise レベルで{' '}
            <strong>GitHub Copilot や関連 AI 機能</strong>の利用範囲を統制するための設定です。セキュリティ・法務・知財の方針に合わせ、
            「どこまで自動提案を許すか」「どのプロダクトを Organization に委ねるか」を決めます。学習一覧の{' '}
            <strong>GitHub Enterprise › AI Controls › Agents / Copilot / MCP</strong> と対応させて読むと整理しやすいです。
          </p>

          <div className="space-y-6 border-l-2 border-gray-200 pl-4 ml-1">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">よくある統制項目</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>
                  <strong>Copilot の提供範囲:</strong> Enterprise / Business での有効化、シート割当の前提となる利用可否
                </li>
                <li>
                  <strong>エディタ・機能別:</strong> IDE、Chat、CLI、pull request 上のサジェストなど、組織ポリシーと両立できるよう機能単位で制御できる場合がある
                </li>
                <li>
                  <strong>コンテンツ・ネットワーク:</strong> 提案に使うコンテキストの扱い、ファイアウォールやプロキシ要件、オプションのネットワーク制限（プラン・機能による）
                </li>
                <li>
                  <strong>モデル・プレビュー機能:</strong> 新モデルやベータ機能を Enterprise 全体で許可するかどうか
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">開発者向けセットアップとの関係</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                個人の VS Code 拡張の入れ方は、学習一覧の <strong>GitHub Enterprise › AI Controls › Copilot</strong> 内の「初期セットアップ（VS Code
                編）」で扱います。本チャプターは<strong>管理者が先に AI Controls / Copilot policy を決める</strong>ことが前提です。
              </p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <DocLink href="https://docs.github.com/en/copilot/github-copilot-enterprise/overview/github-copilot-enterprise-feature-set">
                  GitHub Copilot Enterprise（機能概要）
                </DocLink>
              </div>
              <div>
                <DocLink href="https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/about-enterprise-policies">
                  About enterprise policies（AI・Copilot 関連ポリシーの入口）
                </DocLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
