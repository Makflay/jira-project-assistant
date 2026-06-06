import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import type { JiraIssue } from '../../types/jira';
import { formatDate } from '../../features/utils/formatters';
import {
  isUnassignedIssue,
  isLowPriorityNearDeadLineIssue,
} from '../../features/utils/issueHealth';

type IssuesTableProps = {
  issues: JiraIssue[];
};

export function IssuesTable({ issues }: IssuesTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {issues.map((issue) => {
            const isUnassigned = isUnassignedIssue(issue);
            const isLowPriorityNearDeadline = isLowPriorityNearDeadLineIssue(issue);
            return (
              <TableRow
                key={issue.id}
                sx={{
                  bgcolor: isUnassigned
                    ? 'rgba(211, 47, 47, 0.08)'
                    : isLowPriorityNearDeadline
                      ? 'rgba(237, 108, 2, 0.08)'
                      : 'inherit',
                }}
              >
                <TableCell>{issue.key}</TableCell>
                <TableCell>{issue.fields.summary}</TableCell>
                <TableCell>
                  <Chip size="small" label={issue.fields.status.name} />
                </TableCell>
                <TableCell>
                  {isUnassigned ? (
                    <Chip size="small" color="error" label="Unassigned" />
                  ) : (
                    issue.fields.assignee?.displayName
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={issue.fields.priority?.name ?? 'No priority'}
                  />
                </TableCell>
                <TableCell>{formatDate(issue.fields.duedate)}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
