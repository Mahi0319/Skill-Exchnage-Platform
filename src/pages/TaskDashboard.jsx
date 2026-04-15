import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus, deleteTask } from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function TaskDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [tasks, setTasks] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(currentUser._id);
      setTasks(res || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks ❌");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const assignedTasks = tasks.filter(
    (t) => t.assigned_to_id === currentUser._id
  );

  const requestedTasks = tasks.filter(
    (t) => t.requester_id_id === currentUser._id
  );

  const getName = (user) => {
    if (!user) return "User";

    if (typeof user === "object") {
      return user.name || "User";
    }

    if (user === currentUser._id) {
      return currentUser.name || "You";
    }

    return "User";
  };

  const handleStatusChange = async (taskId, status, currentStatus) => {
    try {
      if (status === currentStatus) return;

      await updateTaskStatus(taskId, status);
      toast.success(`Task updated to ${status} 🚀`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task ❌");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setDeletingId(taskId);

      await deleteTask(taskId);

      toast.success("Task deleted 🗑️");

      setTimeout(() => {
        fetchTasks();
        setDeletingId(null);
      }, 300);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task ❌");
      setDeletingId(null);
    }
  };

  const renderSection = (title, list, isAssigned) => (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-6 text-white/90 tracking-wide">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: deletingId === task._id ? 0 : 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            className={`p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl transition-all duration-300 ${
              deletingId === task._id ? "scale-95" : ""
            }`}
          >
            {/* TITLE */}
            <h3 className="text-lg font-semibold text-white mb-1">
              {task.title || "Untitled Task"}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {task.description || "No Description provided"}
            </p>

            {/* USER INFO */}
            <p className="text-xs text-gray-400 mb-3">
              {isAssigned
                ? `Requested by: ${getName(task.requester_id)}`
                : `Assigned to: ${getName(task.assigned_to)}`}
            </p>

            {/* STATUS BADGE */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === "completed"
                    ? "bg-green-500/20 text-green-300"
                    : task.status === "in_progress"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {task.status?.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* ACTIONS */}
            {isAssigned && (
              <div className="mt-4 space-y-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task._id, e.target.value, task.status)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none text-sm"
                >
                  <option className="text-black" value="pending">
                    Pending
                  </option>
                  <option className="text-black" value="in_progress">
                    In Progress
                  </option>
                  <option className="text-black" value="completed">
                    Completed
                  </option>
                </select>

                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="w-full py-2 text-sm font-semibold rounded-lg bg-red-500/80 hover:bg-red-600 transition-all"
                >
                  Delete Task
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
      {renderSection("Tasks Assigned To You", assignedTasks, true)}
      {renderSection("Tasks You Requested", requestedTasks, false)}
    </div>
  );
}