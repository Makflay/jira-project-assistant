import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { BaseDialog } from '../common/BaseDialog';
import type { JiraIssue } from '../../types/jira';

type PriorityIssueDialogProps = {
  open: boolean;
  issue: JiraIssue | null;
  onClose: () => void;
};

const priorityOptions = [
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export function PriorityIssueDialog({ open, issue, onClose }: PriorityIssueDialogProps) {
  const [selectedPriority, setSelectedPriority] = useState('');

  const handleClose = () => {
    setSelectedPriority('');
    onClose();
  };

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriority(event.target.value);
  };

  const handleConfirm = () => {
    if (!issue || !selectedPriority) return;

    console.log('Update priority', issue.key, selectedPriority);
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      title={issue ? `Update priority for ${issue.key}` : 'Update priority'}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={!selectedPriority} onClick={handleConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <Typography sx={{ mb: 2 }}>
        This issue has low priority and a near deadline. Choose a higher priority.
      </Typography>

      <FormControl>
        <RadioGroup value={selectedPriority} onChange={handlePriorityChange}>
          {priorityOptions.map((priority) => (
            <FormControlLabel
              key={priority.value}
              value={priority.value}
              control={<Radio />}
              label={priority.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </BaseDialog>
  );
}
