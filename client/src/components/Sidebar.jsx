import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ScanLine, History, Droplets, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detect", label: "Disease Detection", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/irrigation", label: "Irrigation", icon: Droplets },
  { to: "/yield", label: "Yield Prediction", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-800 to-emerald-600 text-white shadow-xl">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold tracking-wide">🌿 Smart Farming</h1>
        <p className="text-sm text-green-100 mt-1">AI Assistant</p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-white text-green-700 shadow"
                  : "text-green-100 hover:bg-white/20"
              }`
            }
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 text-xs text-green-100">
        Built for Hackathon 🚀
      </div>
    </aside>
  );
}