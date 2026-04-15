/**
 * github/docs の content/ を Obsidian Vault 配下の GitHub/GitHub-docs に同期
 * 既定: OBSIDIAN_VAULT_PATH 未設定時は …/Documents/Obsidian Vault/GitHub/GitHub-docs
 * 実行: npx ts-node scripts/sync-github-docs-to-obsidian.ts
 */
import { config } from 'dotenv';
import { syncGithubDocsToObsidian } from '../src/lib/github-docs-obsidian-sync';

config({ path: '.env.local' });
config({ path: '.env' });

async function main() {
  const result = syncGithubDocsToObsidian();
  if (!result.ok) {
    console.error(result.error);
    process.exit(1);
  }

  console.log(result.message);
  console.log('出力先:', result.destRoot);
  console.log('.md ファイル数:', result.markdownFileCount);
}

main();
