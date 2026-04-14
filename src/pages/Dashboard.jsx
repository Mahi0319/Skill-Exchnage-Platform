import React, { useEffect, useState } from "react";
import { getTasks, getUserSkills, updateSkill } from "../services/api.js";
import TaskCard from "../components/TaskCard.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // ✅ FIX CONFIRMED

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
        toast.error("Failed to load skills ❌"); // ✅ SAFE ADD
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
        toast.error("Failed to load tasks ❌"); // ✅ SAFE ADD
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchSkills();
    fetchTasks();
  }, []);

  const updateTaskStatusHandler = (taskId, status) => {
    console.log("Update Task", taskId, status);
    toast.info("Task update triggered 🔄"); // optional UX boost
  };

  // Skill update handler
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

      setSkills(prevSkills); // rollback
      toast.error("Failed to update skill ❌");
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
    (t) => t.assigned_to?._id === currentUser._id
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
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-1">
          Welcome, {currentUser.name || "User"} 👋
        </h1>
        <p className="text-gray-200 text-sm">{currentUser.email}</p>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {[
          { title: "Completed", value: completedTasks },
          { title: "Pending", value: pendingTasks },
          { title: "Overdue", value: overdueTasks },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <p className="text-sm text-gray-200">{kpi.title}</p>
            <h2 className="text-3xl font-bold mt-2">{kpi.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* SKILLS */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-5">Your Skills</h2>

        {loadingSkills ? (
          <p className="text-gray-200">Loading...</p>
        ) : skills.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill._id || idx}
                whileHover={{ scale: 1.04 }}
                className={`p-5 rounded-2xl shadow-lg bg-gradient-to-r ${getRandomGradient(
                  idx
                )}`}
              >
                <h3 className="text-xl font-bold">
                  {skill.skill_name || "Skill"}
                </h3>

                <select
                  value={skill.proficiency}
                  onChange={(e) =>
                    updateSkillHandler(skill._id, e.target.value)
                  }
                  className="mt-2 px-3 py-1 rounded-lg text-black text-sm font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">No skills added yet.</p>
        )}
      </section>

      {/* TASKS */}
      <section>
        <h2 className="text-xl font-semibold mb-5">
          Tasks Assigned To You
        </h2>

        {loadingTasks ? (
          <p className="text-gray-200">Loading...</p>
        ) : assignedToMe.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {assignedToMe.map((task) => (
              <motion.div key={task._id} whileHover={{ scale: 1.02 }}>
                <TaskCard
                  task={task}
                  onUpdateStatus={updateTaskStatusHandler}
                  glass
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">
            No tasks assigned to you yet.
          </p>
        )}
      </section>
    </div>
  );
}