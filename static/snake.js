const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gridSize = 30; //1マス分
let boardSize = document.getElementById("boardSize").value;
let speed = document.getElementById("speed").value;
canvas.width = boardSize*gridSize;
canvas.height = boardSize*gridSize; 
let direction = null;
let board = Array.from({ length:boardSize }, () => Array(boardSize).fill("0"));
let snake = [{ x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) }];
let applePosition = { x: 0, y:0 };
let gameloop;

//boardの表示
function drawBackGround(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

//スネーク描画
function drawSnake(){
    ctx.fillStyle = "rgb(0,150,255)";
    snake.forEach(segement => {
        ctx.fillRect(segement.x * gridSize, segement.y * gridSize, gridSize, gridSize);
    });
}

//リンゴ描画
function drawApple(){
    ctx.fillStyle = "rgb(255, 50, 50)"
    ctx.fillRect(applePosition.x * gridSize, applePosition.y * gridSize, gridSize, gridSize)   
}

//全体の描画
function drawBoard(){
    drawBackGround();
    drawSnake();
    drawApple();
}


//りんごの配置
function spawnApple(){
    emptyCells = []
    for (let row=0; row<boardSize; row++){
        for (let col=0; col<boardSize; col++){
            if (!snake.some(segment => segment.x === col && segment.y === row)){
                emptyCells.push({ x: col, y: row })
            }
        }
    }
    if (emptyCells.length === 0){
        window.alert("COMOLETED!! すごい！！")
        reset();
    }else{
        randomIndex = Math.floor(Math.random() * emptyCells.length);
        applePosition = emptyCells[randomIndex];
    }
    console.log(emptyCells)
}

//スネークの更新
function updata(){
    let head = { ...snake[0] };
    
    if (head.x > 0 || head.x <= boardSize || head.y > 0 || head.y <= boardSize || snake.some(segment => segment.x ===head.x && segment.y === head.y)){
    if (direction === "Up") head.y--;
    else if (direction === "Down") head.y++;
    else if (direction === "Right") head.x++;
    else if (direction === "Left") head.x--;
    }

    if (head.x < 0 || head.x >= boardSize|| head.y < 0 || head.y >= boardSize || snake.slice(1).some(segment => segment.x === head.x && segment.y ===head.y)){
        alert("GEME OVER!!");
        reset();
        return;
    }

    snake.unshift(head)

    //リンゴ食べたか
    if (head.x === applePosition.x && head.y === applePosition.y){
        spawnApple();
    }else{
        snake.pop();
    }
    
    drawBoard();
}

//キーボード入力処理
document.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "ArrowUp" && direction !== "Down") direction = "Up";
    if (key === "ArrowDown" && direction !== "Up") direction = "Down";
    if (key === "ArrowRight" && direction !== "Left") direction = "Right";
    if (key === "ArrowLeft" && direction !== "Right") direction = "Left";
})

//矢印キーを押してもスクロールしない
document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault(); // 矢印キーのデフォルト動作（スクロール）を無効化
    }
});

//reset
function reset(){
    gridSize = 30; //1マス分
    boardSize = document.getElementById("boardSize").value;
    canvas.width = boardSize*gridSize;
    canvas.height = boardSize*gridSize;
    speed = document.getElementById("speed").value;
    clearInterval(gameloop)
    snake = [{ x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) }];
    direction = null;
    board = Array.from({ length:boardSize }, () => Array(boardSize).fill("0"));
    spawnApple();
    drawBoard();
    gameloop = setInterval(updata, speed)
}

document.getElementById("reset").addEventListener("click", () => {
    reset();
})


gameloop = setInterval(updata, speed);