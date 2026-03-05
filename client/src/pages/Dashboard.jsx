import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HeroSection from "../components/HeroSection";
import StatCard from "../components/StatCard";
import GlassCard from "../components/GlassCard";
import { getDiseaseStats } from "../api";
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.user?.id) {
      getDiseaseStats(user.user.id)
        .then((res) => setStats(res.data.stats))
        .catch(console.error);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <div className="page-container">
          
          <HeroSection />

          <div>
            <h2 className="section-title mb-6">Farm Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard icon="🔍" label="Total Scans" value={stats?.totalScans || 0} />
              <StatCard icon="🦠" label="Diseased Crops" value={stats?.diseasedScans || 0} />
              <StatCard icon="✅" label="Healthy Crops" value={stats?.healthyScans || 0} />
            </div>
          </div>

          {stats?.recentScans?.length > 0 && (
            <div>
              <h2 className="section-title mb-6">Recent Scans</h2>
              <div className="space-y-4">
                {stats.recentScans.map((scan) => (
                  <GlassCard key={scan._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {scan.status === "Healthy" ? "✅" : "🦠"}
                      </span>
                      <div>
                        <p className="font-bold text-lg">{scan.disease}</p>
                        <p className="text-gray-500 text-sm">{scan.cropType}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      {scan.severity}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}