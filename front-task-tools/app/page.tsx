"use client";

import { useEffect, useState } from "react";

import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

// ✅ NUEVO
import TaskTree from "@/components/TaskTree";

import { createTask, getTasks } from "@/services/tasks.service";

import { Task } from "@/types/task";

const TASKS_PER_COLUMN = 5;

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [todoVisible, setTodoVisible] = useState(5);
  const [progressVisible, setProgressVisible] = useState(5);
  const [doneVisible, setDoneVisible] = useState(5);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const progressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Task System</h1>
          <p className="text-zinc-400 mt-2">Team workload management</p>
        </div>

        {/* CREATE TASK */}
        <div className="mb-8">
          <TaskForm onCreated={loadTasks} />
        </div>

        {/* BOARD */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {/* TODO COLUMN */}
          <div className="min-w-[320px] flex-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg">TODO</h2>
                <span className="bg-zinc-800 px-2 py-1 rounded-lg text-sm">
                  {todoTasks.length}
                </span>
              </div>

              <div className="space-y-4">

                {/* ✅ CAMBIO: TaskCard → TaskTree */}
                <TaskTree tasks={todoTasks} refresh={loadTasks} />

                {todoVisible < todoTasks.length && (
                  <button
                    onClick={() =>
                      setTodoVisible(todoVisible + TASKS_PER_COLUMN)
                    }
                    className="
                      w-full
                      mt-4
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      rounded-xl
                      py-3
                      text-sm
                      text-zinc-300
                    "
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="min-w-[320px] flex-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg text-yellow-300">
                  IN PROGRESS
                </h2>

                <span className="bg-zinc-800 px-2 py-1 rounded-lg text-sm">
                  {progressTasks.length}
                </span>
              </div>

              <div className="space-y-4">

                {/* ✅ CAMBIO: TaskCard → TaskTree */}
                <TaskTree tasks={progressTasks} refresh={loadTasks} />

                {progressVisible < progressTasks.length && (
                  <button
                    onClick={() =>
                      setProgressVisible(progressVisible + TASKS_PER_COLUMN)
                    }
                    className="
                      w-full
                      mt-4
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      rounded-xl
                      py-3
                      text-sm
                      text-zinc-300
                    "
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="min-w-[320px] flex-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg text-emerald-300">
                  DONE
                </h2>

                <span className="bg-zinc-800 px-2 py-1 rounded-lg text-sm">
                  {doneTasks.length}
                </span>
              </div>

              <div className="space-y-4">

                {/* ✅ CAMBIO: TaskCard → TaskTree */}
                <TaskTree tasks={doneTasks} refresh={loadTasks} />

                {doneVisible < doneTasks.length && (
                  <button
                    onClick={() =>
                      setDoneVisible(doneVisible + TASKS_PER_COLUMN)
                    }
                    className="
                      w-full
                      mt-4
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      rounded-xl
                      py-3
                      text-sm
                      text-zinc-300
                    "
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
