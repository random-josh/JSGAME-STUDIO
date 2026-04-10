const express = require("express");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// storage
let games = [];

// routes
app.get("/api/games", (req, res) => {
  res.json(games);
});

app.post("/api/games", (req, res) => {
  const { name, desc } = req.body;

  const newGame = {
    id: Date.now(),
    name,
    desc,
    image: ""
  };

  games.push(newGame);

  res.json({ success: true });
});

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});