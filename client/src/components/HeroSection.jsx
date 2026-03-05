import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-12 text-white shadow-lg">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600')] opacity-20 bg-cover bg-center" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
            <Leaf size={28}/>
          </div>
          <h1 className="text-4xl font-bold">Smart Plant Disease Detection</h1>
        </div>

        <p className="text-lg text-green-50 mb-8">
          Upload crop images and let AI detect diseases instantly.
          Protect your farm with intelligent early diagnosis.
        </p>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-xl shadow hover:scale-105 transition">
            Start Scan
          </button>
          <button className="px-6 py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition">
            View History
          </button>
        </div>
      </motion.div>
    </div>
  );
}