import { Box, CircularProgress, Typography } from '@mui/material';

type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 3 }}>
      <CircularProgress size={20} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
