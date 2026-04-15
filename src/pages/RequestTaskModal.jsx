import React, { useState } from "react";
import { createTask } from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
    if (loading) return;

    if (!title.trim() || !description.trim()) {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

      {/* MODAL ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/20 relative"
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-all"
        >
          ✕
        </button>

        {/* HEADER */}
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
          Request Task
        </h2>

        {/* TITLE INPUT */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
        </div>

        {/* DESCRIPTION INPUT */}
        <div className="mb-6">
          <textarea
            placeholder="Describe the task clearly..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-bold text-white transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-xl"
          }`}
        >
          {loading ? "Submitting..." : "Submit Task 🚀"}
        </button>

      </motion.div>
    </div>
  );
}