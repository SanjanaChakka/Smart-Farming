import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerFarmer } from "../api";


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    location: "", farmSize: "", cropTypes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        ...form,
        cropTypes: form.cropTypes.split(",").map((c) => c.trim()),
      };
      const res = await registerFarmer(data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="auth-card bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌱</div>
          <h1 className="text-3xl font-bold text-blue-700">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Smart Farming Assistant</p>
        </div>

        {error && (
          <div className="auth-error bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Ravi Kumar" },
            { label: "Email", key: "email", type: "email", placeholder: "ravi@farm.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
            { label: "Location", key: "location", type: "text", placeholder: "Vijayawada, AP" },
            { label: "Farm Size", key: "farmSize", type: "text", placeholder: "5 acres" },
            { label: "Crop Types", key: "cropTypes", type: "text", placeholder: "Rice, Cotton, Wheat" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="auth-input w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="auth-btn w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="auth-link text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

