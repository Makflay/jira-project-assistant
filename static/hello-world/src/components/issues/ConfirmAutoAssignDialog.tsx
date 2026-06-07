import { Button, Typography } from '@mui/material';
import { BaseDialog } from '../common/BaseDialog';

type ConfirmAutoAssignDialogProps = {
  open: boolean;
  unassignedIssuesCount: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmAutoAssignDialog({
  open,
  unassignedIssuesCount,
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
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" disabled={unassignedIssuesCount === 0} onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <Typography sx={{ mb: 1 }}>
        {unassignedIssuesCount} unassigned issues will be processed.
      </Typography>

      <Typography color="text.secondary">
        These issues will be assigned to random active project participants.
      </Typography>
    </BaseDialog>
  );
}
