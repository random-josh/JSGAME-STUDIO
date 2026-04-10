let games = [];
let currentUser = null;

/* =========================
   LOAD GAMES FROM SERVER
========================= */
async function loadGames() {
  try {
    const res = await fetch("/api/games");

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("DATA:", data);

    games = data;
    renderGames(games);

  } catch (err) {
    console.error("ERROR:", err);
  }
}

/* =========================
   RENDER GAMES
========================= */
function renderGames(list) {
  const container = document.getElementById("games");
  container.innerHTML = "";

  list.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${game.name}</h3>
      <p>${game.desc}</p>

      ${game.image ? `
  <img src="${game.image}" width="100%">
  <a href="${game.image}" download>
    <button>Download</button>
  </a>
` : ""}
      ${game.file ? `
  <a href="${game.file}" download>
    <button>Download Game</button>
  </a>
` : ""}

      <button onclick="openModal(${game.id})">View</button>
      <button onclick="deleteGame(${game.id})">Delete</button>
    `;

    container.appendChild(card);
  });
}

/* =========================
   SEARCH (LOCAL FILTER)
========================= */
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = games.filter(g =>
    g.name.toLowerCase().includes(value)
  );

  renderGames(filtered);
});

/* =========================
   LOGIN SYSTEM
========================= */
async function login() {
  const username = prompt("Username:");
  const password = prompt("Password:");

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.error) {
    alert("Login failed");
  } else {
    currentUser = data.user;
    alert("Welcome " + currentUser.username);
  }
}
/* =========================
   add game (infiniti)
========================= */
async function addGame() {
  const name = document.getElementById("name").value;
  const desc = document.getElementById("desc").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("desc", desc);
  formData.append("image", image);

  const res = await fetch("/api/games", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    loadGames();
  } else {
    alert("Upload failed");
  }
}

/* =========================
   DELETE GAME
========================= */
async function deleteGame(id) {
  const res = await fetch(`/api/games/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (data.error) {
    alert("Not allowed");
  } else {
    loadGames();
  }
}

/* =========================
   MODAL SYSTEM
========================= */
function openModal(id) {
  const game = games.find(g => g.id === id);

  document.getElementById("modalTitle").innerText = game.name;
  document.getElementById("modalDesc").innerText = game.desc;

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* =========================
   THEME TOGGLE
========================= */
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

/* LOAD ON START */
loadGames();