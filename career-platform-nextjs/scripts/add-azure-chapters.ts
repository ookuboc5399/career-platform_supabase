/**
 * Azure 言語とチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-azure-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const AZURE_CHAPTERS: {
  id: string;
  title: string;
  description: string;
  order: number;
  parent_id: string | null;
}[] = [
  {
    id: 'azure-overview',
    title: 'Azure の概要',
    description: 'Microsoft Azure の基本構成、主要サービス、企業での活用の概要を学びます。',
    order: 1,
    parent_id: null,
  },
  {
    id: 'azure-entra-id',
    title: 'Microsoft Entra ID（旧 Azure AD）',
    description: 'Entra ID の概要、SSO、MFA、条件付きアクセス、GitHub との連携を学びます。',
    order: 2,
    parent_id: null,
  },
  {
    id: 'azure-entra-bulk-user-registration',
    title: 'ユーザー一括登録',
    description:
      '管理センターの CSV 一括作成、ゲストの一括招待、Microsoft Graph / PowerShell による自動化の考え方と運用上の注意を学びます。',
    order: 1,
    parent_id: 'azure-entra-id',
  },
  {
    id: 'azure-scim-github',
    title: 'Azure SCIM と GitHub のプロビジョニング',
    description: 'Entra ID の SCIM を使って GitHub Organization のメンバーを自動プロビジョニングする設定方法を学びます。',
    order: 3,
    parent_id: null,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Azure 言語が存在するか確認し、なければ追加
  const { data: existingLang } = await supabase
    .from('programming_languages')
    .select('id')
    .eq('id', 'azure')
    .single();

  if (!existingLang) {
    const { error: langError } = await supabase
      .from('programming_languages')
      .upsert(
        {
          id: 'azure',
          title: 'Azure入門',
          description: 'Microsoftが提供するクラウドプラットフォーム、Azureの基礎から学びます。',
          type: 'cloud',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    if (langError) {
      console.error('Azure 言語の追加に失敗:', langError);
      process.exit(1);
    }
    console.log('✓ Azure 言語を追加しました');
  } else {
    console.log('✓ Azure 言語は既に存在します');
  }

  // 2. チャプターを追加
  for (const ch of AZURE_CHAPTERS) {
    const { data, error } = await supabase
      .from('programming_chapters')
      .upsert(
        {
          id: ch.id,
          language_id: 'azure',
          parent_id: ch.parent_id,
          title: ch.title,
          description: ch.description,
          order: ch.order,
          status: 'published',
          exercises: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select();

    if (error) {
      console.error(`エラー (${ch.id}):`, error);
      continue;
    }
    console.log(`✓ ${ch.id} を追加しました`);
  }

  console.log('\nAzure チャプターの追加が完了しました。');
}

main();
