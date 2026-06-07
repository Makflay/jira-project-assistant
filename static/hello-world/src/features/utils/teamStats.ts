import type { JiraIssue } from '../../types/jira';

export function getAssignedIssuesCountByUser(issues: JiraIssue[]) {
  return issues.reduce<Record<string, number>>((acc, issue) => {
    const accountId = issue.fields.assignee?.accountId;

    if (!accountId) {
      return acc;
    }

    acc[accountId] = (acc[accountId] ?? 0) + 1;

    return acc;
  }, {});
}
