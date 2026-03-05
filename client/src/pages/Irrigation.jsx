import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { getIrrigation } from "../api";
import React from 'react'

export default function Irrigation() {
  const [form, setForm] = useState({
    crop: "", stage: "", soilMoisture: "",
    lat: "16.51", lon: "80.64"
  });
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await getIrrigation(form);
      setResult(res.data.recommendation);
      setWeather(res.data.weather);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get recommendations!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">💧 Irrigation & Fertilizer</h1>
          <p className="text-gray-500 mt-1">Smart recommendations based on live weather data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Crop Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Crop Type", key: "crop", placeholder: "Rice, Cotton, Wheat..." },
                { label: "Growth Stage", key: "stage", placeholder: "Seedling, Vegetative, Flowering..." },
                { label: "Soil Moisture (%)", key: "soilMoisture", placeholder: "40" },
                { label: "Latitude", key: "lat", placeholder: "16.51" },
                { label: "Longitude", key: "lon", placeholder: "80.64" },
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
                {loading ? "💧 Getting Recommendations..." : "💧 Get Recommendations"}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
            {loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce">💧</div>
                <p className="text-gray-500">Fetching live weather + AI recommendations...</p>
              </div>
            )}
            {!loading && !result && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌦️</div>
                <p className="text-gray-400">Fill the form to get smart recommendations</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-4">
                {weather && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-blue-700 mb-1">🌤️ Live Weather Used</p>
                    <p className="text-gray-600 text-sm">{weather}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-semibold text-blue-700 mb-3">💧 Irrigation Plan</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Needed:</span>
                      <span className={`font-semibold text-sm ${result.irrigation?.needed ? "text-red-600" : "text-blue-600"}`}>
                        {result.irrigation?.needed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Frequency:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.irrigation?.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Amount:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.irrigation?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Best Time:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.irrigation?.best_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Method:</span>
                      <span className="font-semibold text-sm text-gray-800 capitalize">{result.irrigation?.method}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-semibold text-blue-700 mb-3">🌱 Fertilizer Plan</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Type:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.fertilizer?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Amount:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.fertilizer?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Schedule:</span>
                      <span className="font-semibold text-sm text-gray-800">{result.fertilizer?.schedule}</span>
                    </div>
                  </div>
                </div>

                {result.alerts?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="font-semibold text-red-700 mb-2">🚨 Alerts</p>
                    {result.alerts.map((alert, i) => (
                      <p key={i} className="text-gray-700 text-sm">• {alert}</p>
                    ))}
                  </div>
                )}

                {result.weather_impact && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="font-semibold text-yellow-700 mb-1">🌦️ Weather Impact</p>
                    <p className="text-gray-700 text-sm">{result.weather_impact}</p>
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
