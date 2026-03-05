import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-emerald-500 flex items-center justify-center text-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">🌿 Smart Farming Assistant</h1>
        <p className="text-lg mb-8">
          AI-powered crop disease detection, irrigation advice,
          and yield prediction for modern farmers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold">
            Login
          </Link>
          <Link to="/register" className="bg-white/20 px-6 py-3 rounded-xl">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}