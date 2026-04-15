'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/ui/VideoPlayer';
import PdfViewer from '@/components/ui/PdfViewer';
import GitHubEnterpriseSettingsTable from '@/components/ui/GitHubEnterpriseSettingsTable';
import GitHubEnterpriseOrgRepositoriesGuide from '@/components/ui/GitHubEnterpriseOrgRepositoriesGuide';
import GitHubEnterpriseOrgProjectsGuide from '@/components/ui/GitHubEnterpriseOrgProjectsGuide';
import GitHubEnterpriseOrgPackagesGuide from '@/components/ui/GitHubEnterpriseOrgPackagesGuide';
import GitHubEnterpriseOrgTeamsGuide from '@/components/ui/GitHubEnterpriseOrgTeamsGuide';
import GitHubEnterpriseOrgPeopleGuide from '@/components/ui/GitHubEnterpriseOrgPeopleGuide';
import { GitHubEnterprisePeopleChildGuideBody } from '@/components/ui/GitHubEnterprisePeopleChildGuides';
import { GitHubEnterprisePoliciesChildGuideBody } from '@/components/ui/GitHubEnterprisePoliciesChildGuides';
import GitHubEnterpriseOrgSettingsGuide from '@/components/ui/GitHubEnterpriseOrgSettingsGuide';
import GitHubEnterpriseAuthSsoGuide from '@/components/ui/GitHubEnterpriseAuthSsoGuide';
import GitHubEnterpriseBestPracticesGuide from '@/components/ui/GitHubEnterpriseBestPracticesGuide';
import GitHubEnterpriseCostManagementGuide from '@/components/ui/GitHubEnterpriseCostManagementGuide';
import GitHubEnterpriseServerGuide from '@/components/ui/GitHubEnterpriseServerGuide';
import GitHubEnterpriseComplianceGuide from '@/components/ui/GitHubEnterpriseComplianceGuide';
import GitHubEnterpriseConnectPoliciesAiGuide from '@/components/ui/GitHubEnterpriseConnectPoliciesAiGuide';
import GitHubEnterpriseAiAgentsGuide from '@/components/ui/GitHubEnterpriseAiAgentsGuide';
import GitHubEnterpriseAiAgentsHubGuide from '@/components/ui/GitHubEnterpriseAiAgentsHubGuide';
import GitHubCopilotSetupVscodeGuide from '@/components/ui/GitHubCopilotSetupVscodeGuide';
import {
  GitHubEnterpriseCopilotPrivacyFeaturesGuide,
  GitHubEnterpriseCopilotBillingSettingsGuide,
  GitHubEnterpriseCopilotMetricsGuide,
  GitHubEnterpriseCopilotClientsGuide,
} from '@/components/ui/GitHubEnterpriseCopilotOrgSettingsGuides';
import CopilotMatlabMcpGuide, { isCopilotMatlabMcpChapterId } from '@/components/ui/CopilotMatlabMcpGuide';
import {
  GitHubEnterpriseGitHubAppsOverviewGuide,
  GitHubEnterpriseGitHubAppsCreateGuide,
  GitHubEnterpriseGitHubAppsInstallGuide,
  GitHubEnterpriseGitHubAppsWebhookGuide,
} from '@/components/ui/GitHubEnterpriseGitHubAppsGuide';
import GitHubAppsSeriesNav from '@/components/ui/GitHubAppsSeriesNav';
import { isGitHubAppsSeriesChapterId } from '@/lib/github-enterprise-github-apps-series';
import GitHubRestApiSeriesNav from '@/components/ui/GitHubRestApiSeriesNav';
import { isGitHubRestApiSeriesChapterId } from '@/lib/github-rest-api-series';
import {
  GitHubRestApiHubGuide,
  GitHubRestApiOverviewGuide,
  GitHubRestApiReposGuide,
  GitHubRestApiOrgsGuide,
} from '@/components/ui/GitHubRestApiGuides';
import { OrgSettingsCopilotSeriesNav } from '@/components/ui/OrgSettingsCopilotSeriesNav';
import { isOrgSettingsCopilotSeriesChapterId } from '@/lib/github-enterprise-org-settings-copilot-series';
import {
  isOrgSettingsTopSubChapterId,
  isOrgSettingsPlanningChildId,
  isOrgSettingsCodespacesChildId,
  isOrgSettingsRepositoryChildId,
  isOrgSettingsAdvancedSecurityChildId,
  isOrgSettingsPatChildId,
  isOrgSettingsLogsChildId,
} from '@/lib/github-enterprise-org-settings-subchapters';
import { isEnterpriseSecPeopleChildId } from '@/lib/github-enterprise-sec-people-subchapters';
import { isEnterpriseSecPoliciesChildId } from '@/lib/github-enterprise-sec-policies-subchapters';
import { OrgSettingsPlanningSubNav } from '@/components/ui/OrgSettingsPlanningSubNav';
import { OrgSettingsCodespacesSubNav } from '@/components/ui/OrgSettingsCodespacesSubNav';
import { OrgSettingsRepositorySubNav } from '@/components/ui/OrgSettingsRepositorySubNav';
import { OrgSettingsAdvancedSecuritySubNav } from '@/components/ui/OrgSettingsAdvancedSecuritySubNav';
import { OrgSettingsPatSubNav } from '@/components/ui/OrgSettingsPatSubNav';
import { OrgSettingsLogsSubNav } from '@/components/ui/OrgSettingsLogsSubNav';
import {
  GitHubEnterpriseOrgSettingsTopSubGuideBody,
  GitHubEnterpriseOrgSettingsPlanningChildGuideBody,
  GitHubEnterpriseOrgSettingsCodespacesChildGuideBody,
  GitHubEnterpriseOrgSettingsRepositoryChildGuideBody,
  GitHubEnterpriseOrgSettingsAdvancedSecurityChildGuideBody,
  GitHubEnterpriseOrgSettingsPatChildGuideBody,
  GitHubEnterpriseOrgSettingsLogsChildGuideBody,
  GitHubEnterpriseOrgSettingsCopilotSeriesBody,
} from '@/components/ui/GitHubEnterpriseOrgSettingsSubGuides';
import {
  GitHubEnterpriseOverviewGuide,
  GitHubEnterpriseInsightsGuide,
  GitHubEnterpriseAnnouncementsGuide,
  GitHubEnterpriseHooksGuide,
} from '@/components/ui/GitHubEnterpriseAccountAreaGuides';
import GitHubPagesGuide from '@/components/ui/GitHubPagesGuide';
import GitHubCliApiGuide from '@/components/ui/GitHubCliApiGuide';
import GitHubActionsCicdPipelineGuide from '@/components/ui/GitHubActionsCicdPipelineGuide';
import GitHubHostedRunnerGuide from '@/components/ui/GitHubHostedRunnerGuide';
import GitHubSelfHostedRunnerGuide from '@/components/ui/GitHubSelfHostedRunnerGuide';
import GitHubCodeScanningGuide from '@/components/ui/GitHubCodeScanningGuide';
import GitHubSiemIntegrationGuide from '@/components/ui/GitHubSiemIntegrationGuide';
import GitHubAuditLogsGuide from '@/components/ui/GitHubAuditLogsGuide';
import GitHubDependabotGuide from '@/components/ui/GitHubDependabotGuide';
import GitHubGhasIntroGuide from '@/components/ui/GitHubGhasIntroGuide';
import GitHubBlogLatestGuide from '@/components/ui/GitHubBlogLatestGuide';
import GitHubTroubleshootingGuide, {
  isGitHubTroubleshootingSubChapterId,
} from '@/components/ui/GitHubTroubleshootingGuide';
import GitHubWikiGuide from '@/components/ui/GitHubWikiGuide';
import GitHubIssuesGuide from '@/components/ui/GitHubIssuesGuide';
import GitHubInsightsGuide from '@/components/ui/GitHubInsightsGuide';
import GitHubSecurityGuide from '@/components/ui/GitHubSecurityGuide';
import GitHubModelsGuide from '@/components/ui/GitHubModelsGuide';
import AzureOverviewGuide from '@/components/ui/AzureOverviewGuide';
import AzureEntraIdGuide from '@/components/ui/AzureEntraIdGuide';
import AzureEntraBulkUserRegistrationGuide from '@/components/ui/AzureEntraBulkUserRegistrationGuide';
import AzureScimGitHubProvisioningGuide from '@/components/ui/AzureScimGitHubProvisioningGuide';
import {
  CloudDxOverviewGuide,
  CloudDxCcoeGuide,
  CloudDxGovernanceGuide,
  CloudDxPlatformGuide,
  CloudDxAdoptionGuide,
} from '@/components/ui/CloudDxCcoeChapterGuides';
import {
  DockerOverviewGuide,
  DockerImagesRegistryGuide,
  DockerDockerfileRunGuide,
  DockerComposeNetworksVolumesGuide,
  DockerCicdHardeningGuide,
} from '@/components/ui/DockerChapterGuides';
import GitHubEnterpriseCopilotAiControlsGuide from '@/components/ui/GitHubEnterpriseCopilotAiControlsGuide';
import GitHubCopilotOrgLicenseAssignmentGuide, {
  isGithubCopilotOrgLicenseAssignmentChapterId,
} from '@/components/ui/GitHubCopilotOrgLicenseAssignmentGuide';
import GitHubEnterpriseMcpAiControlsGuide from '@/components/ui/GitHubEnterpriseMcpAiControlsGuide';
import LearnClaudeCodeS09Guide from '@/components/ui/LearnClaudeCodeS09Guide';
import GitHubPullRequestsReviewGuide from '@/components/ui/GitHubPullRequestsReviewGuide';
import GitHubDiscussionsGuide from '@/components/ui/GitHubDiscussionsGuide';
import GitHubCodespacesGuide from '@/components/ui/GitHubCodespacesGuide';
import GitHubReleasesGuide from '@/components/ui/GitHubReleasesGuide';
import GitHubBranchProtectionRulesetsGuide from '@/components/ui/GitHubBranchProtectionRulesetsGuide';
import GitHubSupportInquiryGuide from '@/components/ui/GitHubSupportInquiryGuide';
import {
  GitHubTipsHubGuide,
  GitHubTipsEnterpriseOrganizationGuide,
  GitHubTipsGitHubVsGitlabGuide,
  GitHubTipsCopilotMetricsViewerGuide,
} from '@/components/ui/GitHubTipsGuide';
import { GitHubTipsSubNav } from '@/components/ui/GitHubTipsSubNav';
import { CopilotMetricsRelatedCards } from '@/components/ui/CopilotMetricsRelatedCards';
import { isGitHubTipsChapterId } from '@/lib/github-tips-series';
import JiraOverviewGuide from '@/components/ui/JiraOverviewGuide';
import JiraIssuesBoardsGuide from '@/components/ui/JiraIssuesBoardsGuide';
import JiraWorkflowsGuide from '@/components/ui/JiraWorkflowsGuide';
import JiraSprintsBacklogGuide from '@/components/ui/JiraSprintsBacklogGuide';
import JiraFiltersJqlGuide from '@/components/ui/JiraFiltersJqlGuide';
import JiraServiceManagementIntroGuide from '@/components/ui/JiraServiceManagementIntroGuide';
import AtlassianOverviewGuide from '@/components/ui/AtlassianOverviewGuide';
import AtlassianCloudAdminBasicsGuide from '@/components/ui/AtlassianCloudAdminBasicsGuide';
import AtlassianRovoGuide from '@/components/ui/AtlassianRovoGuide';
import ConfluenceOverviewGuide from '@/components/ui/ConfluenceOverviewGuide';
import ConfluenceSpacesPagesGuide from '@/components/ui/ConfluenceSpacesPagesGuide';
import ConfluenceMacrosTemplatesGuide from '@/components/ui/ConfluenceMacrosTemplatesGuide';
import AiUiUxCoursesGuide, { isAiUiCourseLanguage } from '@/components/ui/AiUiUxCoursesGuide';
import { getProgrammingChapter } from '@/lib/api';
import { ProgrammingChapter } from '@/types/api';

export default function ChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const [chapter, setChapter] = useState<ProgrammingChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      const data = await getProgrammingChapter(params.chapterId, params.id);
      setChapter(data);
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [params.id, params.chapterId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-12 text-gray-500">
        チャプターが見つかりません
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <header
          className={
            params.chapterId === 'github-enterprise-auth-sso'
              ? 'mb-8 mx-auto flex max-w-4xl flex-col items-center text-center'
              : 'mb-8 max-w-4xl'
          }
        >
          <Link
            href={`/programming/${params.id}`}
            scroll={false}
            className="mb-4 inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </Link>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">{chapter.title}</h1>
          {chapter.description ? (
            <p className="leading-relaxed text-gray-600 whitespace-pre-wrap dark:text-gray-300">
              {chapter.description}
            </p>
          ) : null}
        </header>

        {chapter.videoUrl?.trim() ? (
          <div className="mb-8 flex w-full justify-center">
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-black">
              <VideoPlayer url={chapter.videoUrl.trim()} />
            </div>
          </div>
        ) : null}

        {params.chapterId === 'github-enterprise-best-practices' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseBestPracticesGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-cost-management' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseCostManagementGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-ghes-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseServerGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-compliance' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseComplianceGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-connect-policies-ai' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseConnectPoliciesAiGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-ai-agents' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseAiAgentsHubGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-ai-agents-intro' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseAiAgentsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-org-repositories' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgRepositoriesGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-org-projects' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgProjectsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-org-packages' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgPackagesGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-org-teams' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgTeamsGuide />
          </div>
        )}

        {isEnterpriseSecPeopleChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            {params.chapterId === 'github-enterprise-org-people' ? (
              <GitHubEnterpriseOrgPeopleGuide />
            ) : (
              <GitHubEnterprisePeopleChildGuideBody chapterId={params.chapterId} />
            )}
          </div>
        )}

        {isEnterpriseSecPoliciesChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterprisePoliciesChildGuideBody chapterId={params.chapterId} />
          </div>
        )}

        {params.chapterId === 'github-enterprise-org-settings' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgSettingsGuide />
          </div>
        )}

        {isOrgSettingsTopSubChapterId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOrgSettingsTopSubGuideBody chapterId={params.chapterId} />
          </div>
        )}

        {isOrgSettingsPlanningChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsPlanningSubNav
              languageId={params.id}
              currentChapterId={params.chapterId}
            >
              <GitHubEnterpriseOrgSettingsPlanningChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsPlanningSubNav>
          </div>
        )}

        {isOrgSettingsCodespacesChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsCodespacesSubNav
              languageId={params.id}
              currentChapterId={params.chapterId}
            >
              <GitHubEnterpriseOrgSettingsCodespacesChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsCodespacesSubNav>
          </div>
        )}

        {isOrgSettingsRepositoryChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsRepositorySubNav
              languageId={params.id}
              currentChapterId={params.chapterId}
            >
              <GitHubEnterpriseOrgSettingsRepositoryChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsRepositorySubNav>
          </div>
        )}

        {isOrgSettingsAdvancedSecurityChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsAdvancedSecuritySubNav
              languageId={params.id}
              currentChapterId={params.chapterId}
            >
              <GitHubEnterpriseOrgSettingsAdvancedSecurityChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsAdvancedSecuritySubNav>
          </div>
        )}

        {isOrgSettingsPatChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsPatSubNav languageId={params.id} currentChapterId={params.chapterId}>
              <GitHubEnterpriseOrgSettingsPatChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsPatSubNav>
          </div>
        )}

        {isOrgSettingsLogsChildId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsLogsSubNav languageId={params.id} currentChapterId={params.chapterId}>
              <GitHubEnterpriseOrgSettingsLogsChildGuideBody chapterId={params.chapterId} />
            </OrgSettingsLogsSubNav>
          </div>
        )}

        {isOrgSettingsCopilotSeriesChapterId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <OrgSettingsCopilotSeriesNav
              languageId={params.id}
              currentChapterId={params.chapterId}
            >
              <GitHubEnterpriseOrgSettingsCopilotSeriesBody chapterId={params.chapterId} />
            </OrgSettingsCopilotSeriesNav>
          </div>
        )}

        {params.chapterId === 'github-enterprise-auth-sso' && (
          <div className="w-full max-w-6xl mx-auto mb-8 flex justify-center">
            <GitHubEnterpriseAuthSsoGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseOverviewGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-insights' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseInsightsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-announcements' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseAnnouncementsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-hooks' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseHooksGuide />
          </div>
        )}

        {isGitHubAppsSeriesChapterId(params.chapterId) && (
          <GitHubAppsSeriesNav languageId={params.id} currentChapterId={params.chapterId}>
            {params.chapterId === 'github-enterprise-github-apps' && (
              <GitHubEnterpriseGitHubAppsOverviewGuide />
            )}
            {params.chapterId === 'github-enterprise-github-apps-create' && (
              <GitHubEnterpriseGitHubAppsCreateGuide />
            )}
            {params.chapterId === 'github-enterprise-github-apps-install' && (
              <GitHubEnterpriseGitHubAppsInstallGuide />
            )}
            {params.chapterId === 'github-enterprise-github-apps-webhook' && (
              <GitHubEnterpriseGitHubAppsWebhookGuide />
            )}
          </GitHubAppsSeriesNav>
        )}

        {isGitHubRestApiSeriesChapterId(params.chapterId) && (
          <GitHubRestApiSeriesNav languageId={params.id} currentChapterId={params.chapterId}>
            {params.chapterId === 'github-rest-api' && <GitHubRestApiHubGuide />}
            {params.chapterId === 'github-rest-api-overview' && <GitHubRestApiOverviewGuide />}
            {params.chapterId === 'github-rest-api-repos' && <GitHubRestApiReposGuide />}
            {params.chapterId === 'github-rest-api-orgs' && <GitHubRestApiOrgsGuide />}
          </GitHubRestApiSeriesNav>
        )}

        {params.chapterId === 'github-cli-api' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubCliApiGuide />
          </div>
        )}

        {params.chapterId === 'github-wiki' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubWikiGuide />
          </div>
        )}

        {params.chapterId === 'github-issues' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubIssuesGuide />
          </div>
        )}

        {params.chapterId === 'github-insights' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubInsightsGuide />
          </div>
        )}

        {params.chapterId === 'github-security' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubSecurityGuide />
          </div>
        )}

        {params.chapterId === 'github-models' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubModelsGuide />
          </div>
        )}

        {params.chapterId === 'github-pages' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubPagesGuide />
          </div>
        )}

        {params.chapterId === 'github-pull-requests-review' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubPullRequestsReviewGuide />
          </div>
        )}

        {params.chapterId === 'github-discussions' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubDiscussionsGuide />
          </div>
        )}

        {params.chapterId === 'github-codespaces' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubCodespacesGuide />
          </div>
        )}

        {params.chapterId === 'github-releases' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubReleasesGuide />
          </div>
        )}

        {params.chapterId === 'github-branch-protection-rulesets' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubBranchProtectionRulesetsGuide />
          </div>
        )}

        {params.chapterId === 'github-support-inquiry' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubSupportInquiryGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-settings' && (
          <div className="w-full max-w-6xl mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              設定パラメーター一覧
            </h2>
            <GitHubEnterpriseSettingsTable />
          </div>
        )}

        {params.chapterId === 'github-ghas-intro' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubGhasIntroGuide />
          </div>
        )}

        {params.id === 'github' && params.chapterId === 'github-blog-latest' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubBlogLatestGuide />
          </div>
        )}

        {params.id === 'github' && isGitHubTipsChapterId(params.chapterId) && (
          <div className="w-full max-w-6xl mb-8">
            <GitHubTipsSubNav languageId={params.id} currentChapterId={params.chapterId}>
              {params.chapterId === 'github-tips' && <GitHubTipsHubGuide />}
              {params.chapterId === 'github-tips-enterprise-organization' && (
                <GitHubTipsEnterpriseOrganizationGuide />
              )}
              {params.chapterId === 'github-tips-github-vs-gitlab' && <GitHubTipsGitHubVsGitlabGuide />}
              {params.chapterId === 'github-tips-copilot-metrics-viewer' && (
                <GitHubTipsCopilotMetricsViewerGuide />
              )}
            </GitHubTipsSubNav>
          </div>
        )}

        {params.chapterId === 'github-ghas-dependabot' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubDependabotGuide />
          </div>
        )}

        {params.chapterId === 'github-ghas-siem-integration' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubSiemIntegrationGuide />
          </div>
        )}

        {params.chapterId === 'github-audit-logs-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubAuditLogsGuide />
          </div>
        )}

        {params.chapterId === 'github-ghas-code-scanning' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubCodeScanningGuide />
          </div>
        )}

        {params.chapterId === 'github-actions-cicd-pipeline' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubActionsCicdPipelineGuide />
          </div>
        )}

        {params.chapterId === 'github-actions-hosted-runner' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubHostedRunnerGuide />
          </div>
        )}

        {params.chapterId === 'github-actions-self-hosted-runner' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubSelfHostedRunnerGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-ai-copilot' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseCopilotAiControlsGuide />
          </div>
        )}

        {params.chapterId === 'github-copilot-setup-vscode' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubCopilotSetupVscodeGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-copilot-privacy' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseCopilotPrivacyFeaturesGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-copilot-billing-settings' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseCopilotBillingSettingsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-copilot-metrics' && (
          <div className="mb-8 flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              <GitHubEnterpriseCopilotMetricsGuide />
            </div>
            <CopilotMetricsRelatedCards languageId={params.id} />
          </div>
        )}

        {params.chapterId === 'github-enterprise-copilot-clients' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseCopilotClientsGuide />
          </div>
        )}

        {params.chapterId === 'github-enterprise-ai-mcp' && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubEnterpriseMcpAiControlsGuide />
          </div>
        )}

        {isCopilotMatlabMcpChapterId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <CopilotMatlabMcpGuide chapterId={params.chapterId} />
          </div>
        )}

        {params.chapterId === 'claude-s09-agent-teams' && (
          <div className="w-full max-w-4xl mb-8">
            <LearnClaudeCodeS09Guide />
          </div>
        )}

        {params.id === 'azure' && params.chapterId === 'azure-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <AzureOverviewGuide />
          </div>
        )}

        {params.id === 'azure' && params.chapterId === 'azure-entra-id' && (
          <div className="w-full max-w-4xl mb-8">
            <AzureEntraIdGuide />
          </div>
        )}

        {params.id === 'azure' && params.chapterId === 'azure-entra-bulk-user-registration' && (
          <div className="w-full max-w-4xl mb-8">
            <AzureEntraBulkUserRegistrationGuide />
          </div>
        )}

        {params.id === 'azure' && params.chapterId === 'azure-scim-github' && (
          <div className="w-full max-w-4xl mb-8">
            <AzureScimGitHubProvisioningGuide />
          </div>
        )}

        {params.id === 'cloud-dx' && params.chapterId === 'cloud-dx-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <CloudDxOverviewGuide />
          </div>
        )}
        {params.id === 'cloud-dx' && params.chapterId === 'cloud-dx-ccoe' && (
          <div className="w-full max-w-4xl mb-8">
            <CloudDxCcoeGuide />
          </div>
        )}
        {params.id === 'cloud-dx' && params.chapterId === 'cloud-dx-governance' && (
          <div className="w-full max-w-4xl mb-8">
            <CloudDxGovernanceGuide />
          </div>
        )}
        {params.id === 'cloud-dx' && params.chapterId === 'cloud-dx-platform' && (
          <div className="w-full max-w-4xl mb-8">
            <CloudDxPlatformGuide />
          </div>
        )}
        {params.id === 'cloud-dx' && params.chapterId === 'cloud-dx-adoption' && (
          <div className="w-full max-w-4xl mb-8">
            <CloudDxAdoptionGuide />
          </div>
        )}

        {params.id === 'docker' && params.chapterId === 'docker-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <DockerOverviewGuide />
          </div>
        )}
        {params.id === 'docker' && params.chapterId === 'docker-images-registry' && (
          <div className="w-full max-w-4xl mb-8">
            <DockerImagesRegistryGuide />
          </div>
        )}
        {params.id === 'docker' && params.chapterId === 'docker-dockerfile-run' && (
          <div className="w-full max-w-4xl mb-8">
            <DockerDockerfileRunGuide />
          </div>
        )}
        {params.id === 'docker' && params.chapterId === 'docker-compose-networks-volumes' && (
          <div className="w-full max-w-4xl mb-8">
            <DockerComposeNetworksVolumesGuide />
          </div>
        )}
        {params.id === 'docker' && params.chapterId === 'docker-cicd-hardening' && (
          <div className="w-full max-w-4xl mb-8">
            <DockerCicdHardeningGuide />
          </div>
        )}

        {params.chapterId === 'jira-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraOverviewGuide />
          </div>
        )}
        {params.chapterId === 'jira-issues-and-boards' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraIssuesBoardsGuide />
          </div>
        )}
        {params.chapterId === 'jira-workflows' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraWorkflowsGuide />
          </div>
        )}
        {params.chapterId === 'jira-sprints-backlog' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraSprintsBacklogGuide />
          </div>
        )}
        {params.chapterId === 'jira-filters-jql' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraFiltersJqlGuide />
          </div>
        )}
        {params.chapterId === 'jira-service-management-intro' && (
          <div className="w-full max-w-4xl mb-8">
            <JiraServiceManagementIntroGuide />
          </div>
        )}
        {params.chapterId === 'atlassian-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <AtlassianOverviewGuide />
          </div>
        )}
        {params.chapterId === 'atlassian-cloud-admin-basics' && (
          <div className="w-full max-w-4xl mb-8">
            <AtlassianCloudAdminBasicsGuide />
          </div>
        )}
        {params.chapterId === 'atlassian-rovo' && (
          <div className="w-full max-w-4xl mb-8">
            <AtlassianRovoGuide />
          </div>
        )}
        {params.chapterId === 'confluence-overview' && (
          <div className="w-full max-w-4xl mb-8">
            <ConfluenceOverviewGuide />
          </div>
        )}
        {params.chapterId === 'confluence-spaces-and-pages' && (
          <div className="w-full max-w-4xl mb-8">
            <ConfluenceSpacesPagesGuide />
          </div>
        )}
        {params.chapterId === 'confluence-macros-templates' && (
          <div className="w-full max-w-4xl mb-8">
            <ConfluenceMacrosTemplatesGuide />
          </div>
        )}

        {isAiUiCourseLanguage(params.id) && (
          <AiUiUxCoursesGuide languageId={params.id} chapterId={params.chapterId} />
        )}

        {(params.chapterId.endsWith('-troubleshooting') ||
          isGitHubTroubleshootingSubChapterId(params.chapterId)) && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubTroubleshootingGuide chapterId={params.chapterId} />
          </div>
        )}

        {params.id === 'github' && isGithubCopilotOrgLicenseAssignmentChapterId(params.chapterId) && (
          <div className="w-full max-w-4xl mb-8">
            <GitHubCopilotOrgLicenseAssignmentGuide />
          </div>
        )}

        {chapter.slideUrl && (
          <div className="w-full max-w-3xl mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              スライド資料
            </h2>
            <PdfViewer
              url={chapter.slideUrl}
              title={`${chapter.title} スライド`}
              height={520}
              linkClassName="inline-flex items-center gap-2 mt-2 text-sm text-purple-600 hover:text-purple-800"
            />
          </div>
        )}

        {chapter.pdfUrl && (
          <div className="w-full max-w-3xl mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF資料
            </h2>
            <PdfViewer
              url={chapter.pdfUrl}
              title={`${chapter.title} PDF資料`}
              height={600}
            />
          </div>
        )}

        {chapter.exercises && chapter.exercises.length > 0 && (
          <div className="flex justify-between items-center max-w-3xl">
            <div>
              <h3 className="text-lg font-semibold">演習問題</h3>
              <p className="text-gray-600">このチャプターには {chapter.exercises.length} 問の演習問題があります</p>
            </div>
            <Link
              href={`/programming/${params.id}/chapters/${params.chapterId}/exercises`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <span>演習問題へ進む</span>
              <span className="text-sm bg-blue-500 px-2 py-1 rounded-md">
                {chapter.exercises.length}問
              </span>
            </Link>
          </div>
        )}
      </div>
  );
}
