import { invoke } from './forge';

export function getJiraProjects() {
  return invoke('getProjects');
}
