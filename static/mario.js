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
    x: gridSize * 10,
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
        this.vy = 0;
        this.width = gridSize;
        this.height = gridSize;
        this.dead = false;
    }
    update(){
        console.log(Enemies.length)
        this.x += this.vx;
        if (!isGround(this)){
            this.y += this.vy;
            this.vy += gravity;
        }
        if (this.y > canvas.height || this.x + this.width < 0) this.dead = true;
        Enemies = Enemies.filter(enemy => enemy.dead == false)
        enemiesCollision();
    }
    draw(){
        if (this.type === "kuribo"){
            ctx.drawImage(sprite,165,165,80,80,this.x - cameraX,this.y, this.width,this.height)
        }
    }
}

let Enemies = [
    new Entity(gridSize*15,gridSize*3,"kuribo",-1),
    new Entity(gridSize*20,gridSize*3,"kuribo",-3),
    new Entity(gridSize*20,gridSize*3,"kuribo",3),
    new Entity(gridSize*25,gridSize*3,"kuribo",1),
    new Entity(gridSize*30,gridSize*3,"kuribo",1),
    new Entity(gridSize*25,gridSize*3,"kuribo",-1),
    new Entity(gridSize*100,gridSize*3,"kuribo",-4),
    new Entity(gridSize*40,gridSize*3,"kuribo",-1),
    new Entity(gridSize*80,gridSize*3,"kuribo",-1),
    new Entity(gridSize*100,gridSize*3,"kuribo",-1),
    new Entity(gridSize*50,gridSize*3,"kuribo",-1),
    new Entity(gridSize*40,gridSize*3,"kuribo",-2),
    new Entity(gridSize*49,gridSize*3,"kuribo",-3),
    new Entity(gridSize*62,gridSize*3,"kuribo",-1),
    new Entity(gridSize*91,gridSize*3,"kuribo",-1),
    new Entity(gridSize*97,gridSize*3,"kuribo",-1),
]





//カメラ
let cameraX;

//キー入力
let keys = {};

//画像
const brick = new Image();
const sprite = new Image();
const block = new Image();
const questionBlock = new Image();
brick.src = "static/images/brick.png";
sprite.src = "static/images/sprite.png"
block.src = "static/images/block.png"
questionBlock.src = "static/images/questionBlock.png"


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
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,"","","","","","G","","O","","A","","L","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,3,2,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3,2,0,0,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,"","","","","","","","","","","","","","","",""],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,"","","","","","","","","","","","","","","",""],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

let questionBlocks = [];
function drawBlock(tile, x, y){
    switch(tile){

        case tileBrick:
            ctx.drawImage(brick, x, y, gridSize, gridSize);
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
                if (tile === tileQuestion){
                    if (!questionBlocks.some(qB => qB.x == drawX + cameraX && qB.y == drawY)){
                        questionBlocks.push(
                            {x: drawX + cameraX, y: drawY, frame: 0}
                        )
                    }
                }
                drawBlock(tile, drawX, drawY);
        }
    }
}
    

function drawMario() {
    if (marioInfo.y > 0) {
        ctx.drawImage(sprite,160,80,16*spriteGridSize,16*spriteGridSize, marioInfo.x - cameraX, marioInfo.y, marioInfo.width, marioInfo.height);
    }
}

function drawEnemy(){
    Enemies.forEach(e => {
        e.draw();
    })
}

const frameCount = 14;

function drawQuestion(){
    questionBlocks.forEach(qB => {
        ctx.drawImage(questionBlock, 80*Math.floor(qB.frame % 4), 80*Math.floor(qB.frame / 4), 80, 80, qB.x - cameraX, qB.y, gridSize, gridSize )
    })
}


setInterval(() => {
    questionBlocks.forEach(qB => {
        qB.frame = (qB.frame + 1) % frameCount;
    })
}, 100)

function isGround(entity) {
    const nextY = entity.y + entity.height + 1; // マリオのちょっと下
    const leftX = entity.x;
    const rightX = entity.x + entity.width;

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
    if (isGround(marioInfo)){
        marioInfo.vy = marioInfo.jumpStrength;
        marioInfo.jumping = true;
    }
}

function updateMario() {    
    marioInfo.x += marioInfo.vx;
    checkCollision("x");
    
    marioInfo.y += marioInfo.vy;
    marioInfo.vy += gravity;
    checkCollision("y");
    postCollisionUpdate();    

    applyFriction();

    //ステージ外
    if (marioInfo.x < 0){
        marioInfo.x = 0;
    }else if (marioInfo.x + marioInfo.width > stageMap[0].length * gridSize){
        marioInfo.x = stageMap[0].length * gridSize - marioInfo.width;
    }

    //gameover
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
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    )    
}


function isSolid(tile){
    return (tile === tileBlock || tile === tileBrick || tile === tileQuestion || tile === pushedBlock )
}

function checkCollision(axis){
    for (let row = 0; row < stageMap.length; row++){
        for (let col = 0; col < stageMap[row].length; col++){
            const tile = stageMap[row][col];
            let tileX = col * gridSize;
            let tileY = row * gridSize;
            if (!isSolid(tile)) continue;

            //画面
            if (isColliding(marioInfo.x + 3, marioInfo.y + 3, marioInfo.width - 3 , marioInfo.height - 3,
                tileX, tileY, gridSize, gridSize)){
                reseloveCollistion(tile, tileX, tileY, axis);
            }
        }
    }
}

let closestTile = null;
let minDistance = Infinity;
function reseloveCollistion(tile, tileX, tileY, axis){
    if (axis === "x"){
        if (marioInfo.vx > 0){
            marioInfo.x = tileX - marioInfo.width;
            marioInfo.vx = 0;
        }else if (marioInfo < 0){
            marioInfo.x = tileX + gridSize;
            marioInfo.vx = 0;
        }
        marioInfo.vx = 0;
    }
    if (axis === "y"){
        if (marioInfo.vy > 0){
            marioInfo.y = tileY - marioInfo.height;
            marioInfo.vy = 0;
            marioInfo.jumping = false;
        }else if (marioInfo.vy < 0){
            marioInfo.y = tileY + gridSize;
            marioInfo.vy = 0;

            
            const distance = Math.abs((marioInfo.x + marioInfo.width / 2) - (tileX + gridSize / 2));
            if (distance < minDistance){
                minDistance = distance;
                closestTile = { tile, row: tileY / gridSize, col: tileX / gridSize };
            }
        }
    }
}
function postCollisionUpdate(){
    if (closestTile){
        const { tile, row, col } = closestTile;

        if (tile === tileQuestion && stageMap[row][col] === tileQuestion){
            questionBlocks = questionBlocks.filter(qB => qB.x != col*gridSize)
            stageMap[row][col] = pushedBlock;
        } else if (tile === tileBlock && stageMap[row][col] === tileBlock){
            stageMap[row][col] = tileEmpty;
        }

        closestTile = null;
        minDistance = Infinity;
    }
}

function enemiesCollision(){
    for (let i = 0; i < Enemies.length; i++) {
        const enemy = Enemies[i];
    
        if (isColliding(
            marioInfo.x, marioInfo.y, marioInfo.width, marioInfo.height,
            enemy.x, enemy.y, gridSize, gridSize
        )){
            const isStomp = marioInfo.vy > 0 && marioInfo.y <= enemy.y + 5;
            
            if (isStomp) {
                marioInfo.vy = -50;
                
                enemy.dead = true;
                i--;
            }else{
                window.alert("Gameover")
            }
        }
    }
}

let countTime = 0;
function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateMario();
    upadateCamera();
    updateEnemies();
    
    
    drawStage();
    drawQuestion();
    drawMario();
    drawEnemy();

    handleKeyInput();
    requestAnimationFrame(gameloop);
}


gameloop();


function applyFriction(){
    const frictionGround = 0.3;
    const frinctionAir = 0.01;

    const friction = isGround(marioInfo) ? frictionGround : frinctionAir;

    if (!(keys["ArrowRight"] || keys["d"]|| keys["ArrowLeft"] || keys["a"])){
        if (marioInfo.vx > 0){
            marioInfo.vx = Math.max(0, marioInfo.vx - friction);
        }else if (marioInfo.vx < 0){
            marioInfo.vx = Math.min(0, marioInfo.vx + friction);
        }
    }
}


function handleKeyInput(){
    const accelGround = 0.2;
    const accelAir = 0.08;
    const maxSpeed = 6;

    const accel = isGround(marioInfo) ? accelGround : accelAir;

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
        jump();
    }
}

//チート
document.addEventListener("keydown", (e) => {
    if (e.key == "E"){
        Enemies.push(
            new Entity(marioInfo.x + gridSize * 3, marioInfo.y,"kuribo",-1),
              )
    }
})