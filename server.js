const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// make uploads folder if missing
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// memory storage
let games = [];

// GET games
app.get("/api/games", (req, res) => {
  res.json(games);
});

// POST game
app.post("/api/games", upload.single("file"), (req, res) => {
  try {
    const { name, desc } = req.body;

    const newGame = {
      id: Date.now(),
      name,
      desc,
      file: req.file ? "/uploads/" + req.file.filename : null
    };

    games.push(newGame);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server crashed" });
  }
});

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});