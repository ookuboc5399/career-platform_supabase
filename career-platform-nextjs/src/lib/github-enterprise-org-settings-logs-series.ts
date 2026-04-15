/** Logs 配下のサブチャプター */
export type OrgSettingsLogsSeriesItem = { id: string; shortTitle: string };

export const GITHUB_ORG_SETTINGS_LOGS_SERIES: OrgSettingsLogsSeriesItem[] = [
  {
    id: 'github-enterprise-org-settings-logs-sponsorship-log',
    shortTitle: 'Sponsorship log',
  },
  {
    id: 'github-enterprise-org-settings-logs-audit-log',
    shortTitle: 'Audit log',
  },
];
