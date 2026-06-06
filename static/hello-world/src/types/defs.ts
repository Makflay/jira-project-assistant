import type { JiraProject, JiraIssue } from './jira';

export type Defs = {
  getProjects: () => JiraProject[];
  getIssuesByProject: (payload: { projectKey: string }) => JiraIssue[];
};
