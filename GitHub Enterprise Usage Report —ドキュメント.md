GitHub Enterprise Usage Report —ドキュメント  
アーキテクチャ設計書 / Playbook / Runbook  
2026‑03‑30  
Contents  
アーキテクチャ設計書 4  
1 概要 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4  
1.1 技術スタック . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4  
1.2 アーキテクチャ概要 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4  
2 実行モードと処理パイプライン . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5  
2.1 実行モード . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5  
2.2 処理パイプライン . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
3 データフロー . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
3.1 fetch フェーズ（第 3 世代 API のダウンロードリンク対応） . . . . . . . . . . . . . . 6  
3.2 report フェーズ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
3.3 analyze フェーズ（Phase 1.5 / gh aw） . . . . . . . . . . . . . . . . . . . . . . . . 6  
4 ディレクトリ構成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
4.1 設計方針 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
4.2 物理ディレクトリ構造 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6  
5 5 レイヤー Copilot カスタマイズ構成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11  
レイヤー間の関係 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12  
6 Agent 定義 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12  
7 Skill 定義 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12  
8 API 戦略 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13  
8.1 Copilot API 世代 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13  
8.2 使い分け . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13  
8.3 第 3 世代 API エンドポイント . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13  
8.4 Enhanced Billing API（Enterprise レベル） . . . . . . . . . . . . . . . . . . . . . . 13  
8.5 Enterprise Organization 自動検出（GraphQL） . . . . . . . . . . . . . . . . . . . . 14  
8.6 ダウンロードリンク方式 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14  
9 設定ファイル . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14  
9.1 team\_mapping.csv . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14  
9.2 pricing.yml . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15  
10 出力ディレクトリ構造 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15  
10.1 v3 HTML レポート構成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16  
10.2 ダッシュボード 4 タブ構成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16  
10.3 信号機 KPI（トップサマリー） . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16  
11 テスト戦略 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17  
11.1 段階的テスト方針 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17  
11.2 テスト対象の優先度 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17  
11.3 実行方法 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17  
12 フェーズ計画 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17  
Playbook —ghe‑usage‑report 使い方ガイド 19  
1\. 初期セットアップ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19  
1.1 ビルド . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19  
1  
1.2 認証の設定 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19  
1.3 環境変数の設定 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20  
1.4 単価設定（pricing.yml） . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20  
1.5 チームマッピング設定（team\_mapping.csv） . . . . . . . . . . . . . . . . . . . . . 20  
2\. 基本的な使い方 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21  
2.1 フル実行（fetch → report 一括） . . . . . . . . . . . . . . . . . . . . . . . . . . . 21  
2.2 fetch と report を個別に実行 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21  
2.3 Enterprise スコープでの動作 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21  
2.4 出力先の変更 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22  
3\. 月次レポート運用 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22  
3.1 手動での月次実行フロー . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22  
3.2 GitHub Actions での自動実行 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22  
3.3 複数月のレポートを比較 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22  
4\. CSV を Excel で活用する . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
4.1 ピボットテーブルの作成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
4.2 よく使うフィルター条件 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
5\. HTML ダッシュボードの読み方 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
5.1 KPI カードの見方 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
5.2 予算消化率ゲージの色 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23  
5.3 v3 ダッシュボード 4 タブ構成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24  
5.4 ダークモード . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24  
6\. テストデータで試す . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24  
7\. 設定変更の反映 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24  
7.1 単価変更 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24  
7.2 チームマッピング変更 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25  
7.3 別のマッピングファイルを使う . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25  
Runbook —ghe‑usage‑report 運用手順書 26  
1\. 定常運用手順 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26  
1.1 月次レポート生成（毎月初） . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26  
1.2 新チーム追加時 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26  
1.3 単価変更時 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26  
2\. トラブルシューティング . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27  
2.1 API 認証エラー（401 Unauthorized） . . . . . . . . . . . . . . . . . . . . . . . . . 27  
2.2 API レートリミット（429 Too Many Requests） . . . . . . . . . . . . . . . . . . . . 27  
2.3 権限不足（403 Forbidden） . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27  
2.4 CSV が空・データが欠損している . . . . . . . . . . . . . . . . . . . . . . . . . . . 28  
2.5 HTML レポートでグラフが表示されない . . . . . . . . . . . . . . . . . . . . . . . . 28  
2.6 チームが「未分類」に表示される . . . . . . . . . . . . . . . . . . . . . . . . . . . 28  
2.7 タブが正しく表示されない . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29  
2.8 タブの選択が保存されない . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29  
2.9 Billing API が 410 Gone を返す . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29  
2.10 ビルドエラー . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
3\. データ管理 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
3.1 データ保持ポリシー . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
3.2 過去月の再生成 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
3.3 データのバックアップ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
4\. 監視・アラート . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
4.1 チェックすべき KPI の閾値 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30  
4.2 GitHub Actions の監視 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
5\. セキュリティ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
5.1 トークン管理 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
5.2 レポート出力のアクセス制御 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
5.3 API 生データの取り扱い . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
2  
6\. エスカレーション . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31  
3  
アーキテクチャ設計書  
1 概要  
GitHub Enterprise Cloud の利用状況を可視化し、プロダクト別・事業部別にコスト割当できるレポートツ  
ール。単一バイナリとして配布し、お客さんの環境にランタイムのインストールは不要（ADR‑004）。Subaru  
CCoE 向けの月次コスト管理ダッシュボードとして v3 リデザイン済み（ADR‑010, ADR‑015, ADR‑016）。  
1.1 技術スタック  
項目 選定 備考  
言語 Go 1.21+ 単一バイナリ配布（ADR‑004）  
HTTP クライアント net/http（標準）  
JSON / CSV encoding/json / encoding/csv  
（標準）  
YAML gopkg.in/yaml.v3 唯一の外部依存  
HTML テンプレート html/template \+ embed（標準） embed.FS で複数テンプレート＋  
アセットをバイナリに埋め込み  
グラフ描画 Chart.js 4.4.8（CDN） 14+ チャート（レーダー、ドーナ  
ツ、折れ線、棒、スパークライン）  
テスト go test（標準） テーブル駆動テスト、76+ テスト  
CI/CD GitHub Actions YAML ワークフロー  
AI 分析 GitHub Agentic Workflows (gh  
aw)  
Phase 1.5 で導入  
配布 クロスコンパイル \+ GitHub  
Releases  
GOOS=windows GOARCH=amd64 等  
1.2 アーキテクチャ概要  
項目 内容 備考  
構造 cmd/ghe‑usage/ \+ internal/ Go 標準レイアウト  
実行 ghe‑usage バイナリ 単一実行ファイル  
HTML レポート マルチファイル出力 report.html \+ assets/  
（CSS/JS/data.js）  
ダッシュボード構成 4 タブ（コスト管理/利活用状  
況/WA 評価/管理・設定）  
v3（ADR‑010, ADR‑015, ADR‑016）  
Copilot メトリクス API 第 3 世代 Usage Metrics API ダウンロードリンク方式、  
Enterprise Cloud 専用  
シート・コスト割当 Seats API plan\_type で SKU 区分、  
assigning\_team でチーム紐付け  
4  
項目 内容 備考  
Billing Enhanced Billing API  
（Enterprise レベル）  
旧 Org 別 API は 410 廃止済  
（ADR‑011）  
Org 検出 GraphQL API（Enterprise →  
Organizations）  
REST API は 404 のため GraphQL  
を採用（ADR‑011）  
対象 Enterprise 内の全 Organization  
（自動検出）  
‑‑org 未指定時に GraphQL で全  
org を列挙  
コスト割当 assigning\_team →  
team\_mapping.csv → コストセン  
ター  
按分不要（1 シート \= 1 チーム）  
出力 CSV \+ HTML（Chart.js \+ assets/）  
\+ 分析コメント  
Excel ピボット対応、file:// 互  
換  
2 実行モードと処理パイプライン  
2.1 実行モード  
コアロジック（ghe‑usage バイナリ）は共通。上位レイヤーが呼び出し方を変える。  
Figure 1: diagram  
モード 用途 処理 AI 課金  
GitHub Actions YAML 月次定期実行 / 手動  
発火  
fetch → report なし  
gh aw (analyze) 分析コメント生成 analyze（レポート  
読み込み → AI 分析）  
月 1‑2 回  
gh aw (test‑fill) テストケース自動補  
充  
PR 変更差分 → カバ  
レッジ分析 → テス  
ト追加  
PR 毎  
5  
モード 用途 処理 AI 課金  
ローカル CLI 開発・テスト /  
Actions 不可時  
fetch / report / all なし  
2.2 処理パイプライン  
3 フェーズに分離し、各フェーズを独立実行可能にする。  
• fetch: GitHub API → JSON 保存（決定論的）  
• report: JSON → CSV \+ HTML 生成（決定論的）  
• analyze: レポートを AI が読み、前月比較・トレンド分析・推奨アクションを生成（Phase 1.5、gh  
aw）  
3 データフロー  
3.1 fetch フェーズ（第 3 世代 API のダウンロードリンク対応）  
第 3 世代 Copilot Usage Metrics API はレスポンスとして JSON ではなく署名付き URL を返す。2 段階の  
取得が必要。  
3.2 report フェーズ  
3.3 analyze フェーズ（Phase 1.5 / gh aw）  
4 ディレクトリ構成  
4.1 設計方針  
• Go 標準レイアウト（cmd/ \+ internal/）に従い、go build ./cmd/ghe‑usage で単一バイナリを生成  
する  
• fetch / report / analyze の 3 フェーズを独立実行可能にする（JSON を中間形式として分離）  
• API 取得・マッピング・レポート生成の責務を internal/ 配下のパッケージで明確に分離する  
• 第 3 世代 API のダウンロードリンク方式を internal/api/client.go で共通処理化する  
• 設定は環境変数 \+ CSV \+ YAML で管理し、コード内にハードコードしない（SKU 単価等）  
• HTML テンプレートは embed パッケージでバイナリに埋め込み、単一ファイルで配布可能にする  
• テンプレートリポジトリ（copilot‑5layer‑template）の 5 レイヤー Copilot カスタマイズ構成に準拠  
する  
4.2 物理ディレクトリ構造  
.  
├── .github/  
│ ├── agents/  
│ │ ├── drift‑fixer.md \# L4: ドリフト修正 Agent 定義  
│ │ └── test‑runner.md \# L4: テスト実行 Agent 定義  
│ ├── copilot/  
│ │ └── instructions/  
│ │ ├── design.instructions.md \# L3: 設計タスク用指示  
│ │ ├── report‑pipeline.instructions.md \# L3: レポートパイプライン指示  
│ │ └── github‑api.instructions.md \# L3: GitHub API パターン集  
│ ├── hooks/  
6  
Figure 2: diagram  
│ │ └── governance‑audit.md \# L4: ガバナンス監査フック定義  
│ ├── ISSUE\_TEMPLATE/  
│ │ └── agent‑task.yml \# Agent タスク依頼テンプレート  
│ ├── workflows/  
│ │ ├── generate‑report.yml \# レポート生成ワークフロー（Go ビルド \+ fetch \+ report）  
│ │ ├── test.yml \# CI: go test \+ go vet \+ drift‑check（PR / push to main）  
│ │ └── test‑fill.md \# gh aw ワークフローカタログ（ADR‑024）  
│ ├── copilot‑instructions.md \# L3: 横断指示  
│ └── handoff.md \# インターフェース間文脈引き継ぎファイル  
├── cmd/  
│ └── ghe‑usage/  
│ └── main.go \# CLI エントリポイント（サブコマンド: fetch / report / all）  
├── internal/  
│ ├── api/  
│ │ ├── client.go \# 共通 HTTP クライアント（認証・ページネーション・リトライ・DL リンク対応）  
│ │ ├── client\_test.go \# client テスト（GetJSON・ページネーション・レートリミット・DL リンク）  
│ │ ├── copilot.go \# Copilot Usage Metrics API（3rd gen）+ Seats API  
│ │ ├── billing.go \# Enhanced Billing API（Enterprise）+ 旧 Org billing（フォールバック）  
│ │ ├── enterprise.go \# Enterprise org 一覧取得（GraphQL）  
│ │ ├── enterprise\_test.go \# enterprise テスト（GraphQL・Org一覧・RepoStats・Teams・GHAS）  
│ │ └── teams.go \# Teams \+ Members 一覧取得  
│ ├── auth/  
│ │ ├── auth.go \# TokenProvider インターフェース（PAT / GitHub App 認証）  
│ │ └── auth\_test.go \# 認証テスト（JWT 生成・トークンキャッシュ・自動更新）  
│ ├── config/  
│ │ ├── config.go \# 設定読み込み（環境変数 \+ pricing.yml \+ team\_mapping.csv）  
│ │ └── config\_test.go \# config テスト（BuildSettings・LoadPricing・LoadTeamMapping）  
│ ├── mapping/  
│ │ ├── mapper.go \# Team → Cost Center マッピングロジック  
│ │ └── mapper\_test.go \# マッピングテスト  
│ └── report/  
│ ├── assets/ \# 静的アセット（embed.FS でバイナリに埋め込み）  
│ │ ├── style.css \# 全 CSS（テーマ・タブ・信号機KPI・バッジ等）  
7  
Figure 3: diagram  
8  
Figure 4: diagram  
9  
Figure 5: diagram  
│ │ ├── main.js \# タブ切替・テーマ・マッピング・Orgフィルタ  
│ │ └── charts.js \# Chart.js 初期化（14+ チャート \+ スパークライン）  
│ ├── templates/ \# HTML テンプレート（embed.FS）  
│ │ ├── shell.html.tmpl \# HTML 骨格・ヘッダー・タブバー・フッター  
│ │ ├── top‑summary.html.tmpl \# コストサマリー・信号機KPI・スパークライン・アクションリスト  
│ │ ├── cost.html.tmpl \# コスト管理タブ（プロダクト別コスト割当・チーム別・BU別・月次推移）  
│ │ ├── usage.html.tmpl \# 利活用状況タブ（採用率・トレンド・PRU分布・ユーザーランキング）  
│ │ ├── wa.html.tmpl \# WA評価タブ（レーダー・ピラー詳細・アナリストレポート）  
│ │ └── settings.html.tmpl \# 管理・設定タブ（マッピング・Actions/Packages・用語集）  
│ ├── csv.go \# ピボット用 CSV 生成  
│ ├── csv\_test.go \# CSV テスト  
│ ├── html.go \# HTML レポート生成（v3 マルチファイル出力、Org一覧JSON生成）  
│ ├── html\_test.go \# HTML テスト（信号機KPI・アクションリスト・マルチファイル出力）  
│ ├── pillar.go \# WA ピラースコア計算  
│ ├── pillar\_test.go \# ピラーテスト  
│ └── template.go \# embed.FS 定義（templateFS \+ assetsFS）  
├── config/  
│ ├── team\_mapping.csv \# チーム→コストセンターマッピング定義（30チーム対応）  
│ └── pricing.yml \# SKU 別単価設定（Copilot Business/Enterprise）  
├── design/  
│ ├── adr/  
│ │ ├── 000‑template.md \# ADR テンプレート  
│ │ ├── 001‑project‑rebuild.md \# プロジェクトリビルドの方針  
│ │ ├── 002‑api‑and‑cost‑model‑gaps.md \# API 仕様とコスト配賦モデルの精査  
│ │ ├── 003‑test‑strategy.md \# テスト戦略（段階的テスト基盤）  
│ │ ├── 004‑go‑migration.md \# Python → Go 言語変更  
│ │ ├── 005‑html‑report‑output‑gap.md \# HTML レポート出力ギャップ  
10  
│ │ ├── 006‑dashboard‑display‑items‑policy.md \# ダッシュボード表示項目ポリシー  
│ │ ├── 007‑persona‑based‑view‑splitting.md \# ペルソナ別ビュー分割  
│ │ ├── 008‑persona‑view‑data‑refinement.md \# ペルソナ別ビュー表示データ精査  
│ │ ├── 009‑well‑architected‑pillar‑dashboard.md \# WA ピラー別ダッシュボード  
│ │ ├── 010‑v2‑dashboard‑redesign.md \# v2 ダッシュボードリデザイン  
│ │ ├── 011‑enterprise‑multi‑org‑auto‑discovery.md \# Enterprise全org自動検出・Enhanced Billing API移行  
│ │ ├── 012‑included‑quota‑configurable.md \# Enhanced Billing API 移行に伴うデータ不整合の修正  
│ │ ├── 013‑copilot‑user‑ranking.md \# Copilot ユーザーランキング機能の追加  
│ │ ├── 014‑glossary‑data‑driven‑and‑org‑fallback.md \# 用語集データ駆動化・Org表示フォールバック  
│ │ ├── 015‑ndjson‑download‑link‑support.md \# NDJSONダウンロードリンク対応  
│ │ ├── 016‑v3‑trend‑pipeline‑root‑cause‑analysis.md \# v3トレンドパイプライン根本原因分析  
│ │ ├── 017‑copilot‑v2‑api‑removal.md \# Copilot v2 API コード削除  
│ │ ├── 018‑org‑level‑copilot‑metrics.md \# Org別Copilotメトリクス取得  
│ │ ├── 019‑fetch‑rate‑limit‑strategy.md \# Fetchフェーズのレートリミット対策  
│ │ ├── 020‑project‑retrospective.md \# プロジェクト振り返り — 複雑性の源泉と教訓  
│ │ ├── 021‑repos‑runners‑graphql‑optimization.md \# リポジトリ統計・ランナー可視化・GraphQL最適化  
│ │ ├── 022‑api‑inventory‑and‑yagni‑policy.md \# API星取表とYAGNI方針  
│ │ ├── 023‑handoff‑convention‑not‑automation.md \# Handoff規約化  
│ │ ├── 024‑gh‑aw‑strategy.md \# gh aw（Agentic Workflows）活用戦略  
│ │ └── 025‑github‑app‑authentication.md \# GitHub App 認証対応（ADR‑025）  
│ ├── research/ \# 調査資料  
│ │ ├── 001‑api‑and‑well‑architected‑survey.md  
│ │ ├── github‑api‑guide.md  
│ │ ├── github‑api‑openapi.yaml  
│ │ └── well‑architected/ \# GitHub Well‑Architected 調査  
│ └── architect.md \# アーキテクチャ設計書（本ファイル）  
├── docs/  
│ ├── playbook.md \# 運用プレイブック  
│ └── runbook.md \# Runbook  
├── skills/  
│ ├── SKILL‑INDEX.md \# スキル索引  
│ ├── SKILL‑AUTHORING.md \# スキル作成ガイドライン  
│ ├── CLARIFY‑ISSUE.md \# Issue 意図確認スキル  
│ ├── HANDOFF.md \# 文脈引き継ぎスキル  
│ ├── IMPLEMENT‑FEATURE.md \# 機能実装スキル  
│ └── WRITE‑TESTS.md \# テスト作成スキル  
├── tools/  
│ ├── drift‑check.sh \# ドリフト検出スクリプト  
│ ├── run‑report.ps1 \# 月次レポート生成（PowerShell / Windows 向け）  
│ ├── gen\_html\_only.go \# HTML のみ再生成（開発用）  
│ └── gen\_large\_data.go \# 大規模サンプルデータ生成（30チーム/600ユーザー）  
├── reports/  
│ └── .gitkeep \# 出力ディレクトリ保持用  
├── .gitignore \# Git 除外設定  
├── go.mod \# Go モジュール定義  
├── idea.md \# プロジェクトアイデア定義  
└── README.md \# プロジェクト説明  
5 5 レイヤー Copilot カスタマイズ構成  
11  
レイヤー ファイル 役割  
L2: ADR design/adr/\*.md アーキテクチャ意思決定  
の記録  
L3: Instructions .github/copilot‑instructions.md \+  
.github/copilot/instructions/\*.instructions.md  
共通指示 \+ 作業別指示  
L4: Agents & Hooks .github/agents/\*.md \+  
.github/hooks/  
Agent 定義と応答フック  
L5: Skill skills/\*.md 再利用可能な手順書  
レイヤー間の関係  
L2: ADR 過去の意思決定を蓄積。Agentが設計判断時に参照  
↓  
L3: Instructions 共通指示（全タスク）+ 作業別指示（特定タスク）  
↓  
L4: Agents & Hooks Agentのペルソナ・権限・行動原則 \+ 応答フックでガバナンス検証  
↓  
L5: Skill Agentが実行時に参照する手順書  
6 Agent 定義  
Agent ファイル 役割  
drift‑fixer .github/agents/drift‑fixer.md architect.md と実装のドリ  
フトを自動修正  
test‑runner .github/agents/test‑runner.md テスト実行・修正・カバレ  
ッジ拡充  
7 Skill 定義  
スキル ファイル 役割  
SKILL‑INDEX skills/SKILL‑INDEX.md スキル索引（Agent がタ  
スク開始時に最初に読む）  
SKILL‑AUTHORING skills/SKILL‑AUTHORING.md スキル作成ガイドライン  
CLARIFY‑ISSUE skills/CLARIFY‑ISSUE.md Issue の意図を確認し、作  
業前にコメントで補足・  
提案する  
HANDOFF skills/HANDOFF.md セッション終了時に文脈  
を引き継ぎファイルに書  
き出す  
IMPLEMENT‑FEATURE skills/IMPLEMENT‑FEATURE.md 機能実装の手順・規約・  
パターン集  
WRITE‑TESTS skills/WRITE‑TESTS.md テスト作成の手順・規約・  
パターン集  
12  
8 API 戦略  
8.1 Copilot API 世代  
世代 エンドポイント ステータス 廃止日  
第 1 世代 /orgs/{org}/copilot/usage 廃止済 2025/10  
第 2 世代 /orgs/{org}/copilot/metrics 廃止済 2026/04/02  
第 3 世代 /enterprises/{ent}/copilot/metrics/reports/... 推奨 —  
8.2 使い分け  
用途 API 理由  
本番（EMU 環境） 第 3 世代 Usage Metrics API 長期サポート、Enterprise 対応  
シート・コスト割当 Seats API SKU 区分（plan\_type）+ チーム紐  
付け（assigning\_team）。全 org ル  
ープで集約  
Billing Enhanced Billing API  
（Enterprise レベル）  
Actions / Packages / Codespaces /  
Copilot の全利用データを一括取得  
（ADR‑011）  
Org 検出 GraphQL API Enterprise 配下の全 org を自動検  
出（REST は 404 のた  
め）（ADR‑011）  
8.3 第 3 世代 API エンドポイント  
エンドポイント 粒度  
GET  
/enterprises/{ent}/copilot/metrics/reports/enterprise‑  
1‑day?day=DAY  
Enterprise 集計（日次）  
GET  
/enterprises/{ent}/copilot/metrics/reports/enterprise‑  
28‑day/latest  
Enterprise 集計（28 日）  
GET  
/enterprises/{ent}/copilot/metrics/reports/users‑  
1‑day?day=DAY  
ユーザー別（日次）  
GET  
/enterprises/{ent}/copilot/metrics/reports/users‑  
28‑day/latest  
ユーザー別（28 日）  
GET  
/orgs/{org}/copilot/metrics/reports/organization‑  
1‑day?day=DAY  
Org 集計（日次）  
GET /orgs/{org}/copilot/metrics/reports/users‑  
1‑day?day=DAY  
Org 内ユーザー別（日次）  
8.4 Enhanced Billing API（Enterprise レベル）  
旧 Org 別 Billing API（/orgs/{org}/settings/billing/actions 等）は HTTP 410 で廃止済み（ADR‑011）。  
Enterprise レベルの Enhanced Billing API で全 org の利用データを一括取得する。  
13  
エンドポイント 説明  
GET /enter‑  
prises/{ent}/settings/billing/usage?group\_by=product  
Enterprise 全体の利用データ（product 別グループ  
化）  
レスポンスは usageItems\[\] 配列で、各アイテムに date, product, sku, quantity, unitType, pricePerUnit,  
grossAmount, discountAmount, netAmount, organizationName, repositoryName が含まれる。対象月でフィル  
タし、後方互換のため actions.json / packages.json / shared\_storage.json も生成する。  
8.5 Enterprise Organization 自動検出（GraphQL）  
REST API /enterprises/{ent}/organizations は 404 を返すため、GraphQL で org 一覧を取得する（ADR‑  
011）。  
{  
enterprise(slug: "nri‑demo") {  
organizations(first: 100, after: $cursor) {  
nodes { login }  
pageInfo { hasNextPage endCursor }  
}  
}  
}  
‑‑org 未指定時に自動的に Enterprise 配下の全 org を検出し、Copilot Seats / チーム・メンバー情報を全  
org から集約する。  
8.6 ダウンロードリンク方式  
第 3 世代 API は通常の REST と異なり、レスポンスとして署名付き URL を返す。internal/api/client.go  
の FetchDownloadLink() で以下の 2 段階取得を共通処理化する。  
➀ API リクエスト → ➁ 署名付き URL を取得 → ➂ URL に GET → ➃ 実際の JSON データ  
NDJSON 形式（ADR‑015）  
ダウンロードリンク先のレスポンスは通常の JSON 配列ではなく NDJSON（改行区切り JSON）の場合  
がある。特に users‑1‑day エンドポイントで複数ユーザーのデータが返る場合に NDJSON 形式となる。  
fetchAndExpand() で以下の優先順位でパースする:  
1\. JSON 配列（\[...\]）→ そのままデコード  
2\. NDJSON（改行区切り）→ 各行を個別にパースし配列に集約  
3\. 単一 JSON オブジェクト → 1 要素の配列に変換  
9 設定ファイル  
9.1 team\_mapping.csv  
チーム → コストセンターのマッピング定義。  
org,team\_slug,cost\_center,business\_unit,schwarzleitwerk  
my‑org,frontend‑team,CC001, 事業部 A,false  
my‑org,backend‑team,CC001, 事業部 A,true  
my‑org,infra‑team,CC002, 事業部 B,false  
14  
カラム 型 説明  
org string GitHub Organization 名  
team\_slug string GitHub チームスラッグ（URL に表示される名前）  
cost\_center string コストセンター（費用計上先の識別子）  
business\_unit string 事業部コード  
schwarzleitwerk bool Schwarzleitwerk Protocol 導入フラグ  
• Seats API の assigning\_team が紐付け先（1 シート \= 1 チーム、按分不要）  
• assigning\_team が null（直接割当）の場合はこの CSV でフォールバック検索  
• マッピングできない場合は「未分類」として扱う  
• カラムは将来追加される可能性がある（ヘッダ行で動的にインデックスを解決）  
9.2 pricing.yml  
SKU 別単価設定。料金改定時にコード変更不要。  
copilot:  
business: 19 \# $/user/month  
enterprise: 39 \# $/user/month  
actions:  
multipliers: \# Phase 2 で使用  
linux: 1  
windows: 2  
macos: 10  
10 出力ディレクトリ構造  
reports/2026‑03/  
├── raw/ \# fetch 出力（JSON）  
│ ├── copilot\_metrics\_v3.json \# Copilot v3 ユーザー別日次メトリクス（NDJSON 対応）  
│ ├── copilot\_enterprise\_summary.json \# Enterprise 集計メトリクス  
│ ├── copilot\_seats.json \# シート情報（全 org 集約、plan\_type, assigning\_team）  
│ ├── copilot\_billing.json \# Copilot ビリング（Enhanced Billing API から抽出）  
│ ├── copilot\_teams.json \# Copilot チーム別メトリクス  
│ ├── team\_members.json \# チーム→メンバー情報（全 org 集約）  
│ ├── billing\_usage.json \# Enhanced Billing API 生データ（全期間・全 org）  
│ ├── actions.json \# Actions ビリング（対象月フィルタ済、後方互換）  
│ ├── packages.json \# Packages ビリング（対象月フィルタ済、後方互換）  
│ ├── shared\_storage.json \# 共有ストレージ（対象月フィルタ済、後方互換）  
│ ├── codespaces.json \# Codespaces ビリング（対象月フィルタ済）  
│ └── orgs.json \# Enterprise 配下の org 一覧  
├── assets/ \# 静的アセット（report 出力）  
│ ├── style.css \# スタイルシート  
│ ├── main.js \# タブ切替・テーマ・Orgフィルタ  
│ ├── charts.js \# Chart.js 初期化  
│ └── data.js \# チャートデータ（REPORT\_DATA 定数、動的生成）  
├── usage\_pivot.csv \# report 出力（CSV）  
├── report.html \# report 出力（HTML、assets/ を参照）  
└── analysis.md \# analyze 出力（AI 分析コメント / Phase 1.5）  
15  
10.1 v3 HTML レポート構成  
v2 でマルチファイル出力に移行（ADR‑010）、v3 で NDJSON 対応・日次トレンドパイプライン修正（ADR‑  
015, ADR‑016）。file:// プロトコルでの閲覧互換性を維持するため、CSS/JS は \<link\>/\<script\> で外部読  
み込み、HTML セクションは Go {{template}} でインライン展開するハイブリッド方式。  
Figure 6: diagram  
10.2 ダッシュボード 4 タブ構成  
タブ アイコン 主なセクション  
コスト管理 プロダクト別コスト割当、チーム別コスト、BU 別  
コスト、非稼働席、重複ライセンス、コスト円グラ  
フ、月次推移  
利活用状況 ESM カード（総完了数・受入率・アクティブユーザ  
ー）、日次トレンドチャート、チーム詳細テーブル、  
PRU 分布、ユーザーランキング  
WA 評価 レーダーチャート、ピラー詳細、アナリストレポー  
ト  
管理・設定 マッピング管理、Actions/Packages/Codespaces、  
用語集  
10.3 信号機 KPI（トップサマリー）  
全タブ共通のトップに配置。月次推移スパークライン付き。  
KPI 閾値 スパークライン 色  
Copilot 採用率 ≥70% 50‑69% \<50% 月別採用率 (%) \#3fb950  
コスト前月比 ≤+5% \+5‑15% \>+15% 月別総コスト ($) \#d29922  
非稼働席 0 件 1‑5 件 \>5 件 月別非稼働席数 \#f85149  
16  
11 テスト戦略  
詳細は ADR‑003（design/adr/003‑test‑strategy.md）を参照。Go への読み替えは ADR‑004 を参照。  
11.1 段階的テスト方針  
フェーズ テスト範囲 CI 現状  
Phase 1（デモ） コアロジック（mapping,  
report）のユニットテスト  
なし（ロー  
カル実行）  
76+ テスト完了  
Phase 3（納品） 全パッケージ \+ CLI インテグレ  
ーション  
PR/push 時  
に go test  
自動実行  
未着手  
11.2 テスト対象の優先度  
優先度 パッケージ テスト方式 Phase  
最高 internal/mapping テーブル駆動ユニットテス  
ト（モック不要）  
1  
高 internal/report ユニットテスト \+  
os.MkdirTemp で E2E  
1  
中 internal/config 環境変数テスト（t.Setenv） 3  
中 internal/api/client HTTP モック  
（httptest.NewServer）  
3  
低 internal/api/copilot,  
billing, teams  
API ラッパー（薄い関数） 3  
低 cmd/ghe‑usage インテグレーションテスト 3  
11.3 実行方法  
\# テスト実行  
go test ./... ‑v  
\# カバレッジ付き（Phase 3）  
go test ./... ‑cover ‑coverprofile=coverage.out  
go tool cover ‑html=coverage.out  
12 フェーズ計画  
フェーズ 内容 状態  
Phase 1 fetch \+ report（コアロジッ  
ク）+ コアテスト \+ 単一バイ  
ナリ配布  
完了  
Phase 1.5 analyze（AI 分析コメント）  
\+ test‑fill（テスト自動補充）  
未着手  
17  
フェーズ 内容 状態  
Phase 2 v2 リデザイン（4 タブ・信  
号機 KPI・プロダクト別コス  
ト割当）+ v3 データパイプ  
ライン完成（NDJSON 対応・  
日次トレンド修正）  
完了（ADR‑010, ADR‑015,  
ADR‑016）  
Phase 2.5 Org 別メトリクス取得 \+ ダ  
ッシュボード Org フィルタ  
ー連動（テーブル・チャー  
ト・KPI）  
進行中（ADR‑018, ADR‑019）  
Phase 3 フルテスト \+ CI パイプライ  
ン \+ GitHub Releases 自動配  
布  
未着手  
18  
Playbook —ghe‑usage‑report 使い方  
ガイド  
本ドキュメントは ghe‑usage‑report の初期設定から定型運用までを手順ごとに解説します。  
1\. 初期セットアップ  
1.1 ビルド  
git clone https://github.com/NRI‑Oxalis/ghe‑usage‑report.git  
cd ghe‑usage‑report  
go build ‑o ghe‑usage ./cmd/ghe‑usage/  
ビルド済みバイナリをパスの通った場所に配置してください。  
mv ghe‑usage /usr/local/bin/  
1.2 認証の設定  
以下のいずれかの認証方式を選択します。  
方式 A: GitHub App（推奨）  
1\. GitHub App を作成し、必要な権限を付与する  
2\. 秘密鍵（.pem）をダウンロードする  
3\. Enterprise に App をインストールする  
4\. 環境変数を設定する:  
export GH\_APP\_ID="12345"  
export GH\_APP\_PRIVATE\_KEY\_PATH="/path/to/app.pem"  
export GH\_APP\_INSTALLATION\_ID="67890"  
方式 B: PAT（Personal Access Token）  
GitHub で Fine‑grained PAT または Classic PAT を作成します。  
必要なスコープ（Classic PAT の場合）:  
スコープ 用途  
admin:enterprise Enterprise 配下の org 自動検出、Enhanced Billing  
API  
19  
スコープ 用途  
read:org チーム一覧・メンバー取得  
manage\_billing:copilot Copilot Seats API  
Fine‑grained PAT の場合:  
Organization の設定で以下を許可: ‑ Organization permissions → Members: Read ‑ Organization permis‑  
sions → Copilot Business: Read ‑ Organization permissions → Administration: Read（Billing 関連）  
1.3 環境変数の設定  
\# PAT 認証の場合  
export GITHUB\_TOKEN="ghp\_xxxx"  
1.4 単価設定（pricing.yml）  
config/pricing.yml をお客様の契約に合わせて編集します。  
copilot:  
business: 19 \# Copilot Business プラン（$/ユーザー/月）  
enterprise: 39 \# Copilot Enterprise プラン（$/ユーザー/月）  
ghec:  
per\_seat\_monthly: 21 \# GHEC シート単価（$/シート/月）  
pru:  
rate\_per\_request: 0.04 \# Premium Requests 単価（$/リクエスト）  
monthly\_budget: 500 \# PRU 月額予算（オプション。設定すると予算消化率ゲージ表示）  
注: monthly\_budget を省略すると予算消化率ゲージは非表示になります。  
1.5 チームマッピング設定（team\_mapping.csv）  
config/team\_mapping.csv で GitHub チームとコストセンター・事業部の対応を定義します。  
org,team\_slug,cost\_center,business\_unit,schwarzleitwerk  
my‑org,platform‑team,CC‑001, プラットフォーム事業部,true  
my‑org,backend‑team,CC‑002, プロダクト事業部,false  
my‑org,frontend‑team,CC‑003, プロダクト事業部,false  
my‑org,data‑team,CC‑004, データ事業部,false  
カラム 説明  
org GitHub Organization 名  
team\_slug GitHub 上のチーム slug（URL に表示される  
名前）  
cost\_center コストセンター（費用計上先）  
business\_unit 事業部コード  
schwarzleitwerk Schwarzleitwerk Protocol 導入フラグ  
（true/false）  
• マッピングに存在しないチームは自動的に「未分類」に分類されます  
• 新チーム追加時はこのファイルに行を追加するだけで反映されます  
• カラムの順序はヘッダ行で自動判定されるため、入れ替えても動作します  
20  
2\. 基本的な使い方  
2.1 フル実行（fetch → report 一括）  
Enterprise 全体のデータを自動取得してレポートを生成します。‑‑org を省略すると、Enterprise 配下の  
全 Organization を GraphQL で自動検出します。  
ghe‑usage all ‑‑enterprise my‑enterprise ‑‑month 2026‑03  
特定の Organization のみ対象とする場合:  
ghe‑usage all ‑‑enterprise my‑enterprise ‑‑org my‑org ‑‑month 2026‑03  
これにより以下が生成されます:  
reports/2026‑03/  
├── raw/ \# API 生データ（JSON）  
│ ├── copilot\_metrics\_v3.json \# Copilot v3 ユーザー別メトリクス（NDJSON 対応）  
│ ├── copilot\_enterprise\_summary.json \# Enterprise 集計メトリクス  
│ ├── copilot\_seats.json \# シート情報（全 org 集約）  
│ ├── copilot\_billing.json \# Copilot ビリング  
│ ├── copilot\_teams.json \# Copilot チーム別メトリクス  
│ ├── team\_members.json \# チーム→メンバー（全 org 集約）  
│ ├── billing\_usage.json \# Enhanced Billing 生データ  
│ ├── actions.json \# Actions ビリング（対象月）  
│ ├── packages.json \# Packages ビリング（対象月）  
│ ├── shared\_storage.json \# 共有ストレージ（対象月）  
│ ├── codespaces.json \# Codespaces ビリング（対象月）  
│ └── orgs.json \# Enterprise 配下の org 一覧  
├── assets/ \# 静的アセット  
│ ├── style.css  
│ ├── main.js  
│ ├── charts.js  
│ └── data.js  
├── usage\_pivot.csv \# Excel ピボット用 CSV  
└── report.html \# ダッシュボード HTML  
2.2 fetch と report を個別に実行  
API 制限を避けたい場合や、レポートのみ再生成したい場合は個別実行できます。  
\# データ取得のみ（Enterprise 全体）  
ghe‑usage fetch ‑‑enterprise my‑enterprise ‑‑month 2026‑03  
\# レポート生成のみ（既存 JSON から）  
ghe‑usage report ‑‑enterprise my‑enterprise ‑‑month 2026‑03  
2.3 Enterprise スコープでの動作  
‑‑enterprise のみ指定（‑‑org 省略）すると、以下が自動的に行われます:  
1\. GraphQL で全 org を自動検出 —Enterprise 配下の全 Organization を列挙  
2\. 全 org の Copilot Seats を集約 —各 org からシート情報を取得し、1 つの copilot\_seats.json にマ  
ージ  
3\. 全 org のチーム・メンバーを集約 —各 org のチーム一覧 → メンバーを取得し、team\_members.json  
にマージ  
21  
4\. Enhanced Billing API で利用データを一括取得 —Enterprise レベルで Actions / Packages /  
Codespaces の利用データを取得  
5\. Copilot v3 メトリクス（Enterprise レベル）—日次ユーザー別メトリクス \+ Enterprise Summary  
を取得  
注: 一部の org でトークンの権限が不足する場合（403）、その org はスキップされ警告が表示  
されます。データ欠損は発生しますが処理は継続します。  
2.4 出力先の変更  
ghe‑usage all ‑‑org my‑org ‑‑output‑dir /path/to/output  
3\. 月次レポート運用  
3.1 手動での月次実行フロー  
毎月初に以下を実施します:  
\# 1\. 前月分のレポートを生成（Enterprise 全体）  
ghe‑usage all ‑‑enterprise my‑enterprise ‑‑month 2026‑02  
\# 2\. HTML レポートをブラウザで確認  
open reports/2026‑02/report.html  
\# 3\. CSV を Excel で分析（オプション）  
open reports/2026‑02/usage\_pivot.csv  
3.2 GitHub Actions での自動実行  
リポジトリに同梱の GitHub Actions ワークフローで毎月自動実行できます。  
設定手順:  
1\. リポジトリの Settings → Secrets and variables → Actions を開く  
2\. Secrets に GH\_TOKEN を追加（GitHub PAT —admin:enterprise \+ read:org \+ manage\_billing:copilot）  
3\. Variables に GH\_ENTERPRISE を追加（対象 Enterprise slug）  
4\. Variables に GH\_ORG を追加（特定 org に限定する場合。省略で全 org 自動検出）  
ワークフローは毎月 1 日 09:00 UTC に自動実行されます。  
手動実行は Actions タブ → Generate Usage Report → Run workflow から可能です。  
3.3 複数月のレポートを比較  
過去の月次データが reports/ に蓄積されると、HTML レポートの「月次推移」セクションで自動的にトレ  
ンドグラフが表示されます。  
reports/  
├── 2026‑01/  
├── 2026‑02/  
└── 2026‑03/ ← 最新月のレポートで過去月の推移も確認可能  
22  
4\. CSV を Excel で活用する  
4.1 ピボットテーブルの作成  
CSV を Excel で開き、ピボットテーブルを作成します:  
配置 フィールド 用途  
行 business\_unit → team 事業部 → チームの階層表示  
列 metric メトリクス種別  
値 value（合計） 集計値  
フィルター product, date プロダクト・月の絞り込み  
4.2 よく使うフィルター条件  
分析したい内容 product フィルター metric フィルター  
Copilot コスト copilot monthly\_cost  
Copilot シート数 copilot seat\_enterprise, seat\_business  
非アクティブシート copilot inactive\_seats  
Actions 利用量 actions total\_minutes\_used  
PRU 消費 copilot premium\_requests  
5\. HTML ダッシュボードの読み方  
5.1 KPI カードの見方  
ダッシュボード上部に表示される KPI カードの意味:  
KPI 説明 改善アクション  
Copilot 採用率 アクティブユーザー ÷ 総シート  
数  
低い場合 → 非アクティブシート  
の回収を検討  
PRU コスト Premium Requests × 単価 予算超過の兆候がないか確認  
AI Leverage % Acceptances ÷ Suggestions ×  
100  
チーム間で差がある場合 → 低い  
チームに活用支援  
エンジニアリング総コスト GHEC \+ Copilot \+ Actions \+ PRU 全体の月次コスト推移を管理  
非アクティブシート数 30 日以上未使用 回収して節約可能コストを確認  
重複ライセンス数 複数チームに重複アサイン 整理で月額コスト削減可能  
5.2 予算消化率ゲージの色  
色 消化率 意味  
緑 0–70% 正常  
黄 70–90% 注意  
オレンジ 90–100% 警告  
赤 100% 超 予算超過  
23  
5.3 v3 ダッシュボード 4 タブ構成  
メインコンテンツは 4 つのタブで構成され、分析目的に応じて切り替えできます。  
タブ アイコン 対象 主な内容  
コスト管理 FinOps・経営層 プロダクト別コスト、チ  
ーム別・事業部別コス  
ト、非稼働席・重複検  
出、月次推移  
利活用状況 チームリーダー ESM カード、日次トレ  
ンド、チーム詳細、PRU  
分布、ユーザーランキン  
グ  
WA 評価 CCoE・品質 レーダーチャート、ピラ  
ー詳細、アナリストレポ  
ート  
管理・設定 IT 管理者 マッピング、Ac‑  
tions/Packages/Codespaces、  
用語集  
• 選択したタブはブラウザの localStorage に保存され、次回表示時も維持されます  
• 設計の背景は ADR‑010 を参照  
5.4 ダークモード  
レポート右上のトグル（/ ）でダーク / ライトテーマを切り替えできます。  
6\. テストデータで試す  
実際の API を叩かずにレポートの見た目を確認したい場合、同梱のテストデータ生成ツールを使います。  
\# テストデータ生成（5 ヶ月分、30 チーム規模）  
go run tools/gen\_large\_data.go  
\# テストデータからレポート生成（GITHUB\_TOKEN は dummy で OK）  
export GITHUB\_TOKEN=dummy  
ghe‑usage report ‑‑org myorg ‑‑month 2026‑04  
\# レポートを開く  
open reports/2026‑04/report.html  
7\. 設定変更の反映  
7.1 単価変更  
config/pricing.yml を編集後、report サブコマンドだけ再実行すれば反映されます（再 fetch は不要）。  
\# pricing.yml を編集  
ghe‑usage report ‑‑org my‑org ‑‑month 2026‑03  
24  
7.2 チームマッピング変更  
config/team\_mapping.csv を編集後、同様に report のみ再実行します。  
\# team\_mapping.csv を編集  
ghe‑usage report ‑‑org my‑org ‑‑month 2026‑03  
7.3 別のマッピングファイルを使う  
ghe‑usage all ‑‑org my‑org ‑‑mapping /path/to/custom\_mapping.csv  
25  
Runbook —ghe‑usage‑report 運用手順  
書  
本ドキュメントは ghe‑usage‑report の運用中に発生しうる問題への対応手順をまとめた運用手順書です。  
1\. 定常運用手順  
1.1 月次レポート生成（毎月初）  
実行タイミング: 毎月 1～3 日（前月データの確定後）  
\# 1\. 前月分を生成（Enterprise 全体）  
ghe‑usage all ‑‑enterprise my‑enterprise ‑‑month $(date ‑v‑1m \+%Y‑%m)  
\# 2\. 出力を確認  
ls ‑la reports/$(date ‑v‑1m \+%Y‑%m)/  
\# 3\. HTML を開いて異常値がないか目視確認  
open reports/$(date ‑v‑1m \+%Y‑%m)/report.html  
確認ポイント: ‑ \[ \] KPI カードに値が表示されている（N/A や 0 ばかりでないこと）‑ \[ \] org 自動検出で期待  
する org が含まれている（orgs.json を確認）‑ \[ \] Copilot シート数が契約数と整合している ‑ \[ \] 前月と比  
較して極端な増減がないこと  
1.2 新チーム追加時  
\# 1\. GitHub 上で新チームの slug を確認  
\# https://github.com/orgs/{org}/teams/{team‑slug}  
\# 2\. team\_mapping.csv に追加（5 カラム: org,team\_slug,cost\_center,business\_unit,schwarzleitwerk）  
echo 'my‑org,new‑team,CC‑005, 新規事業部,false' \>\> config/team\_mapping.csv  
\# 3\. レポートを再生成して反映を確認  
ghe‑usage report ‑‑org my‑org ‑‑month 2026‑03  
1.3 単価変更時  
GitHub の契約変更（例: Copilot Business → Enterprise への移行）に対応します。  
\# 1\. config/pricing.yml を編集  
26  
\# 2\. report のみ再実行（再 fetch は不要）  
ghe‑usage report ‑‑org my‑org ‑‑month 2026‑03  
\# 3\. エンジニアリング総コストが変わることを確認  
2\. トラブルシューティング  
2.1 API 認証エラー（401 Unauthorized）  
症状: API error: 401 Unauthorized  
原因と対処:  
原因 対処  
トークン期限切れ 新しい PAT を生成して GITHUB\_TOKEN を更新  
スコープ不足 admin:enterprise, read:org,  
manage\_billing:copilot を確認  
EMU 環境の制約 Enterprise 管理者アカウントのトークンを使用  
\# トークンの有効性を確認  
curl ‑H "Authorization: Bearer $GITHUB\_TOKEN" \\  
https://api.github.com/user  
2.2 API レートリミット（429 Too Many Requests）  
症状: API error: 429 または rate limit exceeded  
対処:  
\# レートリミットの残量を確認  
curl ‑sI ‑H "Authorization: Bearer $GITHUB\_TOKEN" \\  
https://api.github.com/rate\_limit ￨ grep ‑i 'x‑ratelimit'  
• ツールは 429 レスポンスに対して自動リトライを実装しています  
• 大量チーム（100+）の場合、自然にリセットを待って再試行されます  
• 改善しない場合は時間を空けて再実行してください  
2.3 権限不足（403 Forbidden）  
症状: API error: 403 Forbidden  
原因と対処:  
API 必要な権限  
Enterprise org 検出（GraphQL） admin:enterprise スコープ  
Enhanced Billing API admin:enterprise スコープ  
Copilot Seats Organization Owner または Billing Manager  
Teams Organization Member 以上  
• Enterprise 配下の全 org 自動検出時、一部の org で 403 が出ることがあります  
• これはトークンにその org へのアクセス権がないためで、その org はスキップされ警告が表示され  
ます  
27  
• EMU 環境では Enterprise Owner のトークンが必要になる場合があります  
• Fine‑grained PAT を使用している場合は Organization permissions を確認  
2.4 CSV が空・データが欠損している  
症状: usage\_pivot.csv にデータが少ない / 特定プロダクトのデータがない  
チェック手順:  
\# 1\. org 検出が正しく行われたか確認  
cat reports/2026‑03/raw/orgs.json ￨ python3 ‑m json.tool  
\# 2\. Copilot seats が取得できているか確認  
cat reports/2026‑03/raw/copilot\_seats.json ￨ python3 ‑c "import sys,json; d=json.load(sys.stdin); print(f'Total seats: {d\[\\"total\_seats\\"\]}')"  
\# 3\. Enhanced Billing データがあるか確認  
cat reports/2026‑03/raw/billing\_usage.json ￨ python3 ‑c "import sys,json; d=json.load(sys.stdin); print(f'Usage items: {len(d.get(\\"usageItems\\", \[\]))}')"  
\# 4\. 特定プロダクトの行数を確認  
grep copilot reports/2026‑03/usage\_pivot.csv ￨ wc ‑l  
grep actions reports/2026‑03/usage\_pivot.csv ￨ wc ‑l  
\# 5\. JSON はあるが CSV にないなら report だけ再実行  
ghe‑usage report ‑‑enterprise my‑enterprise ‑‑month 2026‑03  
よくある原因: ‑ Copilot を有効化して間もない → データ未蓄積 ‑ Actions 無料枠内で利用 → paid\_minutes  
が 0 ‑ Codespaces 未使用 → データなし（正常）  
2.5 HTML レポートでグラフが表示されない  
症状: レポートを開くとグラフ部分が空白  
原因と対処:  
原因 対処  
オフライン環境 Chart.js を CDN から読み込むためインターネット  
接続が必要  
ブラウザのセキュリティ ローカルファイルの JS 実行がブロックされた → ロ  
ーカルサーバーで配信  
データ不足 チャートデータが 0 件の場合はセクション自体が非  
表示になる（正常動作）  
\# ローカルサーバーで配信する場合  
cd reports/2026‑03/  
python3 ‑m http.server 8080  
\# ブラウザで http://localhost:8080/report.html を開く  
2.6 チームが「未分類」に表示される  
症状: team\_mapping.csv に登録したはずのチームが「未分類」になる  
チェック手順:  
\# 1\. CSV の team\_slug が正しいか確認（大文字小文字に注意）  
grep platform‑team config/team\_mapping.csv  
28  
\# 2\. GitHub 上の実際の slug を確認  
curl ‑s ‑H "Authorization: Bearer $GITHUB\_TOKEN" \\  
"https://api.github.com/orgs/my‑org/teams" ￨ \\  
python3 ‑c "import sys,json; \[print(t\['slug'\]) for t in json.load(sys.stdin)\]"  
\# 3\. slug を修正して再実行  
ghe‑usage report ‑‑org my‑org ‑‑month 2026‑03  
2.7 タブが正しく表示されない  
症状: HTML レポートを開いても 4 タブ（コスト管理/利活用状況/WA 評価/管理・設定）が表示されない  
原因と対処:  
原因 対処  
ブラウザキャッシュ ハードリロード（Cmd+Shift+R / Ctrl+Shift+R）を  
実行  
古いテンプレートで生成 最新バイナリで ghe‑usage report を再実行  
VS Code Simple Browser 外部ブラウザで開く、またはローカルサーバー経由  
で表示  
\# ローカルサーバー経由で表示（推奨）  
cd reports/  
python3 ‑m http.server 8080  
\# ブラウザで http://localhost:8080/2026‑03/report.html を開く  
2.8 タブの選択が保存されない  
症状: タブを切り替えても、リロードすると「コスト管理」に戻ってしまう  
原因と対処:  
原因 対処  
file:// プロトコルで開いている 一部ブラウザは file:// で localStorage を制限。  
ローカルサーバー経由で開く  
プライベートブラウジング 通常のウィンドウで開く  
2.9 Billing API が 410 Gone を返す  
症状: API error: 410: This endpoint has been moved  
原因: GitHub の旧 Org 別 Billing API（/orgs/{org}/settings/billing/actions 等）は Enhanced Billing  
Platform への移行に伴い廃止されました。  
対処: ツールを最新バージョンに更新してください。最新版では Enterprise レベルの Enhanced Billing  
API (/enterprises/{ent}/settings/billing/usage) を使用します。  
\# 最新版をビルドして再実行  
go build ‑o ghe‑usage ./cmd/ghe‑usage/  
ghe‑usage all ‑‑enterprise my‑enterprise ‑‑month 2026‑03  
29  
2.10 ビルドエラー  
症状: go build でエラーが発生  
\# Go バージョンを確認（1.21 以上が必要）  
go version  
\# 依存関係を解決  
go mod tidy  
\# 再ビルド  
go build ‑o ghe‑usage ./cmd/ghe‑usage/  
3\. データ管理  
3.1 データ保持ポリシー  
対象 推奨保持期間 理由  
raw/\*.json 12 ヶ月 API 生データ。レポート再生成に必要  
usage\_pivot.csv 無期限 ピボット分析用。軽量なので保持推奨  
report.html 再生成可能 CSV から再生成できるため削除可  
3.2 過去月の再生成  
API 生データ（raw/）が残っていれば、いつでもレポートを再生成できます。  
\# 過去月のレポートを最新テンプレートで再生成  
ghe‑usage report ‑‑org my‑org ‑‑month 2025‑12  
3.3 データのバックアップ  
\# reports ディレクトリごとバックアップ  
tar czf ghe‑usage‑backup‑$(date \+%Y%m%d).tar.gz reports/  
4\. 監視・アラート  
4.1 チェックすべき KPI の閾値  
KPI 正常範囲 アラート条件 アクション  
Copilot 採用率 60% 以上 50% 未満に低下 非アクティブユーザー  
へのヒアリング  
PRU 予算消化率 0–70% 90% 超過 利用制限の検討、予算見  
直し  
非アクティブシート率 0–15% 20% 超過 シート回収、再配分  
月次 PRU 成長率 0–20% 50% 超 利用パターンの調査  
30  
4.2 GitHub Actions の監視  
Actions ワークフローが失敗した場合の対応:  
\# 1\. Actions タブでエラーログを確認  
\# 2\. 多くの場合はトークン期限切れが原因  
\# 3\. Secrets の GH\_TOKEN を更新  
\# 4\. Actions タブから手動で Re‑run  
5\. セキュリティ  
5.1 トークン管理  
• GITHUB\_TOKEN を .env ファイルやコードにハードコードしない  
• GitHub Actions では Secrets を使用  
• ローカル実行では環境変数またはシェルの認証情報マネージャーを使用  
5.2 レポート出力のアクセス制御  
• reports/ ディレクトリはデフォルトで .gitignore に含まれています  
• HTML レポートにはコスト情報が含まれるため、共有範囲に注意してください  
• GitHub Actions の Artifact は 90 日間保持され、リポジトリアクセス権を持つメンバーがダウンロー  
ド可能です  
5.3 API 生データの取り扱い  
raw/\*.json にはユーザーの login などの個人情報が含まれます。  
社外共有が必要な場合は、CSV または HTML レポートのみを共有してください。  
6\. エスカレーション  
状況 対応先  
API 認証・権限の問題 GitHub Enterprise 管理者  
Copilot ライセンスの不正利用 Organization Owner \+ セキュリティチーム  
予算超過 財務担当 \+ コストセンターオーナー  
ツール自体のバグ リポジトリに Issue を作成  
31  
