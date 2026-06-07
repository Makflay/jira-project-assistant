import { Box, CircularProgress, Typography } from '@mui/material';

type LoadingStateProps = {
  message: string;
  compact?: boolean;
};

export function LoadingState({ message, compact = false }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: compact ? 1 : 3,
        color: 'text.secondary',
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={20} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
