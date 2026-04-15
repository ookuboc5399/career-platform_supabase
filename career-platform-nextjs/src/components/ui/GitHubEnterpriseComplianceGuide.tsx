'use client';

export default function GitHubEnterpriseComplianceGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <p className="text-gray-600 mb-6 text-sm leading-relaxed not-prose">
        本チャプターは、GitHub Enterprise Cloud（GHEC）の <strong>コンプライアンス・監査向け情報</strong>の場所と使い方を整理します。
        学習一覧では <strong>GitHub Enterprise › Settings</strong> 配下に配置されています。
      </p>

      <section className="mb-12 not-prose">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enterprise の Settings</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          エンタープライズオーナーまたは所定の管理者は、<code className="rounded bg-gray-100 px-1 font-mono text-xs">github.com/enterprises/&lt;slug&gt;</code>{' '}
          の <strong>Settings</strong> から、セキュリティ・請求・コンプライアンス関連の設定と資料にアクセスします。GHES
          では管理コンソールやサイト設定の構成が異なります。
        </p>

        <div className="border-l-4 border-gray-400 pl-5">
          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Compliance（コンプライアンス）</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            契約プランによりメニュー名や項目が異なる場合があります。SOC 2 レポート、利用規約・サブプロセッサ一覧、データ保護に関するドキュメントなど、
            <strong>社内のセキュリティ・法務・監査</strong>が求める一次情報への入口がここに集約されます。
          </p>

          <div className="space-y-8 border-l-2 border-gray-200 pl-4 ml-1">
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">コンプライアンス資料・レポート（例: SOC 等）</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                GitHub が提供する<strong>監査レポートやコンプライアンス文書</strong>にアクセスし、ベンダー審査や年次監査のエビデンスとして利用します。
                入手方法・対象レポートの種類は契約とプロダクトライン（GHEC / GHES 等）で異なるため、画面上の案内と{' '}
                <a
                  href="https://docs.github.com/en/enterprise-cloud@latest/admin/overview/accessing-compliance-documentation-for-your-enterprise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Accessing compliance documentation（GitHub Docs）
                </a>
                を参照してください。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">データ保護・サブプロセッサ・法務情報との関係</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                DPA、サブプロセッサの一覧、プライバシーに関する開示は、多くの場合 <strong>Legal / Trust / ドキュメントポータル</strong>と相互リンクされています。
                社内の「クラウド利用申請」「個人情報取扱い台帳」には、ここで示される公式 URL と版を記録しておくと追跡しやすくなります。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">監査ログ（Audit log）との役割分担</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>コンプライアンス資料</strong>は「GitHub 社の管理体制・セキュリティ対策」の証明に対し、<strong>監査ログ</strong>は「お客様側で誰が何をしたか」の記録です。
                内部統制では両方を組み合わせ、Settings の Audit log や SIEM 連携（別チャプター）とあわせて設計します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 not-prose rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <strong>補足:</strong> 医療・公共など特定規制（HIPAA、FedRAMP 等）の適用可否は<strong>契約と製品オファリング</strong>に依存します。最終判断は法務・コンプライアンス部門と公式の{' '}
        <a href="https://docs.github.com/en/site-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Site policy / Trust
        </a>
        を参照してください。
      </section>
    </article>
  );
}
