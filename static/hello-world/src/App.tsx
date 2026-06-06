import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import type { JiraProject, JiraIssue } from './types/jira';
import { getJiraProjects, getIssuesByProject } from './services/jiraApi';

function App() {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [isIssuesLoading, setIsIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState<string | null>(null);

  useEffect(() => {
    getJiraProjects()
      .then((loadedProjects) => {
        setProjects(loadedProjects);
        setSelectedProject(loadedProjects[0] ?? null);
      })
      .catch(() => setError('Failed to load Jira projects'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    setIsIssuesLoading(true);
    setIssuesError(null);

    getIssuesByProject(selectedProject.key)
      .then(setIssues)
      .catch(() => setIssuesError('Failed to load Jira issues'))
      .finally(() => setIsIssuesLoading(false));
  }, [selectedProject]);

  if (isLoading) return <Typography>Loading projects...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (isIssuesLoading) return <Typography>Loading issues...</Typography>;
  if (issuesError) return <Alert severity="error">{issuesError}</Alert>;

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

        {selectedProject ? (
          <Typography>
            {selectedProject.key} - {selectedProject.name}
          </Typography>
        ) : (
          <Typography>No project selected</Typography>
        )}
      </Box>
    </AppProviders>
  );
}

export default App;
