const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/predict", async (req, res) => {
  try {
    const { crop, area, rainfall, temperature, soil, season } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `You are an agricultural expert. Given these farm details:
    Crop: ${crop}, Area: ${area} acres, Rainfall: ${rainfall}mm,
    Temperature: ${temperature}°C, Soil Type: ${soil}, Season: ${season}
    Return ONLY a valid JSON object:
    {
      "predicted_yield": "X tons/acre",
      "total_yield": "X tons",
      "confidence": 88,
      "monthly_data": [
        {"month": "Month1", "growth": 10},
        {"month": "Month2", "growth": 25},
        {"month": "Month3", "growth": 45},
        {"month": "Month4", "growth": 70},
        {"month": "Month5", "growth": 90},
        {"month": "Month6", "growth": 100}
      ],
      "positive_factors": ["factor1", "factor2", "factor3"],
      "risk_factors": ["risk1", "risk2"],
      "recommendation": "overall recommendation text",
      "estimated_revenue": "₹X - ₹Y per acre"
    }`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const yieldData = JSON.parse(cleanedResponse);
    res.json({ success: true, prediction: yieldData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;