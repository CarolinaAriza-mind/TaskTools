export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate?: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  subtasks?: Task[];
}

export interface TaskMetrics {
  total: number;
  todo: number;
  inProgress: number;
}
