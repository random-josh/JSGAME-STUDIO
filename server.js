const express = require("express");
const fs = require("fs");
const session = require("express-session");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
const getGames = () =>
  JSON.parse(fs.readFileSync("games.json"));

const saveGames = (data) =>
  fs.writeFileSync("games.json", JSON.stringify(data, null, 2));
const USERS = [
  { username: "admin", password: "1234", role: "admin" }
];
app.post("/login", (req, res) => {
  const user = USERS.find(u =>
    u.username === req.body.username &&
    u.password === req.body.password
  );

  if (!user) return res.json({ error: "Invalid login" });

  req.session.user = user;
  res.json({ success: true, user });
});
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}
app.get("/api/games", (req, res) => {
  res.json(getGames());
});
app.post("/api/games", requireLogin, upload.single("image"), (req, res) => {
  const games = getGames();

  const newGame = {
    id: Date.now(),
    name: req.body.name,
    desc: req.body.desc,
    image: req.file ? `/uploads/${req.file.filename}` : null
  };

  games.push(newGame);
  saveGames(games);

  res.json(newGame);
});
app.delete("/api/games/:id", requireLogin, (req, res) => {
  let games = getGames();

  games = games.filter(g => g.id != req.params.id);

  saveGames(games);

  res.json({ success: true });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});