import { Box, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useProjectStore } from '../../app/store/projectStore';
import { isLowPriority, isNearDeadline } from '../../features/utils/issueHealth';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { LoadingState } from '../common/LoadingState';

export function ProjectStats() {
  const issues = useProjectStore((state) => state.issues);
  const isIssuesLoading = useProjectStore((state) => state.isIssuesLoading);
  const issuesError = useProjectStore((state) => state.issuesError);

  const stats = useMemo(() => {
    const unassigned = issues.filter((issue) => !issue.fields.assignee).length;

    const lowPriorityDueSoon = issues.filter((issue) => {
      return isLowPriority(issue.fields.priority?.name) && isNearDeadline(issue.fields.duedate);
    }).length;

    const done = issues.filter(
      (issue) => issue.fields.status.statusCategory?.key?.toLowerCase() === 'done',
    ).length;

    return {
      total: issues.length,
      unassigned,
      lowPriorityDueSoon,
      done,
    };
  }, [issues]);

  if (isIssuesLoading) {
    return <LoadingState message="Loading project issues..." />;
  }

  if (issuesError) {
    return <ErrorState message={issuesError} />;
  }

  if (issues.length === 0) {
    return (
      <EmptyState
        title="No issues found"
        description="This project does not have issues matching the current request."
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      }}
    >
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Issues
        </Typography>

        <Typography variant="h5">{stats.total}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Unassigned
        </Typography>

        <Typography variant="h5">{stats.unassigned}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Low Priority Due Soon
        </Typography>

        <Typography variant="h5">{stats.lowPriorityDueSoon}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Done
        </Typography>

        <Typography variant="h5">{stats.done}</Typography>
      </Paper>
    </Box>
  );
}
