import { toast } from "react-toastify";

export default function TaskCard({ task, onUpdateStatus }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-900 animate-pulse",
    in_progress: "bg-blue-100 text-blue-900 animate-pulse",
    completed: "bg-green-100 text-green-900",
  };

  const isAssignedToMe = task.assigned_to?._id === currentUser?._id;
  const isRequestedByMe = task.requester_id?._id === currentUser?._id;

  // ✅ WRAPPED HANDLER WITH TOAST
  const handleUpdate = async (taskId, status) => {
    try {
      await onUpdateStatus(taskId, status);
      toast.success(`Task marked as ${status.replace("_", " ")} 🚀`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task ❌");
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col justify-between h-full transform transition hover:-translate-y-2 hover:shadow-3xl">
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {task.title || "No Title"}
        </h3>

        {/* FIXED LABEL */}
        <p className="text-gray-600 mb-2">
          <strong>
            {isAssignedToMe
              ? "Assigned to You"
              : isRequestedByMe
              ? "Requested by You"
              : "Task"}
          </strong>
        </p>

        <p className="text-gray-600 mb-2">
          {task.description || "No Description"}
        </p>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[task.status]}`}
        >
          {task.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* ONLY RECEIVER CAN UPDATE STATUS */}
      <div className="mt-auto flex gap-2">
        {isAssignedToMe && task.status === "pending" && (
          <button
            onClick={() => handleUpdate(task._id, "in_progress")}
            className="bg-blue-600 text-white px-3 py-2 rounded-full w-full"
          >
            Start Task
          </button>
        )}

        {isAssignedToMe && task.status === "in_progress" && (
          <button
            onClick={() => handleUpdate(task._id, "completed")}
            className="bg-green-600 text-white px-3 py-2 rounded-full w-full"
          >
            Complete Task
          </button>
        )}
      </div>
    </div>
  );
}