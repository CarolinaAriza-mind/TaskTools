"use client";

import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
  refresh: () => void;
}

export default function TaskTree({ tasks, refresh }: Props) {
  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <TaskNode key={task.id} task={task} refresh={refresh} />
      ))}
    </div>
  );
}

// 🔥 RECURSIVO
function TaskNode({
  task,
  refresh,
}: {
  task: Task;
  refresh: () => void;
}) {
  return (
    <div className="ml-0 border-l border-zinc-800 pl-4 space-y-4">
      {/* TASK PRINCIPAL */}
      <TaskCard task={task} refresh={refresh} />

      {/* SUBTASKS */}
      {task.subtasks?.length ? (
        <div className="space-y-4">
          {task.subtasks.map((sub) => (
            <TaskNode key={sub.id} task={sub} refresh={refresh} />
          ))}
        </div>
      ) : null}
    </div>
  );
}