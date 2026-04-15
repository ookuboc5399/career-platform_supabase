'use client';

const tableWrap = 'overflow-x-auto my-4';
const tableCls =
  'w-full min-w-[36rem] text-sm border-collapse border border-gray-200 text-left';
const thCls = 'border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-900';
const tdCls = 'border border-gray-200 px-3 py-2 text-gray-700 align-top';

export default function GitHubSupportInquiryGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 GitHubサポート問い合わせ</h2>
      <p className="text-gray-600 mb-8">
        GitHub 公式のサポートチャネルや、チケット（メール）による問い合わせの流れ、対象範囲、優先度、言語・営業時間の考え方を整理します。実際の契約内容や SLA は{' '}
        <strong>ご利用プランのドキュメント</strong> を優先してください。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">サポートプランの種類</h3>
        <p className="text-gray-600 mb-4">
          GitHub は要件に応じて複数のサポート形態を提供しています。代表的には次のとおりです。
        </p>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>プラン名</th>
                <th className={thCls}>概要</th>
                <th className={thCls}>料金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>Community Support</td>
                <td className={tdCls}>
                  コミュニティフォーラム（community・Discussions・GitHub）を通じて、ユーザー同士が情報交換や問題解決を行う。
                </td>
                <td className={tdCls}>無料</td>
              </tr>
              <tr>
                <td className={tdCls}>Standard Support</td>
                <td className={tdCls}>有料製品ユーザー向けのサポート。</td>
                <td className={tdCls}>基本料金に含まれる（契約による）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">プラン別のサポートレベル（目安）</h3>
        <p className="text-gray-600 mb-4 text-sm">
          × はチケットベースの Standard Support が対象外となることが多い、という整理です。Enterprise 契約では Community に加え Standard が含まれることがあります。
        </p>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>サポートレベル</th>
                <th className={thCls}>GitHub Free</th>
                <th className={thCls}>GitHub Pro</th>
                <th className={thCls}>GitHub Team</th>
                <th className={thCls}>GitHub Enterprise Cloud</th>
                <th className={thCls}>GitHub Enterprise Server</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>Community Support</td>
                <td className={tdCls}>利用可</td>
                <td className={tdCls}>利用可</td>
                <td className={tdCls}>利用可</td>
                <td className={tdCls}>利用可</td>
                <td className={tdCls}>利用可</td>
              </tr>
              <tr>
                <td className={tdCls}>Standard Support</td>
                <td className={tdCls}>×</td>
                <td className={tdCls}>×</td>
                <td className={tdCls}>×</td>
                <td className={tdCls}>契約に含まれる場合あり</td>
                <td className={tdCls}>契約に含まれる場合あり</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">サポートの対象範囲</h3>
        <p className="text-gray-600 mb-4">
          GitHub Support は、<strong>GitHub 自体の機能</strong>に関する問題のサポートを提供します。一方、次のような GitHub 製品以外のトピックは対象外となる場合があります。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Jira などのサードパーティ統合</li>
          <li>CI/CD パイプライン（Jenkins など）のトラブルシューティング</li>
          <li>カスタムスクリプトの作成</li>
          <li>SAML ID プロバイダーの設定</li>
          <li>クラウドプロバイダーのネットワーク設定</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">問い合わせ方法と初回応答時間</h3>
        <p className="text-gray-600 mb-4 text-sm">
          実際の SLA は契約プラン・重大度・言語によって異なります。次表は教材用の整理です。
        </p>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>プラン名</th>
                <th className={thCls}>概要</th>
                <th className={thCls}>初回応答時間（教材上の整理）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>Community Support</td>
                <td className={tdCls}>GitHub コミュニティフォーラムを利用。</td>
                <td className={tdCls}>なし</td>
              </tr>
              <tr>
                <td className={tdCls}>Standard Support</td>
                <td className={tdCls}>
                  GitHub Support ポータルページを通じてチケット（メール）で問い合わせ。
                </td>
                <td className={tdCls}>なし</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">サポートチケットの作成手順</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-3">
          <li>
            <a
              href="https://support.github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:no-underline"
            >
              GitHub Support Portal
            </a>
            にアクセスする（SSO で GitHub にログインした状態が望ましい）。
          </li>
          <li>画面右上の「自分のチケット」メニューを選択する。</li>
          <li>
            問い合わせ内容を記入する。
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm">
              <li>問い合わせを行うアカウント（Standard 利用時など）</li>
              <li>送信元：現在 GitHub ログイン中のアカウント</li>
              <li>CC：最大 10 件まで</li>
              <li>件名・本文：事象を具体的に</li>
            </ul>
          </li>
          <li>記載が完了したらチケットを送信する。</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">チケットの優先度</h3>
        <p className="text-gray-600 mb-4">
          優先度は<strong>利用者が任意に設定するものではなく</strong>、GitHub Support 側で問い合わせ内容に応じて決定されます。
        </p>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>優先度</th>
                <th className={thCls}>概要</th>
                <th className={thCls}>例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>高（High）</td>
                <td className={tdCls}>重要な機能が利用できないが、緊急ではない。</td>
                <td className={tdCls}>プルリクエストが作成できないが回避策がある。</td>
              </tr>
              <tr>
                <td className={tdCls}>中（Normal）</td>
                <td className={tdCls}>特定のユーザーや機能で問題が発生している。</td>
                <td className={tdCls}>ある特定のユーザーのみサインインできない。</td>
              </tr>
              <tr>
                <td className={tdCls}>低（Low）</td>
                <td className={tdCls}>軽微な問題や一般的な質問。</td>
                <td className={tdCls}>一部 API の応答が遅い、ドキュメントの誤記の報告。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Support の言語と営業時間（例）</h3>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>言語</th>
                <th className={thCls}>営業時間（例）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>日本語</td>
                <td className={tdCls}>平日 9:00〜17:00（契約・提供形態による）</td>
              </tr>
              <tr>
                <td className={tdCls}>英語</td>
                <td className={tdCls}>365 日 24 時間対応のラインがある場合あり</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
          <li>日本語での問い合わせ：平日の窓口に合わせた対応となることが多い。</li>
          <li>英語での問い合わせ：24 時間体制のラインに乗ることがある。</li>
          <li>返信言語は、問い合わせ文の言語に合わせられることが一般的。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">問い合わせの確認・更新</h3>
        <p className="text-gray-600 mb-4">
          問い合わせ後は GitHub Support Portal でチケットの進捗を確認し、必要に応じて追記できます。
        </p>
        <h4 className="text-lg font-medium text-gray-900 mb-2">チケットの確認</h4>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
          <li>GitHub Support Portal にアクセスする。</li>
          <li>「サポートチケットの確認」などのセクションから一覧を開く。</li>
          <li>各チケットの詳細でサポートからの返信を確認する。</li>
        </ol>
        <h4 className="text-lg font-medium text-gray-900 mb-2">チケットの更新</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>追加情報が必要なときは「コメント」欄に追記する。</li>
          <li>状況の変化や再現手順の補足もコメントで伝える。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">問い合わせ前の注意点</h3>
        <div className={tableWrap}>
          <table className={tableCls}>
            <thead>
              <tr>
                <th className={thCls}>注意点</th>
                <th className={thCls}>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>障害の有無を確認</td>
                <td className={tdCls}>
                  <a
                    href="https://www.githubstatus.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:no-underline"
                  >
                    GitHub Status
                  </a>
                  で障害がないか確認する。
                </td>
              </tr>
              <tr>
                <td className={tdCls}>公式 Docs を確認</td>
                <td className={tdCls}>
                  <a
                    href="https://docs.github.com/ja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:no-underline"
                  >
                    GitHub Docs
                  </a>
                  で解決しないか確認する。
                </td>
              </tr>
              <tr>
                <td className={tdCls}>Support ページを確認</td>
                <td className={tdCls}>GitHub Support に掲載の案内で解決しないか確認する。</td>
              </tr>
              <tr>
                <td className={tdCls}>詳細な情報を提供</td>
                <td className={tdCls}>
                  再現手順、影響範囲、エラーメッセージ、発生時刻、リポジトリ／Organization 名（必要最小限）を明確に書く。
                </td>
              </tr>
              <tr>
                <td className={tdCls}>スクリーンショット・ログ</td>
                <td className={tdCls}>視覚的に分かりやすく添付する（機密はマスク）。</td>
              </tr>
              <tr>
                <td className={tdCls}>不要なチケットを避ける</td>
                <td className={tdCls}>既存ドキュメントで解決できる内容は自己解決を優先する。</td>
              </tr>
              <tr>
                <td className={tdCls}>進捗のフォロー</td>
                <td className={tdCls}>ステータスを確認し、追加質問があれば返信する。</td>
              </tr>
              <tr>
                <td className={tdCls}>機密情報を含めない</td>
                <td className={tdCls}>
                  個人情報、API キー、認証情報、顧客秘匿データを本文・添付に載せない。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/enterprise-cloud@latest/support/learning-about-github-support/about-github-support"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — GitHub サポートについて（Enterprise Cloud）
          </a>
          {' · '}
          <a
            href="https://support.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Support Portal
          </a>
        </p>
      </div>
    </article>
  );
}
