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
  Box,
  Stack,
  Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material';
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

function getStatusColor(issue: JiraIssue): ChipProps['color'] {
  const statusCategory = issue.fields.status.statusCategory?.key?.toLowerCase();

  if (statusCategory === 'done') return 'success';
  if (statusCategory === 'indeterminate') return 'warning';

  return 'default';
}

export function IssuesTable({ issues, onFixIssue }: IssuesTableProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell>Key</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {issues.map((issue) => {
            const isUnassigned = isUnassignedIssue(issue);
            const isLowPriorityNearDeadline = isLowPriorityNearDeadlineIssue(issue);
            const problems = getIssueProblems(issue);
            return (
              <TableRow
                key={issue.id}
                sx={{
                  bgcolor: isUnassigned
                    ? 'rgba(211, 47, 47, 0.07)'
                    : isLowPriorityNearDeadline
                      ? 'rgba(237, 108, 2, 0.07)'
                      : 'inherit',
                  '&:hover': {
                    bgcolor: isUnassigned
                      ? 'rgba(211, 47, 47, 0.12)'
                      : isLowPriorityNearDeadline
                        ? 'rgba(237, 108, 2, 0.12)'
                        : 'action.hover',
                  },
                }}
              >
                <TableCell sx={{ width: 120, whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {issue.key}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 420 }}>
                  <Stack spacing={0.75}>
                    <Typography
                      variant="body2"
                      title={issue.fields.summary}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {issue.fields.summary}
                    </Typography>
                    {problems.length > 0 && (
                      <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {isUnassigned && (
                          <Chip size="small" color="error" variant="outlined" label="No assignee" />
                        )}
                        {isLowPriorityNearDeadline && (
                          <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            label="Priority due soon"
                          />
                        )}
                      </Stack>
                    )}
                  </Stack>
                </TableCell>
                <TableCell sx={{ width: 150 }}>
                  <Chip
                    size="small"
                    color={getStatusColor(issue)}
                    label={issue.fields.status.name}
                  />
                </TableCell>
                <TableCell sx={{ width: 190 }}>
                  {isUnassigned ? (
                    <Chip size="small" color="error" label="Unassigned" />
                  ) : (
                    <Typography
                      variant="body2"
                      title={issue.fields.assignee?.displayName}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {issue.fields.assignee?.displayName}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ width: 190 }}>
                  <Stack spacing={0.5}>
                    <Chip
                      size="small"
                      color={isLowPriorityNearDeadline ? 'warning' : 'default'}
                      variant="outlined"
                      label={issue.fields.priority?.name ?? 'No priority'}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Due: {formatDate(issue.fields.duedate)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ width: 190 }}>
                  {isUnassigned ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onFixIssue(issue)}
                      aria-label={`Assign ${issue.key}`}
                    >
                      Assign
                    </Button>
                  ) : isLowPriorityNearDeadline ? (
                    <Button size="small" variant="text" disabled>
                      Priority issue
                    </Button>
                  ) : (
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      -
                    </Box>
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
