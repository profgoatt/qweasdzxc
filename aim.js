const target = document.getElementById("target");
const hitsText = document.getElementById("hits");
const timeText = document.getElementById("time");

const questionModal = document.getElementById("questionModal");

let hits = 0;
let startTime;
let timerInterval;

function randomPosition() {

    const gameWidth = window.innerWidth - 100;
    const gameHeight = window.innerHeight - 100;

    const x = Math.random() * gameWidth;
    const y = Math.random() * gameHeight;

    target.style.left = x + "px";
    target.style.top = y + "px";
}

function startGame() {

    hits = 0;

    hitsText.textContent = hits;

    target.style.display = "block";

    startTime = Date.now();

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        const elapsed = (Date.now() - startTime) / 1000;

        timeText.textContent = elapsed.toFixed(2);

    }, 10);

    randomPosition();
}

target.addEventListener("click", () => {

    hits++;

    hitsText.textContent = hits;

    if (hits >= 6) {

        clearInterval(timerInterval);

        target.style.display = "none";

        questionModal.classList.remove("hidden");

    } else {

        randomPosition();
    }
});

function answerQuestion(correct) {

    if (correct) {

        document.querySelector(".modal-content").innerHTML = `
            <h2>❤️ Correct ❤️</h2>
            <p class="result-message">
                Nov 26 was our first talk ❤️
                <br><br>
                Proceeding to Round 2...
            </p>
        `;

        setTimeout(() => {

            window.location.href = "cup.html";

        }, 2500);

    } else {

        alert("❌ Wrong answer! Try again ❤️");

        questionModal.classList.add("hidden");

        startGame();
    }
}

startGame();