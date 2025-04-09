const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const Hold = document.getElementById("Hold");
const ctxHold = Hold.getContext("2d");
requestAnimationFrame(drawHoldBlock);


//背景表示
function drawBackground(){

    ctx.beginPath();
    ctx.fillStyle = "rgb(150 150 250 / 100%)";
    ctx.fillRect(0,0,360,630);
    ctx.strokeStyle = "rgb(220, 220, 220)"
    ctx.moveTo(15,0);
    ctx.lineTo(15,630);
    ctx.lineWidth = "30";
    ctx.stroke();
    ctx.moveTo(345,0);
    ctx.lineTo(345,630);
    ctx.stroke();
    ctx.moveTo(15,615);
    ctx.lineTo(345,615);
    ctx.stroke();

}

//block
// 20行 10列のボードを作成
let board = [];
for (let row = 0; row < 20; row++) {
    board[row] = [];
    for (let col = 0; col < 10; col++) {
        board[row][col] = "0";  // 初期値として "0" をセット
    }
}
const gridSize = 30;
const columns = 10;
const rows = 20;

let blockX = 4;
let blockY = 0;
let score = 0;
let speed = document.getElementById("SPEED").value
let mode = "endless";
let level = 0;

const I = {
    "shape":[
    ["1","1","1","1"]
    ],
    "color": "rgb(45, 195, 255)"}
const O = {
    "shape":[
    ["1","1"],
    ["1","1"]
    ],
    "color": "rgb(255, 255, 0)"}
const T = {
    "shape":[
    ["0","1","0"],
    ["1","1","1"]
    ],
    "color": "rgb(255, 0, 255)"}
const Z = {
    "shape":[
    ["1","1","0"],
    ["0","1","1"]
    ],
    "color": "rgb(255, 37, 84)"}
const S = {
    "shape":[
    ["0","1","1"],
    ["1","1","0"]
    ],
    "color": "rgb(0, 255, 0)"}
const L = {
    "shape":[
    ["1","1","1"],
    ["1","0","0"]
    ],
    "color": "rgb(255, 136, 0)"}
const J = {
    "shape":[
    ["1","1","1"],
    ["0","0","1"]
    ],
    "color": "rgb(0, 0, 255)"}

let block = [];
let blocktype;
let current_shape;
spawnBlock();

let holdBlock;
    
//blockを描画
function draw_block(){
    for (let i=0; i<current_shape.length; i++){
        for (let j=0; j<current_shape[i].length; j++){
            if (current_shape[i][j] === "1"){
                ctx.beginPath();
                ctx.fillStyle = blocktype.color;
                ctx.fillRect((blockX + j + 1) * gridSize, (blockY + i) * gridSize , gridSize, gridSize);
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = "2";
                ctx.strokeRect((blockX + j + 1) * gridSize, (blockY + i) * gridSize , gridSize, gridSize);
            }
        }
    }
}

//blockを回転
function RotateShape(){
    let shapeRows = current_shape.length;
    let shapeCols = current_shape[0].length;
    let newShape = Array.from({ length: shapeCols }, () => []);
    for (let col=0; col<shapeCols; col++){
        for (let row=0; row<shapeRows; row++){
            newShape[col][shapeRows - 1 -row] = current_shape[row][col]
        }
    }
    current_shape = newShape
    if (blockX + current_shape[0].length > 10) blockX = 10 - current_shape[0].length;
    
    requestAnimationFrame(drawBoard);
}

//画面をクリアして、ブロックを描画
function drawBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawNextBlockBackground();
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board[i].length; j++){
            if (board[i][j] === "1"){

                ctx.beginPath();
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect((j+1)*gridSize, i*gridSize, gridSize, gridSize);
                ctx.lineWidth = "2";
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.strokeRect((j+1)*gridSize, i*gridSize, gridSize, gridSize);
                
            }
        }
    }
    draw_block();
    //次のブロック用背景
    //次のブロックを描画
    drawNextBlock(0, 379, 10);
    drawNextBlock(1, 379, 110);
    drawNextBlock(2, 379, 210);
    //ハードドロップの予測位置を描画
    falseBlock();
}
//一回だけ描画
drawNextBlockBackground();

//次のブロックよう背景
function drawNextBlockBackground(){
    ctx.beginPath();
    ctx.fillStyle = "rgb(150 150 250 / 100%)";
    ctx.fillRect(365,0,100,269);
    ctx.strokeStyle = "rgb(240, 50, 50)"
    ctx.lineWidth = "5";
    ctx.strokeRect(365,0,100,269);
}

//次のブロック描画用
function drawNextBlock(num, x, y){
    let nextBlock = block[num];
    let nextBlockShape = nextBlock.shape;
    let nextBlockColor = nextBlock.color;
    for (let row=0; row<nextBlockShape.length; row++){
        for (let col=0; col<nextBlockShape[row].length; col++){
            if (nextBlockShape[row][col] === "1"){
                ctx.beginPath();
                ctx.fillStyle = nextBlockColor;
                ctx.fillRect(x + col*gridSize * 0.8, y + row*gridSize * 0.8, gridSize*0.8, gridSize*0.8);
                ctx.lineWidth = "2";
                ctx.strokeStyle = "black";
                ctx.strokeRect(x + col*gridSize *0.8, y + row*gridSize *0.8, gridSize*0.8, gridSize*0.8);
            }
        }
    }
}

function drawHoldBlock(){
    ctxHold.clearRect(0, 0, Hold.width, Hold.height);
    ctxHold.fillStyle = "rgb(150 150 250 / 100%)";
    ctxHold.fillRect(0,0,95,95);
    ctxHold.strokeStyle = "rgb(240, 50, 50)"
    ctxHold.lineWidth = "5";
    ctxHold.strokeRect(0, 0, 95, 95);

    for (let row=0; row<holdBlock.shape.length; row++){
        for (let col=0; col<holdBlock.shape[row].length; col++){
            if (holdBlock.shape[row][col] === "1"){
                ctxHold.beginPath();
                ctxHold.fillStyle = holdBlock.color;
                ctxHold.fillRect(14+col*gridSize * 0.8, 26+row*gridSize * 0.8, gridSize*0.8, gridSize*0.8);
                ctxHold.lineWidth = "2";
                ctxHold.strokeStyle = "black";
                ctxHold.strokeRect(14+col*gridSize *0.8, 26+row*gridSize *0.8, gridSize*0.8, gridSize*0.8);
            }
        }
    }
}

//新しいテトリミノを生成
function spawnBlock(){
    let Firstblock = [I, O, T, Z, S, L, J]

    if (block.length === 0) {
        for (let i=Firstblock.length-1; i>0; i--){
            let j = Math.floor(Math.random() * (i+1));
            [Firstblock[i], Firstblock[j]] = [Firstblock[j], Firstblock[i]];
        }
        block = Firstblock.slice();
        for (let i=Firstblock.length-1; i>0; i--){
            let j = Math.floor(Math.random() * (i+1));
            [Firstblock[i], Firstblock[j]] = [Firstblock[j], Firstblock[i]];
        }
        for (let i=0; i<Firstblock.length; i++){
            block.push(Firstblock[i]);
        }
    }

    if (block.length === 7){
        for (let i=Firstblock.length-1; i>0; i--){
            let j = Math.floor(Math.random() * (i+1));
            [Firstblock[i], Firstblock[j]] = [Firstblock[j], Firstblock[i]];
        }
    for (let i=0; i<Firstblock.length; i++){
            block.push(Firstblock[i]);
        }
    }

    console.log(block.length)
    blocktype = block.shift();
    current_shape = blocktype.shape;

    blockX = 4;
    blockY = 0;

    requestAnimationFrame(drawBoard);
}

//テトリミノを置く
function placeblock(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++)
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY + row;
                let BoardCol = blockX + col;
                board[BoardRow][BoardCol] = "1";
            }
    }
    lineclear();
    GameOver();
}          

//1秒毎にブロックを一つ下に移動
function update(){
    if (canMoveDown()){
        blockY++;
        requestAnimationFrame(drawBoard);
    }else{
        placeblock();
        spawnBlock();
    }
    if (score === 0){
        level = 0;
    }else if (mode==="marason" && score % 10 === 0){
        level = score / 10
        document.getElementById("level").innerHTML = "現在のレベル: " + level;
        speed = 1000 * 0.8 ** level;
        clearInterval(gameloop);
        gameloop = setInterval(update, speed)
        if (level == 20){
            window.alert("GAME CLEAR!! すごい!!");
            document.getElementById("level").innerHTML = "現在のレベル: 0"
            speed = 1000;
            reset();
        }
    }
    requestAnimationFrame(drawHoldBlock);
}

let gameloop
//モード別loop
if (mode==="endless"){
    gameloop = setInterval(update, speed);
}else if (mode==="marason"){
    gameloop = setInterval(update, speed);
}

//下へ動ける？
function canMoveDown(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++){
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY + row;
                let BoardCol = blockX + col;
                let newRow = BoardRow + 1;

                if (newRow >= board.length) return false;
                if (board[newRow][BoardCol] === "1"){
                    return false;
                }else if (board[newRow][BoardCol] == "undefined"){
                    return false;
                }
            }
        }
    }
    return true;
}

//右への当たり判定
function canMoveRight(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++){
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY+row;
                let BoardCol = blockX+col;
                let newCol = BoardCol + 1;

                if (newCol >= board[row].length) return false;
                if (board[BoardRow][newCol] === "1") return false;
            }
        }
    }
    return true;
}

//左への当たり判定
function canMoveLeft(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++){
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY+row;
                let BoardCol = blockX+col;
                let newCol = BoardCol - 1;

                if (newCol < 0 ) return false;
                if (board[BoardRow][newCol] === "1") return false;
            }
        }
    }
    return true;
}

//harddropできる距離を計測
function getDropDistance(){
    let distance = 0;
    while (true){
        for (let row=0; row<current_shape.length; row++){
            for (let col=0; col<current_shape[row].length; col++){
                if (current_shape[row][col] === "1"){
                    let BoardRow = blockY + row + distance + 1;
                    let BoardCol = blockX + col;
                    if (BoardRow >= board.length || board[BoardRow][BoardCol] === "1"){
                        return distance;
                    }
                }
            }
        }
        distance++;
    }
}

//ハードドロップ
function HardDrop(){
    let dropDistance = getDropDistance();
    blockY += dropDistance;
    placeblock();
    spawnBlock();
}

//落ちる予測位置に白いやつ描画
function falseBlock(){
    let falseDistance = getDropDistance();
    let falseY = blockY + falseDistance;
    for (let i=0; i<current_shape.length; i++){
        for (let j=0; j<current_shape[i].length; j++){
            if (current_shape[i][j] === "1"){
                ctx.beginPath();
                ctx.fillStyle = "rgb(200 200 200 /25%)";
                ctx.fillRect((blockX + j + 1) * gridSize, (falseY + i) * gridSize , gridSize, gridSize);
                ctx.lineWidth = "2";
                ctx.strokeStyle = "rgb(0 0 0 /25%)"
                ctx.strokeRect((blockX + j + 1) * gridSize, (falseY + i) * gridSize , gridSize, gridSize);
            }
        }
    }
}

//ライン消去
function lineclear(){
    let lineToClear = []
    
    //リストアップ
    for (let row=0; row<board.length; row++){
        if (board[row].join("") === "1111111111"){
            lineToClear.push(row);
            score++;
            document.getElementById("score").innerHTML = "現在のスコア: " +score+ "ライン"
        }
    }

    for (let i=lineToClear.length-1; i>=0; i--){
        board.splice(lineToClear[i], 1);
    }
    for (let i=0; i<lineToClear.length; i++){
        board.unshift(Array(10).fill("0"));
    }
    
    if (lineToClear > 0){
        requestAnimationFrame(drawBoard)
    }
}

//1番上に来たらGAME OVER
function GameOver(){
    if (board[0].includes("1")){
        window.alert("GAME OVER!!" + score + "ライン消去でした！！" );
        reset();
    }
}

//矢印キーを押してもスクロールしない
document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault(); // 矢印キーのデフォルト動作（スクロール）を無効化
    }
});


//左右移動&回転
window.addEventListener("keydown", (event) =>{
    let key = event.key;
    //右へ
    if(key === "l" || key === "ArrowRight" || key === "d"){
        if (canMoveRight()){
            blockX++;
            requestAnimationFrame(drawBoard);
        }
        //左へ
    }if (key === "j" || key === "ArrowLeft" || key === "a"){
        if (canMoveLeft()){
            blockX--;
            requestAnimationFrame(drawBoard);
        }
    //急降下
    }else if(key === "," || key === " " || key === "w" || key === "ArrowUp"){
        HardDrop();
    //上へ（チート）
    }else if(key === "I"){
        blockY--;
        requestAnimationFrame(drawBoard);
    //下へ
    }else if(key === "k" || key === "ArrowDown" || key === "s"){
        if (canMoveDown()){
            blockY++;
            requestAnimationFrame(drawBoard);
        }else{
            placeblock();
            spawnBlock();
        }
    //右回転
    }else if(key === "u"){
        RotateShape();
        RotateShape();
        RotateShape();
    //左回転
    }else if(key === "o"){
        RotateShape();
    //スポーン（チート）
    }else if(key === "S"){
        spawnBlock();
    }else if(key === "h"){
        if (holdBlock === undefined){
            holdBlock = blocktype;
            blocktype = block.shift();
            current_shape = blocktype.shape;
            blockX = 4;
            blockY = 0;
            drawHoldBlock();
        }else{
            let temp = holdBlock;
            holdBlock = blocktype;
            blocktype = temp;
            current_shape = blocktype.shape;
            blockX = 4;
            blockY = 0;
        }
        requestAnimationFrame(drawBoard);
        requestAnimationFrame(drawHoldBlock);
    }else if(key === "r"){
        reset();
    }
})

//モバイル対応

function preventLongPressMenu(elementId) {
    const element = document.getElementById(elementId);
    
    element.addEventListener("touchstart", (event) => {
        event.preventDefault(); // 長押しメニューを防ぐ
        element.click(); // クリック処理を実行
    }, { passive: false });  
}

// クリックイベント（PC・スマホ共通）
document.getElementById("ArrowLeft").addEventListener("click", () => {
    if (canMoveLeft()){
        blockX--;
        requestAnimationFrame(drawBoard);
    }
});

document.getElementById("ArrowRight").addEventListener("click", () => {
    if (canMoveRight()){
        blockX++;
        requestAnimationFrame(drawBoard);
    }
});

document.getElementById("ArrowDown").addEventListener("click", () => {
    if (canMoveDown()){
        blockY++;
        requestAnimationFrame(drawBoard);
    } else {
        placeblock();
        spawnBlock();
    }
});

document.getElementById("RotateLeft").addEventListener("click", () => {
    RotateShape();
    RotateShape();
    RotateShape();
});

document.getElementById("RotateRight").addEventListener("click", () => {
    RotateShape();    
});

document.getElementById("HardDrop").addEventListener("click", () => {
    HardDrop();
});
document.getElementById("HoldBtn").addEventListener("click", () => {
    if (holdBlock === undefined){
        holdBlock = blocktype;
        blocktype = block.shift();
        current_shape = blocktype.shape;
        blockX = 4;
        blockY = 0;
        drawHoldBlock();
    }else{
        let temp = holdBlock;
        holdBlock = blocktype;
        blocktype = temp;
        current_shape = blocktype.shape;
        blockX = 4;
        blockY = 0;
    }
    requestAnimationFrame(drawBoard);
    requestAnimationFrame(drawHoldBlock());
}
);

// 長押しを防ぐ処理を追加
preventLongPressMenu("ArrowLeft");
preventLongPressMenu("ArrowRight");
preventLongPressMenu("ArrowDown");
preventLongPressMenu("RotateLeft");
preventLongPressMenu("RotateRight");
preventLongPressMenu("HardDrop");
preventLongPressMenu("HoldBtn");


//1回だけ表示
requestAnimationFrame(drawBoard);



//モード変更
document.getElementById("marason").addEventListener("click", () => {
    speed = 1000;
    mode = "marason";
    document.getElementById("mode").innerHTML = "現在のモード: マラソン";
    document.getElementById("level").innerHTML = "現在のレベル: 0";
    reset();
});
//モード変更
document.getElementById("endless").addEventListener("click", () => {
    mode = "endless";
    document.getElementById("mode").innerHTML = "現在のモード: エンドレス";
    document.getElementById("level").innerHTML = "";
    reset();
})

//reset
function reset(){
    //ボードを初期化
    board = [];
    for (let row = 0; row < 20; row++) {
        board[row] = [];
        for (let col = 0; col < 10; col++) {
            board[row][col] = "0";
        }
    }
    score = 0;
    document.getElementById("score").innerHTML = "現在のスコア: 0ライン" 
    Firstblock = 0;
    spawnBlock();
    //現在のブロックを初期化
    //ブロック座標を初期化
    speed = document.getElementById("SPEED").value
    level = 0;
    holdBlock = undefined;
    requestAnimationFrame(drawHoldBlock);
    clearInterval(gameloop)
    if (mode==="endless"){
        gameloop = setInterval(update, speed);
    }else if (mode==="marason"){
    speed = 1000 * 0.8 ** level;
        gameloop = setInterval(update, speed);
        document.getElementById("level").innerHTML = "現在のレベル: 0";
    }
    //ボードを表示
    drawBoard();
}

// ページ読み込み後にスクロール位置を設定
window.onload = function() {
    window.scrollTo(500, 0);
  };

//reset
document.getElementById("reset").addEventListener("click", () => {
    reset();
})
document.getElementById("setSpeed").addEventListener("click", () => {
    reset();
})