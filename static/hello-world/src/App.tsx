import { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './app/store/projectStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectSelect } from './components/project/ProjectSelect';
import { ProjectStats } from './components/project/ProjectStats';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { LoadingState } from './components/common/LoadingState';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);
  const loadProjects = useProjectStore((state) => state.loadProjects);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
      </AppLayout>
    </AppProviders>
  );
}

export default App;
