import { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './app/store/projectStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectSelect } from './components/project/ProjectSelect';
import { ProjectStats } from './components/project/ProjectStats';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const isIssuesLoading = useProjectStore((state) => state.isIssuesLoading);
  const error = useProjectStore((state) => state.error);
  const loadProjects = useProjectStore((state) => state.loadProjects);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (isProjectsLoading) return <Typography>Loading projects...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (isIssuesLoading) return <Typography>Loading issues...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

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
