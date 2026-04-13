import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddSkill from "./pages/AddSkill.jsx";
import Search from "./pages/Search.jsx";
import RequestTaskModal from "./pages/RequestTaskModal.jsx";
import TaskDashboard from "./pages/TaskDashboard.jsx";
import Registration from "./pages/Registration.jsx"; // Import registration

export default function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans">
        <Navbar />
        <Routes>
          {/* Root path */}
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Registration />
            } 
          />

          {/* Other routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/search" element={<Search />} />
          <Route path="/request-task" element={<RequestTaskModal />} />
          <Route path="/tasks" element={<TaskDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}