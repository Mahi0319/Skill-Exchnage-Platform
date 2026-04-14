import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../services/api.js";
import { toast } from "react-toastify"; // ✅ ADDED

export default function TaskDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(currentUser._id);
      setTasks(res || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks ❌"); // ✅ ADDED
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // SEPARATE TASKS
  const assignedTasks = tasks.filter(
    (t) => t.assigned_to?._id === currentUser._id
  );

  const requestedTasks = tasks.filter(
    (t) => t.requester_id?._id === currentUser._id
  );

  // UPDATE STATUS
  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);

      toast.success(`Task marked as ${status} 🚀`); // ✅ ADDED

      fetchTasks(); // refresh after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task ❌"); // ✅ ADDED
    }
  };

  // RENDER SECTION
  const renderSection = (title, list, color, isAssigned) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white/90">{title}</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((task) => (
          <div
            key={task._id}
            className="p-6 backdrop-blur-md bg-white/20 rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {task.title}
            </h3>

            <p className="text-white/80 mb-2">{task.description}</p>

            {/* FIXED TEXT LOGIC */}
            <p className="text-white/70 text-sm mb-2">
              {isAssigned
                ? `Requested by: ${task.requester_id?.name || "User"}`
                : task.assigned_to?._id === currentUser._id
                ? "Assigned to you"
                : `Assigned to: ${task.assigned_to?.name || "User"}`}
            </p>

            {/* STATUS */}
            <span
              className={`px-3 py-1 rounded-full text-white font-bold bg-${color}-500/70`}
            >
              {task.status?.toUpperCase()}
            </span>

            {/* ONLY ASSIGNED USER CAN UPDATE */}
            {isAssigned && (
              <div className="mt-4 flex gap-2">
                {task.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusChange(task._id, "in_progress")
                    }
                    className="bg-blue-500 px-3 py-1 rounded text-white"
                  >
                    Start
                  </button>
                )}

                {task.status === "in_progress" && (
                  <button
                    onClick={() =>
                      handleStatusChange(task._id, "completed")
                    }
                    className="bg-green-500 px-3 py-1 rounded text-white"
                  >
                    Complete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      {/* ASSIGNED TO YOU */}
      {renderSection("Tasks Assigned To You", assignedTasks, "blue", true)}

      {/* REQUESTED BY YOU */}
      {renderSection("Tasks You Requested", requestedTasks, "yellow", false)}

    </div>
  );
}