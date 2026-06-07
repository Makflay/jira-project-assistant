import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './app/store/projectStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectSelect } from './components/project/ProjectSelect';
import { ProjectStats } from './components/project/ProjectStats';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { LoadingState } from './components/common/LoadingState';
import { IssuesTable } from './components/issues/IssuesTable';
import { PriorityIssueDialog } from './components/issues/PriorityIssueDialog';
import type { JiraIssue } from './types/jira';
import { AssignIssueDialog } from './components/issues/AssignIssueDialog';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const issues = useProjectStore((state) => state.issues);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const loadIssuesByProject = useProjectStore((state) => state.loadIssuesByProject);
  const updateIssuePriority = useProjectStore((state) => state.updateIssuePriority);

  const [issueToAssign, setIssueToAssign] = useState<JiraIssue | null>(null);
  const [issueToRaisePriority, setIssueToRaisePriority] = useState<JiraIssue | null>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const reloadIssues = async () => {
    if (!selectedProject) return;

    await loadIssuesByProject(selectedProject);
  };

  return (
    <AppProviders>
      <AppLayout>
        {isProjectsLoading ? (
          <LoadingState message="Loading Jira projects..." />
        ) : projectsError ? (
          <ErrorState message={projectsError} actionLabel="Retry" onAction={loadProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No Jira projects found"
            description="You do not have access to any Jira projects yet."
          />
        ) : (
          <Stack spacing={3}>
            <ProjectSelect />
            <ProjectStats />
            <Box>
              {issues.length > 0 && (
                <IssuesTable
                  issues={issues}
                  onAssignIssue={setIssueToAssign}
                  onRaisePriority={setIssueToRaisePriority}
                />
              )}
            </Box>
          </Stack>
        )}
        <>
          <AssignIssueDialog
            open={issueToAssign !== null}
            issue={issueToAssign}
            onClose={() => setIssueToAssign(null)}
          />

          <PriorityIssueDialog
            open={issueToRaisePriority !== null}
            issue={issueToRaisePriority}
            onClose={() => setIssueToRaisePriority(null)}
            reloadIssues={reloadIssues}
            updateIssuePriority={updateIssuePriority}
          />
        </>
      </AppLayout>
    </AppProviders>
  );
}

export default App;
