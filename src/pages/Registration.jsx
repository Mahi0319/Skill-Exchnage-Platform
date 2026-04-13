import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api.js";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await createUser({ name, email, password });
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="w-full max-w-md p-10 bg-gradient-to-tr from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl animate-fadeIn">
        <h2 className="text-4xl font-extrabold text-white text-center mb-10 drop-shadow-xl animate-slideDown">
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
        />

        <button
          onClick={handleRegister}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-3xl shadow-xl hover:scale-105 transform transition-all hover:shadow-2xl animate-pulse"
        >
          Register
        </button>
      </div>
    </div>
  );
}