import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import type { JiraProject } from './types/jira';
import { getJiraProjects } from './services/jiraApi';

function App() {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJiraProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load Jira projects'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Typography>Loading projects...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  return (
    <AppProviders>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1">
          Jira Project Assistant
        </Typography>
      </Box>
    </AppProviders>
  );
}

export default App;
