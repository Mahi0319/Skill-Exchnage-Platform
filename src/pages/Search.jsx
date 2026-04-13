  import React, { useState } from "react";
  import { searchUsersBySkill } from "../services/api.js";
  import RequestTaskModal from "./RequestTaskModal.jsx";

  export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleSearch = async () => {
      if (!query) return;
      try {
        const res = await searchUsersBySkill(query);
        setResults(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        setResults([]);
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
      <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Search Bar */}
        <div className="flex gap-4 mb-12 max-w-4xl mx-auto animate-slideDown">
          <input
            type="text"
            placeholder="Search by Skill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-6 py-4 rounded-3xl shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 backdrop-blur-xl bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-xl hover:scale-105 transition-all"
          >
            Search
          </button>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {results.length === 0 && (
            <p className="text-white text-center col-span-full text-lg">
              No results found
            </p>
          )}

          {results.map((item) => {
            const name = item.user_id?.name || "Unknown User";
            const email = item.user_id?.email || "No Email";
            const skillName = item.skill_name || "Unknown Skill";
            const proficiency = item.proficiency || "Unknown";

            return (
              <div
                key={item._id}
                className="p-6 backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all flex flex-col animate-fadeIn"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
                <p className="text-white/80 mb-2">{email}</p>
                <div className="bg-white/10 text-white px-4 py-2 rounded-xl w-fit mb-4">
                  {skillName} - {proficiency}
                </div>
                <button
                  onClick={() => openModal(item)}
                  className="mt-auto py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-3xl font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  Request Help
                </button>
              </div>
            );
          })}
        </div>

        {/* Request Task Modal */}
        {modalOpen && selectedUser && (
          <RequestTaskModal selectedUser={selectedUser} onClose={closeModal} />
        )}
      </div>
    );
  }