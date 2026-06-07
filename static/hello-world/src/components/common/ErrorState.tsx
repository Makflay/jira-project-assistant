import { Alert, Button } from '@mui/material';

type ErrorStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        actionLabel && onAction ? (
          <Button color="inherit" size="small" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
}
