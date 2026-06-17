const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

const cursorCanvas = document.getElementById("cursor");
const cctx = cursorCanvas.getContext("2d");

canvas.width = cursorCanvas.width = window.innerWidth;
canvas.height = cursorCanvas.height = window.innerHeight;

// AUDIO
const bgm = document.getElementById("bgm");
const heartbeat = document.getElementById("heartbeat");

// TYPEWRITER TITLE
const titleText = "6 Chapters of Love";
let i = 0;

function typeWriter() {
    if (i < titleText.length) {
        document.getElementById("title").innerHTML += titleText.charAt(i);
        i++;
        setTimeout(typeWriter, 120);
    }
}
typeWriter();

// BACKGROUND PARTICLES
const particles = [];

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

// HEART EXPLOSION
const hearts = [];

function createHeart(x, y) {
    return {
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 8 + 6,
        alpha: 1
    };
}

function drawHeart(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ff4d88";
    ctx.shadowColor = "#ff4d88";
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x-size/2,y-size/2,x-size,y+size/3,x,y+size);
    ctx.bezierCurveTo(x+size,y+size/3,x+size/2,y-size/2,x,y);
    ctx.fill();
    ctx.restore();
}

// CURSOR TRAIL HEARTS
const cursorHearts = [];

document.addEventListener("mousemove", e => {
    cursorHearts.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 6 + 4,
        alpha: 1
    });
});

function drawCursorHearts() {
    for (let i = cursorHearts.length - 1; i >= 0; i--) {
        let h = cursorHearts[i];
        h.alpha -= 0.02;

        ctx.save();
        ctx.globalAlpha = h.alpha;
        ctx.fillStyle = "#ff4d88";

        ctx.beginPath();
        ctx.arc(h.x, h.y, h.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (h.alpha <= 0) cursorHearts.splice(i, 1);
    }
}

const cutscene = document.getElementById("cutscene");
const cutsceneText = document.getElementById("cutsceneText");

const scenes = [
    "It all started with a simple hello...",
    "Two people, two worlds, one unexpected story...",
    "Every moment became a memory...",
    "And now... here we are.",
    "6 Chapters of Love begins."
];

let sceneIndex = 0;

function showScene() {
    if (sceneIndex >= scenes.length) {
        cutscene.style.display = "none";
        startIntro(); // go to menu animation
        return;
    }

    cutsceneText.style.opacity = 0;

    setTimeout(() => {
        cutsceneText.innerText = scenes[sceneIndex];
        cutsceneText.style.opacity = 1;
        sceneIndex++;
    }, 500);
}

function startCutscene() {
    showScene();

    const interval = setInterval(() => {
        if (sceneIndex >= scenes.length) {
            clearInterval(interval);
        } else {
            showScene();
        }
    }, 3000);

    // click skip
    cutscene.addEventListener("click", () => {
        clearInterval(interval);
        cutscene.style.display = "none";
        startIntro();
    });
}

startCutscene();

// MAIN ANIMATION LOOP
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
    });

    // heart explosion
    for (let i = hearts.length - 1; i >= 0; i--) {
        let h = hearts[i];

        h.x += h.vx;
        h.y += h.vy;
        h.vy += 0.2;
        h.alpha -= 0.02;

        drawHeart(h.x, h.y, h.size, h.alpha);

        if (h.alpha <= 0) hearts.splice(i, 1);
    }

    drawCursorHearts();

    requestAnimationFrame(animate);
}
animate();

//startgame

function playNarration(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1.1;
    speech.volume = 1;

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
}

function startGame() {

    if (heartbeat) heartbeat.play();

    if (bgm) {
        setTimeout(() => bgm.volume = 0.2, 200);
        bgm.play();
    }

    const btn = document.querySelector(".start-btn");

    if (btn) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < 50; i++) {
            hearts.push(createHeart(cx, cy));
        }
    }

    setTimeout(() => {
        document.body.style.transition = "0.8s";
        document.body.style.opacity = "0";

        setTimeout(() => {
            // ✅ CHANGE THIS PATH
            window.location.href = "aim.html";
        }, 800);

    }, 700);
}


window.startGame = startGame;