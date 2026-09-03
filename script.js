const SCRIPT_URL = "URL_SCRIPT_GOOGLE_ANDA";

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let player = { x: 180, y: 350, size: 20, speed: 5 };
let target = { x: 0, y: 0, size: 15 };
let score = 0;
let gameOver = false;
let gameInterval;
let userData = { username: "", wa: "" };

// Kontrol Keyboard
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function startGame() {
  const username = document.getElementById("username").value;
  const wa = document.getElementById("wa").value;

  if (!username || !wa) {
    alert("Isi username dan nomor WA terlebih dahulu!");
    return;
  }

  userData = { username, wa };
  document.getElementById("start-menu").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  resetGameData();
  spawnTarget();
  gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
}

function resetGameData() {
  score = 0;
  gameOver = false;
  player.x = 180;
  player.y = 350;
  document.getElementById("score").innerText = score;
}

function spawnTarget() {
  target.x = Math.random() * (canvas.width - target.size);
  target.y = Math.random() * (canvas.height - target.size);
}

function updateGame() {
  if (gameOver) return;

  // Gerakan Player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.size) player.y += player.speed;

  // Deteksi Tabrakan
  if (
    player.x < target.x + target.size &&
    player.x + player.size > target.x &&
    player.y < target.y + target.size &&
    player.y + player.size > target.y
  ) {
    score += 10;
    document.getElementById("score").innerText = score;
    spawnTarget();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar Player (Biru Muda)
  ctx.fillStyle = "#4ecca3";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Gambar Target (Merah)
  ctx.fillStyle = "#e94560";
  ctx.fillRect(target.x, target.y, target.size, target.size);
}

// Simulasi Selesai Main setelah 15 Detik
setTimeout(() => {
  // Untuk keperluan testing, jalankan fungsi endGame saat dipicu
}, 15000);

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  document.getElementById("game-container").style.display = "none";
  document.getElementById("game-over-menu").style.display = "block";
  document.getElementById("final-score").innerText = score;

  kirimDataDanFetchLeaderboard();
}

function kirimDataDanFetchLeaderboard() {
  const payload = {
    username: userData.username,
    wa: userData.wa,
    score: score
  };

  // Kirim data ke Google Sheets
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(() => fetchLeaderboard())
  .catch(err => console.error("Error mengirim data:", err));
}

function fetchLeaderboard() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      let listHTML = "";
      data.forEach(item => {
        listHTML += `<li>${item[0]} - ${item[2]} Poin</li>`;
      });
      document.getElementById("leaderboard-list").innerHTML = listHTML;
    });
}

function restartGame() {
  document.getElementById("game-over-menu").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  resetGameData();
  spawnTarget();
  gameInterval = setInterval(updateGame, 1000 / 60);
}
