import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldPrediction from "./pages/YieldPrediction";
import Irrigation from "./pages/Irrigation";
import History from "./pages/History";
import React from 'react';
import "./App.css";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/disease" element={<PrivateRoute><DiseaseDetection /></PrivateRoute>} />
        <Route path="/yield" element={<PrivateRoute><YieldPrediction /></PrivateRoute>} />
        <Route path="/irrigation" element={<PrivateRoute><Irrigation /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

