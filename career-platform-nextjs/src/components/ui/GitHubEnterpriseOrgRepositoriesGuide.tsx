'use client';

import GitHubEnterpriseRepositoryGuide from '@/components/ui/GitHubEnterpriseRepositoryGuide';
import GitHubEnterpriseBranchMergeGuide from '@/components/ui/GitHubEnterpriseBranchMergeGuide';

/** Organization › Repositories: 従来のリポジトリ運用とブランチ・マージを1チャプターに集約 */
export default function GitHubEnterpriseOrgRepositoriesGuide() {
  return (
    <div className="space-y-16 max-w-none">
      <GitHubEnterpriseRepositoryGuide />
      <GitHubEnterpriseBranchMergeGuide />
    </div>
  );
}
