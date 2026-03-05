import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginFarmer } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginFarmer(form);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500">
      
      {/* Floating blobs */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-10 -left-10 blur-3xl animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-white/10 rounded-full bottom-0 right-0 blur-3xl animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌿</div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-1">Login to Smart Farming Assistant</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="farmer@email.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300">
              🔐 Login
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
