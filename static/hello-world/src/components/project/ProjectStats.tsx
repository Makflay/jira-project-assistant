import { Box, Chip, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useProjectStore } from '../../app/store/projectStore';
import { isLowPriority, isNearDeadline } from '../../features/utils/issueHealth';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { LoadingState } from '../common/LoadingState';

type StatCardProps = {
  label: string;
  value: number;
  tone?: 'default' | 'warning' | 'error' | 'success';
  helper?: string;
};

function StatCard({ label, value, tone = 'default', helper }: StatCardProps) {
  const chipColor = tone === 'default' ? 'default' : tone;
  const chipLabel = tone === 'error' ? 'Needs attention' : tone === 'warning' ? 'Watch' : 'OK';

  return (
    <Paper variant="outlined" sx={{ p: 2, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        {tone !== 'default' && <Chip size="small" color={chipColor} label={chipLabel} />}
      </Box>
      <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
        {value}
      </Typography>
      {helper && (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      )}
    </Paper>
  );
}

export function ProjectStats() {
  const issues = useProjectStore((state) => state.issues);
  const isIssuesLoading = useProjectStore((state) => state.isIssuesLoading);
  const issuesError = useProjectStore((state) => state.issuesError);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const loadIssuesByProject = useProjectStore((state) => state.loadIssuesByProject);

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
    return (
      <ErrorState
        message={issuesError}
        actionLabel={selectedProject ? 'Retry' : undefined}
        onAction={selectedProject ? () => void loadIssuesByProject(selectedProject) : undefined}
      />
    );
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
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      <StatCard label="Total issues" value={stats.total} helper="Loaded from Jira" />
      <StatCard
        label="Unassigned"
        value={stats.unassigned}
        tone={stats.unassigned > 0 ? 'error' : 'success'}
        helper="Needs an assignee"
      />
      <StatCard
        label="Low priority due soon"
        value={stats.lowPriorityDueSoon}
        tone={stats.lowPriorityDueSoon > 0 ? 'warning' : 'success'}
        helper="Due in the next 3 days"
      />
      <StatCard label="Done" value={stats.done} tone="success" helper="Completed work" />
    </Box>
  );
}
