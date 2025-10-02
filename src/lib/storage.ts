import { Project } from '@/types/project';

const STORAGE_KEY = 'dev_todo_projects';

export const getProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
};

export const addProject = (project: Project): void => {
  const projects = getProjects();
  saveProjects([...projects, project]);
};

export const updateProject = (updatedProject: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = { ...updatedProject, updatedAt: new Date().toISOString() };
    saveProjects(projects);
  }
};

export const deleteProject = (projectId: string): void => {
  const projects = getProjects();
  saveProjects(projects.filter(p => p.id !== projectId));
};
