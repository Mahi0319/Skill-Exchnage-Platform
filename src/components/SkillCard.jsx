import React from "react";

export default function SkillCard({ skill }) {
  return (
    <div className="px-3 py-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md text-sm">
      {skill.skill_name} ({skill.proficiency})
    </div>
  );
}