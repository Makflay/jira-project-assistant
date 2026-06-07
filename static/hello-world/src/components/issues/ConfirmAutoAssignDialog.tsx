import { Button, Typography, Alert } from '@mui/material';
import { BaseDialog } from '../common/BaseDialog';

type ConfirmAutoAssignDialogProps = {
  open: boolean;
  unassignedIssuesCount: number;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmAutoAssignDialog({
  open,
  unassignedIssuesCount,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: ConfirmAutoAssignDialogProps) {
  return (
    <BaseDialog
      open={open}
      title="Auto-assign unassigned issues"
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={unassignedIssuesCount === 0 || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? 'Assigning...' : 'Confirm'}
          </Button>
        </>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography sx={{ mb: 1 }}>
        {unassignedIssuesCount} unassigned issues will be processed.
      </Typography>

      <Typography color="text.secondary">
        These issues will be assigned to random active project participants.
      </Typography>
    </BaseDialog>
  );
}
