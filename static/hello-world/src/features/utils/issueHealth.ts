import type { JiraIssue } from '../../types/jira';

const DAY_MS = 1000 * 60 * 60 * 24;
const NEAR_DEADLINE_DAYS = 3;

export const isNearDeadline = (dueDate?: string | null): boolean => {
  if (!dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / DAY_MS);

  return diffDays >= 0 && diffDays <= NEAR_DEADLINE_DAYS;
};

export const isLowPriority = (priorityName?: string | null): boolean => {
  const normalized = priorityName?.toLowerCase();

  return normalized === 'low' || normalized === 'lowest';
};

export function isUnassignedIssue(issue: JiraIssue) {
  return !issue.fields.assignee;
}
