import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { predictYield } from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import React from 'react';

export default function YieldPrediction() {
  const [form, setForm] = useState({
    crop: "", area: "", rainfall: "",
    temperature: "", soil: "", season: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await predictYield(form);
      setResult(res.data.prediction);
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📈 Yield Prediction</h1>
          <p className="text-gray-500 mt-1">AI-powered crop yield forecasting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Farm Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Crop Type", key: "crop", placeholder: "Rice, Wheat, Cotton..." },
                { label: "Farm Area (acres)", key: "area", placeholder: "5" },
                { label: "Expected Rainfall (mm)", key: "rainfall", placeholder: "800" },
                { label: "Average Temperature (°C)", key: "temperature", placeholder: "28" },
                { label: "Soil Type", key: "soil", placeholder: "Clay, Sandy, Loamy..." },
                { label: "Season", key: "season", placeholder: "Kharif, Rabi, Zaid..." },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "🤖 Predicting..." : "📈 Predict Yield"}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Prediction Results</h3>
            {loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce">🤖</div>
                <p className="text-gray-500">AI is analyzing your farm data...</p>
              </div>
            )}
            {!loading && !result && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-400">Fill the form to see predictions</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{result.predicted_yield}</p>
                    <p className="text-gray-600 text-sm">Predicted Yield</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{result.total_yield}</p>
                    <p className="text-gray-600 text-sm">Total Yield</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{result.confidence}%</p>
                    <p className="text-gray-600 text-sm">Confidence</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-yellow-700">{result.estimated_revenue}</p>
                    <p className="text-gray-600 text-sm">Est. Revenue</p>
                  </div>
                </div>

                {result.monthly_data && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-700 mb-3">📊 Growth Forecast</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={result.monthly_data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="growth" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {result.positive_factors?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-blue-700 mb-2">✅ Positive Factors</p>
                    {result.positive_factors.map((f, i) => (
                      <p key={i} className="text-gray-700 text-sm">• {f}</p>
                    ))}
                  </div>
                )}

                {result.risk_factors?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="font-semibold text-red-700 mb-2">⚠️ Risk Factors</p>
                    {result.risk_factors.map((f, i) => (
                      <p key={i} className="text-gray-700 text-sm">• {f}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
