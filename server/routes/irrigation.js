const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/recommend", async (req, res) => {
  try {
    const { crop, stage, soilMoisture, lat, lon } = req.body;

    // Fetch real weather data — no API key needed!
    let weatherInfo = "Weather data unavailable";
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m`
      );
      const w = weatherRes.data.current;
      weatherInfo = `Temperature: ${w.temperature_2m}°C, Humidity: ${w.relative_humidity_2m}%, Rainfall: ${w.precipitation}mm, Wind: ${w.wind_speed_10m}km/h`;
    } catch (e) {
      console.log("Weather fetch failed, continuing without it");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `You are an expert agricultural advisor. Given:
    Crop: ${crop}, Growth Stage: ${stage}
    Current Weather: ${weatherInfo}
    Soil Moisture: ${soilMoisture}%
    Return ONLY a valid JSON object:
    {
      "irrigation": {
        "needed": true,
        "frequency": "every X days",
        "amount": "X liters/acre",
        "best_time": "Early morning (6-8 AM)",
        "method": "drip or sprinkler or flood"
      },
      "fertilizer": {
        "type": "NPK ratio recommendation",
        "amount": "X kg/acre",
        "schedule": "Apply every X weeks",
        "method": "application method"
      },
      "alerts": ["urgent action 1", "urgent action 2"],
      "weather_impact": "how current weather affects the crop",
      "next_review": "when to review next"
    }`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const recommendation = JSON.parse(cleanedResponse);
    res.json({ success: true, recommendation, weather: weatherInfo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;