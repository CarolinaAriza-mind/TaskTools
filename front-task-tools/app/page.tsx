"use client";

import { useEffect, useState, useCallback } from "react";

import TaskForm from "@/components/TaskForm";
import TaskTree from "@/components/TaskTree";

import { getTasks } from "@/services/tasks.service";

import { Task } from "@/types/task";

const TASKS_PER_PAGE = 5;

export default function HomePage() {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [progressTasks, setProgressTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const [todoTotal, setTodoTotal] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [doneTotal, setDoneTotal] = useState(0);

  const [todoPage, setTodoPage] = useState(1);
  const [progressPage, setProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  // LOAD TASKS
  const loadTasks = useCallback(async () => {
    try {
      const todoRes = await getTasks(todoPage, TASKS_PER_PAGE, "TODO");

      const progressRes = await getTasks(
        progressPage,
        TASKS_PER_PAGE,
        "IN_PROGRESS",
      );

      const doneRes = await getTasks(donePage, TASKS_PER_PAGE, "DONE");

      setTodoTasks(todoRes.data);
      setProgressTasks(progressRes.data);
      setDoneTasks(doneRes.data);

      setTodoTotal(todoRes.total);
      setProgressTotal(progressRes.total);
      setDoneTotal(doneRes.total);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }, [todoPage, progressPage, donePage]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
        {/* HEADER */}
        <div className="mb-8 md:mb-10">
          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
              tracking-tight
            "
          >
            Task System
          </h1>

          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Team workload management
          </p>
        </div>

        {/* CREATE TASK */}
        <div className="mb-6 md:mb-8">
          <TaskForm onCreated={loadTasks} />
        </div>

        {/* BOARD */}
        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-4
            md:gap-6
          "
        >
          {/* TODO */}
          <div className="w-full lg:flex-1">
            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-4
                md:p-5
              "
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-base md:text-lg">TODO</h2>

                <span
                  className="
                    bg-zinc-800
                    px-2
                    py-1
                    rounded-lg
                    text-xs
                    md:text-sm
                  "
                >
                  {todoTotal}
                </span>
              </div>

              <div className="space-y-4">
                <TaskTree tasks={todoTasks} refresh={loadTasks} />

                {/* PAGINATION */}
                <div className="flex items-center justify-between gap-2 pt-4">
                  <button
                    disabled={todoPage === 1}
                    onClick={() => setTodoPage((prev) => prev - 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Prev
                  </button>

                  <span className="text-xs md:text-sm text-zinc-400">
                    Page {todoPage}
                  </span>

                  <button
                    disabled={todoPage * TASKS_PER_PAGE >= todoTotal}
                    onClick={() => setTodoPage((prev) => prev + 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="w-full lg:flex-1">
            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-4
                md:p-5
              "
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="
                    font-semibold
                    text-base
                    md:text-lg
                    text-yellow-300
                  "
                >
                  IN PROGRESS
                </h2>

                <span
                  className="
                    bg-zinc-800
                    px-2
                    py-1
                    rounded-lg
                    text-xs
                    md:text-sm
                  "
                >
                  {progressTotal}
                </span>
              </div>

              <div className="space-y-4">
                <TaskTree tasks={progressTasks} refresh={loadTasks} />

                {/* PAGINATION */}
                <div className="flex items-center justify-between gap-2 pt-4">
                  <button
                    disabled={progressPage === 1}
                    onClick={() => setProgressPage((prev) => prev - 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Prev
                  </button>

                  <span className="text-xs md:text-sm text-zinc-400">
                    Page {progressPage}
                  </span>

                  <button
                    disabled={progressPage * TASKS_PER_PAGE >= progressTotal}
                    onClick={() => setProgressPage((prev) => prev + 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DONE */}
          <div className="w-full lg:flex-1">
            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-4
                md:p-5
              "
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="
                    font-semibold
                    text-base
                    md:text-lg
                    text-emerald-300
                  "
                >
                  DONE
                </h2>

                <span
                  className="
                    bg-zinc-800
                    px-2
                    py-1
                    rounded-lg
                    text-xs
                    md:text-sm
                  "
                >
                  {doneTotal}
                </span>
              </div>

              <div className="space-y-4">
                <TaskTree tasks={doneTasks} refresh={loadTasks} />

                {/* PAGINATION */}
                <div className="flex items-center justify-between gap-2 pt-4">
                  <button
                    disabled={donePage === 1}
                    onClick={() => setDonePage((prev) => prev - 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Prev
                  </button>

                  <span className="text-xs md:text-sm text-zinc-400">
                    Page {donePage}
                  </span>

                  <button
                    disabled={donePage * TASKS_PER_PAGE >= doneTotal}
                    onClick={() => setDonePage((prev) => prev + 1)}
                    className="
                      px-3 md:px-4
                      py-2
                      rounded-xl
                      bg-zinc-800
                      hover:bg-zinc-700
                      transition
                      disabled:opacity-40
                      text-sm
                    "
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
