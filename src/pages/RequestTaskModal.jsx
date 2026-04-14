import React, { useState } from "react";
import { createTask } from "../services/api.js";
import { toast } from "react-toastify";

export default function RequestTaskModal({
  selectedUser,
  onClose,
  onTaskCreated,
}) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error("Please enter title and description ❌");
      return;
    }

    if (!selectedUser?._id) {
      toast.error("No user selected ❌");
      return;
    }

    try {
      setLoading(true);

      await createTask({
        requester_id: currentUser._id,
        assigned_to: selectedUser._id,
        title,
        description,
      });

      toast.success("Task created successfully 🚀");

      setTitle("");
      setDescription("");

      if (onTaskCreated) onTaskCreated();
      if (onClose) onClose();
    } catch (err) {
      console.error("Task create error:", err);
      toast.error("Failed to create task ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Request Task
        </h2>

        {/* Input Title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-2xl bg-white/20 text-white placeholder-white outline-none"
        />

        {/* Input Description */}
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-2xl bg-white/20 text-white placeholder-white outline-none resize-none"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all"
        >
          {loading ? "Submitting..." : "Submit Task"}
        </button>

      </div>
    </div>
  );
}