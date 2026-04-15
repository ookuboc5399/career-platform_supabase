/** Repository 配下のサブチャプター（小さなシリーズナビ用） */
export type OrgSettingsRepositorySeriesItem = { id: string; shortTitle: string };

export const GITHUB_ORG_SETTINGS_REPOSITORY_SERIES: OrgSettingsRepositorySeriesItem[] = [
  { id: 'github-enterprise-org-settings-repository-general', shortTitle: 'General' },
  { id: 'github-enterprise-org-settings-repository-topics', shortTitle: 'Topics' },
  { id: 'github-enterprise-org-settings-repository-rulesets', shortTitle: 'Rulesets' },
  { id: 'github-enterprise-org-settings-repository-rule-insights', shortTitle: 'Rule insights' },
  { id: 'github-enterprise-org-settings-repository-bypass-requests', shortTitle: 'Bypass requests' },
  {
    id: 'github-enterprise-org-settings-repository-custom-properties',
    shortTitle: 'Custom properties',
  },
];
