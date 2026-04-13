import React, { useEffect, useState } from "react";
import { getTasks, getUserSkills } from "../services/api.js";
import TaskCard from "../components/TaskCard.jsx";
import { motion } from "framer-motion";

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
        console.error("Failed to fetch user skills:", err);
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
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchSkills();
    fetchTasks();
  }, []);

  const updateTaskStatusHandler = (taskId, status) => {
    console.log("Update Task", taskId, status);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg">No user logged in.</p>
      </div>
    );
  }

  // 🟢 separate task categories
  const assignedToMe = tasks.filter(t => t.assigned_to?._id === currentUser._id);
  const requestedByMe = tasks.filter(t => t.requester_id === currentUser._id);

  const completedTasks = assignedToMe.filter((t) => t.status === "completed").length;
  const pendingTasks = assignedToMe.filter((t) => t.status === "pending").length;
  const overdueTasks = assignedToMe.filter((t) => t.status === "overdue").length;

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
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">
          Welcome, {currentUser.name || "User"} 👋
        </h1>
        <p className="text-gray-100">{currentUser.email}</p>
      </motion.div>

      {/* KPI */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {[
          { title: "Completed Tasks", value: completedTasks, color: "green" },
          { title: "Pending Tasks", value: pendingTasks, color: "yellow" },
          { title: "Overdue Tasks", value: overdueTasks, color: "red" },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`bg-white/20 backdrop-blur-lg p-6 rounded-2xl flex flex-col items-center justify-center border-l-8 border-${kpi.color}-400 shadow-lg`}
          >
            <p className="text-gray-100">{kpi.title}</p>
            <p className={`text-3xl font-bold text-${kpi.color}-400 mt-2`}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white/90">Your Skills</h2>

        {loadingSkills ? (
          <p className="text-gray-200">Loading skills...</p>
        ) : skills.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill._id || idx}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${getRandomGradient(
                  idx
                )} text-white`}
              >
                <h3 className="text-2xl font-bold mb-2">
                  {skill.skill_name || "Unnamed Skill"}
                </h3>
                <p className="text-white/80 font-semibold">
                  {skill.proficiency}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">You haven't added any skills yet.</p>
        )}
      </section>

      {/* TASKS ASSIGNED TO ME */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white/90">Tasks Assigned To You</h2>

        {loadingTasks ? (
          <p className="text-gray-200">Loading tasks...</p>
        ) : assignedToMe.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedToMe.map((task) => (
              <motion.div key={task._id} whileHover={{ scale: 1.03 }}>
                <TaskCard task={task} onUpdateStatus={updateTaskStatusHandler} glass />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">No tasks assigned to you yet.</p>
        )}
      </section>
    </div>
  );
}