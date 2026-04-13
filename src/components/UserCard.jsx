export default function UserCard({ user, onRequestHelp }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800">{user.name}</h3>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <p className="mt-1 text-gray-600">{user.skill_name} ({user.proficiency})</p>
      </div>
      <button
        onClick={() => onRequestHelp(user._id)}
        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
      >
        Request Help
      </button>
    </div>
  );
}