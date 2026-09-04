// GANTI DENGAN URL GOOGLE APPS SCRIPT KAMU
const API_URL = "MASUKKAN_URL_APPS_SCRIPT_DI_SINI";

let username = "";
let nomorWA = "";
let score = 0;
let timeLeft = 30;
let timer;

// ==========================
// MENU → GAME
// ==========================

function startGame() {

    username = document.getElementById("username").value.trim();
    nomorWA = document.getElementById("wa").value.trim();

    if (username === "" || nomorWA === "") {
        document.getElementById("error").textContent =
            "Username dan nomor WhatsApp wajib diisi!";
        return;
    }

    score = 0;
    timeLeft = 30;

    document.getElementById("playerName").textContent = username;
    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = timeLeft;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    moveCoin();

    clearInterval(timer);

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("time").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }

    }, 1000);
}

// ==========================
// KLIK KOIN
// ==========================

function collectCoin() {

    if (timeLeft <= 0) return;

    score++;

    document.getElementById("score").textContent = score;

    moveCoin();
}

// ==========================
// PINDAHKAN KOIN
// ==========================

function moveCoin() {

    const gameArea = document.getElementById("gameArea");
    const coin = document.getElementById("coin");

    const maxX = gameArea.clientWidth - coin.offsetWidth;
    const maxY = gameArea.clientHeight - coin.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
}

// ==========================
// GAME SELESAI
// ==========================

async function endGame() {

    alert(`Game selesai!\nSkor kamu: ${score}`);

    await saveScore();

    showLeaderboard();
}

// ==========================
// SIMPAN DATA
// GOOGLE SHEETS
// ==========================

async function saveScore() {

    try {

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                whatsapp: nomorWA,
                score: score
            })
        });

    } catch (error) {

        console.error("Gagal menyimpan data:", error);

    }
}

// ==========================
// LEADERBOARD
// ==========================

async function showLeaderboard() {

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("leaderboard").classList.remove("hidden");

    const tbody = document.getElementById("leaderboardBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="3">Memuat data...</td>
        </tr>
    `;

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        data.sort((a, b) => Number(b.score) - Number(a.score));

        tbody.innerHTML = "";

        data.slice(0, 10).forEach((player, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3">Gagal mengambil leaderboard</td>
            </tr>
        `;

        console.error(error);
    }
}

// ==========================
// KEMBALI KE MENU
// ==========================

function backToMenu() {

    clearInterval(timer);

    document.getElementById("game").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}
