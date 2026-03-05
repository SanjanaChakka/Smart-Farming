import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getDiseaseStats } from "../api";
import React from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.user?.id) {
      getDiseaseStats(user.user.id)
        .then((res) => setStats(res.data.stats))
        .catch(console.error);
    }
    // Fetch weather for Vijayawada
    fetch("https://api.open-meteo.com/v1/forecast?latitude=16.51&longitude=80.64&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m")
      .then((res) => res.json())
      .then((data) => setWeather(data.current))
      .catch(console.error);
  }, []);

  const statCards = [
    { label: "Total Scans", value: stats?.totalScans || 0, icon: "🔍", color: "bg-blue-50 border-blue-200" },
    { label: "Diseased Crops", value: stats?.diseasedScans || 0, icon: "🦠", color: "bg-red-50 border-red-200" },
    { label: "Healthy Crops", value: stats?.healthyScans || 0, icon: "✅", color: "bg-blue-50 border-blue-200" },
  ];

  return (
    <div className="dashboard-page flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="dashboard-main flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.user?.name?.split(" ")[0] || "Farmer"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your farm overview for today</p>
        </div>

        {/* Weather Widget */}
        {weather && (
          <div className="weather-widget bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">🌤️ Live Weather — {user?.user?.location || "Your Farm"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="weather-metric bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{weather.temperature_2m}°C</p>
                <p className="text-blue-100 text-sm">Temperature</p>
              </div>
              <div className="weather-metric bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{weather.relative_humidity_2m}%</p>
                <p className="text-blue-100 text-sm">Humidity</p>
              </div>
              <div className="weather-metric bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{weather.precipitation}mm</p>
                <p className="text-blue-100 text-sm">Rainfall</p>
              </div>
              <div className="weather-metric bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{weather.wind_speed_10m}km/h</p>
                <p className="text-blue-100 text-sm">Wind Speed</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className={`stat-card border-2 ${card.color} rounded-2xl p-6`}>
              <div className="text-4xl mb-3">{card.icon}</div>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              <p className="text-gray-600 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Scans */}
        {stats?.recentScans?.length > 0 && (
          <div className="recent-scans bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🕒 Recent Scans</h3>
            <div className="space-y-3">
              {stats.recentScans.map((scan) => (
                <div key={scan._id} className="scan-row flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{scan.status === "Healthy" ? "✅" : "🦠"}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{scan.disease}</p>
                      <p className="text-gray-500 text-sm">{scan.cropType}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    scan.severity === "Severe" ? "bg-red-100 text-red-600" :
                    scan.severity === "Moderate" ? "bg-yellow-100 text-yellow-600" :
                    scan.severity === "Mild" ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {scan.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


