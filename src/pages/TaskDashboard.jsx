import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../services/api.js";

export default function TaskDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(currentUser._id);
      setTasks(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ SEPARATION LOGIC (MAIN FIX)
  const assignedTasks = tasks.filter(
    (t) => t.assigned_to?._id === currentUser._id
  );

  const requestedTasks = tasks.filter(
    (t) => t.requester_id?._id === currentUser._id
  );

  // ✅ STATUS UPDATE
  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchTasks(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const renderSection = (title, list, color, isAssigned) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white/90">{title}</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((task) => (
          <div
            key={task._id}
            className="p-6 backdrop-blur-md bg-white/20 rounded-2xl shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {task.title}
            </h3>

            <p className="text-white/80 mb-2">{task.description}</p>

            {/* 👇 SHOW USER INFO CORRECTLY */}
            <p className="text-white/70 text-sm mb-2">
              {isAssigned
                ? `Requested by: ${task.requester_id?.name}`
                : `Assigned to: ${task.assigned_to?.name}`}
            </p>

            <span className={`px-3 py-1 rounded-full bg-${color}-500/70 text-white`}>
              {task.status.toUpperCase()}
            </span>

            {/* ✅ ONLY ASSIGNED USER CAN UPDATE */}
            {isAssigned && (
              <div className="mt-4 flex gap-2">
                {task.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(task._id, "in_progress")}
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    Start
                  </button>
                )}

                {task.status === "in_progress" && (
                  <button
                    onClick={() => handleStatusChange(task._id, "completed")}
                    className="bg-green-500 px-3 py-1 rounded"
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

      {/* ✅ ASSIGNED TO ME */}
      {renderSection("Tasks Assigned To Me", assignedTasks, "blue", true)}

      {/* ✅ REQUESTED BY ME */}
      {renderSection("Tasks I Requested", requestedTasks, "yellow", false)}

    </div>
  );
}