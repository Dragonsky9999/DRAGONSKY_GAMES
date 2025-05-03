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
    thirsty: true,
    x: gridSize * 10,
    y : canvas.height - gridSize * 3 + 880, //: canvas.height - gridSize * 3,
    width: gridSize,
    height: 10,// gridSize,
    vy: 0,
    vx: 0,
    jumpStrength: -12,
    jumping: false,
    direction: "Right",
    isRotating: false,
    frame: 0, 
    invincible: false,
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
        this.jumpStrength = -50;
        this.jumping = false;
        this.width = gridSize;
        this.height = gridSize;
        this.dead = false;
        if (this.type == "needle"){
            this.maxX = x + gridSize * 10;
            this.minX = x - gridSize * 10;        
            this.num = 0;
        }
    }
    update(){
    
        this.x += this.vx;
        if (this.type == "needle"){
            if (this.x < this.minX || this.x > this.maxX || this.y > canvas.height || this.x + this.width < 0) this.dead = true;
            needles = needles.filter(enemy => enemy.dead == false)    
        }else {
            if (!isGround(this)){
                this.y += this.vy;
                this.vy += gravity;
            }
            if (this.y > canvas.height || this.x + this.width < 0) this.dead = true;
            Enemies = Enemies.filter(enemy => enemy.dead == false)
            enemiesCollision();
        }
    }
    draw(){
        //spriteが128だったら1マス2px、64だったら1マス5px
        if (this.type === "goast"){
            ctx.drawImage(sprite2,160,160,80,80,this.x - cameraX,this.y, this.width,this.height)
        }else if (this.type === "robber"){
            ctx.drawImage(sprite2,0,80,80,80,this.x - cameraX,this.y, this.width,this.height)
        }else if (this.type === "needle"){
            ctx.drawImage(sprite3, 0, 0, 32, 32, this.x -cameraX, this.y, this.width, this.height)
        }else if (this.type === "water"){
            ctx.drawImage(sprite2, 240, 160, 80, 80, this.x -cameraX, this.y, this.width, this.height)
        }
    }
}

let Enemies = [
    new Entity(gridSize*15,gridSize*3,"goast",-1),
    new Entity(gridSize*20,gridSize*3,"robber",-3),
    new Entity(gridSize*20,gridSize*3,"robber",3),
    new Entity(gridSize*25,gridSize*3,"goast",1),
    new Entity(gridSize*30,gridSize*3,"goast",1),
    new Entity(gridSize*25,gridSize*3,"goast",-1),
    new Entity(gridSize*100,gridSize*3,"goast",-4),
    new Entity(gridSize*40,gridSize*3,"goast",-1),
    new Entity(gridSize*80,gridSize*3,"goast",-1),
    new Entity(gridSize*100,gridSize*3,"goast",-1),
]
let needles = []





//カメラ
let cameraX;

//キー入力
let keys = {};

//画像
const brick = new Image();
const sprite = new Image();
const block = new Image();
const questionBlock = new Image();
const sprite2 = new Image();
const sprite3 =new Image();
brick.src = "static/images/brick.png";
sprite.src = "static/images/sprite.png"
sprite2.src = "static/images/sprite2.png"
sprite3.src = "static/images/sprite3.png"
block.src = "static/images/block.png"
questionBlock.src = "static/images/questionBlock.png"


//ステージ
const tileEmpty = 0;
const tileBrick = 1;
const tileQuestion = 2;
const tileBlock = 3;
const pushedBlock = 4;

let stageMap = [
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
    if (marioInfo.thirsty){
        ctx.drawImage(sprite2, 160, 55, 80, 25, marioInfo.x - cameraX, marioInfo.y, marioInfo.width, marioInfo.height)
    }else{
        if (marioInfo.y > 0 && marioInfo.direction == "Left"){
            if (!marioInfo.isRotating) {
                ctx.drawImage(sprite2,80,0,16*spriteGridSize,16*spriteGridSize, marioInfo.x - cameraX, marioInfo.y, marioInfo.width, marioInfo.height);
            }else if (marioInfo.isRotating) {
                ctx.drawImage(sprite3, 32 + 32*Math.floor(marioInfo.frame % 8), 32*Math.floor(marioInfo.frame / 8), 32, 32, marioInfo.x - cameraX, marioInfo.y, marioInfo.width, marioInfo.height)
            }
        }else if(marioInfo.y > 0 && marioInfo.direction == "Right"){
                ctx.save();
                ctx.translate(marioInfo.x + marioInfo.width/2 - cameraX, marioInfo.y + marioInfo.height/2);
                ctx.scale(-1, 1);
                
                !marioInfo.isRotating ? 
                    ctx.drawImage(sprite2,80,0,80,80, -marioInfo.width/2 , -marioInfo.height/2, marioInfo.width, marioInfo.height) 
                    : 
                    ctx.drawImage(sprite3, 32 + 32*Math.floor(marioInfo.frame % 8), 32*Math.floor(marioInfo.frame / 8), 32, 32, -marioInfo.width/2 , -marioInfo.height/2, marioInfo.width, marioInfo.height);
                    
                ctx.restore();
        }
    }
}
const frameMarioCount = 22;
let counter = 0;

setInterval(() => {
    if (marioInfo.isRotating){
        marioInfo.frame = (marioInfo.frame + 1) % frameMarioCount;        
        counter++;
    }
    if (counter == 44 * 4){
        marioInfo.frame = 0;
        marioInfo.isRotating = false;
        counter = 0;
    }
}, 2)

function drawEnemy(){
    Enemies.forEach(e => {
        e.draw();
    })
}

function drawNeedles(){

    needles.forEach(n => {
        n.draw();
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


function jump(entity){
    if (isGround(entity)){
        entity.vy = entity.jumpStrength;
        entity.jumping = true;
    }
}

let invincibleCounter = 0;

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

    if (marioInfo.invincible){
        invincibleCounter++;
        if (invincibleCounter > 120){
            marioInfo.invincible = false;
            invincibleCounter = 0;
        }
    }
    //gameover
    if (marioInfo.y > canvas.height){
        reset();
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

function updateNeedles(){
    needles.forEach(n => {
        n.update();
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
            let randamNum = Math.random(); 
            if (randamNum < 0.5){
                Enemies.push(
                new Entity(col * gridSize, row * gridSize - gridSize, "water", -2)
                )   
            }
        } else if (!marioInfo.thirsty && tile === tileBlock && stageMap[row][col] === tileBlock){
            stageMap[row][col] = tileEmpty;
        }

        closestTile = null;
        minDistance = Infinity;
    }
}

function enemiesCollision(){
    for (let i = 0; i < Enemies.length; i++) {
        const enemy = Enemies[i];

        if (!marioInfo.invincible && isColliding(
            marioInfo.x, marioInfo.y, marioInfo.width, marioInfo.height,
            enemy.x, enemy.y, gridSize, gridSize)){
            const isStomp = marioInfo.vy > 0 && marioInfo.y + (marioInfo.height / 2) < enemy.y;
            
            if (marioInfo.thirsty){
                    reset();
            }else if (!marioInfo.thirsty){
                if (isStomp){
                    marioInfo.vy = -10;
                    
                    Enemies.splice(i, 1);
                    i--;
                }else if (!isStomp){
                    marioInfo.invincible = true; 
                    marioInfo.thirsty = true;
                    marioInfo.height = 10;
                }
            }
        }
    
        for (let j = 0; j < needles.length; j++){
            const needle = needles[j]

            if (isColliding(needle.x, needle.y, needle.width, needle.height,
                enemy.x, enemy.y, gridSize, gridSize)){
                    const isAttack = (needle.x < enemy.x || needle.x + needle.width > enemy.x + enemy.width) && needle.y < enemy.y + enemy.height && needle.y + needle.height > enemy.y 

                    if (isAttack) {
                        needle.num++;
                        Enemies.splice(i, 1);
                        i--;
                        if (needle.num == 3){
                            needles.splice(j, 1);
                            j--;
                        }
                    }
            }
        }
    }
}

let countTime = 0;
function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateMario();
    updateNeedles();
    upadateCamera();
    updateEnemies();
    
    
    drawStage();
    drawQuestion();
    drawMario();
    drawEnemy();

    drawNeedles();


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

function reset(){
    marioInfo.x = gridSize * 10;
    marioInfo.y = canvas.height - gridSize * 3;
    marioInfo.thirsty = true;
    keys = [];
    stageMap = [
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
    Enemies = [
        new Entity(gridSize*15,gridSize*3,"robber",-1),
        new Entity(gridSize*20,gridSize*3,"robber",-3),
        new Entity(gridSize*20,gridSize*3,"robber",3),
        new Entity(gridSize*25,gridSize*3,"robber",1),
        new Entity(gridSize*30,gridSize*3,"robber",1),
        new Entity(gridSize*25,gridSize*3,"robber",-1),
        new Entity(gridSize*100,gridSize*3,"robber",-4),
        new Entity(gridSize*40,gridSize*3,"robber",-1),
        new Entity(gridSize*80,gridSize*3,"robber",-1),
        new Entity(gridSize*100,gridSize*3,"robber",-1),
    ]

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
    if ((keys["ArrowRight"] || keys["d"]) && !marioInfo.isRotating){
        marioInfo.direction = "Right";
        marioInfo.vx = Math.min(marioInfo.vx + accel, maxSpeed);
    }
    if ((keys["ArrowLeft"] || keys["a"]) && !marioInfo.isRotating){
        marioInfo.direction = "Left";
        marioInfo.vx = Math.max(marioInfo.vx - accel, -maxSpeed);
    }
    if (keys[" "] || keys["ArrowUp"] || keys["w"]){
        jump(marioInfo
        );
    }
}

//チート
document.addEventListener("keydown", (e) => {
    if (e.key == "E"){
        Enemies.push(
            new Entity(marioInfo.x + gridSize * 3, marioInfo.y,"robber",-1),
              )
    }else if (e.key == "_" || e.key == e){
        if (!marioInfo.thirsty){
            if (needles.length < 3 && !marioInfo.isRotating){
                needles.push(
                    new Entity(marioInfo.x, marioInfo.y, "needle", marioInfo.direction == "Right" ? 10 : -10)
                )
                marioInfo.isRotating = true;
            }
        }
    }else if (e.key == "U"){
        marioInfo.thirsty = false;
        marioInfo.y = marioInfo.y - 22;
        marioInfo.height = gridSize;
    }else if (e.key === "K"){
        Enemies.splice(0,Enemies.length)
    }
})
document.getElementById("reset").addEventListener("click", () => {
    reset();
})