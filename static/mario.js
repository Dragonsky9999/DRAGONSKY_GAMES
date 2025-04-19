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
    preX: gridSize * 3,
    preY: canvas.height - gridSize * 3,
    width: gridSize,
    height: gridSize,
    vy: 0,
    vx: 0,
    jumpStrength: -12,
    jumping: false,
}
const speed = 5;

//エンティティ
class Entity{
    constructor(x,y,type, vx){
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = vx;
        this.width = gridSize;
        this.height = gridSize;
    }
    update(){
        this.x += this.vx;
    }
    draw(){
        if (this.type === "kuribo"){
            ctx.drawImage(sprite,160,160,80,80,this.x - cameraX,this.y, this.width,this.height)
        }
    }
}

let Enemies = [
    new Entity(gridSize*15,gridSize*8,"kuribo",-1),
    new Entity(gridSize*20,gridSize*8,"kuribo",-1),
    new Entity(gridSize*25,gridSize*8,"kuribo",-1),
]





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
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","","","","","","","","","","","","","",""],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
        ctx.drawImage(sprite,0,0,16*spriteGridSize,16*spriteGridSize, marioInfo.x - cameraX, marioInfo.y, marioInfo.width, marioInfo.height);
    }
}

function drawEnemy(){
    Enemies.forEach(e => {
        e.draw();
    })
}

function isGround() {
    const nextY = marioInfo.y + marioInfo.height + 1; // マリオのちょっと下
    const leftX = marioInfo.x;
    const rightX = marioInfo.x + marioInfo.width;

    const leftCol = Math.floor(leftX / gridSize);
    const rightCol = Math.floor(rightX / gridSize);
    const row = Math.floor(nextY / gridSize);

    for (let col = leftCol; col <= rightCol; col++) {
        const tile = stageMap[row]?.[col]; // 存在チェック付き
        if (tile === tileBrick || tile === tileBlock || tile === tileQuestion || tile === pushedBlock) {
            return true; // 地面がある
        }
    }
    return false; // 地面がない
}


function jump(){
    if (isGround()){
        marioInfo.vy = marioInfo.jumpStrength;
        marioInfo.jumping = true;
    }
}

function updateMario() {
    marioInfo.preX = marioInfo.x;
    marioInfo.preY = marioInfo.y;
    marioInfo.vy += gravity;
    marioInfo.y += marioInfo.vy;
    marioInfo.x += marioInfo.vx;

    checkCollision();

    if (marioInfo.y > canvas.height){
        window.alert("何してんねん")
    }
}

function upadateCamera(){
    cameraX = marioInfo.x - canvas.width / 4 - marioInfo.width / 2;
    const maxScroleX = stageMap[0].length * gridSize - canvas.width; 

    cameraX = Math.max(0, Math.min(cameraX, maxScroleX))
}

function updateEnemies(){
    Enemies.forEach(e => {
        e.update();
    })
}


//衝突判定
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
    const ax1 = ax;
    const ay1 = ay;
    const ax2 = ax + aw;
    const ay2 = ay + ah;

    const bx1 = bx;
    const by1 = by;
    const bx2 = bx + bw;
    const by2 = by + bh;

    const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);
    const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);

    return overlapX > 0 && overlapY > 0
}

function collidingDirection(preX, preY, newX, newY, aw, ah, bx, by, bw, bh){
    const ax1 = newX;
    const ay1 = newY;
    const ax2 = newX + aw;
    const ay2 = newY + ah;

    const bx1 = bx;
    const by1 = by;
    const bx2 = bx + bw;
    const by2 = by + bh;

    const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);
    const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);

    if (overlapX < overlapY){
        if (preX + aw <= bx) return "Right"; // 右から衝突（→）
        if (preX >= bx + bw) return "Left";  // 左から衝突（←）
    } else {
        if (preY + ah <= by) return "Down";  // 上から着地（↓）
        if (preY >= by + bh) return "Up";    // 下から頭ゴツン（↑）
    }
}


function checkCollision(){
    for (let row = 0; row < stageMap.length; row++){
        for (let col = 0; col < stageMap[row].length; col++){
            let tile = stageMap[row][col];
            let tileX = col * gridSize;
            let tileY = row * gridSize;

            //画面
            if (isColliding(marioInfo.x, marioInfo.y, marioInfo.width, marioInfo.height,
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

function standardCollding(tile, tileX, tileY){
    const marioDirection = collidingDirection(marioInfo.preX, marioInfo.preY, marioInfo.x, marioInfo.y, marioInfo.width, marioInfo.height, tileX, tileY, gridSize, gridSize); 
    
    console.log(marioDirection)
    if (marioDirection == "Down"){
        marioInfo.y = tileY - marioInfo.height;
        marioInfo.vy = 0;
        marioInfo.jumping = false;    
    }else if (marioDirection == "Right"){
        marioInfo.x = tileX - marioInfo.width;
        marioInfo.vx = 0;
    }else if (marioDirection == "Left"){
        marioInfo.x = tileX + gridSize;
        marioInfo.vx = 0;
    }else if (marioDirection == "Up"){
        marioInfo.y = tileY + gridSize;
        marioInfo.vy = 0;
    }
}



function reseloveCollistion(tile, tileX, tileY){
    const marioDirection = collidingDirection(marioInfo.preX, marioInfo.preY, marioInfo.x, marioInfo.y, marioInfo.width, marioInfo.height, tileX, tileY, gridSize, gridSize); 

    //ブッロク
    switch(tile){
        case tileBrick:
            standardCollding(tile, tileX, tileY);
            break;
        case tileBlock:
            standardCollding(tile, tileX, tileY);
            if (marioDirection == "Up"){
                let row = Math.floor(marioInfo.y / gridSize) - 1;
                let col = Math.floor(marioInfo.x / gridSize);
                if (stageMap[row][col] == tileBlock){
                    stageMap[row][col] = tileEmpty;
                }
            }
            break;
        
        case tileQuestion:
            standardCollding(tile, tileX, tileY);
            if (marioDirection == "Up"){
                let row = Math.floor(marioInfo.y / gridSize) - 1; 
                let col = Math.floor(marioInfo.x / gridSize);
                if (stageMap[row][col] === tileQuestion){
                    stageMap[row][col] = pushedBlock;
                }
            }
            break;
        case pushedBlock:
            standardCollding(tile, tileX, tileY);
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
    updateEnemies();
    
    
    drawStage();
    drawMario();
    drawEnemy();

    handleKeyInput();
    requestAnimationFrame(gameloop);
}


gameloop();


function handleKeyInput(){
    const accelGround = 0.3;
    const accelAir = 0.1;
    const maxSpeed = 5;

    const accel = isGround() ? accelGround : accelAir

    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
        
    })
    if (keys["ArrowRight"] || keys["d"]){
        marioInfo.vx = Math.min(marioInfo.vx + accel, maxSpeed);
    }
    if (keys["ArrowLeft"] || keys["a"]){
        marioInfo.vx = Math.max(marioInfo.vx - accel, -maxSpeed);
    }
    if (keys[" "] || keys["ArrowUp"] || keys["w"]){
        console.log("jump");
        jump();
    }
    if (!keys["ArrowRight"] && !keys["ArrowLeft"]){
        marioInfo.vx = 0;
    }
}