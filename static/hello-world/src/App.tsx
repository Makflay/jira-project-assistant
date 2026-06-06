import { Box, Typography } from '@mui/material';
import { invoke } from '@forge/bridge';
import { AppProviders } from './app/AppProviders';

const result = await invoke('getProjectInfo');
console.log(result);

function App() {
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
