import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './store/projectStore';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const isIssuesLoading = useProjectStore((state) => state.isIssuesLoading);
  const error = useProjectStore((state) => state.error);
  const issues = useProjectStore((state) => state.issues);
  const selectProject = useProjectStore((state) => state.selectProject);
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
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1">
          Jira Project Assistant
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Projects</Typography>
        {projects.map((project) => (
          <Typography key={project.id}>
            {project.key} - {project.name}
          </Typography>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Selected Project</Typography>

        {selectProject ? (
          <Typography>
            {selectedProject?.key} - {selectProject.name}
          </Typography>
        ) : (
          <Typography>No project selected</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Project Issues</Typography>
        {issues.map((issue) => (
          <Typography key={issue.id}>{issue.key}</Typography>
        ))}
      </Box>
    </AppProviders>
  );
}

export default App;
