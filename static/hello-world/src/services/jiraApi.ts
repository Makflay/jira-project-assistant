import { invoke } from './forge';

export function getJiraProjects() {
  return invoke('getProjects');
}

export function getIssuesByProject(projectKey: string) {
  return invoke('getIssuesByProject', { projectKey });
}
