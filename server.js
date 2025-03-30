const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const axios = require("axios");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "mythbhed_db",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ MySQL Database connected...");
});

// 🔹 Fact-Checking API with NLP
app.post("/api/fact-check", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  // 🔍 Run Python NLP script to extract keywords
  exec(`python nlp_processor.py "${text}"`, async (error, stdout) => {
    if (error) {
      console.error("❌ NLP Processing Error:", error);
      return res.status(500).json({ error: "NLP processing failed" });
    }

    const keywords = JSON.parse(stdout).keywords;
    const query = keywords.join(" ");

    try {
      const factCheckResponse = await axios.get(
        `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=YOUR_GOOGLE_FACTCHECK_API_KEY`
      );

      // 📝 Store fact-check in MySQL
      db.query("INSERT INTO fact_checks (query, result) VALUES (?, ?)", [text, JSON.stringify(factCheckResponse.data)], (err) => {
        if (err) console.error("❌ Database Insert Error:", err);
      });

      res.json(factCheckResponse.data);
    } catch (error) {
      console.error("❌ Error fetching fact-check data:", error);
      res.status(500).json({ error: "Fact-checking failed" });
    }
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
