import { motion } from "framer-motion";
import React from "react";
export default function StatCard({ icon, label, value }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass-card p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}