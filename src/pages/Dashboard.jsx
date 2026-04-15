import React, { useEffect, useState } from "react";
import { getTasks, getUserSkills, updateSkill, deleteSkill } from "../services/api.js";
import TaskCard from "../components/TaskCard.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { updateTaskStatus } from "../services/api.js";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(user);

    if (!user?._id) return;

    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const res = await getUserSkills(user._id);
        setSkills(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load skills ❌");
      } finally {
        setLoadingSkills(false);
      }
    };

    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const res = await getTasks(user._id);
        setTasks(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tasks ❌");
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchSkills();
    fetchTasks();
  }, []);

  const updateTaskStatusHandler = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task updated 🚀");

      const user = JSON.parse(localStorage.getItem("currentUser"));
      const res = await getTasks(user._id);
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task ❌");
    }
  };

  const updateSkillHandler = async (skillId, newProficiency) => {
    const prevSkills = [...skills];

    setSkills((prev) =>
      prev.map((s) =>
        s._id === skillId ? { ...s, proficiency: newProficiency } : s
      )
    );

    try {
      await updateSkill(skillId, newProficiency);
      toast.success("Skill updated 🚀");
    } catch (err) {
      console.error(err);
      setSkills(prevSkills);
      toast.error("Failed to update skill ❌");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const prevSkills = [...skills];

    setSkills((prev) => prev.filter((s) => s._id !== skillId));

    try {
      await deleteSkill(skillId);
      toast.success("Skill deleted 🗑️");
    } catch (err) {
      console.error(err);
      setSkills(prevSkills);
      toast.error("Failed to delete skill ❌");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg">No user logged in.</p>
      </div>
    );
  }

  const assignedToMe = tasks.filter(
    (t) => t.assigned_to_id === currentUser._id
  );

  const completedTasks = assignedToMe.filter(
    (t) => t.status === "completed"
  ).length;

  const pendingTasks = assignedToMe.filter(
    (t) => t.status === "pending"
  ).length;

  const overdueTasks = assignedToMe.filter(
    (t) => t.status === "overdue"
  ).length;

  const skillGradients = [
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-green-400 via-teal-500 to-blue-500",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-pink-400 via-fuchsia-500 to-indigo-500",
    "from-cyan-400 via-blue-500 to-indigo-500",
  ];

  const getRandomGradient = (index) =>
    skillGradients[index % skillGradients.length];

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome back, <span className="text-indigo-300">{currentUser.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">{currentUser.email}</p>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {[
          { title: "Completed", value: completedTasks },
          { title: "Pending", value: pendingTasks },
          { title: "Overdue", value: overdueTasks },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10 hover:border-white/30 transition-all"
          >
            <p className="text-sm text-gray-400">{kpi.title}</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{kpi.value}</h2>

            {/* glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </motion.div>
        ))}
      </div>

      {/* SKILLS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white/90">
          Your Skills
        </h2>

        {loadingSkills ? (
          <p className="text-gray-400">Loading...</p>
        ) : skills.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill._id || idx}
                whileHover={{ scale: 1.05 }}
                className={`relative p-6 rounded-2xl shadow-xl bg-gradient-to-r ${getRandomGradient(
                  idx
                )} overflow-hidden`}
              >
                <h3 className="text-xl font-bold mb-2">
                  {skill.skill_name || "Skill"}
                </h3>

                <select
                  value={skill.proficiency}
                  onChange={(e) =>
                    updateSkillHandler(skill._id, e.target.value)
                  }
                  className="mt-2 px-3 py-1 rounded-lg text-black text-sm font-semibold focus:ring-2 focus:ring-white/50 outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <button
                  onClick={() => handleDeleteSkill(skill._id)}
                  className="mt-3 text-red-100 hover:text-red-300 text-sm transition"
                >
                  Delete Skill
                </button>

                {/* glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 blur-3xl rounded-full"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">🚀 No skills added yet</p>
        )}
      </section>

      {/* TASKS */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white/90">
          Tasks Assigned To You
        </h2>

        {loadingTasks ? (
          <p className="text-gray-400">Loading...</p>
        ) : assignedToMe.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedToMe.map((task) => (
              <motion.div
                key={task._id}
                whileHover={{ scale: 1.03 }}
                className="transition-all"
              >
                <TaskCard
                  task={task}
                  onUpdateStatus={updateTaskStatusHandler}
                  glass
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            🚀 No tasks assigned yet
          </p>
        )}
      </section>
    </div>
  );
}