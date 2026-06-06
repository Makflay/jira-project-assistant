import { create } from 'zustand';
import type { JiraIssue, JiraProject } from '../types/jira';
import { getIssuesByProject, getJiraProjects } from '../services/jiraApi';

type ProjectStore = {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  issues: JiraIssue[];
  isProjectsLoading: boolean;
  isIssuesLoading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  selectProject: (project: JiraProject) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  selectedProject: null,
  issues: [],
  isProjectsLoading: false,
  isIssuesLoading: false,
  error: null,

  loadProjects: async () => {
    set({ isProjectsLoading: true, error: null });

    try {
      const projects = await getJiraProjects();
      set({ projects, selectedProject: projects[0] ?? null });

      if (projects[0]) {
        const issues = await getIssuesByProject(projects[0].key);
        set({ issues });
      }
    } catch {
      set({ error: 'Failed to load Jira projects' });
    } finally {
      set({ isProjectsLoading: false });
    }
  },

  selectProject: async (project) => {
    set({ selectedProject: project, issues: [], isIssuesLoading: true, error: null });

    try {
      const issues = await getIssuesByProject(project.key);
      set({ issues });
    } catch {
      set({ error: 'Failed to load Jira issues' });
    } finally {
      set({ isIssuesLoading: false });
    }
  },
}));
