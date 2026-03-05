const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST /api/predict
router.post("/", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  exec(
    `python model/predict.py "${imagePath}"`,
    { cwd: path.join(__dirname, "..") },
    (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", stderr);
        return res.status(500).json({ error: "Prediction failed" });
      }

      res.json({
        success: true,
        disease: stdout.trim(),
      });
    }
  );
});

module.exports = router;