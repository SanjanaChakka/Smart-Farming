import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { getIrrigation } from "../api";

export default function Irrigation() {
  const [form, setForm] = useState({ crop: "", stage: "", soilMoisture: "" });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await getIrrigation(form);
    setResult(res.data.recommendation);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="page-container">
          <h1 className="section-title">Irrigation Advisor</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["crop", "stage", "soilMoisture"].map((f) => (
                  <input
                    key={f}
                    placeholder={f}
                    className="w-full border rounded-lg px-4 py-3"
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                ))}
                <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                  Get Recommendation
                </button>
              </form>
            </GlassCard>

            {result && (
              <GlassCard>
                <h3 className="font-bold mb-3">Recommendation</h3>
                <p>{result.advice}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}