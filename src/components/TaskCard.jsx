import React from "react";

export default function TaskCard({ task, onUpdateStatus }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ FIXED ID CHECK (uses normalized fields from api.js)
  const isAssignedToMe = task.assigned_to_id === currentUser?._id;
  const isRequestedByMe = task.requester_id_id === currentUser?._id;

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-900",
    in_progress: "bg-blue-100 text-blue-900",
    completed: "bg-green-100 text-green-900",
  };

  const handleChange = (e) => {
    onUpdateStatus(task._id, e.target.value);
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col justify-between h-full">

      <div className="mb-4">
        {/* ✅ SAFE TITLE */}
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {task.title || "Untitled Task"}
        </h3>

        {/* ✅ SAFE DESCRIPTION */}
        <p className="text-gray-600 mb-2">
          {task.description || "No Description provided"}
        </p>

        {/* ✅ ROLE LABEL */}
        <p className="text-sm text-gray-600 mb-2">
          {isAssignedToMe
            ? "Assigned to You"
            : isRequestedByMe
            ? "Requested by You"
            : "Task"}
        </p>

        {/* ✅ STATUS BADGE */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColor[task.status]
          }`}
        >
          {task.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* ✅ ONLY ASSIGNED USER CAN CHANGE STATUS */}
      {isAssignedToMe && (
        <div className="mt-4">
          <select
            value={task.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black font-semibold"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
}