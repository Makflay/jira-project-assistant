import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useProjectStore } from '../../app/store/projectStore';
import { ErrorState } from '../common/ErrorState';

export function ProjectSelect() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
  const loadIssuesByProject = useProjectStore((state) => state.loadIssuesByProject);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);

  const handleChange = async (event: SelectChangeEvent) => {
    const project = projects.find((p) => p.key === event.target.value);

    if (!project) return;

    setSelectedProject(project);
    await loadIssuesByProject(project);
  };

  if (projectsError) {
    return <ErrorState message={projectsError} />;
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(280px, 420px)' },
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" component="h2">
            Project dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a Jira project to review its work, risks, and quick fixes.
          </Typography>
        </Box>
        <FormControl fullWidth size="small" disabled={isProjectsLoading || projects.length === 0}>
          <InputLabel id="project-select-label">Project</InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProject?.key ?? ''}
            label="Project"
            onChange={handleChange}
            displayEmpty={projects.length === 0}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.key}>
                {project.name} ({project.key})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
