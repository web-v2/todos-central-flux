export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ProjectStatus = 'active' | 'maintenance' | 'interrupted' | 'suspended' | 'cancelled' | 'completed' | 'delivered';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Commit {
  id: string;
  message: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  tasks: Task[];
  commits: Commit[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
