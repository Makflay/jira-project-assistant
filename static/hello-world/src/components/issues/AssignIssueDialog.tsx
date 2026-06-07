import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { BaseDialog } from '../common/BaseDialog';
import type { JiraIssue, JiraUser } from '../../types/jira';
import { getProjectAssignableUsers } from '../../services/jiraApi';

type AssignIssueDialogProps = {
  open: boolean;
  issue: JiraIssue | null;
  onClose: () => void;
};

export function AssignIssueDialog({ open, issue, onClose }: AssignIssueDialogProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [users, setUsers] = useState<JiraUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const projectKey = issue?.key?.split('-')[0] ?? null;

  useEffect(() => {
    if (!open || !projectKey) return;

    setIsUsersLoading(true);
    setUsersError(null);

    getProjectAssignableUsers(projectKey)
      .then(setUsers)
      .catch(() => setUsersError('Failed to load assignable users'))
      .finally(() => setIsUsersLoading(false));
  }, [open, projectKey]);

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

      {usersError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {usersError}
        </Alert>
      ) : (
        <>
          {isUsersLoading && <Typography sx={{ mb: 2 }}>Loading users...</Typography>}

          <FormControl fullWidth size="small" disabled={isUsersLoading || users.length === 0}>
            <InputLabel id="assignee-select-label">Assignee</InputLabel>
            <Select
              labelId="assignee-select-label"
              value={selectedAccountId}
              label="Assignee"
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem key={user.accountId} value={user.accountId}>
                  {user.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </BaseDialog>
  );
}
