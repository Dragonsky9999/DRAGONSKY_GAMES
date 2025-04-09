let canvas;
let ctx;

let canvasWidth = 600 * document.getElementById("canvasWidth").valueAsNumber;
let canvasHeight = 500 * document.getElementById("canvasHeight").valueAsNumber;
//フラッピーの初期値 座標,サイズ,ジャンプ力,速さ
let flappyX;       
let flappyY;
let flappySize = 50 * document.getElementById("flappySize").valueAsNumber;
let jumpStrength = -10 * document.getElementById("jumpStrength").valueAsNumber;
let flappyVelocity = 0;
//重力
let gravity = 0.5 * document.getElementById("gravity").valueAsNumber;
//ゲームループ
let gameAnimation;
//ゲームオーバー
let gameover = false;
//パイプ
let pipes = [];
let pipeSize = 70 * document.getElementById("pipeSize").valueAsNumber;
let pipeGap = 150 * document.getElementById("pipeGap").valueAsNumber;
let pipeInterval = 150 * document.getElementById("pipeInterval").valueAsNumber;
//雲
let clouds = [];
const cloud1Width = 100;
const cloud2Width = 200;
const cloudHeight = 40;
//スコア
let score = 0;

function createPipe(){
    const gap = pipeGap;
    const topHeight = Math.floor(Math.random() * canvas.height * 2 / 3); //端っこすぎを防ぐ
    const bottomY = topHeight + gap;
    
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - bottomY,
        passed: false
    })
}

function createCloud(){
    const cloudY = Math.floor(Math.random() * canvas.height);
    const cloudType = Math.random();
    
    clouds.push({
        x: canvas.width,
        y: cloudY,
        type: cloudType
    })
}

//画像
const flappyImg = new Image();
const pipeTopImg = new Image();
const pipeBottomImg = new Image();
const cloud1Img = new Image();
const cloud2Img = new Image();

flappyImg.src = "static/images/flappy.jpeg";
pipeTopImg.src = "static/images/pipeTop.jpeg";
pipeBottomImg.src = "static/images/pipeBottom.jpeg";
cloud1Img.src = "static/images/cloud1.jpeg";
cloud2Img.src = "static/images/cloud2.jpeg";

//背景
function drawBackGround(){
    ctx.lineWidth = "5"; 
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    
    const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    
    gradient.addColorStop(0,"rgb(80,150,245)");
    gradient.addColorStop(1,"rgb(100,170,255)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}


//フラッピー
function drawFlappy(){
    if (flappyY > 0){
        ctx.drawImage(flappyImg,flappyX,flappyY, flappySize,flappySize);
    }
}

//パイプ
function drawPipes(){
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeSize, pipe.top);

        ctx.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottom, pipeSize, pipe.bottom);
    })   
}

//雲
function drawCloud(){
    clouds.forEach(cloud => {
        if (cloud.type < 0.8){
            ctx.drawImage(cloud1Img, cloud.x,cloud.y,cloud1Width,cloudHeight);
        }else {
            ctx.drawImage(cloud2Img, cloud.x, cloud.y, cloud2Width, cloudHeight);
        }
    })
}

//スコア
function drawScore(){
    ctx.fillStyle = "black";
    ctx.fillRect(10,10,200,44)
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("現在のスコア: " + score,20,40);
}

//flappyJump
function flappyJump(){
    if (!gameStarted){
        gameStarted = true;
        gameloop();
    }
    flappyVelocity = jumpStrength;
}

function updateGameState(){
    if (!gameover){
        flappyVelocity += gravity
        flappyY += flappyVelocity    
    }
}

function updatePipe(){
    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (!pipe.passed && pipe.x + pipeSize < flappyX){
            score++;
            pipe.passed = true;
        }
    })
    
    pipes = pipes.filter(pipe => pipe.x + pipeSize >= 0);
}

function upadateCloud(){
    clouds.forEach(cloud => {
        cloud.x -= 1;
    })
    clouds = clouds.filter(cloud => cloud.x + cloud1Width >= 0);
}

//ゲームオーバー
function checkGameOver(){
    //衝突判定
    pipes.forEach(pipe => {
        const inXRange = flappyX + flappySize > pipe.x && flappyX < pipe.x + pipeSize;
        const hitTop = flappyY < pipe.top;
        const hitBottom = flappyY > canvas.height - pipe.bottom;

        if (inXRange && (hitTop || hitBottom)){
            gameover = true;
        }
    })
    //下に落ちる
    if (flappyY > canvas.height) gameover = true;

    //ゲームオーバー
    if (gameover){
        cancelAnimationFrame(gameAnimation);
        showPopup();
    }
}


//ループ
let gameTimer = 0;

function gameloop(){
    if (gameover) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    updateGameState()
    updatePipe();
    upadateCloud();

    drawBackGround();
    drawCloud();
    drawFlappy();
    drawPipes();


    checkGameOver();

    gameTimer++;
    if (gameTimer % pipeInterval === 0){
        createPipe();
    }
    //雲2個くらい別間隔で表示
    if (gameTimer % 200 === 0){
        createCloud();
    }
    if (gameTimer % 150 === 0){
        createCloud();
    }
    

    drawScore();

    gameAnimation = requestAnimationFrame(gameloop);
}

function handleKeyDown(e){
    if (gameover) return;

    if (openGame){
        const key = e.key;
        
        //デフォルトででウィンドウ動くのなし！
        if (key === " ") e.preventDefault();
        
        if (key === " " && !gameover ){
            flappyJump();
        }else if (key === "r"){
            reset();
        }    
            
    }

}

let openGame = false;
let gameStarted = false;

//ポップアップ
function showPopup(){
    const popup = document.getElementById("popup");
    const scoreText = document.getElementById("scoreText");
    scoreText.textContent = `Score: ${score} 点`;
    popup.classList.remove("hidden");
}

function reset(){
    const parentCanvas = document.getElementById("parentCanvas");
    const oldCanvas = document.getElementById("canvas");
    if (oldCanvas){
        oldCanvas.remove();
    }
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "canvas";
    parentCanvas.appendChild(newCanvas);
    newCanvas.width = canvasWidth;
    newCanvas.height = canvasHeight;
    canvas = newCanvas;
    ctx = newCanvas.getContext("2d");

    //入力内容諸々更新
    canvasWidth = 600 * document.getElementById("canvasWidth").valueAsNumber;
    canvasHeight = 500 * document.getElementById("canvasHeight").valueAsNumber;
    flappySize = 50 * document.getElementById("flappySize").valueAsNumber;
    jumpStrength = -10 * document.getElementById("jumpStrength").valueAsNumber;
    gravity = 0.5 * document.getElementById("gravity").valueAsNumber;
    pipeSize = 70 * document.getElementById("pipeSize").valueAsNumber;
    pipeGap = 150 * document.getElementById("pipeGap").valueAsNumber;
    pipeInterval = 150 * document.getElementById("pipeInterval").valueAsNumber;


    
    document.getElementById("popup").classList.add("hidden");
    cancelAnimationFrame(gameAnimation);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    openGame = true; 
    flappyX = canvas.width/8;       
    flappyY = canvas.height/2;
    flappyVelocity = 0;
    gameover = false;
    gameStarted = false;
    pipes.length = 0;
    gameTimer = 0;
    clouds.length = 3;
    score = 0;

    drawBackGround();
    drawScore();
    drawCloud();
    drawFlappy();

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        flappyJump();
    }, { passive: false });

}

function closeGame(){
    openGame = false;
    cancelAnimationFrame(gameAnimation);
    flappyX = canvas.width/8;       
    flappyY = canvas.height/2;
    flappyVelocity = 0;
    gameover = false;
    gameStarted = false;
    pipes.length = 0;
    gameTimer = 0;
    clouds.length = 3;
    score = 0;

    //キャンバスそのものを削除
    document.getElementById("canvas").remove();
    //ポップアップを隠す
    document.getElementById("popup").classList.add("hidden");
}

document.addEventListener("keydown", handleKeyDown);
const StartBtns = document.querySelectorAll(".StartBtns")
StartBtns.forEach(StartBtn => {
    StartBtn.addEventListener("click", reset)
})
document.getElementById("reset").addEventListener("click", reset)
document.getElementById("close").addEventListener("click", closeGame)

//レベルボタン
const levelBtns = document.querySelectorAll(".levelBtn");
levelBtns.forEach(levelBtn => {
    levelBtn.addEventListener("click", () => {
        levelBtns.forEach(b => b.classList.remove("active"));
        levelBtn.classList.add("active");
    })
})

document.getElementById("easy").addEventListener("click", () => {
    document.getElementById("jumpStrength").valueAsNumber = 0.8;
    document.getElementById("gravity").valueAsNumber = 1;
    document.getElementById("pipeSize").valueAsNumber = 0.8;
    document.getElementById("pipeGap").valueAsNumber = 1.5;
    document.getElementById("pipeInterval").valueAsNumber = 1.5;
})

document.getElementById("normal").addEventListener("click", () => {    
    document.getElementById("jumpStrength").valueAsNumber = 1;
    document.getElementById("gravity").valueAsNumber = 1;
    document.getElementById("pipeSize").valueAsNumber = 1;
    document.getElementById("pipeGap").valueAsNumber = 1;
    document.getElementById("pipeInterval").valueAsNumber = 1;
})

document.getElementById("hard").addEventListener("click", () => {
    document.getElementById("jumpStrength").valueAsNumber = 1.1;
    document.getElementById("gravity").valueAsNumber = 0.9;
    document.getElementById("pipeSize").valueAsNumber = 1;
    document.getElementById("pipeGap").valueAsNumber = 1;
    document.getElementById("pipeInterval").valueAsNumber = 0.7;
})