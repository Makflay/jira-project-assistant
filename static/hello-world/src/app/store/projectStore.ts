import { create } from 'zustand';
import type { JiraIssue, JiraProject } from '../../types/jira';
import { getIssuesByProject, getJiraProjects } from '../../services/jiraApi';

type ProjectStore = {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  issues: JiraIssue[];
  isProjectsLoading: boolean;
  isIssuesLoading: boolean;
  projectsError: string | null;
  issuesError: string | null;

  loadProjects: () => Promise<void>;
  setSelectedProject: (project: JiraProject) => void;
  loadIssuesByProject: (project: JiraProject) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  issues: [],
  isProjectsLoading: false,
  isIssuesLoading: false,
  projectsError: null,
  issuesError: null,

  loadProjects: async () => {
    set({ isProjectsLoading: true, projectsError: null });

    try {
      const projects = await getJiraProjects();
      set({ projects, selectedProject: projects[0] ?? null });

      if (projects[0]) {
        const issues = await getIssuesByProject(projects[0].key);
        set({ issues });
      }
    } catch {
      set({ projectsError: 'Failed to load Jira projects' });
    } finally {
      set({ isProjectsLoading: false });
    }
  },

  setSelectedProject: (project) => {
    const current = get().selectedProject;

    if (current?.key === project.key) {
      return;
    }

    set({ selectedProject: project });
  },

  loadIssuesByProject: async (project) => {
    set({ issues: [], isIssuesLoading: true, issuesError: null });

    try {
      const issues = await getIssuesByProject(project.key);
      set({ issues });
    } catch {
      set({ issuesError: 'Failed to load Jira issues' });
    } finally {
      set({ isIssuesLoading: false });
    }
  },
}));
