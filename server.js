const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// API endpoints for mock data
app.get("/api/dashboard/metrics", (req, res) => {
  res.json({
    activeSessions: Math.floor(Math.random() * 20) + 5,
    apiCalls: Math.floor(Math.random() * 1000) + 2000,
    responseTime: Math.floor(Math.random() * 100) + 400,
    errorRate: (Math.random() * 3).toFixed(1),
  });
});

app.get("/api/dashboard/chart-data", (req, res) => {
  res.json({
    labels: [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    data: [
      Math.floor(Math.random() * 100) + 100,
      Math.floor(Math.random() * 100) + 80,
      Math.floor(Math.random() * 100) + 140,
      Math.floor(Math.random() * 100) + 200,
      Math.floor(Math.random() * 100) + 300,
      Math.floor(Math.random() * 100) + 250,
      Math.floor(Math.random() * 100) + 400,
      Math.floor(Math.random() * 100) + 300,
    ],
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
