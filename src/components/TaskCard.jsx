export default function TaskCard({ task, onUpdateStatus }) {
  const statusColor = {
    pending: "bg-yellow-200 text-yellow-900",
    in_progress: "bg-blue-200 text-blue-900",
    completed: "bg-green-200 text-green-900",
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl p-5">
      <h3 className="text-xl font-bold">{task.title}</h3>
      <p className="text-gray-700">{task.description}</p>

      <p className="text-sm mt-2">
        <strong>Assigned To:</strong> {task.assigned_to?.name}
      </p>

      <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-3 inline-block ${statusColor[task.status]}`}>
        {task.status.toUpperCase()}
      </span>

      {/* Status Buttons */}
      {task.status === "pending" && (
        <button
          onClick={() => onUpdateStatus(task._id, "in_progress")}
          className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg"
        >
          Start Task
        </button>
      )}

      {task.status === "in_progress" && (
        <button
          onClick={() => onUpdateStatus(task._id, "completed")}
          className="w-full bg-green-600 text-white py-2 mt-3 rounded-lg"
        >
          Complete Task
        </button>
      )}
    </div>
  );
}