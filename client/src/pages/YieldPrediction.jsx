
import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { predictYield } from "../api";

export default function YieldPrediction() {
  const [form, setForm] = useState({ crop: "", area: "" });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await predictYield(form);
    setResult(res.data.prediction);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="page-container">
          <h1 className="section-title">Yield Prediction</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["crop", "area"].map((f) => (
                  <input
                    key={f}
                    placeholder={f}
                    className="w-full border rounded-lg px-4 py-3"
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                ))}
                <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                  Predict Yield
                </button>
              </form>
            </GlassCard>

            {result && (
              <GlassCard>
                <h3 className="font-bold mb-3">Prediction</h3>
                <p>Yield: {result.predicted_yield}</p>
                <p>Confidence: {result.confidence}%</p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}