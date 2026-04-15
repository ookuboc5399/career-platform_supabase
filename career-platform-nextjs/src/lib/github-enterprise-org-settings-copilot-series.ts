/**
 * Organization Settings > Copilot 配下のサブチャプター（シリーズナビ用）
 */
export type OrgSettingsCopilotSeriesItem = {
  id: string;
  title: string;
  shortTitle: string;
};

export const GITHUB_ORG_SETTINGS_COPILOT_SERIES: OrgSettingsCopilotSeriesItem[] = [
  {
    id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot（概要）',
    shortTitle: '概要',
  },
  {
    id: 'github-enterprise-org-settings-copilot-access',
    title: 'Copilot — Access',
    shortTitle: 'Access',
  },
  {
    id: 'github-enterprise-org-settings-copilot-policies',
    title: 'Copilot — Policies',
    shortTitle: 'Policies',
  },
  {
    id: 'github-enterprise-org-settings-copilot-models',
    title: 'Copilot — Models',
    shortTitle: 'Models',
  },
  {
    id: 'github-enterprise-org-settings-copilot-custom-instructions',
    title: 'Copilot — Custom instructions',
    shortTitle: 'Custom instructions',
  },
  {
    id: 'github-enterprise-org-settings-copilot-content-exclusion',
    title: 'Copilot — Content exclusion',
    shortTitle: 'Content exclusion',
  },
  {
    id: 'github-enterprise-org-settings-copilot-cloud-agent',
    title: 'Copilot — Cloud agent',
    shortTitle: 'Cloud agent',
  },
];

export function isOrgSettingsCopilotSeriesChapterId(
  chapterId: string | undefined,
): boolean {
  if (!chapterId) return false;
  return GITHUB_ORG_SETTINGS_COPILOT_SERIES.some((item) => item.id === chapterId);
}
