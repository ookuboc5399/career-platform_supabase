import fs from 'fs';
import path from 'path';
import {
  getGithubBlogJaDestRoot,
  getGithubDocsContentPath,
  getGithubDocsDestRoot,
  getObsidianVaultRoot,
} from '@/lib/obsidian-paths';

export type ObsidianVaultStatus = {
  vaultPathConfigured: boolean;
  vaultPath: string | null;
  vaultExists: boolean;
  githubDocsDestRoot: string;
  githubDocsContentExists: boolean;
  markdownFileCount: number;
  githubBlogJaDestRoot: string;
  githubBlogJaExists: boolean;
  githubBlogJaMarkdownCount: number;
};

export function getObsidianVaultStatus(): ObsidianVaultStatus {
  const vaultPath = getObsidianVaultRoot();
  const envSet = !!process.env.OBSIDIAN_VAULT_PATH?.trim();

  const vaultExists = fs.existsSync(vaultPath);
  const githubDocsContent = getGithubDocsContentPath();
  const githubDocsDestRoot = getGithubDocsDestRoot();
  const githubDocsContentExists = fs.existsSync(githubDocsContent);

  let markdownFileCount = 0;
  if (githubDocsContentExists) {
    function walk(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.isFile() && e.name.endsWith('.md')) markdownFileCount += 1;
      }
    }
    try {
      walk(githubDocsContent);
    } catch {
      markdownFileCount = 0;
    }
  }

  const githubBlogJaDestRoot = getGithubBlogJaDestRoot();
  const githubBlogJaExists = fs.existsSync(githubBlogJaDestRoot);
  let githubBlogJaMarkdownCount = 0;
  if (githubBlogJaExists) {
    function walkBlogJa(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.name === '_sync') continue;
        if (e.isDirectory()) walkBlogJa(p);
        else if (e.isFile() && e.name.endsWith('.md')) githubBlogJaMarkdownCount += 1;
      }
    }
    try {
      walkBlogJa(githubBlogJaDestRoot);
    } catch {
      githubBlogJaMarkdownCount = 0;
    }
  }

  return {
    vaultPathConfigured: envSet,
    vaultPath,
    vaultExists,
    githubDocsDestRoot,
    githubDocsContentExists,
    markdownFileCount,
    githubBlogJaDestRoot,
    githubBlogJaExists,
    githubBlogJaMarkdownCount,
  };
}
