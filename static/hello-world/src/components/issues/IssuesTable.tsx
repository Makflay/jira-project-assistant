import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import type { JiraIssue } from '../../types/jira';
import { formatDate } from '../../features/utils/formatters';
import {
  isUnassignedIssue,
  isLowPriorityNearDeadlineIssue,
  getIssueProblems,
} from '../../features/utils/issueHealth';

type IssuesTableProps = {
  issues: JiraIssue[];
  onFixIssue: (issue: JiraIssue) => void;
};

export function IssuesTable({ issues, onFixIssue }: IssuesTableProps) {
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
            const isLowPriorityNearDeadline = isLowPriorityNearDeadlineIssue(issue);
            const problems = getIssueProblems(issue);
            const isFixable = problems.length > 0;
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
                  {isFixable ? (
                    <Button size="small" variant="outlined" onClick={() => onFixIssue(issue)}>
                      Fix
                    </Button>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
