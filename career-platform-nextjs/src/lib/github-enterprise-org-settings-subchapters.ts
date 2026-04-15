/** Organization の Settings 直下（Copilot ハブ以外）のサブチャプター ID */
export const ORG_SETTINGS_TOP_SUB_CHAPTER_IDS = [
  'github-enterprise-org-settings-repository',
  'github-enterprise-org-settings-codespaces',
  'github-enterprise-org-settings-planning',
  'github-enterprise-org-settings-actions',
  'github-enterprise-org-settings-models',
  'github-enterprise-org-settings-webhooks',
  'github-enterprise-org-settings-discussions',
  'github-enterprise-org-settings-packages',
  'github-enterprise-org-settings-pages',
  'github-enterprise-org-settings-hosted-compute-networking',
  'github-enterprise-org-settings-custom-properties',
  'github-enterprise-org-settings-authentication-security',
  'github-enterprise-org-settings-advanced-security',
  'github-enterprise-org-settings-deploy-keys',
  'github-enterprise-org-settings-compliance',
  'github-enterprise-org-settings-vertified-approved-domains',
  'github-enterprise-org-settings-secrets-and-variables',
  'github-enterprise-org-settings-github-apps',
  'github-enterprise-org-settings-oauth-app-policy',
  'github-enterprise-org-settings-personal-access-tokens',
  'github-enterprise-org-settings-scheduled-reminders',
  'github-enterprise-org-settings-announcement',
  'github-enterprise-org-settings-logs',
  'github-enterprise-org-settings-deleted-repositories',
  'github-enterprise-org-settings-developer-settings',
] as const;

export function isOrgSettingsTopSubChapterId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_TOP_SUB_CHAPTER_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Planning 直下のサブチャプター */
export const ORG_SETTINGS_PLANNING_CHILD_IDS = [
  'github-enterprise-org-settings-planning-projects',
  'github-enterprise-org-settings-planning-issue-types',
] as const;

export function isOrgSettingsPlanningChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_PLANNING_CHILD_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Codespaces 直下のサブチャプター */
export const ORG_SETTINGS_CODESPACES_CHILD_IDS = [
  'github-enterprise-org-settings-codespaces-general',
  'github-enterprise-org-settings-codespaces-policies',
] as const;

export function isOrgSettingsCodespacesChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_CODESPACES_CHILD_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Repository 直下のサブチャプター */
export const ORG_SETTINGS_REPOSITORY_CHILD_IDS = [
  'github-enterprise-org-settings-repository-general',
  'github-enterprise-org-settings-repository-topics',
  'github-enterprise-org-settings-repository-rulesets',
  'github-enterprise-org-settings-repository-rule-insights',
  'github-enterprise-org-settings-repository-bypass-requests',
  'github-enterprise-org-settings-repository-custom-properties',
] as const;

export function isOrgSettingsRepositoryChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_REPOSITORY_CHILD_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Advanced Security 直下のサブチャプター */
export const ORG_SETTINGS_ADVANCED_SECURITY_CHILD_IDS = [
  'github-enterprise-org-settings-advanced-security-configurations',
  'github-enterprise-org-settings-advanced-security-global-settings',
] as const;

export function isOrgSettingsAdvancedSecurityChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_ADVANCED_SECURITY_CHILD_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Personal access tokens 直下のサブチャプター */
export const ORG_SETTINGS_PAT_CHILD_IDS = [
  'github-enterprise-org-settings-personal-access-tokens-settings',
  'github-enterprise-org-settings-personal-access-tokens-active-tokens',
  'github-enterprise-org-settings-personal-access-tokens-prnding-requests',
] as const;

export function isOrgSettingsPatChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_PAT_CHILD_IDS as readonly string[]).includes(chapterId);
}

/** Organization Settings › Logs 直下のサブチャプター */
export const ORG_SETTINGS_LOGS_CHILD_IDS = [
  'github-enterprise-org-settings-logs-sponsorship-log',
  'github-enterprise-org-settings-logs-audit-log',
] as const;

export function isOrgSettingsLogsChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ORG_SETTINGS_LOGS_CHILD_IDS as readonly string[]).includes(chapterId);
}
