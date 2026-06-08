import {
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { LoadingState } from '../common/LoadingState';
import { useProjectStore } from '../../app/store/projectStore';
import {
  getAssignedIssuesCountByUser,
  getMemberActivityStatus,
  getMemberActivityColor,
} from '../../features/utils/teamStats';

export function TeamPage() {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const issues = useProjectStore((state) => state.issues);
  const teamMembers = useProjectStore((state) => state.teamMembers);
  const isTeamLoading = useProjectStore((state) => state.isTeamLoading);
  const teamError = useProjectStore((state) => state.teamError);
  const loadTeamMembers = useProjectStore((state) => state.loadTeamMembers);

  useEffect(() => {
    if (selectedProject) {
      void loadTeamMembers(selectedProject.key);
    }
  }, [selectedProject, loadTeamMembers]);

  const assignedIssuesCountByUser = useMemo(() => getAssignedIssuesCountByUser(issues), [issues]);

  if (!selectedProject) {
    return (
      <EmptyState
        title="Select a project"
        description="Choose a Jira project to view assignable team members."
      />
    );
  }

  if (isTeamLoading) {
    return <LoadingState message="Loading team members..." />;
  }

  if (teamError) {
    return (
      <>
        <ErrorState message={teamError} />
        <Button sx={{ mt: 2 }} onClick={() => void loadTeamMembers(selectedProject.key)}>
          Retry
        </Button>
      </>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <EmptyState
        title="No team members found"
        description="This project has no members available for issue assignment."
      />
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Team
      </Typography>
      <List>
        {teamMembers.map((user) => {
          const assignedIssuesCount = assignedIssuesCountByUser[user.accountId] ?? 0;
          const activityStatus = getMemberActivityStatus(assignedIssuesCount);
          const activityColor = getMemberActivityColor(activityStatus);
          return (
            <ListItem key={user.accountId} divider>
              <ListItemAvatar>
                <Avatar src={user.avatarUrls?.['48x48']} alt={user.displayName}>
                  {user.displayName?.[0] ?? '?'}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={user.displayName}
                secondary={[
                  `Assigned issues: ${assignedIssuesCount}`,
                  user.accountType ? `Type: ${user.accountType}` : null,
                  user.active === undefined
                    ? 'Status unknown'
                    : user.active
                      ? 'Active'
                      : 'Inactive',
                ]
                  .filter(Boolean)
                  .join(' • ')}
              />
              <Chip size="small" color={activityColor} label={activityStatus} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
