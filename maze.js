const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startModal = document.getElementById("start");
const questionModal = document.getElementById("question");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");

const TILE = 40;

let state = "menu";

const keys = {};

const player = {
    x:0,
    y:0,
    w:24,
    h:24
};

const maze = [
"#########################",
"#S      #      #       E#",
"# ##### # #### # ##### ##",
"# #   # #    # # #      #",
"# # # # #### # # # #### #",
"#   # #      #   # #    #",
"##### ########### # #####",
"#       #         #     #",
"# ##### # ########### # #",
"#     #             # # #",
"#########################"
];

const walls = [];

let goal = null;

maze.forEach((row,r)=>{

    row.split("").forEach((cell,c)=>{

        const x = c*TILE;
        const y = r*TILE;

        if(cell === "#"){
            walls.push({
                x,y,w:TILE,h:TILE
            });
        }

        if(cell === "S"){
            player.x = x+8;
            player.y = y+8;
        }

        if(cell === "E"){
            goal = {
                x,y,w:TILE,h:TILE
            };
        }
    });
});

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
    return(
        a.x < b.x+b.w &&
        a.x+a.w > b.x &&
        a.y < b.y+b.h &&
        a.y+a.h > b.y
    );
}

function update(){

    const speed = 3.5;

    let dx = 0;
    let dy = 0;

    if(keys["a"] || keys["arrowleft"]) dx = -speed;
    if(keys["d"] || keys["arrowright"]) dx = speed;
    if(keys["w"] || keys["arrowup"]) dy = -speed;
    if(keys["s"] || keys["arrowdown"]) dy = speed;

    player.x += dx;

    walls.forEach(w=>{
        if(collide(player,w)){
            player.x -= dx;
        }
    });

    player.y += dy;

    walls.forEach(w=>{
        if(collide(player,w)){
            player.y -= dy;
        }
    });

    if(collide(player,goal)){

        state = "question";

        questionModal.classList.add("active");

        questionText.innerText =
        "What is the name of our 2nd Child?";

        answers.innerHTML = `
        <button class="choice-btn" onclick="answer(true)">
        Yone
        </button>

        <button class="choice-btn" onclick="answer(false)">
        Baking
        </button>

        <button class="choice-btn" onclick="answer(false)">
        Don Honorio
        </button>
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
        window.location.href = "last.html";
    }, 1200);
}
}

window.answer = answer;

function drawPortal(){

    const t = Date.now()*0.005;

    const glow = 15 + Math.sin(t)*8;

    ctx.save();

    ctx.shadowColor = "#a610ff";
    ctx.shadowBlur = glow;

    ctx.fillStyle = "#a610ff";

    ctx.beginPath();

    ctx.arc(
        goal.x+20,
        goal.y+20,
        15 + Math.sin(t)*3,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.restore();
}

function drawParticles(){

    for(let i=0;i<20;i++){

        const x =
        (Date.now()/20 + i*50)%1000;

        const y =
        (i*87)%600;

        ctx.fillStyle =
        "rgba(10,200,185,.15)";

        ctx.beginPath();
        ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fill();
    }
}

function draw(){

    ctx.clearRect(0,0,1000,600);

    drawParticles();

    walls.forEach(w=>{

        ctx.fillStyle = "#1a2744";

        ctx.fillRect(
            w.x,w.y,w.w,w.h
        );

        ctx.strokeStyle="#c8aa6e";

        ctx.strokeRect(
            w.x,w.y,w.w,w.h
        );
    });

    drawPortal();

    ctx.save();

    ctx.shadowColor="#0ac8b9";
    ctx.shadowBlur=15;

    ctx.fillStyle="#0ac8b9";

    ctx.fillRect(
        player.x,
        player.y,
        player.w,
        player.h
    );

    ctx.restore();
}

function loop(){

    if(state === "play"){
        update();
    }

    draw();

    requestAnimationFrame(loop);
}

loop();