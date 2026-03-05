import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { detectDisease } from "../api";
import React from 'react';

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🌿 Disease Detection</h1>
          <p className="text-gray-500 mt-1">Upload a crop image for instant AI diagnosis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Crop Image</h3>
            <div
              className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => document.getElementById("imageInput").click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
              ) : (
                <div>
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-gray-500">Click to upload crop image</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, WEBP up to 5MB</p>
                </div>
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
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "🔍 Analyzing with AI..." : "🔍 Detect Disease"}
              </button>
            )}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">AI Diagnosis Result</h3>
            {loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce">🔬</div>
                <p className="text-gray-500 text-lg">Analyzing your crop...</p>
                <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}
            {!loading && !result && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-400">Upload an image to see results</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${result.status === "Healthy" ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{result.disease}</p>
                      <p className="text-gray-600">{result.crop}</p>
                    </div>
                    <span className="text-4xl">{result.status === "Healthy" ? "✅" : "🦠"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Severity</p>
                    <p className="font-bold text-gray-800">{result.severity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Confidence</p>
                    <p className="font-bold text-gray-800">{result.confidence}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Cause</p>
                    <p className="font-bold text-gray-800 capitalize">{result.cause}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-bold ${result.status === "Healthy" ? "text-blue-600" : "text-red-600"}`}>{result.status}</p>
                  </div>
                </div>

                {result.description && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-700 mb-1">Description</p>
                    <p className="text-gray-700 text-sm">{result.description}</p>
                  </div>
                )}

                {result.treatment?.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-yellow-700 mb-2">💊 Treatment Steps</p>
                    <ul className="space-y-1">
                      {result.treatment.map((t, i) => (
                        <li key={i} className="text-gray-700 text-sm flex gap-2">
                          <span className="text-yellow-600 font-bold">{i + 1}.</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.prevention?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-700 mb-2">🛡️ Prevention Tips</p>
                    <ul className="space-y-1">
                      {result.prevention.map((p, i) => (
                        <li key={i} className="text-gray-700 text-sm flex gap-2">
                          <span>•</span> {p}
                        </li>
                      ))}
                    </ul>
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
