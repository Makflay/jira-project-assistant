import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import type { JiraIssue } from '../../types/jira';

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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.key}</TableCell>
              <TableCell>{issue.fields.summary}</TableCell>
              <TableCell>{issue.fields.status.name}</TableCell>
              <TableCell>{issue.fields.assignee?.displayName ?? 'Unassigned'}</TableCell>
              <TableCell>{issue.fields.priority?.name ?? 'No priority'}</TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
