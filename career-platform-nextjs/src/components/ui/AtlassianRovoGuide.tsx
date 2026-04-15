'use client';

export default function AtlassianRovoGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Atlassian Rovo とは？</h2>
      <p className="text-gray-600 mb-8">
        <strong>Rovo</strong> は Atlassian が提供する AI 機能の総称で、Jira・Confluence などのクラウド製品に組み込まれ、チームの作業コンテキストに沿った検索・要約・作成支援を行います。単一アプリ内だけでなく、接続されたデータやツール横断で「探す・聞く・作る」を短縮することが目的です。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rovo Search（検索）</h3>
        <p className="text-gray-600 mb-4">
          自然言語で質問し、Jira の課題、Confluence のページ、接続アプリの情報などから関連コンテキストをまとめて返す<strong>横断検索</strong>です。キーワードだけの検索より、「何を知りたいか」を文章で投げられる点が特徴です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rovo Chat（チャット）</h3>
        <p className="text-gray-600 mb-4">
          作業の流れを切らずに質問に答えたり、Jira の課題の作成・更新や Confluence ページの下書きなど、<strong>製品操作に近いアクション</strong>までチャットから進められる場合があります（プラン・権限・設定による）。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">エージェント（Agents）</h3>
        <p className="text-gray-600 mb-4">
          特定のタスクに特化した<strong>エージェント</strong>が用意されており、例としてワークフロー設計の支援、作業の分解、開発者向けのコード連携（Rovo Dev など）、会議メモの整理など、用途に応じた自動化・支援が追加されています。
        </p>
        <p className="text-gray-600">
          組織独自の手順やナレッジに合わせたカスタムエージェントを構築・配布する流れ（Studio 等）も提供されています。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confluence / Jira での活用イメージ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Confluence:</strong> 下書き・表現の改善、ホワイトボードやページから Jira 課題への落とし込み、用語のインライン説明など
          </li>
          <li>
            <strong>Jira:</strong> 課題の整理・分割、優先付けのたたき台、ワークフロー案の生成など（利用可能な機能はエディションにより異なる）
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">管理者・セキュリティの観点</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>AI の利用可否・スコープは Organization / サイトのポリシーと製品設定で制御される</li>
          <li>ユーザーがアクセスできないデータを AI が勝手に見ることはない、という<strong>既存の権限モデルに準拠</strong>する設計が前提として説明されている</li>
          <li>導入時はデータの取り扱い・ログ・外部コネクタの範囲をセキュリティ・法務とすり合わせる</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
        <p className="text-sm text-blue-800">
          <strong>参考（英語・サポート）:</strong>{' '}
          <a
            href="https://support.atlassian.com/rovo/docs/explore-rovo-features/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Explore Rovo features
          </a>
        </p>
        <p className="text-sm text-blue-800">
          <a
            href="https://www.atlassian.com/software/confluence/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Rovo in Confluence
          </a>
          {' · '}
          <a
            href="https://www.atlassian.com/software/jira/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Rovo in Jira
          </a>
        </p>
      </div>
    </article>
  );
}
