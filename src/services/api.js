import axios from "axios";

// ==============================
// BASE API INSTANCE
// ==============================
const API = axios.create({
  baseURL: "https://skill-exchange-backend-azbm.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ==============================
// HELPER: NORMALIZE ERROR
// ==============================
const handleError = (error, fallbackMessage) => {
  const msg = error.response?.data?.message || fallbackMessage;
  return { message: msg };
};

// ==============================
// 1️⃣ LOGIN USER
// ==============================
export const loginUser = async (email, password) => {
  try {
    const res = await API.post("/users/login", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    console.error("loginUser error:", error.response?.data || error.message);
    throw handleError(error, "Login failed");
  }
};

// ==============================
// 2️⃣ CREATE USER
// ==============================
export const createUser = async (userData) => {
  try {
    const res = await API.post("/users", userData);
    return res.data;
  } catch (error) {
    console.error("createUser error:", error.response?.data || error.message);
    throw handleError(error, "Registration failed");
  }
};

// ==============================
// 3️⃣ ADD SKILL
// ==============================
export const addSkill = async (userId, skill_name, proficiency) => {
  try {
    const res = await API.post("/skills", {
      user_id: userId,
      skill_name,
      proficiency,
    });

    return res.data;
  } catch (error) {
    console.error("addSkill error:", error.response?.data || error.message);
    throw handleError(error, "Failed to add skill");
  }
};

// ==============================
// 4️⃣ SEARCH USERS BY SKILL
// ==============================
export const searchUsersBySkill = async (skill) => {
  try {
    const res = await API.get(`/skills/search?skill=${skill}`);
    return res.data;
  } catch (error) {
    console.error("searchUsersBySkill error:", error.response?.data || error.message);
    return [];
  }
};

// ==============================
// 5️⃣ CREATE TASK
// ==============================
export const createTask = async ({
  requester_id,
  assigned_to,
  title,
  description,
}) => {
  try {
    const res = await API.post("/tasks", {
      requester_id,
      assigned_to,
      title,
      description,
      status: "pending",
    });

    return res.data;
  } catch (error) {
    console.error("createTask error:", error.response?.data || error.message);
    throw handleError(error, "Failed to create task");
  }
};

// ==============================
// 6️⃣ UPDATE TASK STATUS
// ==============================
export const updateTaskStatus = async (taskId, status) => {
  try {
    const res = await API.put(`/tasks/update-status/${taskId}`, {
      status,
    });

    return res.data;
  } catch (error) {
    console.error("updateTaskStatus error:", error.response?.data || error.message);
    throw handleError(error, "Failed to update task");
  }
};

// ==============================
// 7️⃣ GET USER SKILLS
// ==============================
export const getUserSkills = async (userId) => {
  try {
    const res = await API.get(`/skills?userId=${userId}`);
    return res.data;
  } catch (error) {
    console.error("getUserSkills error:", error);
    throw handleError(error, "Failed to fetch skills");
  }
};

// ==============================
// 8️⃣ GET TASKS
// ==============================
export const getTasks = async (userId) => {
  try {
    const res = await API.get(`/tasks?userId=${userId}`);

    const normalizedTasks = (res.data || []).map((task) => ({
      ...task,
      assigned_to: task.assigned_to,
      requester_id: task.requester_id,
      assigned_to_id: task.assigned_to?._id || task.assigned_to,
      requester_id_id: task.requester_id?._id || task.requester_id,
      title: task.title || "No Title",
      description: task.description || "No Description",
      status: task.status || "pending",
    }));

    return normalizedTasks;
  } catch (error) {
    console.error("getTasks error:", error.response?.data || error.message);
    throw handleError(error, "Failed to fetch tasks");
  }
};

// ==============================
// 9️⃣ UPDATE SKILL
// ==============================
export const updateSkill = async (skillId, proficiency) => {
  try {
    const res = await API.patch(`/skills/${skillId}`, {
      skill_id: skillId,
      proficiency,
    });

    return res.data;
  } catch (error) {
    console.error("updateSkill error:", error);
    throw handleError(error, "Failed to update skill");
  }
};