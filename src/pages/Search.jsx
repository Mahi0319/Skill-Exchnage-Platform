import React, { useState } from "react";
import { searchUsersBySkill } from "../services/api.js";
import RequestTaskModal from "./RequestTaskModal.jsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      toast.error("Please enter a skill to search ❌");
      return;
    }

    try {
      const res = await searchUsersBySkill(query);
      setResults(Array.isArray(res) ? res : []);

      if (!res || res.length === 0) {
        toast.info("No users found for this skill 🔍");
      } else {
        toast.success("Search completed 🚀");
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      toast.error("Search failed ❌");
    }
  };

  const openModal = (user) => {
    setSelectedUser(user.user_id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Find Skilled People 🔍
        </h1>
        <p className="text-gray-400 text-sm">
          Search users by skill and collaborate instantly
        </p>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 mb-12 max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search skills like React, UI Design..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSearch}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all"
        >
          Search
        </motion.button>
      </motion.div>

      {/* RESULTS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

        {results.length === 0 && (
          <p className="text-gray-400 text-center col-span-full text-lg">
            No results found
          </p>
        )}

        {results.map((item, idx) => {
          const name = item.user_id?.name || "Unknown User";
          const email = item.user_id?.email || "No Email";
          const skillName = item.skill_name || "Unknown Skill";
          const proficiency = item.proficiency || "Unknown";

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.04 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all"
            >
              {/* USER */}
              <h3 className="text-lg font-semibold text-white mb-1">
                {name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">{email}</p>

              {/* SKILL TAG */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-4">
                {skillName} • {proficiency}
              </div>

              {/* ACTION */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openModal(item)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold shadow-md hover:shadow-blue-500/30 transition-all"
              >
                Request Help
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalOpen && selectedUser && (
        <RequestTaskModal
          selectedUser={selectedUser}
          onClose={closeModal}
        />
      )}
    </div>
  );
}