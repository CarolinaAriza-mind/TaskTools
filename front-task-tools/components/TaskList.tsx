import { Task } from "@/types/task";

import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
  refresh: () => void;
}

export default function TaskList({ tasks, refresh }: Props) {
  const todo = tasks.filter((t) => t.status === "TODO");

  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");

  const done = tasks.filter((t) => t.status === "DONE");

  const columns = [
    {
      title: "TODO",
      tasks: todo,
    },
    {
      title: "IN PROGRESS",
      tasks: inProgress,
    },
    {
      title: "DONE",
      tasks: done,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div
          key={column.title}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl">{column.title}</h2>

            <span className="bg-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
              {column.tasks.length}
            </span>
          </div>

          <div className="space-y-4">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} refresh={refresh} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
