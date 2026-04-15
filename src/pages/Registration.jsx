import React, { useState } from "react";
import { createUser, loginUser } from "../services/api.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  // REGISTER
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields ❌");
      return;
    }

    try {
      const res = await createUser({ name, email, password });

      localStorage.setItem("currentUser", JSON.stringify(res.user));

      toast.success("Registration successful 🚀");

      // 🔥 FIX: FORCE PAGE RELOAD
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed ❌");
    }
  };

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields ❌");
      return;
    }

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("currentUser", JSON.stringify(res.user));

      toast.success("Login successful 🚀");

      // 🔥 FIX: FORCE PAGE RELOAD
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative"
      >
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin
              ? "Login to continue your journey"
              : "Join and start exchanging skills"}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            {isLogin ? "Login" : "Create Account"}
          </motion.button>
        </div>

        {/* SWITCH */}
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center text-gray-400 mt-6 cursor-pointer hover:text-white transition-all"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

        {/* GLOW EFFECT */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
      </motion.div>
    </div>
  );
}