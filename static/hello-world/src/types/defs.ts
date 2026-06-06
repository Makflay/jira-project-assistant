import type { JiraProject } from './jira';

export type Defs = {
  getProjects: () => JiraProject[];
};
