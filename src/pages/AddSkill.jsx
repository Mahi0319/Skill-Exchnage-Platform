import React, { useState } from "react";
import { addSkill } from "../services/api.js";
import { toast } from "react-toastify"; // ✅ added

export default function AddSkill() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState("Beginner");

  const handleAddSkill = async () => {
    if (!skillName) {
      toast.error("Please enter skill name ❌"); // ✅ replaced
      return;
    }

    try {
      await addSkill(currentUser._id, skillName, proficiency);

      toast.success("Skill added successfully 🚀"); // ✅ replaced

      setSkillName("");
      setProficiency("Beginner");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skill ❌"); // ✅ added
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="w-full max-w-lg p-12 bg-gradient-to-tr from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl animate-fadeIn">

        <h2 className="text-4xl font-extrabold text-white text-center mb-10 drop-shadow-xl animate-slideDown">
          Add New Skill
        </h2>

        <input
          type="text"
          placeholder="Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
        />

        <select
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
          className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button
          onClick={handleAddSkill}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-3xl shadow-xl hover:scale-105 transform transition-all hover:shadow-2xl animate-pulse"
        >
          Add Skill
        </button>
      </div>
    </div>
  );
}