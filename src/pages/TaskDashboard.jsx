import React, { useEffect, useState } from "react";
import { getTasks } from "../services/api.js";

export default function TaskDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks(currentUser._id);
        setTasks(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const assignedToMe = tasks.filter(
    (t) => t.assigned_to?._id === currentUser._id
  );
  const requestedByMe = tasks.filter(
    (t) => t.requester_id === currentUser._id
  );

  const renderSection = (title, list) => (
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

            <span className="px-3 py-1 rounded-full bg-blue-500/70 text-white font-bold">
              {task.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {renderSection("Tasks Assigned To You", assignedToMe)}
      {renderSection("Tasks You Requested From Others", requestedByMe)}
    </div>
  );
}