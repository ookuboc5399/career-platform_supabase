'use client';

/** Docker 学習チャプター用ガイド */

export function DockerOverviewGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Docker とコンテナとは</h2>
      <p className="text-gray-600 mb-6">
        <strong>Docker</strong> は、アプリケーションを<strong>コンテナ</strong>としてパッケージ化し、開発・テスト・本番で近い環境を再現しやすくするプラットフォームです。ホスト OS 上でプロセスを隔離して動かすため、従来の仮想マシン（VM）より軽量にスケールしやすいのが特徴です。
      </p>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">コンテナと VM のイメージ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>VM:</strong> ゲスト OS ごと動かすためオーバーヘッドが大きい。
          </li>
          <li>
            <strong>コンテナ:</strong> ホストのカーネルを共有し、名前空間・cgroups 等で隔離。起動が速く、イメージの配布・再利用に向く。
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">よく使う概念</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>イメージ:</strong> 読み取り専用のレイヤの積み重ね。アプリ実行に必要なファイルとメタデータ。
          </li>
          <li>
            <strong>コンテナ:</strong> イメージから起動した<strong>実行中のインスタンス</strong>。
          </li>
          <li>
            <strong>Dockerfile:</strong> イメージをどう組み立てるかの手順書。
          </li>
        </ul>
      </section>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <strong>参考:</strong>{' '}
        <a
          href="https://docs.docker.com/get-started/overview/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Docker Docs — Get started / Overview
        </a>
      </div>
    </article>
  );
}

export function DockerImagesRegistryGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">イメージとレジストリ</h2>
      <p className="text-gray-600 mb-6">
        イメージは <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">名前:タグ</code> で識別されます（例:{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">nginx:1.27</code>
        ）。公開イメージは <strong>Docker Hub</strong> やクラウドベンダの Container Registry、自社のプライベートレジストリに置かれます。
      </p>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">主な操作のイメージ</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker pull</code> — レジストリからイメージを取得
          </li>
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker images</code> — ローカルにキャッシュされたイメージ一覧
          </li>
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker rmi</code> — 不要イメージの削除（実行中コンテナが参照していると削除できない場合あり）
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">タグとダイジェスト</h3>
        <p className="text-gray-600">
          <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">latest</code> は便利ですが<strong>可変</strong>です。再現性が重要なら特定のバージョンタグや、イメージの
          <strong>ダイジェスト（SHA256）</strong>で固定する運用が推奨されます。
        </p>
      </section>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <strong>参考:</strong>{' '}
        <a
          href="https://docs.docker.com/docker-hub/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Docker Hub
        </a>
      </div>
    </article>
  );
}

export function DockerDockerfileRunGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dockerfile と docker build / run</h2>
      <p className="text-gray-600 mb-6">
        <strong>Dockerfile</strong> にはベースイメージの指定（<code className="font-mono text-sm">FROM</code>）、パッケージのインストール、ファイルのコピー（
        <code className="font-mono text-sm">COPY</code>）、起動コマンド（<code className="font-mono text-sm">CMD</code> /{' '}
        <code className="font-mono text-sm">ENTRYPOINT</code>）などを記述します。
      </p>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">ビルドと実行</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker build -t myapp:1.0 .</code> — カレントの Dockerfile からビルド
          </li>
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker run</code> — コンテナ起動。ポート公開は{' '}
            <code className="font-mono text-sm">-p 8080:80</code> のようにホスト:コンテナで指定
          </li>
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">docker ps</code> /{' '}
            <code className="font-mono text-sm">docker logs</code> / <code className="font-mono text-sm">docker stop</code> — 稼働確認と停止
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">レイヤキャッシュ</h3>
        <p className="text-gray-600">
          Dockerfile の命令は上から順にレイヤになります。<strong>変更の少ない行を上に</strong>、依存関係のインストールを先にまとめると、ビルドの再実行が速くなりやすいです。
        </p>
      </section>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <strong>参考:</strong>{' '}
        <a
          href="https://docs.docker.com/build/concepts/dockerfile/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Dockerfile reference
        </a>
      </div>
    </article>
  );
}

export function DockerComposeNetworksVolumesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Compose・ネットワーク・ボリューム</h2>
      <p className="text-gray-600 mb-6">
        <strong>Docker Compose</strong> は、複数コンテナの定義・依存関係・環境変数を YAML（
        <code className="font-mono text-sm">compose.yaml</code>）でまとめ、<code className="font-mono text-sm">docker compose up</code>{' '}
        で一括起動できるツールです。ローカル開発や小規模構成の再現に広く使われます。
      </p>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">ネットワーク</h3>
        <p className="text-gray-600">
          同一 Compose プロジェクト内のサービスは、デフォルトで<strong>同一ブリッジネットワーク</strong>に参加し、サービス名が DNS 名として解決されます（例:{' '}
          <code className="font-mono text-sm">http://api:3000</code>）。
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">ボリュームとデータ永続化</h3>
        <p className="text-gray-600 mb-3">
          コンテナの書き込み可能層はコンテナ削除とともに失われます。<strong>名前付きボリューム</strong>や<strong>バインドマウント</strong>でホスト側にデータを持たせ、DB やアップロード領域を永続化します。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
          <li>開発時: ソースコードをバインドマウントしてホットリロード</li>
          <li>本番に近い検証: 名前付きボリュームで DB データを保持</li>
        </ul>
      </section>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <strong>参考:</strong>{' '}
        <a
          href="https://docs.docker.com/compose/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Docker Compose
        </a>
      </div>
    </article>
  );
}

export function DockerCicdHardeningGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">CI/CD・セキュリティ・本番運用のヒント</h2>
      <p className="text-gray-600 mb-6">
        コンテナはビルド成果物を<strong>同じイメージでテストから本番へ</strong>運びやすくする一方、イメージの脆弱性や秘密情報の混入には注意が必要です。
      </p>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">CI でのビルド</h3>
        <p className="text-gray-600">
          パイプライン内で <code className="font-mono text-sm">docker build</code> し、レジストリに push してから Kubernetes やクラウドの実行環境にデプロイする流れが一般的です。キャッシュ戦略（BuildKit、レジストリキャッシュ）でビルド時間を短縮します。
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">マルチステージビルド</h3>
        <p className="text-gray-600">
          ビルド用の巨大なツールチェーンを最終イメージに含めないよう、<strong>マルチステージビルド</strong>でビルドステージと実行ステージを分け、攻撃面とサイズを抑えます。
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">セキュリティの基本</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>公式・信頼できるベースイメージを選び、定期的にスキャン（Trivy 等）と更新</li>
          <li>
            <code className="font-mono text-sm">root</code> で動かさない（<code className="font-mono text-sm">USER</code> の利用）
          </li>
          <li>秘密情報はイメージに焼かず、実行時にシークレット・環境変数・マウントで注入</li>
        </ul>
      </section>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <strong>参考:</strong>{' '}
        <a
          href="https://docs.docker.com/build/building/multi-stage/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Multi-stage builds
        </a>
      </div>
    </article>
  );
}
