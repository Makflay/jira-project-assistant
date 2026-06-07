import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { BaseDialog } from '../common/BaseDialog';
import type { JiraIssue, JiraPriority } from '../../types/jira';
import { updateIssuePriority as updateIssuePriorityReq } from '../../services/jiraApi';

type PriorityIssueDialogProps = {
  open: boolean;
  issue: JiraIssue | null;
  onClose: () => void;
  reloadIssues: () => Promise<void>;
  updateIssuePriority: (issueKey: string, priority: JiraPriority | undefined) => void;
};

const priorityOptions: JiraPriority[] = [
  { id: '3', name: 'Medium' },
  { id: '2', name: 'High' },
  { id: '1', name: 'Highest' },
];

export function PriorityIssueDialog({
  open,
  issue,
  onClose,
  reloadIssues,
  updateIssuePriority,
}: PriorityIssueDialogProps) {
  const [selectedPriorityId, setSelectedPriorityId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedPriorityId('');
    onClose();
  };

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriorityId(event.target.value);
  };

  const handleConfirm = async () => {
    const nextPriority = priorityOptions.find((priority) => priority.id === selectedPriorityId);
    if (!issue || !selectedPriorityId) return;

    const previousPriority = issue.fields.priority ?? undefined;

    setIsSubmitting(true);
    setSubmitError(null);
    updateIssuePriority(issue.key, nextPriority);

    try {
      await updateIssuePriorityReq(issue.key, selectedPriorityId);
      handleClose();
      await reloadIssues();
    } catch {
      updateIssuePriority(issue.key, previousPriority);
      setSubmitError('Failed to update issue priority');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      title={issue ? `Update priority for ${issue.key}` : 'Update priority'}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedPriorityId || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? 'Updating...' : 'Confirm'}
          </Button>
        </>
      }
    >
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <Typography sx={{ mb: 2 }}>
        This issue has low priority and a near deadline. Choose a higher priority.
      </Typography>

      <FormControl>
        <RadioGroup value={selectedPriorityId} onChange={handlePriorityChange}>
          {priorityOptions.map((priority) => (
            <FormControlLabel
              key={priority.id}
              value={priority.id}
              control={<Radio />}
              label={priority.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </BaseDialog>
  );
}
