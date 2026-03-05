const express = require("express");
const router = express.Router();
const fs = require("fs");
const { spawn } = require("child_process");
const upload = require("../middleware/upload");
const ScanHistory = require("../models/ScanHistory");

// -----------------------------------------------
// @route   POST /api/disease/detect
// -----------------------------------------------
router.post("/detect", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a crop image!" });
    }

    const { userId, cropType } = req.body;
    const imagePath = req.file.path;

    console.log("Running local AI model on:", imagePath);

    // Run Python script
    const result = await new Promise((resolve, reject) => {
      const python = spawn("py", ["-3.10", "model/predict.py", imagePath])
      let output = "";
      let errorOutput = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
        console.log("Python output:", data.toString());
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.log("Python error:", data.toString());
      });

      python.on("close", (code) => {
        if (code === 0 && output) {
          try {
            resolve(JSON.parse(output.trim()));
          } catch (e) {
            reject(new Error("Failed to parse model output"));
          }
        } else {
          console.log("Python stderr:", errorOutput);
          reject(new Error("Model execution failed"));
        }
      });
    });

    // Cleanup temp file
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    // Save to MongoDB
    let savedScan = null;
    if (userId) {
      savedScan = await ScanHistory.create({
        userId,
        cropType: result.crop || cropType,
        disease: result.disease,
        severity: result.severity,
        cause: result.cause,
        confidence: result.confidence,
        status: result.status,
        treatment: result.treatment,
        prevention: result.prevention,
      });
    }

    res.json({
      success: true,
      message: "Crop analysis complete!",
      diagnosis: result,
      scanId: savedScan ? savedScan._id : null,
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------
// @route   GET /api/disease/history/:userId
// -----------------------------------------------
router.get("/history/:userId", async (req, res) => {
  try {
    const scans = await ScanHistory.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: scans.length, scans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------
// @route   GET /api/disease/stats/:userId
// -----------------------------------------------
router.get("/stats/:userId", async (req, res) => {
  try {
    const totalScans = await ScanHistory.countDocuments({ userId: req.params.userId });
    const diseasedScans = await ScanHistory.countDocuments({ userId: req.params.userId, status: "Diseased" });
    const healthyScans = await ScanHistory.countDocuments({ userId: req.params.userId, status: "Healthy" });
    const recentScans = await ScanHistory.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, stats: { totalScans, diseasedScans, healthyScans, recentScans } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;