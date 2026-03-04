import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsed = JSON.parse(user);
    req.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return req;
});

// Auth
export const registerFarmer = (data) => API.post("/auth/register", data);
export const loginFarmer = (data) => API.post("/auth/login", data);

// Disease
export const detectDisease = (formData) => API.post("/disease/detect", formData);
export const getDiseaseHistory = (userId) => API.get(`/disease/history/${userId}`);
export const getDiseaseStats = (userId) => API.get(`/disease/stats/${userId}`);

// Yield
export const predictYield = (data) => API.post("/yield/predict", data);

// Irrigation
export const getIrrigation = (data) => API.post("/irrigation/recommend", data);