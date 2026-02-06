const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// 環境変数を読み込む（.env.local または .env）
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials are not configured.');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// /programming/page.tsxから取得したコースデータ
const courses = [
  {
    id: 'dify',
    title: 'Dify入門',
    description: 'ノーコードでAIアプリケーションを開発できるDifyプラットフォームの使い方を学びます。',
    type: 'ai-platform',
  },
  {
    id: 'n8n',
    title: 'n8n入門',
    description: 'オープンソースのワークフロー自動化ツールn8nの使い方を学びます。',
    type: 'ai-platform',
  },
  {
    id: 'php',
    title: 'PHP入門',
    description: 'Webアプリケーション開発で広く使用されているPHPを基礎から学びます。',
    type: 'language',
  },
  {
    id: 'python',
    title: 'Python入門',
    description: 'データサイエンス、機械学習、Webアプリケーション開発で人気のPythonを基礎から学びます。',
    type: 'language',
  },
  {
    id: 'javascript',
    title: 'JavaScript入門',
    description: 'Web開発に不可欠なJavaScriptの基礎から応用までを実践的に学習します。',
    type: 'language',
  },
  {
    id: 'go',
    title: 'Go入門',
    description: '高性能で効率的なバックエンド開発のためのGo言語を基礎から学びます。',
    type: 'language',
  },
  {
    id: 'react',
    title: 'React入門',
    description: 'モダンなWebフロントエンド開発のためのReactフレームワークを学びます。',
    type: 'framework',
  },
  {
    id: 'django',
    title: 'Django入門',
    description: 'Pythonで高速に安全なWebアプリケーションを開発するためのフレームワーク、Djangoを学びます。',
    type: 'framework',
  },
  {
    id: 'nextjs',
    title: 'Next.js入門',
    description: 'Reactをベースにしたサーバーサイドレンダリングや静的サイト生成が可能なフレームワーク、Next.jsを学びます。',
    type: 'framework',
  },
  {
    id: 'express',
    title: 'Express入門',
    description: 'Node.jsのための高速で最小限のWebアプリケーションフレームワーク、Expressを学びます。',
    type: 'framework',
  },
  {
    id: 'rails',
    title: 'Ruby on Rails入門',
    description: '「設定より規約」の原則に基づいた効率的なWebアプリケーション開発フレームワーク、Ruby on Railsを学びます。',
    type: 'framework',
  },
  {
    id: 'snowflake',
    title: 'Snowflake入門',
    description: 'クラウドベースのデータウェアハウスプラットフォーム、Snowflakeの基礎から学びます。',
    type: 'data-warehouse',
  },
  {
    id: 'semantic-layer',
    title: 'セマンティックレイヤー入門',
    description: 'ビジネスインテリジェンスとデータ分析のためのセマンティックレイヤーの概念と構築方法を学びます。',
    type: 'others',
  },
  {
    id: 'github',
    title: 'GitHub入門',
    description: '世界最大のコードホスティングサービス、GitHubの使い方を基礎から実践的に学びます。',
    type: 'others',
  },
];

async function importLanguages() {
  try {
    console.log('プログラミング言語のインポートを開始します...');
    
    for (const course of courses) {
      try {
        // 既存のデータをチェック
        const { data: existing } = await supabaseAdmin
          .from('programming_languages')
          .select('id')
          .eq('id', course.id)
          .single();

        if (existing) {
          console.log(`✓ スキップ: ${course.title} (既に存在します)`);
          continue;
        }

        // 新規作成
        const now = new Date().toISOString();
        const { data, error } = await supabaseAdmin
          .from('programming_languages')
          .insert({
            id: course.id,
            title: course.title,
            description: course.description,
            type: course.type,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (error) {
          console.error(`✗ エラー: ${course.title}`, error.message);
        } else {
          console.log(`✓ 作成完了: ${course.title} (${course.type})`);
        }
      } catch (error) {
        console.error(`✗ エラー: ${course.title}`, error);
      }
    }
    
    console.log('\nすべてのプログラミング言語のインポートが完了しました！');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

importLanguages();

