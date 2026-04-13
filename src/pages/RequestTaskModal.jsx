import React, { useState } from "react";
import { createTask } from "../services/api.js";

export default function RequestTaskModal({ selectedUser, onClose, onTaskCreated }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) return alert("Please enter all fields");

    try {
      setLoading(true);

      await createTask({
        requester_id: currentUser._id,
        assigned_to: selectedUser?._id || selectedUser, // ✅ FIXED
        title,
        description,
      });

      alert("Task created successfully!");
      setTitle("");
      setDescription("");

      onTaskCreated && onTaskCreated(); // ✅ SAFE CALL
      onClose && onClose(); // ✅ SAFE CALL
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white font-bold text-xl">
          ✕
        </button>

        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Request Task
        </h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-2xl bg-white/20 text-white"
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-2xl bg-white/20 text-white"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-white/20 text-white font-bold rounded-2xl"
        >
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </div>
    </div>
  );
}