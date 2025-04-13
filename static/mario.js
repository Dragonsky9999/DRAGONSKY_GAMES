const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//画面設定
const gridSize = 32;
const tileRows = 11;
const tileCols = 16;
const spriteGridSize = 5;

canvas.width = gridSize * tileCols;
canvas.height = gridSize * tileRows;

//重力の定数
const gravity = 0.5;

//marioの基本情報
const marioInfo = {
    x: gridSize * 3,
    y : canvas.height - gridSize * 3,
    width: gridSize,
    height: gridSize,
    vy: 0,
    vx: 0,
    jumpStrength: -13,
    jumping: false,
}
const speed = 5;

//カメラ
let cameraX;

//キー入力
let keys = {};

//画像
const brick = new Image();
const sprite = new Image();
const block = new Image();
brick.src = "static/images/brick.png";
sprite.src = "static/images/sprite.png"
block.src = "static/images/block.png"

//ステージ
const tileEmpty = 0;
const tileBrick = 1;
const tileQuestion = 2;
const tileBlock = 3;
const pushedBlock = 4;

const stageMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,3,3,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","G","","O","","A","","L","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,3,2,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3,2,0,0,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

function drawBlock(tile, x, y){
    
    switch(tile){

        case tileBrick:
            ctx.drawImage(brick, x, y, gridSize, gridSize);
            break;
        case tileQuestion:
            ctx.drawImage(sprite,80,80,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case tileBlock:
            ctx.drawImage(block,x,y,gridSize,gridSize);
            break;
        case pushedBlock:
            ctx.drawImage(sprite,80,160,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case "G":
            ctx.drawImage(sprite,0,240,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case "O":
            ctx.drawImage(sprite,80,240,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case "A":
            ctx.drawImage(sprite,160,240,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case "L":
            ctx.drawImage(sprite,240,240,16*spriteGridSize,16*spriteGridSize, x, y, gridSize, gridSize);
            break;
        case "":
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, gridSize, gridSize);
            break;
        case 0:
            ctx.fillStyle = "#5c94fc"
            ctx.fillRect(x,y,gridSize,gridSize)
            break;
    }
}

function drawStage() {
    
    for (let row = 0; row<stageMap.length; row++){
        for (let col = 0; col<stageMap[row].length; col++){
                let tile = stageMap[row][col];
                let drawX = col * gridSize - cameraX;
                let drawY = row * gridSize;
                drawBlock(tile, drawX, drawY);
        }
    }
}
    

function drawMario() {
    if (marioInfo.y > 0 && marioInfo.y > 0) {
        ctx.drawImage(sprite,0,0,16*spriteGridSize-15,16*spriteGridSize, marioInfo.x - cameraX , marioInfo.y, marioInfo.width, marioInfo.height);
    }
}

function jump(){
    if (!marioInfo.jumping){
        marioInfo.vy = marioInfo.jumpStrength;
        marioInfo.jumping = true;
    }
}

function updateMario() {
    marioInfo.vy += gravity;
    marioInfo.y += marioInfo.vy;
    marioInfo.x += marioInfo.vx;

    if (marioInfo.y > canvas.height){
        window.alert("何してんねん")
    }
}

function upadateCamera(){
    cameraX = marioInfo.x - canvas.width / 4 - marioInfo.width / 2;
    const maxScroleX = stageMap[0].length * gridSize - canvas.width; 

    cameraX = Math.max(0, Math.min(cameraX, maxScroleX))
}


//衝突判定
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    )
}
function checkCollision(){
    for (let row = 0; row < stageMap.length; row++){
        for (let col = 0; col < stageMap[row].length; col++){
            let tile = stageMap[row][col];
            let tileX = col * gridSize;
            let tileY = row * gridSize;

            //画面
            if (isColliding(marioInfo.x, marioInfo.y, marioInfo.width-10, marioInfo.height,
                tileX, tileY, gridSize, gridSize)){
                reseloveCollistion(tile, tileX, tileY);
            }
        }
    }
    if (marioInfo.x < 0){
        marioInfo.x = 0;
    }else if (marioInfo.x + marioInfo.width > stageMap[0].length * gridSize){
        marioInfo.x = stageMap[0].length * gridSize - marioInfo.width;
    }
}

function reseloveCollistion(tile, tileX, tileY){
    //ブッロク
    switch(tile){
        case tileBrick:
            if (marioInfo.vy > 0){
                marioInfo.y = tileY - marioInfo.height;
                marioInfo.vy = 0;
                marioInfo.jumping = false;
            }
            else if (marioInfo.vy < 0){
                marioInfo.y = tileY + gridSize;
                marioInfo.vy = 0;
            }
            break;
        case tileBlock:
            if (marioInfo.vy > 0){
                marioInfo.y = tileY - marioInfo.height;
                marioInfo.vy = 0;
                marioInfo.jumping = false;
            }
            else if (marioInfo.vy < 0){
                marioInfo.y = tileY + gridSize;
                marioInfo.vy = 0;
            }
            break;
        
        case tileQuestion:
            if (marioInfo.vy > 0){
                marioInfo.y = tileY - marioInfo.height;
                marioInfo.vy = 0;
                marioInfo.jumping = false;
            }
            else if (marioInfo.vy < 0){
                marioInfo.y = tileY + gridSize;
                marioInfo.vy = 0;
                let row = Math.floor(marioInfo.y / gridSize) - 1; 
                let col = Math.floor(marioInfo.x / gridSize);
                if (stageMap[row][col] === tileQuestion){
                    stageMap[row][col] = pushedBlock;
                }
            }
            break;
        case pushedBlock:
            if (marioInfo.vy > 0){
                marioInfo.y = tileY - marioInfo.height;
                marioInfo.vy = 0;
                marioInfo.jumping = false;
            }
            else if (marioInfo.vy < 0){
                marioInfo.y = tileY + gridSize;
                marioInfo.vy = 0;
            }
            break;
        
        case tileEmpty:
            break;
    }
}





function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateMario();
    upadateCamera();
    checkCollision();
    
    
    drawStage();
    drawMario();

    handleKeyInput();
    requestAnimationFrame(gameloop);
}


gameloop();


function handleKeyInput(){
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    })
    if (keys["ArrowRight"]){
        marioInfo.vx = speed;
    }
    if (keys["ArrowLeft"]){
        marioInfo.vx = -speed;
    }
    if (keys[" "]){
        console.log("jump");
        jump();
    }
    if (!keys["ArrowRight"] && !keys["ArrowLeft"]){
        marioInfo.vx = 0;
    }
}