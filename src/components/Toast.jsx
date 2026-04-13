// components/Toast.jsx
import React from "react";

export default function Toast({ message, type = "success" }) {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded text-white shadow ${bgColor} animate-fadeIn`}>
      {message}
    </div>
  );
}