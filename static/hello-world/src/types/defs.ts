import type { JiraProject, JiraIssue, JiraUser } from './jira';

export type Defs = {
  getProjects: () => JiraProject[];
  getIssuesByProject: (payload: { projectKey: string }) => JiraIssue[];
  getProjectAssignableUsers: (payload: { projectKey: string }) => JiraUser[];
  assignIssue: (payload: { issueKey: string; accountId: string }) => void;
};
