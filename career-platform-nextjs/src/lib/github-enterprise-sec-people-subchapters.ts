/** Enterprise › People セクション直下のサブチャプター ID */
export const ENTERPRISE_SEC_PEOPLE_CHILD_IDS = [
  'github-enterprise-org-people',
  'github-enterprise-sec-people-members',
  'github-enterprise-sec-people-administrators',
  'github-enterprise-sec-people-enterprise-teams',
  'github-enterprise-sec-people-outside-collaborators',
  'github-enterprise-sec-people-enterprise-roles',
  'github-enterprise-sec-people-enterprise-roles-role-management',
  'github-enterprise-sec-people-enterprise-roles-role-assignments',
  'github-enterprise-sec-people-organization-roles',
  'github-enterprise-sec-people-invitations',
  'github-enterprise-sec-people-failed-invitations',
] as const;

export function isEnterpriseSecPeopleChildId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (ENTERPRISE_SEC_PEOPLE_CHILD_IDS as readonly string[]).includes(chapterId);
}
