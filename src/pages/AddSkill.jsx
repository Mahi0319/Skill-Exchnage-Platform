import React, { useState } from "react";
import { addSkill } from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function AddSkill() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState("Beginner");

  const handleAddSkill = async () => {
    if (!skillName) {
      toast.error("Please enter skill name ❌");
      return;
    }

    try {
      await addSkill(currentUser._id, skillName, proficiency);

      toast.success("Skill added successfully 🚀");

      setSkillName("");
      setProficiency("Beginner");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skill ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Add New Skill
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Showcase what you’re good at 🚀
          </p>
        </div>

        {/* INPUT */}
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Enter skill (e.g. React, UI Design)"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          {/* SELECT */}
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option className="text-black">Beginner</option>
            <option className="text-black">Intermediate</option>
            <option className="text-black">Advanced</option>
          </select>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleAddSkill}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Add Skill
          </motion.button>
        </div>

        {/* subtle glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
      </motion.div>
    </div>
  );
}