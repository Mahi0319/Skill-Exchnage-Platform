import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

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
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500/30 shadow-2xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-3xl font-extrabold text-white hover:scale-105 transition-all drop-shadow-lg"
        >
          SkillExchange
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-5 py-2 rounded-3xl text-sm font-medium transition-all drop-shadow-lg ${
                location.pathname === link.path
                  ? "bg-white/30 text-white backdrop-blur-lg shadow-xl"
                  : "text-white/80 hover:bg-white/20 hover:backdrop-blur-md"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-3 ml-6">
              <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-lg">
                {currentUser.name[0]}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("currentUser");
                  window.location.href = "/";
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-500 via-purple-600 to-pink-500/80 backdrop-blur-lg shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center py-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-6 py-2 rounded-3xl text-white font-semibold transition-all ${
                  location.pathname === link.path
                    ? "bg-white/30 backdrop-blur-lg shadow-xl"
                    : "hover:bg-white/20 hover:backdrop-blur-md"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {currentUser && (
              <div className="flex flex-col items-center gap-3 mt-4">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-lg">
                  {currentUser.name[0]}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.href = "/";
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}