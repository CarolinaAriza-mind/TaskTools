"use client";

import { useState } from "react";

import { Task, TaskMetrics } from "@/types/task";
import {
  deleteTask,
  getMetrics,
  updateTask,
  createSubtask,
} from "@/services/tasks.service";

interface Props {
  task: Task;
  refresh: () => void;
}

const statusColors = {
  TODO: "bg-zinc-700 text-zinc-200 border-zinc-600",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  DONE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const priorityColors = {
  LOW: "bg-sky-500/20 text-sky-300",
  MEDIUM: "bg-orange-500/20 text-orange-300",
  HIGH: "bg-red-500/20 text-red-300",
};

export default function TaskCard({ task, refresh }: Props) {
  const isDone = task.status === "DONE";

  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  // ✅ SUBTASK STATES (NUEVO)
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [subDescription, setSubDescription] = useState("");

  const handleDelete = async () => {
    await deleteTask(task.id);
    refresh();
  };

  const handleMetrics = async () => {
    const data = await getMetrics(task.id);
    setMetrics(data);
    setShowMetrics(true);
  };

  const moveTask = async () => {
    if (task.status === "TODO") {
      await updateTask(task.id, { status: "IN_PROGRESS" });
    }

    if (task.status === "IN_PROGRESS") {
      await updateTask(task.id, { status: "DONE" });
    }

    refresh();
  };

  const cyclePriority = async () => {
    const nextPriority =
      task.priority === "LOW"
        ? "MEDIUM"
        : task.priority === "MEDIUM"
          ? "HIGH"
          : "LOW";

    await updateTask(task.id, {
      priority: nextPriority,
    });

    refresh();
  };

  // ✅ SUBTASK CREATE
  const handleCreateSubtask = async () => {
    if (!subTitle.trim()) return;

    await createSubtask(task.id, {
      title: subTitle,
      description: subDescription,
      status: "TODO",
      priority: "MEDIUM",
    });

    setSubTitle("");
    setSubDescription("");
    setShowSubtaskForm(false);

    refresh();
  };

  return (
    <div
      className={`
        w-full
        max-w-full
        overflow-hidden
        rounded-2xl
        border
        transition-all
        duration-300
        shadow-lg
        p-5
        flex
        flex-col
        justify-between
        min-h-[280px]
        ${
          isDone
            ? "bg-emerald-950/30 border-emerald-500/30 opacity-80"
            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
        }
      `}
    >
      {/* HEADER */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white break-words max-w-[70%]">
            {task.title}
          </h3>

          <span
            className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap ${
              statusColors[task.status]
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        <p className="text-sm text-zinc-400 break-words leading-relaxed">
          {task.description}
        </p>

        {/* PRIORITY */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>

          {task.estimate !== undefined && (
            <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-lg">
              {task.estimate} pts
            </span>
          )}
        </div>

        {/* PROGRESS */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Progress</span>
            <span>
              {task.status === "TODO"
                ? "0%"
                : task.status === "IN_PROGRESS"
                  ? "50%"
                  : "100%"}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`
                h-full
                rounded-full
                transition-all
                duration-500
                ${
                  task.status === "TODO"
                    ? "w-[5%] bg-zinc-500"
                    : task.status === "IN_PROGRESS"
                      ? "w-1/2 bg-yellow-400"
                      : "w-full bg-emerald-400"
                }
              `}
            />
          </div>
        </div>

        {/* MÉTRICAS */}
        {showMetrics && metrics && (
          <div className="mt-3 bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 space-y-1">
            <div className="font-semibold">Task Metrics</div>
            <div>Total: {metrics.total}</div>
            <div>TODO: {metrics.todo}</div>
            <div>IN PROGRESS: {metrics.inProgress}</div>

            <button
              onClick={() => setShowMetrics(false)}
              className="mt-2 text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>
        )}

        {/* SUBTASK FORM (NUEVO) */}
        {showSubtaskForm && (
          <div className="mt-3 bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 space-y-2">
            <div className="text-sm font-semibold text-white">
              Create Subtask
            </div>

            <input
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />

            <textarea
              value={subDescription}
              onChange={(e) => setSubDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreateSubtask}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-sm"
              >
                Create
              </button>

              <button
                onClick={() => setShowSubtaskForm(false)}
                className="text-zinc-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-2">
        {!isDone && (
          <button
            onClick={moveTask}
            className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
          >
            {task.status === "TODO" ? "Start Task" : "Mark as Done"}
          </button>
        )}

        <button
          onClick={handleMetrics}
          className="flex-1 min-w-[120px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          Metrics
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 min-w-[120px] bg-red-500/20 hover:bg-red-500/30 border border-red-500/20 text-red-300 text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          Delete
        </button>

        <button
          onClick={cyclePriority}
          className="flex-1 min-w-[120px] bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/20 text-sky-300 text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          Priority
        </button>

        {/* ✅ NUEVO SUBTASK BUTTON */}
        <button
          onClick={() => setShowSubtaskForm(true)}
          className="flex-1 min-w-[120px] bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/20 text-purple-300 text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          Add Subtask
        </button>
      </div>
    </div>
  );
}