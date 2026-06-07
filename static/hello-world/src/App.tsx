import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './app/store/projectStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectSelect } from './components/project/ProjectSelect';
import { ProjectStats } from './components/project/ProjectStats';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { LoadingState } from './components/common/LoadingState';
import { IssuesTable } from './components/issues/IssuesTable';
import type { JiraIssue } from './types/jira';
import { BaseDialog } from './components/common/BaseDialog';
import { AssignIssueDialog } from './components/issues/AssignIssueDialog';
import { isUnassignedIssue } from './features/utils/issueHealth';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const issues = useProjectStore((state) => state.issues);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);
  const loadProjects = useProjectStore((state) => state.loadProjects);

  const [selectedIssue, setSelectedIssue] = useState<JiraIssue | null>(null);
  const isFixDialogOpen = selectedIssue !== null;
  const isAssignDialogOpen = selectedIssue ? isUnassignedIssue(selectedIssue) : false;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCloseFixDialog = () => {
    setSelectedIssue(null);
  };

  if (isProjectsLoading) {
    return <LoadingState message="Loading Jira projects..." />;
  }

  if (projectsError) {
    return <ErrorState message={projectsError} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No Jira projects found"
        description="You do not have access to any Jira projects yet."
      />
    );
  }

  return (
    <AppProviders>
      <AppLayout>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Projects</Typography>
          {projects.map((project) => (
            <Typography key={project.id}>
              {project.key} - {project.name}
            </Typography>
          ))}
        </Box>
        <ProjectSelect />
        <ProjectStats />
        {issues.length > 0 && <IssuesTable issues={issues} onFixIssue={setSelectedIssue} />}
        <BaseDialog
          open={isFixDialogOpen}
          title={selectedIssue ? `Fix ${selectedIssue.key}` : `Fix issue`}
          onClose={handleCloseFixDialog}
          actions={<Button onClick={handleCloseFixDialog}>Close</Button>}
        >
          <AssignIssueDialog
            open={isAssignDialogOpen}
            issue={selectedIssue}
            onClose={handleCloseFixDialog}
          />
        </BaseDialog>
      </AppLayout>
    </AppProviders>
  );
}

export default App;
