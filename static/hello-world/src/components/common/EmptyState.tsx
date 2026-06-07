import { Paper, Typography } from '@mui/material';

type EmptyStateProps = {
  title: string;
  description?: string;
  compact?: boolean;
};

export function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: compact ? 2 : 3,
        bgcolor: 'background.paper',
        borderStyle: 'dashed',
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Paper>
  );
}
