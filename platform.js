const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startModal = document.getElementById("start");
const questionModal = document.getElementById("question");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");

let state = "menu";

const player = {
    x:60,
    y:500,
    w:24,
    h:24,
    vx:0,
    vy:0,
    onGround:false
};

const keys = {};

const platforms = [
    {x:0,y:560,w:1000,h:40},
    {x:50,y:450,w:150,h:20},
    {x:250,y:380,w:150,h:20},
    {x:480,y:300,w:150,h:20},
    {x:700,y:220,w:150,h:20},
    {x:880,y:150,w:100,h:20}
];

const goal = {
    x:910,
    y:90,
    w:40,
    h:40
};

document.addEventListener("keydown",e=>{
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()] = false;
});

function startGame(){
    startModal.classList.remove("active");
    state = "play";
}

window.startGame = startGame;

function collide(a,b){
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function update(){

    player.vy += 0.6;

    if(keys["a"] || keys["arrowleft"])
        player.vx = -4.5;
    else if(keys["d"] || keys["arrowright"])
        player.vx = 4.5;
    else
        player.vx *= 0.8;

    if((keys["w"] || keys["arrowup"]) && player.onGround){
        player.vy = -11;
        player.onGround = false;
    }

    player.x += player.vx;
    player.y += player.vy;

    player.onGround = false;

    platforms.forEach(p=>{

        if(collide(player,p)){

            if(player.vy >= 0){

                player.y = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
            }
        }
    });

    if(collide(player,goal)){

        state = "question";

        questionModal.classList.add("active");

        questionText.innerText =
            "What is the name of our First Child?";

        answers.innerHTML = `
            <button class="choice-btn" onclick="answer(true)">Yasuo</button>
            <button class="choice-btn" onclick="answer(false)">Ronaldo</button>
            <button class="choice-btn" onclick="answer(false)">Jones</button>
        `;
    }
}

function answer(correct){

if(correct){

    questionText.innerHTML = `
    ❤️ Correct! Moving to next chapter...
    `;

    answers.innerHTML = "";

    setTimeout(() => {
        window.location.href = "maze.html";
    }, 1200);
}
}

window.answer = answer;

function draw(){

    ctx.clearRect(0,0,1000,600);

    platforms.forEach(p=>{

        ctx.fillStyle = "#1a2744";
        ctx.fillRect(p.x,p.y,p.w,p.h);
    });

    ctx.fillStyle = "gold";
    ctx.fillRect(goal.x,goal.y,goal.w,goal.h);

    ctx.fillStyle = "#0ac8b9";
    ctx.fillRect(
        player.x,
        player.y,
        player.w,
        player.h
    );
}

function loop(){

    if(state === "play"){
        update();
    }

    draw();

    requestAnimationFrame(loop);
}

loop();