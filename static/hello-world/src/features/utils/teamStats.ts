import type { JiraIssue } from '../../types/jira';

export type MemberActivityStatus = 'Idle' | 'Normal' | 'Busy';
type ActivityColor = 'default' | 'success' | 'warning';

export function getAssignedIssuesCountByUser(issues: JiraIssue[]): Record<string, number> {
  return issues.reduce<Record<string, number>>((acc, issue) => {
    const accountId = issue.fields.assignee?.accountId;

    if (!accountId) {
      return acc;
    }

    acc[accountId] = (acc[accountId] ?? 0) + 1;

    return acc;
  }, {});
}

export function getMemberActivityStatus(assignedIssuesCount: number): MemberActivityStatus {
  if (assignedIssuesCount === 0) {
    return 'Idle';
  }

  if (assignedIssuesCount <= 3) {
    return 'Normal';
  }

  return 'Busy';
}

export function getMemberActivityColor(status: MemberActivityStatus): ActivityColor {
  if (status === 'Idle') {
    return 'default';
  }

  if (status === 'Normal') {
    return 'success';
  }

  return 'warning';
}
