import { Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useProjectStore } from '../../app/store/projectStore';

export function ProjectSelect() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
  const loadIssuesByProject = useProjectStore((state) => state.loadIssuesByProject);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const error = useProjectStore((state) => state.error);

  const handleChange = async (event: SelectChangeEvent) => {
    const project = projects.find((p) => p.key === event.target.value);

    if (!project) return;

    setSelectedProject(project);
    await loadIssuesByProject(project);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
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
