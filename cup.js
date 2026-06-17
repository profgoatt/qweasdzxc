const cups = document.querySelectorAll(".cup");
const message = document.getElementById("message");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let score = 0;
let coinPosition = 0;
let canGuess = false;

cups.forEach((cup, index) => {
    cup.style.order = index;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

startBtn.addEventListener("click", startRound);

async function startRound() {

    canGuess = false;

    cups.forEach(cup => {
        cup.querySelector(".coin").style.display = "none";
    });

    coinPosition = Math.floor(Math.random() * 3);

    cups[coinPosition].querySelector(".coin").style.display = "block";

    message.textContent = "Watch the coin...";

    await sleep(1500);

    cups[coinPosition].querySelector(".coin").style.display = "none";

    message.textContent = "Shuffling...";

    for (let i = 0; i < 15; i++) {

        const a = Math.floor(Math.random() * 3);
        let b = Math.floor(Math.random() * 3);

        while (a === b) {
            b = Math.floor(Math.random() * 3);
        }

        swapCups(a, b);

        if (coinPosition === a) {
            coinPosition = b;
        } else if (coinPosition === b) {
            coinPosition = a;
        }

        await sleep(250);
    }

    message.textContent = "Where is the coin?";
    canGuess = true;
}

function swapCups(a, b) {

    const orderA = cups[a].style.order;
    const orderB = cups[b].style.order;

    cups[a].style.order = orderB;
    cups[b].style.order = orderA;
}

cups.forEach((cup, index) => {

    cup.addEventListener("click", () => {

        if (!canGuess) return;

        canGuess = false;

        cups.forEach(c => {
            c.querySelector(".coin").style.display = "none";
        });

        cups[coinPosition].querySelector(".coin").style.display = "block";

        if (index === coinPosition) {

            score++;
            scoreText.textContent = score;

            showQuestion();

        } else {

            message.textContent = "❌ Wrong! Press Start to try again.";
        }
    });
});

function showQuestion() {

    const modal = document.createElement("div");

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.85);
            display:flex;
            justify-content:center;
            align-items:center;
            z-index:9999;
        ">
            <div style="
                background:#091428;
                border:2px solid gold;
                padding:40px;
                border-radius:12px;
                text-align:center;
                max-width:400px;
                color:white;
            ">
                <h2>❤️ Question 2 ❤️</h2>

                <p>How did we first get to know each other?</p>

                <button onclick="answerQuestion(true)"
                style="display:block;width:100%;margin:10px 0;padding:12px;">
                    Playing League of Legends 🎮
                </button>

                <button onclick="answerQuestion(false)"
                style="display:block;width:100%;margin:10px 0;padding:12px;">
                    Through mutual friends
                </button>

                <button onclick="answerQuestion(false)"
                style="display:block;width:100%;margin:10px 0;padding:12px;">
                    Social Media
                </button>
            </div>
        </div>
    `;

    modal.id = "questionModal";

    document.body.appendChild(modal);
}

function answerQuestion(correct) {

    const modal = document.getElementById("questionModal");

    if (correct) {

        modal.innerHTML = `
            <div style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.85);
                display:flex;
                justify-content:center;
                align-items:center;
                z-index:9999;
            ">
                <div style="
                    background:#091428;
                    border:2px solid gold;
                    padding:40px;
                    border-radius:12px;
                    text-align:center;
                    color:white;
                ">
                    <h2>❤️ Correct ❤️</h2>
                    <p>
                        We met through League of Legends 🎮❤️
                        <br><br>
                        Proceeding to Round 3...
                    </p>
                </div>
            </div>
        `;

        setTimeout(() => {
            window.location.href = "dodge.html";
        }, 2500);

    } else {

        alert("❌ Wrong answer!");
    }
}

window.answerQuestion = answerQuestion;