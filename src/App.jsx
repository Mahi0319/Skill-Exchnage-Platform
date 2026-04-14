import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddSkill from "./pages/AddSkill.jsx";
import Search from "./pages/Search.jsx";
import RequestTaskModal from "./pages/RequestTaskModal.jsx";
import TaskDashboard from "./pages/TaskDashboard.jsx";
import Registration from "./pages/Registration.jsx";

// ✅ ADD THESE 2 IMPORTS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans">
        
        {/* NAVBAR */}
        {currentUser && <Navbar />}

        {/* ✅ ADD TOAST CONTAINER (GLOBAL FIX) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />

        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Registration />
            } 
          />

          <Route 
            path="/dashboard" 
            element={currentUser ? <Dashboard /> : <Navigate to="/" />} 
          />

          <Route 
            path="/add-skill" 
            element={currentUser ? <AddSkill /> : <Navigate to="/" />} 
          />

          <Route 
            path="/search" 
            element={currentUser ? <Search /> : <Navigate to="/" />} 
          />

          <Route 
            path="/request-task" 
            element={currentUser ? <RequestTaskModal /> : <Navigate to="/" />} 
          />

          <Route 
            path="/tasks" 
            element={currentUser ? <TaskDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}