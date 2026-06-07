import { invoke } from './forge';

export function getJiraProjects() {
  return invoke('getProjects');
}

export function getIssuesByProject(projectKey: string) {
  return invoke('getIssuesByProject', { projectKey });
}

export function getProjectAssignableUsers(projectKey: string) {
  return invoke('getProjectAssignableUsers', { projectKey });
}

export function assignIssue(issueKey: string, accountId: string) {
  return invoke('assignIssue', { issueKey, accountId });
}
