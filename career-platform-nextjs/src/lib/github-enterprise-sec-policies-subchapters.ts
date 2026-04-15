/** Enterprise › Policies セクション直下のサブチャプター ID */
export const ENTERPRISE_SEC_POLICIES_CHILD_IDS = [
  'github-enterprise-sec-policies-repository',
  'github-enterprise-sec-policies-repository-repository',
  'github-enterprise-sec-policies-repository-code',
  'github-enterprise-sec-policies-repository-code-insights',
  'github-enterprise-sec-policies-repository-code-ruleset-bypasses',
  'github-enterprise-sec-policies-repository-custom-properties',
  'github-enterprise-sec-policies-member-privileges',
  'github-enterprise-sec-policies-codespaces',
  'github-enterprise-sec-policies-copilot',
  'github-enterprise-sec-policies-actions',
  'github-enterprise-sec-policies-hosted-compute-networking',
  'github-enterprise-sec-policies-projects',
  'github-enterprise-sec-policies-advanced-security',
  'github-enterprise-sec-policies-code-quality',
  'github-enterprise-sec-policies-personal-access-tokens',
  'github-enterprise-sec-policies-sponsors',
  'github-enterprise-sec-policies-models',
] as const;

export function isEnterpriseSecPoliciesChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ENTERPRISE_SEC_POLICIES_CHILD_IDS as readonly string[]).includes(chapterId);
}
