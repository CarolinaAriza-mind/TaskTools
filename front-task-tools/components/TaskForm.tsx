"use client";

import { useState } from "react";

import { createTask } from "@/services/tasks.service";
import { TaskPriority, TaskStatus } from "@/types/task";

interface Props {
  onCreated: () => void;
}

export default function TaskForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [estimate, setEstimate] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    await createTask({
      title,
      description,
      priority,
      estimate,
      status: "TODO" as TaskStatus,
    });

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setEstimate(1);

    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-zinc-900
        border border-zinc-800
        rounded-3xl
        p-6
        shadow-2xl
        h-fit
        sticky
        top-6
      "
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Create Task</h2>

        <p className="text-zinc-400 text-sm mt-1">
          Organize your workflow efficiently
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Title</label>

          <input
            type="text"
            placeholder="Create API endpoint..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              bg-zinc-950
              border border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-500/20
            "
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Description
          </label>

          <textarea
            placeholder="Describe the task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              w-full
              h-32
              resize-none
              bg-zinc-950
              border border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-500/20
            "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Priority</label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="
                w-full
                bg-zinc-950
                border border-zinc-800
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20
              "
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Estimate</label>

            <input
              type="number"
              min={0}
              value={estimate}
              onChange={(e) => setEstimate(Number(e.target.value))}
              className="
                w-full
                bg-zinc-950
                border border-zinc-800
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20
              "
            />
          </div>
        </div>

        <button
          type="submit"
          className="
            w-full
            bg-violet-600
            hover:bg-violet-500
            active:scale-[0.99]
            transition-all
            rounded-xl
            py-3
            font-semibold
            text-white
            shadow-lg
            shadow-violet-900/30
          "
        >
          Create Task
        </button>
      </div>
    </form>
  );
}
