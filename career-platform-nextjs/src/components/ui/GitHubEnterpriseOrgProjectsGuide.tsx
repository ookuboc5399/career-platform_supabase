'use client';

import GitHubProjectsGuide from '@/components/ui/GitHubProjectsGuide';

/** Organizations › Projects。詳細手順は GitHubProjectsGuide を単一ソースとして再利用する。 */
export default function GitHubEnterpriseOrgProjectsGuide() {
  return (
    <div className="max-w-none space-y-12">
      <article className="prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization の Projects</h2>
        <p className="text-gray-600 mb-0">
          このチャプターは、GitHub Enterprise の <strong>Organizations</strong> セクションにおける Projects
          の位置づけとして配置しています。Organization では複数リポジトリの Issue / PR をひとつのプロジェクトに集約し、ロードマップやスプリントを横断的に扱えます。
        </p>
        <p className="text-gray-600 mt-4 mb-0">
          以下の手順は Organization に限らずリポジトリ単体のプロジェクト作成にもそのまま当てはまります。画面構成・サイドバー・ビュー・カスタムフィールドの操作は共通です。
        </p>
      </article>
      <GitHubProjectsGuide />
    </div>
  );
}
