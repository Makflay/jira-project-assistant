import { Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useProjectStore } from '../../app/store/projectStore';
import { EmptyState } from '../common/EmptyState';
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

  if (!selectedProject) {
    return (
      <EmptyState
        title="Select a project"
        description="Choose a Jira project to see its statistics."
      />
    );
  }

  if (projectsError) {
    return <ErrorState message={projectsError} />;
  }

  return (
    <FormControl fullWidth size="small" disabled={isProjectsLoading || projects.length === 0}>
      <InputLabel id="project-select-label">Project</InputLabel>
      <Select
        labelId="project-select-label"
        value={selectedProject?.key ?? ''}
        label="Project"
        onChange={handleChange}
      >
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.key}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
