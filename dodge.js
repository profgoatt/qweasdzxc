const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const livesText = document.getElementById("lives");
const startModal = document.getElementById("start");
const questionModal = document.getElementById("question");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");

let state = "menu";

const player = {
    x:50,
    y:280,
    w:25,
    h:25,
    speed:5
};

let lives = 3;

const keys = {};

const goal = {
    x:920,
    y:250,
    w:50,
    h:50
};

const obstacles = [
    {x:250,y:50,w:30,h:30,vy:4},
    {x:400,y:400,w:30,h:30,vy:-5},
    {x:550,y:100,w:30,h:30,vy:3},
    {x:700,y:450,w:30,h:30,vy:-4},
    {x:850,y:250,w:30,h:30,vy:6}
];

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

function resetPlayer(){
    player.x = 50;
    player.y = 280;
}

function update(){

    if(keys["w"] || keys["arrowup"]) player.y -= player.speed;
    if(keys["s"] || keys["arrowdown"]) player.y += player.speed;
    if(keys["a"] || keys["arrowleft"]) player.x -= player.speed;
    if(keys["d"] || keys["arrowright"]) player.x += player.speed;

    player.x = Math.max(0,Math.min(canvas.width-player.w,player.x));
    player.y = Math.max(0,Math.min(canvas.height-player.h,player.y));

    obstacles.forEach(o=>{

        o.y += o.vy;

        if(o.y <= 0 || o.y + o.h >= canvas.height){
            o.vy *= -1;
        }

        if(collide(player,o)){

            lives--;
            livesText.textContent = lives;

            resetPlayer();

            if(lives <= 0){

                lives = 3;
                livesText.textContent = lives;

                alert("Try Again ❤️");

                resetPlayer();
            }
        }
    });

    if(collide(player,goal)){

        state = "question";

        questionModal.classList.add("active");

        questionText.innerText =
        "When was our first date? ❤️";

        answers.innerHTML = `
        <button class="choice-btn" onclick="answer(true)">Dec 1</button>
        <button class="choice-btn" onclick="answer(false)">Nov 26</button>
        <button class="choice-btn" onclick="answer(false)">Dec 15</button>
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
        window.location.href = "platform.html";
    }, 1200);
}
}

window.answer = answer;

function drawParticles(){

    for(let i=0;i<25;i++){

        const x = (Date.now()/20 + i*40)%1000;
        const y = (i*73)%600;

        ctx.fillStyle = "rgba(10,200,185,.12)";

        ctx.beginPath();
        ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fill();
    }
}

function drawHeart(x,y,size){

    ctx.save();

    ctx.fillStyle = "#ff4d88";
    ctx.shadowColor = "#ff4d88";
    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.moveTo(x,y);

    ctx.bezierCurveTo(
        x-size/2,y-size/2,
        x-size,y+size/3,
        x,y+size
    );

    ctx.bezierCurveTo(
        x+size,y+size/3,
        x+size/2,y-size/2,
        x,y
    );

    ctx.fill();

    ctx.restore();
}

function draw(){

    ctx.clearRect(0,0,1000,600);

    drawParticles();

    drawHeart(goal.x+25,goal.y+10,25);

    obstacles.forEach(o=>{

        ctx.save();

        ctx.fillStyle="#a610ff";
        ctx.shadowColor="#a610ff";
        ctx.shadowBlur=15;

        ctx.fillRect(o.x,o.y,o.w,o.h);

        ctx.restore();
    });

    ctx.save();

    ctx.fillStyle="#0ac8b9";
    ctx.shadowColor="#0ac8b9";
    ctx.shadowBlur=15;

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