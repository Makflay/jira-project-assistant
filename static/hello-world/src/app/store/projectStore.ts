import { create } from 'zustand';
import type { JiraIssue, JiraProject, JiraUser, JiraPriority } from '../../types/jira';
import {
  getIssuesByProject,
  getJiraProjects,
  getProjectAssignableUsers,
} from '../../services/jiraApi';

type ProjectStore = {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  issues: JiraIssue[];
  isProjectsLoading: boolean;
  isIssuesLoading: boolean;
  projectsError: string | null;
  issuesError: string | null;

  teamMembers: JiraUser[];
  isTeamLoading: boolean;
  teamError: string | null;

  loadProjects: () => Promise<void>;
  setSelectedProject: (project: JiraProject) => void;
  loadIssuesByProject: (project: JiraProject) => Promise<void>;
  updateIssueAssignee: (issueKey: string, assigne: JiraUser | null) => void;
  updateIssuePriority: (issueKey: string, priority: JiraPriority | undefined) => void;
  loadTeamMembers: (projectKey: string) => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  issues: [],
  isProjectsLoading: false,
  isIssuesLoading: false,
  projectsError: null,
  issuesError: null,
  teamMembers: [],
  isTeamLoading: false,
  teamError: null,

  loadProjects: async () => {
    set({ isProjectsLoading: true, projectsError: null });

    try {
      const projects = await getJiraProjects();
      set({ projects, selectedProject: projects[0] ?? null, isProjectsLoading: false });

      if (projects[0]) {
        await get().loadIssuesByProject(projects[0]);
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

  updateIssueAssignee: (issueKey, assignee) => {
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.key === issueKey
          ? {
              ...issue,
              fields: {
                ...issue.fields,
                assignee,
              },
            }
          : issue,
      ),
    }));
  },
  updateIssuePriority: (issueKey, priority) => {
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.key === issueKey
          ? {
              ...issue,
              fields: {
                ...issue.fields,
                priority,
              },
            }
          : issue,
      ),
    }));
  },
  loadTeamMembers: async (projectKey: string) => {
    set({ isTeamLoading: true, teamError: null });

    try {
      const users = await getProjectAssignableUsers(projectKey);
      set({ teamMembers: users });
    } catch {
      set({ teamError: 'Failed to load project team members' });
    } finally {
      set({ isTeamLoading: false });
    }
  },
}));
