const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Endpoint to fetch news for a specific company
app.get("/news", async (req, res) => {
  const company = req.query.q; // Get the company name from query parameters
  const apiKey = "your-api-key"; // Replace with your actual NewsAPI key
  const apiUrl = `https://newsapi.org/v2/everything?q=${company}&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch news" });
    }
    const data = await response.json();
    res.json(data); // Send the data back to the client
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
