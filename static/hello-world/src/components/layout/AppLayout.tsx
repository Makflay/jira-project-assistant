import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            Jira Project Assistant
          </Typography>
        </Toolbar>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </AppBar>
    </Box>
  );
}
