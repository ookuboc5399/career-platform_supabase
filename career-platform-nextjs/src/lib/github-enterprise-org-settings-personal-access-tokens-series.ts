/** Personal access tokens 配下のサブチャプター */
export type OrgSettingsPatSeriesItem = { id: string; shortTitle: string };

export const GITHUB_ORG_SETTINGS_PAT_SERIES: OrgSettingsPatSeriesItem[] = [
  { id: 'github-enterprise-org-settings-personal-access-tokens-settings', shortTitle: 'settings' },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens-active-tokens',
    shortTitle: 'Active tokens',
  },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens-prnding-requests',
    shortTitle: 'Prnding requests',
  },
];
