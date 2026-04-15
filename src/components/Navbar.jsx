import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Skill", path: "/add-skill" },
    { name: "Search Users", path: "/search" },
    { name: "Tasks", path: "/tasks" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/20 shadow-2xl">
      
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">

        {/* ✅ FIXED LOGO LINK */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/dashboard"
            className="text-3xl font-extrabold text-white tracking-wide"
          >
            Skill<span className="text-pink-400">Exchange</span>
          </Link>
        </motion.div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-4">

          {links.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {link.name}
                </motion.div>
              </Link>
            );
          })}

          {/* ✅ ONLY LOGOUT (avatar removed) */}
          {currentUser && (
            <div className="ml-6">
              <button
                onClick={() => {
                  localStorage.removeItem("currentUser");
                  window.location.href = "/";
                }}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-md hover:scale-105"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden text-white">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col items-center py-6 gap-4 bg-black/40 backdrop-blur-xl">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
            >
              <div className="px-6 py-2 rounded-full text-white font-semibold hover:bg-white/20 transition-all">
                {link.name}
              </div>
            </Link>
          ))}

          {currentUser && (
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                window.location.href = "/";
              }}
              className="mt-2 px-6 py-2 bg-red-500 text-white rounded-full font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}