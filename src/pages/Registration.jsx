import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, loginUser } from "../services/api.js";
import { toast } from "react-toastify"; // ✅ ADDED

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  // REGISTER
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields ❌"); // ✅ replaced
      return;
    }

    try {
      const res = await createUser({ name, email, password });

      localStorage.setItem("currentUser", JSON.stringify(res.user));

      toast.success("Registration successful 🚀"); // ✅ added

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed ❌"); // ✅ replaced
    }
  };

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields ❌"); // ✅ replaced
      return;
    }

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("currentUser", JSON.stringify(res.user));

      toast.success("Login successful 🚀"); // ✅ added

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      const msg = err?.message;

      if (msg === "User not found") {
        toast.error("User not found ❌");
      } else if (msg === "Invalid password") {
        toast.error("Invalid password ❌");
      } else {
        toast.error("Login failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="w-full max-w-md p-10 bg-gradient-to-tr from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl animate-fadeIn">

        <h2 className="text-4xl font-extrabold text-white text-center mb-10 drop-shadow-xl animate-slideDown">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-6 px-6 py-4 rounded-3xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg bg-white/20 text-white placeholder-white font-semibold transition-all hover:scale-105"
          />
        )}

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
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-3xl shadow-xl hover:scale-105 transform transition-all hover:shadow-2xl animate-pulse"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-white text-center mt-4 cursor-pointer underline"
        >
          {isLogin ? "Switch to Register" : "Already have account? Login"}
        </p>
      </div>
    </div>
  );
}