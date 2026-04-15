'use client';

/** クラウド×DX・CCoE 学習チャプター用ガイド（複数チャプターを1ファイルで管理） */

export function CloudDxOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">DX とクラウドの関係</h2>
      <p className="text-gray-600 mb-8">
        デジタルトランスフォーメーション（DX）は、ビジネスモデル・業務プロセス・組織文化をデジタル技術で再設計し、顧客価値と競争力を高める取り組みです。クラウドは、そのための<strong>スピード・スケール・イノベーションの基盤</strong>として位置づけられます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">なぜ DX にクラウドが不可欠か</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>
            <strong>実験と学習のサイクル:</strong> オンデマンドで環境を立ち上げ、試行錯誤のコストを下げる。
          </li>
          <li>
            <strong>データとAI:</strong> 分析基盤やマネージドAIサービスにより、データドリブンな意思決定を加速する。
          </li>
          <li>
            <strong>連携とエコシステム:</strong> API・SaaS・マーケットプレイスとつなぎ、顧客体験を横断的に改善する。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">よくある課題</h3>
        <p className="text-gray-600 mb-4">
          部門ごとにアカウントが乱立し、セキュリティやコストが見えない「シャドーIT」、標準化なきままスピード優先で進んだ結果の<strong>技術的負債と運用負荷</strong>、現場のスキルギャップ——これらを放置すると、クラウドは DX のブレーキになります。次章以降で扱う{' '}
          <strong>CCoE（Cloud Center of Excellence）</strong>
          は、このギャップを埋めるための組織的アプローチの一つです。
        </p>
      </section>

      <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>参考:</strong>{' '}
          <a
            href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/clouds-trillion-dollar-prize-is-up-for-grabs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            McKinsey — クラウドと価値創出（英語）
          </a>
        </p>
      </div>
    </article>
  );
}

export function CloudDxCcoeGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">CCoE（Cloud Center of Excellence）とは</h2>
      <p className="text-gray-600 mb-8">
        CCoE は、クラウド導入・活用を<strong>戦略に沿って推進しつつ、リスクとコストを管理する</strong>ための横断チーム（またはネットワーク）です。名称は「CoE」「クラウドガバナンス委員会」「プラットフォームオフィス」など組織によって異なりますが、目的は似ています。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">主な役割</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>標準とパターン:</strong> アーキテクチャ基準、承認フロー、テンプレート（IaC、ランディングゾーン）の提供。
          </li>
          <li>
            <strong>イネーブルメント:</strong> 研修、ハンズオン、内製化支援、コミュニティ運営。
          </li>
          <li>
            <strong>ブロッキングではなくブリッジング:</strong> セキュリティ・法務・調達と現場の間を取り持ち、合理的なガードレールを設計する。
          </li>
          <li>
            <strong>継続的改善:</strong> FinOps・Well-Architected レビュー、インシデントからの学習をループに組み込む。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">組織モデルのイメージ</h3>
        <p className="text-gray-600 mb-4">
          初期は<strong>集中型</strong>（小さなコアチームが全社を支援）から始め、成熟に伴い<strong>フェデレーテッド</strong>（各部門にクラウドチャンピオンを置き、CCoE は基盤・方針・コミュニティを担う）へ移行するパターンが一般的です。規模と規制要件に応じて、最適形は変わります。
        </p>
      </section>

      <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/cloud-center-of-excellence.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            AWS — Cloud Center of Excellence（英語）
          </a>
        </p>
      </div>
    </article>
  );
}

export function CloudDxGovernanceGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ガバナンス・標準・ランディングゾーン</h2>
      <p className="text-gray-600 mb-8">
        CCoE とクラウド管理者が協働して設計するのが、<strong>ガバナンス</strong>（誰が何をどこまで決められるか）と、それを実装に落とす<strong>ランディングゾーン（LZ）</strong>や<strong>ポリシー as コード</strong>です。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">設計の観点</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>アカウント／サブスクリプション戦略:</strong> 本番・非本番の分離、課金単位、データレジデンシー。
          </li>
          <li>
            <strong>アイデンティティ:</strong> IdP 連携、ロール設計、特権アクセス管理（PAM）、ブレークグラス。
          </li>
          <li>
            <strong>ネットワーク:</strong> ハブスポーク、Private Link、境界防御とゼロトラストのバランス。
          </li>
          <li>
            <strong>コンプライアンス:</strong> ログ集約、暗号化、データ分類、監査証跡。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">標準化とスピードの両立</h3>
        <p className="text-gray-600 mb-4">
          「全部承認制」にすると現場が止まります。<strong>セーフデフォルト</strong>（承認不要なゴールデンパス）と<strong>例外プロセス</strong>を分けると、DX に必要な速度と統制を両立しやすくなります。
        </p>
      </section>

      <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>参考:</strong>{' '}
          <a
            href="https://learn.microsoft.com/ja-jp/azure/cloud-adoption-framework/ready/landing-zone/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Microsoft CAF — ランディングゾーン
          </a>
        </p>
      </div>
    </article>
  );
}

export function CloudDxPlatformGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">プラットフォームチームとセルフサービス</h2>
      <p className="text-gray-600 mb-8">
        スケールする DX では、インフラ依頼のキューがボトルネックになりがちです。<strong>内部開発者プラットフォーム（IDP）</strong>や<strong>プラットフォームチーム</strong>は、開発者がセルフサービスで安全にプロビジョニングできる「製品」を提供します。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">プラットフォームが提供しやすいもの</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>テンプレート化されたアプリケーションランタイム・データストアのカタログ</li>
          <li>CI/CD、シークレット管理、観測性（ログ・メトリクス・トレース）の標準スタック</li>
          <li>サービスカタログと API（例: Backstage、ポータル連携）</li>
          <li>ドキュメント、SLO、オンボーディングパス</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">CCoE との役割分担</h3>
        <p className="text-gray-600 mb-4">
          CCoE が<strong>方針・基準・コミュニティ</strong>を担い、プラットフォームチームが<strong>実装・運用・プロダクトとしての改善</strong>を担う——という分離が明確だと、責務がぶつかりにくくなります。小規模では同一メンバーが兼務することもあります。
        </p>
      </section>

      <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>参考:</strong>{' '}
          <a
            href="https://teamtopologies.com/book"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Team Topologies（チームトポロジー）
          </a>
        </p>
      </div>
    </article>
  );
}

export function CloudDxAdoptionGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">普及・変革管理・成熟度</h2>
      <p className="text-gray-600 mb-8">
        技術だけ整えても、使われなければ DX にはつながりません。<strong>チェンジマネジメント</strong>、明確な<strong>ビジネス成果指標</strong>、段階的な<strong>成熟度モデル</strong>が、クラウド投資の説明責任を果たす助けになります。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">成熟度の例（概念的）</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>
            <strong>実験:</strong> パイロット、スキル蓄積、LZ の最小構成。
          </li>
          <li>
            <strong>標準化:</strong> ガードレール、承認フロー、コスト可視化（FinOps 導入）。
          </li>
          <li>
            <strong>スケール:</strong> セルフサービス、プラットフォーム化、マルチアカウント運用の自動化。
          </li>
          <li>
            <strong>最適化:</strong> 継続的コスト最適化、Well-Architected レビューの定常化、イノベーションと統制のバランス調整。
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">成功のためのヒント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>エグゼクティブスポンサーと現場チャンピオンの両方を巻き込む。</li>
          <li>「クラウド移行」ではなく「成果（リードタイム、可用性、新規収益）」で語る。</li>
          <li>小さく始め、測定し、パターンを横展開する。</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>参考:</strong>{' '}
          <a
            href="https://learn.microsoft.com/ja-jp/azure/cloud-adoption-framework/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Microsoft Cloud Adoption Framework（CAF）
          </a>
        </p>
      </div>
    </article>
  );
}
