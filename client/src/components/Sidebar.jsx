import { Link, useLocation, useNavigate } from "react-router-dom";
import React from 'react';

const navItems = [
  { path: "/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/disease", icon: "🌿", label: "Disease Detection" },
  { path: "/yield", icon: "📈", label: "Yield Prediction" },
  { path: "/irrigation", icon: "💧", label: "Irrigation & Fertilizer" },
  { path: "/history", icon: "📋", label: "Scan History" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar-shell w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="sidebar-brand p-6 border-b border-blue-700">
        <div className="text-3xl mb-2">🌾</div>
        <h2 className="text-xl font-bold">Smart Farming</h2>
        <p className="text-blue-300 text-sm mt-1">AI Assistant</p>
      </div>

      <div className="p-4 border-b border-blue-700">
        <div className="sidebar-user bg-blue-700 rounded-lg p-3">
          <p className="font-semibold">{user?.user?.name || "Farmer"}</p>
          <p className="text-blue-300 text-xs">{user?.user?.location || ""}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
              location.pathname === item.path
                ? "sidebar-link-active bg-blue-600 text-white"
                : "text-blue-200 hover:bg-blue-700"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="sidebar-logout w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

