import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { BaseDialog } from '../common/BaseDialog';
import type { JiraIssue, JiraUser } from '../../types/jira';
import { getProjectAssignableUsers, assignIssue } from '../../services/jiraApi';
import { useProjectStore } from '../../app/store/projectStore';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateIssueAssignee = useProjectStore((state) => state.updateIssueAssignee);

  const projectKey = issue?.key?.split('-')[0] ?? null;

  useEffect(() => {
    if (!open || !projectKey) return;

    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) return;

        setIsUsersLoading(true);
        setUsersError(null);
        setSubmitError(null);
        setSelectedAccountId('');
        setUsers([]);
      })
      .then(() => getProjectAssignableUsers(projectKey))
      .then((assignableUsers) => {
        if (!isActive) return;

        setUsers(assignableUsers);
      })
      .catch(() => {
        if (!isActive) return;

        setUsersError('Failed to load assignable users');
      })
      .finally(() => {
        if (!isActive) return;

        setIsUsersLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [open, projectKey]);

  const handleClose = () => {
    setSelectedAccountId('');
    setSubmitError(null);
    onClose();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedAccountId(event.target.value);
  };

  const handleConfirm = async () => {
    const newAssignee = users.find((user) => user.accountId === selectedAccountId);

    if (!issue || !newAssignee) return;

    const previousAssignee = issue.fields.assignee ?? null;

    setIsSubmitting(true);
    setSubmitError(null);

    updateIssueAssignee(issue.key, newAssignee);

    try {
      await assignIssue(issue.key, selectedAccountId);
      handleClose();
    } catch {
      updateIssueAssignee(issue.key, previousAssignee);
      setSubmitError('Failed to assign issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      title={issue ? `Assign ${issue.key}` : 'Assign issue'}
      onClose={handleClose}
      actions={
        <>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedAccountId || isSubmitting || isUsersLoading}
            onClick={handleConfirm}
            startIcon={isSubmitting ? <CircularProgress color="inherit" size={16} /> : undefined}
          >
            {isSubmitting ? 'Assigning' : 'Confirm'}
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Choose an assignable project member. The issue row updates immediately and rolls back if
            Jira rejects the change.
          </Typography>
        </Box>

        {usersError && <Alert severity="error">{usersError}</Alert>}
        {submitError && <Alert severity="error">{submitError}</Alert>}
        {isUsersLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading assignable users...
            </Typography>
          </Box>
        )}
        {!isUsersLoading && !usersError && users.length === 0 && (
          <Alert severity="info">No assignable users were found for this project.</Alert>
        )}

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
      </Stack>
    </BaseDialog>
  );
}
