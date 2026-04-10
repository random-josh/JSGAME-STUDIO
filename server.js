const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// storage setup (MUST BE BEFORE ROUTES)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// in-memory DB
let games = [];

// GET games
app.get("/api/games", (req, res) => {
  res.json(games);
});

// POST game (WITH FILE UPLOAD)
app.post("/api/games", upload.single("image"), (req, res) => {
  const { name, desc } = req.body;

  const newGame = {
    id: Date.now(),
    name,
    desc,
    image: req.file ? "/uploads/" + req.file.filename : null
  };

  games.push(newGame);

  res.json({ success: true });
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