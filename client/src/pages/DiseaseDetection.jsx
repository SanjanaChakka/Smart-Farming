import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { detectDisease } from "../api";

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("userId", user?.user?.id || "");
      formData.append("cropType", "Unknown");
      const res = await detectDisease(formData);
      setResult(res.data.diagnosis);
    } catch (err) {
      setError(err.response?.data?.message || "Detection failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <div className="page-container">
          <h1 className="section-title">Disease Detection</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-6">Upload Crop Image</h3>

              <div
                onClick={() => document.getElementById("imageInput").click()}
                className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition"
              >
                {preview ? (
                  <img src={preview} className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <>
                    <div className="text-6xl mb-4">📸</div>
                    <p className="font-semibold">Click to upload image</p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {preview && (
                <button
                  onClick={handleDetect}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow hover:scale-105 transition"
                >
                  {loading ? "🔍 Analyzing..." : "🔍 Detect Disease"}
                </button>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </GlassCard>

            {/* Results */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-6">Diagnosis Result</h3>

              {loading && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 animate-bounce">🔬</div>
                  <p className="text-gray-500">AI analyzing image...</p>
                </div>
              )}

              {!loading && !result && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-400">Upload image to see results</p>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${result.status === "Healthy" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">{result.disease}</p>
                        <p className="text-gray-500">{result.crop}</p>
                      </div>
                      <span className="text-4xl">
                        {result.status === "Healthy" ? "✅" : "🦠"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Info label="Severity" value={result.severity} />
                    <Info label="Confidence" value={`${result.confidence}%`} />
                    <Info label="Cause" value={result.cause} />
                    <Info label="Status" value={result.status} />
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}