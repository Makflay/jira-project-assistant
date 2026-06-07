import { Paper, Typography } from '@mui/material';

export function TeamPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2">
        Team
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Project participants and workload insights will appear here.
      </Typography>
    </Paper>
  );
}
