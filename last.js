const button = document.getElementById("surpriseBtn");
const message = document.getElementById("message");
const photos = document.querySelector(".side-images");

const bgm = document.getElementById("bgm");

button.addEventListener("click", () => {

    if (bgm) {
        bgm.volume = 0.4;
        bgm.play().catch(() => {});
    }

    button.style.display = "none";
    message.classList.remove("hidden");

    photos.classList.add("show");

    createHearts();
    createConfetti();
    typeWriter();
});

/* HEARTS */
function createHearts(){

    setInterval(() => {

        const heart = document.createElement("div");

        heart.innerHTML = "❤️";
        heart.classList.add("heart");

        heart.style.left = Math.random() * window.innerWidth + "px";
        heart.style.fontSize = (20 + Math.random() * 30) + "px";

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 6000);

    }, 250);
}

/* CONFETTI */
function createConfetti(){

    for(let i = 0; i < 100; i++){

        const piece = document.createElement("div");

        piece.classList.add("confetti");

        piece.style.left = Math.random() * window.innerWidth + "px";
        piece.style.animationDelay = Math.random() * 2 + "s";

        document.body.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 5000);
    }
}

/* TYPEWRITER */
function typeWriter(){

    const title = document.querySelector("#message h1");

    const text = title.textContent;

    title.textContent = "";

    let i = 0;

    const typing = setInterval(() => {

        title.textContent += text.charAt(i);

        i++;

        if(i >= text.length){
            clearInterval(typing);
        }

    }, 80);
}
