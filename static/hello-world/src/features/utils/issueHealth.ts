import type { JiraIssue } from '../../types/jira';

const DAY_MS = 1000 * 60 * 60 * 24;
const NEAR_DEADLINE_DAYS = 3;
const LOW_PRIORITIES = ['low', 'lowest'];

export type IssueProblem = 'unassigned' | 'lowPriorityNearDeadline';

export const isNearDeadline = (dueDate?: string | null): boolean => {
  if (!dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / DAY_MS);

  return diffDays >= 0 && diffDays <= NEAR_DEADLINE_DAYS;
};

export function isUnassignedIssue(issue: JiraIssue): boolean {
  return !issue.fields.assignee;
}

export const isLowPriority = (priorityName?: string | null): boolean => {
  return LOW_PRIORITIES.includes(priorityName?.toLowerCase() ?? '');
};

export const isLowPriorityNearDeadlineIssue = (issue: JiraIssue): boolean => {
  if (isDoneIssue(issue)) {
    return false;
  }

  return isLowPriority(issue.fields.priority?.name) && isNearDeadline(issue.fields.duedate);
};

export function getIssueProblems(issue: JiraIssue): IssueProblem[] {
  const problems: IssueProblem[] = [];

  if (isUnassignedIssue(issue)) {
    problems.push('unassigned');
  }

  if (isLowPriorityNearDeadlineIssue(issue)) {
    problems.push('lowPriorityNearDeadline');
  }

  return problems;
}

export function hasIssueProblems(issue: JiraIssue): boolean {
  return getIssueProblems(issue).length > 0;
}

export function isDoneIssue(issue: JiraIssue): boolean {
  return issue.fields.status.statusCategory?.key === 'done';
}
