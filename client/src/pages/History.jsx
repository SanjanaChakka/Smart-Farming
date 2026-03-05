import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { getDiseaseHistory } from "../api";

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.user?.id) {
      getDiseaseHistory(user.user.id)
        .then((res) => setScans(res.data.scans))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="page-container">
          <h1 className="section-title">Scan History</h1>

          {loading && <p>Loading...</p>}

          {!loading && scans.length === 0 && (
            <GlassCard>No scans yet 🌱</GlassCard>
          )}

          <div className="space-y-4">
            {scans.map((scan) => (
              <GlassCard key={scan._id} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <span className="text-3xl">
                    {scan.status === "Healthy" ? "✅" : "🦠"}
                  </span>
                  <div>
                    <p className="font-bold">{scan.disease}</p>
                    <p className="text-sm text-gray-500">{scan.cropType}</p>
                  </div>
                </div>
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {scan.severity}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}