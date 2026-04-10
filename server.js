app.use(express.json());
const express = require("express");
const path = require("path");

const app = express();

// IMPORTANT: serve frontend files
app.use(express.static("public"));

// parse JSON
app.use(express.json());

// HOME PAGE ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// example API (keep yours too)
app.get("/api/games", (req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  let games = []; // make sure this exists at top

app.post("/api/games", (req, res) => {
  const { name, desc } = req.body;

  const newGame = {
    id: Date.now(),
    name,
    desc,
    image: "" // ignore image for now
  };

  games.push(newGame);

  res.json({ success: true });
});
});