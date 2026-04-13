import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: "https://skill-exchange-backend-azbm.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// 1️⃣ Create User
export const createUser = async (userData) => {
  try {
    const res = await API.post("/users", userData);
    return res.data;
  } catch (error) {
    console.error("createUser error:", error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ Add Skill
export const addSkill = async (userId, skill_name, proficiency) => {
  try {
    const res = await API.post("/skills", { user_id: userId, skill_name, proficiency });
    return res.data;
  } catch (err) {
    console.error("addSkill error:", err.response?.data || err.message);
    throw err;
  }
};

// 3️⃣ Search Users by Skill
export const searchUsersBySkill = async (skill) => {
  try {
    const res = await API.get(`/skills/search?skill=${skill}`);
    return res.data;
  } catch (error) {
    console.error("searchUsersBySkill error:", error.response?.data || error.message);
    return [];
  }
};

// 4️⃣ Create Task
export const createTask = async ({ requester_id, assigned_to }) => {
  try {
    const res = await API.post("/tasks", { requester_id, assigned_to });
    return res.data;
  } catch (error) {
    console.error("createTask error:", error.response?.data || error.message);
    throw error;
  }
};

// 5️⃣ Update Task Status
export const updateTaskStatus = async (taskId, status) => {
  try {
    const res = await API.patch(`/tasks/${taskId}`, { status });
    return res.data;
  } catch (error) {
    console.error("updateTaskStatus error:", error.response?.data || error.message);
    throw error;
  }
};
export const getUserSkills = async (userId) => {
  try {
    const res = await API.get(`/skills?userId=${userId}`);
    return res.data;
  } catch (err) {
    console.error("getUserSkills error: ", err);
    throw err;
  }
};

// 6️⃣ Get Tasks for User
export const getTasks = async (userId) => {
  try {
    const res = await API.get(`/tasks?userId=${userId}`);
    return res.data;
  } catch (error) {
    console.error("getTasks error:", error.response?.data || error.message);
    throw error;
  }
};
