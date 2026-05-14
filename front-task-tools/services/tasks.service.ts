import axios from "axios";
import { Task } from "@/types/task";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getTasks = async (
  page: number,
  limit: number,
  status: string,
): Promise<{
  data: Task[];
  total: number;
}> => {
  const response = await api.get("/tasks", {
    params: {
      page,
      limit,
      status,
    },
  });

  return response.data;
};
export const createTask = async (task: Partial<Task>) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>) => {
  const response = await api.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

export const getMetrics = async (id: number) => {
  const response = await api.get(`/tasks/${id}/metrics`);
  return response.data;
};

export const getTaskTree = async (id: number) => {
  const response = await api.get(`/tasks/${id}/tree`);
  return response.data;
};

// ✅ NUEVO
export const createSubtask = async (parentId: number, task: Partial<Task>) => {
  const response = await api.post(`/tasks/${parentId}/subtasks`, task);
  return response.data;
};
