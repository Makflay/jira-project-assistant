import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { BaseDialog } from '../common/BaseDialog';
import type { JiraIssue } from '../../types/jira';

type AssignIssueDialogProps = {
  open: boolean;
  issue: JiraIssue | null;
  onClose: () => void;
};

const mockUsers = [
  { accountId: 'mock-1', displayName: 'Alice Johnson' },
  { accountId: 'mock-2', displayName: 'Bob Smith' },
  { accountId: 'mock-3', displayName: 'Charlie Lee' },
];

export function AssignIssueDialog({ open, issue, onClose }: AssignIssueDialogProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const handleClose = () => {
    setSelectedAccountId('');
    onClose();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedAccountId(event.target.value);
  };

  return (
    <BaseDialog
      open={open}
      title={issue ? `Assign ${issue.key}` : 'Assign issue'}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={!selectedAccountId}>
            Confirm
          </Button>
        </>
      }
    >
      <Typography sx={{ mb: 2 }}>Select an assignee for this issue.</Typography>

      <FormControl fullWidth size="small">
        <InputLabel id="assignee-select-label">Assignee</InputLabel>
        <Select
          labelId="assignee-select-label"
          value={selectedAccountId}
          label="Assignee"
          onChange={handleChange}
        >
          {mockUsers.map((user) => (
            <MenuItem key={user.accountId} value={user.accountId}>
              {user.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </BaseDialog>
  );
}
