import type { JiraProject, JiraIssue, JiraUser } from './jira';

export type MutationResult = {
  success: true;
};

export type Defs = {
  getProjects: () => JiraProject[];
  getIssuesByProject: (payload: { projectKey: string }) => JiraIssue[];
  getProjectAssignableUsers: (payload: { projectKey: string }) => JiraUser[];
  assignIssue: (payload: { issueKey: string; accountId: string }) => MutationResult;
  updateIssuePriority: (payload: { issueKey: string; priorityId: string }) => MutationResult;
};
