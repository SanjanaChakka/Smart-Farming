import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getDiseaseHistory } from "../api";
import React from 'react';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.user?.id) {
      getDiseaseHistory(user.user.id)
        .then((res) => setScans(res.data.scans))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📋 Scan History</h1>
          <p className="text-gray-500 mt-1">All your crop disease scans in one place</p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">📋</div>
            <p className="text-gray-500">Loading scan history...</p>
          </div>
        )}

        {!loading && scans.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-500 text-lg">No scans yet!</p>
            <p className="text-gray-400 text-sm mt-1">Upload a crop image to get started</p>
          </div>
        )}

        {!loading && scans.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-600">Total scans: <span className="font-bold text-gray-800">{scans.length}</span></p>
            </div>
            <div className="divide-y divide-gray-100">
              {scans.map((scan) => (
                <div key={scan._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{scan.status === "Healthy" ? "✅" : "🦠"}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{scan.disease}</p>
                        <p className="text-gray-500">{scan.cropType} • {scan.cause}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(scan.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        scan.severity === "Severe" ? "bg-red-100 text-red-600" :
                        scan.severity === "Moderate" ? "bg-yellow-100 text-yellow-600" :
                        scan.severity === "Mild" ? "bg-orange-100 text-orange-600" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {scan.severity}
                      </span>
                      <p className="text-gray-500 text-sm mt-2">Confidence: {scan.confidence}%</p>
                    </div>
                  </div>
                  {scan.treatment?.length > 0 && (
                    <div className="mt-4 bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-yellow-700 mb-1">Treatment:</p>
                      <p className="text-gray-600 text-sm">{scan.treatment[0]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
