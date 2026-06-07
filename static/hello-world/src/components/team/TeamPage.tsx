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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { LoadingState } from '../common/LoadingState';
import { useProjectStore } from '../../app/store/projectStore';
import { getProjectAssignableUsers } from '../../services/jiraApi';
import type { JiraUser } from '../../types/jira';
import {
  getAssignedIssuesCountByUser,
  getMemberActivityStatus,
  getMemberActivityColor,
} from '../../features/utils/teamStats';

export function TeamPage() {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const issues = useProjectStore((state) => state.issues);

  const [teamMembers, setTeamMembers] = useState<JiraUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeamMembers = useCallback(async () => {
    if (!selectedProject) {
      setTeamMembers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    getProjectAssignableUsers(selectedProject.key)
      .then(setTeamMembers)
      .catch(() => setError('Failed to load project team members'))
      .finally(() => setIsLoading(false));
  }, [selectedProject]);

  useEffect(() => {
    void loadTeamMembers();
  }, [loadTeamMembers]);

  const assignedIssuesCountByUser = useMemo(() => getAssignedIssuesCountByUser(issues), [issues]);

  if (!selectedProject) {
    return (
      <EmptyState
        title="Select a project"
        description="Choose a Jira project to view assignable team members."
      />
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading team members..." />;
  }

  if (error) {
    return (
      <>
        <ErrorState message={error} />
        <Button sx={{ mt: 2 }} onClick={() => void loadTeamMembers()}>
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
                  {user.displayName[0]}
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
