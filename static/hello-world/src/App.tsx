import { useEffect, useState } from 'react';
import { Box, Stack, Button, Tabs, Tab } from '@mui/material';
import { AppProviders } from './app/AppProviders';
import { useProjectStore } from './app/store/projectStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectSelect } from './components/project/ProjectSelect';
import { ProjectStats } from './components/project/ProjectStats';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { LoadingState } from './components/common/LoadingState';
import { IssuesTable } from './components/issues/IssuesTable';
import { PriorityIssueDialog } from './components/issues/PriorityIssueDialog';
import { TeamPage } from './components/team/TeamPage';
import { AssignIssueDialog } from './components/issues/AssignIssueDialog';
import { ConfirmAutoAssignDialog } from './components/issues/ConfirmAutoAssignDialog';
import { isUnassignedIssue } from './features/utils/issueHealth';
import { assignIssue, getProjectAssignableUsers } from './services/jiraApi';
import { getRandomItem } from './features/utils/random';
import type { JiraIssue } from './types/jira';

function App() {
  const projects = useProjectStore((state) => state.projects);
  const issues = useProjectStore((state) => state.issues);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const loadIssuesByProject = useProjectStore((state) => state.loadIssuesByProject);
  const updateIssuePriority = useProjectStore((state) => state.updateIssuePriority);
  const updateIssueAssignee = useProjectStore((state) => state.updateIssueAssignee);

  const [issueToAssign, setIssueToAssign] = useState<JiraIssue | null>(null);
  const [issueToRaisePriority, setIssueToRaisePriority] = useState<JiraIssue | null>(null);
  const [isAutoAssignDialogOpen, setIsAutoAssignDialogOpen] = useState(false);
  const [isAutoAssignSubmitting, setIsAutoAssignSubmitting] = useState(false);
  const [autoAssignError, setAutoAssignError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'issues' | 'team'>('issues');

  const unassignedIssuesCount = issues.filter(isUnassignedIssue).length;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const reloadIssues = async () => {
    if (!selectedProject) return;

    await loadIssuesByProject(selectedProject);
  };

  const handleOpenAutoAssignDialog = () => {
    setAutoAssignError(null);
    setIsAutoAssignDialogOpen(true);
  };

  const handleCloseAutoAssignDialog = () => {
    setIsAutoAssignDialogOpen(false);
  };

  const handleConfirmAutoAssign = async () => {
    if (!selectedProject) return;

    const unassignedIssues = issues.filter(isUnassignedIssue);
    if (unassignedIssues.length === 0) return;

    setIsAutoAssignSubmitting(true);
    setAutoAssignError(null);

    try {
      const users = await getProjectAssignableUsers(selectedProject.key);
      const activeUsers = users.filter((user) => user.active !== false);

      if (activeUsers.length === 0) {
        setAutoAssignError('No active assignable users found for this project.');
        return;
      }

      const failedIssueKeys: string[] = [];

      for (const issue of unassignedIssues) {
        const assignee = getRandomItem(activeUsers);
        if (!assignee) {
          failedIssueKeys.push(issue.key);
          continue;
        }

        const previousAssignee = issue.fields.assignee ?? null;

        updateIssueAssignee(issue.key, assignee);

        try {
          await assignIssue(issue.key, assignee?.accountId);
        } catch {
          updateIssueAssignee(issue.key, previousAssignee);
          failedIssueKeys.push(issue.key);
        }
      }
      if (failedIssueKeys.length > 0) {
        setAutoAssignError(
          `Failed to assign ${failedIssueKeys.length} issue(s): ${failedIssueKeys.join(', ')}`,
        );
        return;
      }
      setIsAutoAssignDialogOpen(false);
    } finally {
      setIsAutoAssignSubmitting(false);
      await reloadIssues();
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, value: 'issues' | 'team') => {
    setActiveTab(value);
  };

  return (
    <AppProviders>
      <AppLayout>
        {isProjectsLoading ? (
          <LoadingState message="Loading Jira projects..." />
        ) : projectsError ? (
          <ErrorState message={projectsError} actionLabel="Retry" onAction={loadProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No Jira projects found"
            description="You do not have access to any Jira projects yet."
          />
        ) : (
          <Stack spacing={3}>
            <ProjectSelect />
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Issues" value="issues" />
                <Tab label="Team" value="team" />
              </Tabs>
            </Box>
            {activeTab === 'issues' && (
              <>{/* Dashboard: stats, auto-assign button, issues table, dialogs */}</>
            )}

            {activeTab === 'team' && <TeamPage />}
            <ProjectStats />
            <Button
              variant="contained"
              disabled={unassignedIssuesCount === 0}
              onClick={handleOpenAutoAssignDialog}
            >
              Auto-assign unassigned ({unassignedIssuesCount})
            </Button>
            <Box>
              {issues.length > 0 && (
                <IssuesTable
                  issues={issues}
                  onAssignIssue={setIssueToAssign}
                  onRaisePriority={(issue) => {
                    setIssueToRaisePriority(issue);
                  }}
                />
              )}
            </Box>
          </Stack>
        )}

        <AssignIssueDialog
          open={issueToAssign !== null}
          issue={issueToAssign}
          onClose={() => setIssueToAssign(null)}
        />

        <PriorityIssueDialog
          open={issueToRaisePriority !== null}
          issue={issueToRaisePriority}
          onClose={() => setIssueToRaisePriority(null)}
          reloadIssues={reloadIssues}
          updateIssuePriority={updateIssuePriority}
        />

        <ConfirmAutoAssignDialog
          open={isAutoAssignDialogOpen}
          unassignedIssuesCount={unassignedIssuesCount}
          isSubmitting={isAutoAssignSubmitting}
          error={autoAssignError}
          onClose={handleCloseAutoAssignDialog}
          onConfirm={handleConfirmAutoAssign}
        />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
