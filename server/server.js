const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/disease", require("./routes/disease"));
app.use("/api/yield", require("./routes/yield"));
app.use("/api/irrigation", require("./routes/irrigation"));
app.use("/api/predict", require("./routes/predict"));
// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    database:
      mongoose.connection.readyState === 1
        ? "MongoDB Connected ✅"
        : "Not Connected ❌",
    time: new Date().toLocaleString(),
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed:", err.message);
  });