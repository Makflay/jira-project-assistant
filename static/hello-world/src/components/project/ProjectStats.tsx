import { Alert, Box, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useProjectStore } from '../../app/store/projectStore';
import { isLowPriority, isNearDeadline } from '../../features/utils/issueHealth';

export function ProjectStats() {
  const issues = useProjectStore((state) => state.issues);
  const isIssuesLoading = useProjectStore((state) => state.isIssuesLoading);
  const error = useProjectStore((state) => state.error);

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

  if (isIssuesLoading) return <Typography>Loading project statistics...</Typography>;

  if (error) return <Alert severity="error">{error}</Alert>;

  if (issues.length === 0) return <Typography color="text.secondary">No issues loaded.</Typography>;

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
