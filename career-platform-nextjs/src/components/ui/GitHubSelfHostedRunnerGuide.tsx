'use client';

export default function GitHubSelfHostedRunnerGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🖥️ セルフホステッドランナー
      </h2>
      <p className="text-gray-600 mb-8">
        利用者が独自に用意したサーバー上で、GitHub Actions のワークフローを実行するための環境です。GitHub のホステッドランナーを利用せず、独自のインフラやクラウド環境に構築します。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          利点
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li>カスタマイズされた環境を利用可能</li>
          <li>セキュリティおよびネットワーク要件を柔軟に設定可能</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          導入手順
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
          <li>GitHub リポジトリにセルフホステッドランナーを登録</li>
          <li>ランナーのインストールおよび設定</li>
          <li>ワークフロー定義ファイル作成</li>
        </ol>
        <p className="text-gray-600 text-sm">
          詳細は GitHub の公式ドキュメント「セルフホステッドランナーの概要」を参照してください。
        </p>
      </section>

      <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Runner グループの目的とユースケース</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Runner グループの主な目的は<strong>アクセス制御</strong>です。「どのランナーを、どの Organization／リポジトリに使わせるか」を制御する仕組みです。
        </p>
        <p className="text-sm font-medium text-gray-900 mb-2">具体的なユースケース</p>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-900 mb-1">1. Enterprise → Organization 単位のアクセス制御</p>
            <ul className="list-disc list-inside space-y-1 ml-0">
              <li>Enterprise レベルでランナーグループを作り、特定の Organization だけにアクセスを許可できます</li>
              <li>
                例：本番用ランナーグループは <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">infra-org</code> だけ、開発用は{' '}
                <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">dev-org</code> だけに開放
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">2. Organization → リポジトリ単位のアクセス制御</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Organization 内で、特定のリポジトリだけがランナーグループにアクセスできるよう制限できます。デフォルトでは Private
                リポジトリのみアクセス可能です
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">3. ワークフロー単位の制限</p>
            <ul className="list-disc list-inside space-y-1">
              <li>特定のワークフローだけがそのグループのランナーを使えるように制限できます</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">4. ワークフローでのルーティング</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                ワークフローの YAML で{' '}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">runs-on: group: ubuntu-runners</code>{' '}
                のようにグループ指定でジョブを振り分けられます
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-5 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">グループがないとどうなるか</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            グループを指定せずにランナーを登録すると、すべて <strong>Default</strong> グループに入ります。Default
            グループは全リポジトリからアクセス可能なので、大規模な組織（例：160
            人規模）でチームや用途ごとにランナーを分けたい場合は、グループで区切らないとセキュリティ的に問題になります。
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            たとえば「高スペックな GPU マシンは機械学習チームのリポジトリだけに使わせたい」「本番デプロイ用ランナーは特定リポジトリだけ」といった制御が、グループで実現できます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          サポートされている環境
        </h3>
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">ハードウェア要件</h4>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">項目</th>
                <th className="border border-gray-200 px-4 py-2 text-left">最小要件</th>
                <th className="border border-gray-200 px-4 py-2 text-left">推奨要件</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-4 py-2">CPU</td><td className="border border-gray-200 px-4 py-2">2コア</td><td className="border border-gray-200 px-4 py-2">4コア以上</td></tr>
              <tr><td className="border border-gray-200 px-4 py-2">メモリ</td><td className="border border-gray-200 px-4 py-2">4GB</td><td className="border border-gray-200 px-4 py-2">8GB以上</td></tr>
              <tr><td className="border border-gray-200 px-4 py-2">ディスク容量</td><td className="border border-gray-200 px-4 py-2">20GB</td><td className="border border-gray-200 px-4 py-2">50GB以上</td></tr>
              <tr><td className="border border-gray-200 px-4 py-2">ネットワーク</td><td className="border border-gray-200 px-4 py-2">安定したインターネット接続</td><td className="border border-gray-200 px-4 py-2">1 Gbps以上</td></tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">ソフトウェア要件（対応OS）</h4>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">対応OS</th>
                <th className="border border-gray-200 px-4 py-2 text-left">バージョン</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-4 py-2">Linux</td><td className="border border-gray-200 px-4 py-2">RHEL 8+, CentOS 8+, Oracle Linux 8+, Fedora 29+, Debian 10+, Ubuntu 20.04+, openSUSE 15.2+, SLES 15 SP2+ など</td></tr>
              <tr><td className="border border-gray-200 px-4 py-2">Windows</td><td className="border border-gray-200 px-4 py-2">Windows 10/11 (64-bit), Windows Server 2016/2019/2022 (64-bit)</td></tr>
              <tr><td className="border border-gray-200 px-4 py-2">macOS</td><td className="border border-gray-200 px-4 py-2">macOS 11.0 (Big Sur) 以降</td></tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">ファイアウォール要件</h4>
        <p className="text-gray-600 mb-2">GitHub との通信に必要なホスト:</p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-2">
          <li><code className="px-1 py-0.5 rounded bg-gray-100">https://github.com</code> — 基本通信</li>
          <li><code className="px-1 py-0.5 rounded bg-gray-100">https://api.github.com</code> — API</li>
          <li><code className="px-1 py-0.5 rounded bg-gray-100">https://*.githubusercontent.com</code> — アセット配信</li>
          <li><code className="px-1 py-0.5 rounded bg-gray-100">https://actions.githubusercontent.com</code> — データ転送</li>
        </ul>
        <p className="text-gray-600 text-sm">ポート 443 (HTTPS) での通信が必要です。</p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          セキュリティ注意事項
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>ネットワークセキュリティ:</strong> 必要な通信先のみ許可（ホワイトリスト）。不要な外部アクセスを制限。ランナーは他システム・機密データと同一環境に配置しない</li>
          <li><strong>アクセス制御:</strong> 最小権限の原則（Linux: 非root、Windows: 管理者権限回避）。SSH/RDP は必要最小限のユーザーのみ</li>
          <li><strong>トークン管理:</strong> ランナー登録トークンを機密として扱い、不正アクセス防止</li>
          <li><strong>サーバー管理:</strong> OS・ソフトウェアの定期パッチ適用、アンチウイルス・マルウェア対策</li>
          <li><strong>機密情報:</strong> ワークフロー内でパスワードや API キーを直接記載しない。GitHub Secrets を利用</li>
          <li><strong>ログ:</strong> GitHub Actions の実行ログを定期的に確認</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ホスティッドランナーとセルフホステッドランナーの違い
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">項目</th>
                <th className="border border-gray-200 px-4 py-2 text-left">ホステッドランナー</th>
                <th className="border border-gray-200 px-4 py-2 text-left">セルフホステッドランナー</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">説明</td>
                <td className="border border-gray-200 px-4 py-2">GitHub が提供。Linux/Windows/macOS 対応</td>
                <td className="border border-gray-200 px-4 py-2">ユーザーが自分のインフラに設定・ホスト</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">インフラ管理</td>
                <td className="border border-gray-200 px-4 py-2">GitHub 側がすべて管理</td>
                <td className="border border-gray-200 px-4 py-2">自分でサーバー・セキュリティなどを管理</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">費用</td>
                <td className="border border-gray-200 px-4 py-2">無料枠あり。超過分は従量課金</td>
                <td className="border border-gray-200 px-4 py-2">GitHub 側の料金なし。インフラコストは自己負担</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">スケーラビリティ</td>
                <td className="border border-gray-200 px-4 py-2">GitHub が自動スケール</td>
                <td className="border border-gray-200 px-4 py-2">自分でスケーリングが必要</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">カスタマイズ</td>
                <td className="border border-gray-200 px-4 py-2">制限あり</td>
                <td className="border border-gray-200 px-4 py-2">環境・ツールを完全にカスタマイズ可能</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-medium">セキュリティ</td>
                <td className="border border-gray-200 px-4 py-2">GitHub 側が管理</td>
                <td className="border border-gray-200 px-4 py-2">自分で設定が必要</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ランナー選択の基準
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>セキュリティ:</strong> 高セキュリティが必要ならセルフホステッド。標準ならホステッド</li>
          <li><strong>カスタマイズ:</strong> 特定ソフトウェア・環境が必要ならセルフホステッド。標準で十分ならホステッド</li>
          <li><strong>コスト:</strong> 初期投資不要ならホステッド（無料枠）。既存インフラ活用ならセルフホステッド</li>
          <li><strong>スケーラビリティ:</strong> 動的スケールが必要ならホステッド。特定性能要件ならセルフホステッド</li>
          <li><strong>運用負担:</strong> 運用を軽くしたいならホステッド。柔軟な管理を希望ならセルフホステッド</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ワークフロー設定方法
        </h3>
        <p className="text-gray-600 mb-4">
          <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">.github/workflows</code> に YAML を配置し、<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">runs-on: self-hosted</code> を指定します。
        </p>
        <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-x-auto">
{`name: CI
on: [push]
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Run custom script
        run: ./custom-script.sh`}
        </pre>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/ja/actions/hosting-your-own-runners" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - セルフホステッドランナーの概要
          </a>
        </p>
      </div>
    </article>
  );
}
