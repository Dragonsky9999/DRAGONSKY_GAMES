let canvas;
let ctx;

let boardSize = document.getElementById("boardSize").valueAsNumber;
const createBoard = (size) => Array.from( { length: size }, () => Array(size).fill(""))
let board =  createBoard(boardSize);

let gridSize = document.getElementById("gridSize").valueAsNumber;

const keys = {};
const keyHandled = {};

let gameover = false;

let score = 0;
const scoreDisplay = document.getElementById("score");

let startX, startY;
let trackingId = null;

let canvasWidth = (gridSize + 20) * board.length;
let canvasHeight = (gridSize + 20) * board.length;

function drawBoard(board){
    
    for (let row = 0; row < board.length; row++){
        for (let col = 0; col < board[row].length; col++){
            const num = board[row][col];
            const x = col*gridSize*1.2;
            const y = row*gridSize*1.2;

            //grid
            ctx.beginPath()
            ctx.strokeRect(x, y, gridSize, gridSize);
            
            const centerX = x + gridSize / 2;
            const centerY = y + gridSize / 2;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "48px serif";
             
            //number
            if (num){
                ctx.beginPath()
                ctx.fillText(num, centerX, centerY);           
            }
        }
    }
}

function keyHandle(){
    document.addEventListener("keydown", (e) => {
        if (document.activeElement.tagName === "INPUT") return;
        e.preventDefault();
        keys[e.key] = true;
    })

    document.addEventListener("keyup", (e) => {
        if (document.activeElement.tagName === "INPUT") return;
        e.preventDefault();
        keys[e.key] = false;
        keyHandled[e.key] = false;
    })

    canvas.addEventListener("touchstart", (e) => {
        if (document.activeElement.tagName === "INPUT") return;
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        trackingId = touch.identifier;
    })

    canvas.addEventListener("touchend", (e) => {
        if (document.activeElement.tagName === "INPUT") return;
        e.preventDefault();
        for (const touch of e.changedTouches){
            if (touch.identifier !== trackingId) break;
            const endX = touch.clientX;
            const endY = touch.clientY;
            
            const dy = endY - startY;
            const dx = endX - startX;
            
            if (Math.abs(dy) < 30 && Math.abs(dx) < 30) return;
            
            if (Math.abs(dy) > Math.abs(dx)){
                if (dy > 0) {
                    keys["ArrowDown"] = true;
                    keyHandled["ArrowDown"] = false;
                    
                }
                else if (dy < -0) {
                    keys["ArrowUp"] = true;
                    keyHandled["ArrowUp"] = false;
                    
                }
            }else if (Math.abs(dx) > Math.abs(dy)){
                if (dx > 0) {
                    keys["ArrowRight"] = true;
                    keyHandled["ArrowRight"] = false;
                    
                }
                else if (dx < -0) {
                    keys["ArrowLeft"] = true;
                    keyHandled["ArrowLeft"] = false;
                    
                }
            } 
        }
    })
}

function setup(){
    let randomInt1;
    let randomInt2;
    const max = boardSize * boardSize;
    
    while (randomInt1 == randomInt2){
        randomInt1 = Math.floor(Math.random() * max);
        randomInt2 = Math.floor(Math.random() * max);
    }
    
    board[Math.floor(randomInt1/boardSize)][randomInt1%boardSize] = Math.random() > 0.1 ? "2" : "4";
    board[Math.floor(randomInt2/boardSize)][randomInt2%boardSize] = Math.random() > 0.1 ? "2" : "4";
    
}

function randomGenerate(){
    const max = boardSize * boardSize;
    let randomInt = Math.floor(Math.random() * max);
    while (board[Math.floor(randomInt/boardSize)][randomInt%boardSize] !== "") {
        randomInt = Math.floor(Math.random() * max);
    }
    board[Math.floor(randomInt/boardSize)][randomInt%boardSize] = Math.random() > 0.1 ? "2" : "4";
}

function checkGameOver(){
    for (let row = 0; row < board.length; row++){
        for (let col = 0; col < board[row].length; col++){
            if (board[row][col] === "") return false;

            const current = board[row][col];
            if (row>0 && board[row-1][col] === current) return false;
            if (row<board.length-1  && board[row+1][col] === current) return false;
            if (col>0 && board[row][col-1] === current) return false;
            if (col<board[row].length-1 && board[row][col+1] === current) return false;

        }
    }

    gameover = true;
    return true;
}

function moveLeft(){
    for (let row = 0; row < board.length; row++){
        let newRow = [];
        for (let col = 0; col < board[row].length; col++){
            const val = board[row][col];
            if (val !== "") newRow.push(val);

        }


        for (let i=0; i<newRow.length - 1; i++){
            if (newRow[i] == newRow[i+1]){
                const newNum = parseInt(newRow[i]) * 2;
                newRow[i] = newNum.toString();
                newRow[i+1] = null;
                score += newNum;
                scoreDisplay.textContent = score;
            }
        }

        newRow = newRow.filter(n => n !== null);

        while (newRow.length < boardSize){
            newRow.push("");
        }
        board[row] = newRow;
    }
}

function moveRight(){
    for (let row = 0; row < board.length; row++){
        let newRow = [];
        for (let col = board.length - 1; col >= 0; col--){
            const val = board[row][col];
            if (val !== "") newRow.unshift(val);

        }

        for (let i=newRow.length; i>0; i--){
            if (newRow[i] == newRow[i-1]){
                const newNum = parseInt(newRow[i]) * 2;
                newRow[i] = newNum.toString();
                newRow[i-1] = null;
                score += newNum;
                scoreDisplay.textContent = score;
            }
        }

        newRow = newRow.filter(n => n !== null);

        while (newRow.length < boardSize){
            newRow.unshift("");
        }
        board[row] = newRow;
    }
}

function moveUp(){
    for (let col = 0; col < board.length; col++){
        let newCol = [];
        for (let row = 0; row < board.length; row++){
            const val = board[row][col];
            if (val !== "") newCol.push(val);

        }

        for (let i=0; i<newCol.length - 1; i++){
            if (newCol[i] == newCol[i+1]){
                const newNum = parseInt(newCol[i]) * 2;
                newCol[i] = newNum.toString();
                newCol[i+1] = null;
                score += newNum;
                scoreDisplay.textContent = score;
            }
        }

        newCol = newCol.filter(n => n !== null);
        
        while (newCol.length < boardSize){
            newCol.push("");
        }
        for (let i = 0; i < newCol.length; i++){
            board[i][col] = newCol[i];
        }
    }
}

function moveDown(){
    for (let col = 0; col < board.length; col++){
        let newCol = [];
        for (let row = board.length - 1; row >= 0; row--){
            const val = board[row][col];
            if (val !== "") newCol.unshift(val);

        }

        for (let i=newCol.length; i>0; i--){
            if (newCol[i] == newCol[i-1]){
                const newNum = parseInt(newCol[i]) * 2;
                newCol[i] = newNum.toString();
                newCol[i-1] = null;
                score += newNum;
                scoreDisplay.textContent = score;
            }
        }

        newCol = newCol.filter(n => n !== null);

        while (newCol.length < boardSize){
            newCol.unshift("");
        }
        for (let i = 0; i < newCol.length; i++){
            board[i][col] = newCol[i];
        }
    }
}


function gameLoop(){
    if (gameover) return;

    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawBoard(board);

    let oldBoard = JSON.stringify(board);
    if (keys["ArrowLeft"] && !keyHandled["ArrowLeft"]){
        keyHandled["ArrowLeft"] = true;
        moveLeft();
        checkGameOver();;
    }else if (keys["ArrowRight"] && !keyHandled["ArrowRight"]){
        keyHandled["ArrowRight"] = true;
        moveRight();
        checkGameOver();
    }else if (keys["ArrowUp"] && !keyHandled["ArrowUp"]){
        keyHandled["ArrowUp"] = true;
        moveUp();
        checkGameOver();
    }else if (keys["ArrowDown"] && !keyHandled["ArrowDown"]){
        keyHandled["ArrowDown"] = true;
        moveDown();
        checkGameOver();
    }
    
    //チート
    else if (keys["+"] && !keyHandled["+"]){
        keyHandled["+"] = true;
        for (let row = 0; row<board.length; row++){
            for (let col = 0; col<board[row].length; col++){
                if (board[row][col] == "") continue;
                const newNum = parseInt(board[row][col]) * 2;
                board[row][col] = newNum.toString();
            }
        }
    }else if (keys["S"] && !keyHandled["S"]){
        keyHandled["S"] = true;
        score *= 2;
        scoreDisplay.textContent = score;
    }

    let newBoard = JSON.stringify(board);

    if (oldBoard !== newBoard) randomGenerate();
    
    if (gameover){
        showPopup();
        return;
    }

    gameAnimation = requestAnimationFrame(gameLoop);
}

function main(){
    
    reset();
    setup();
    keyHandle();
    requestAnimationFrame(gameLoop);
}

//ポップアップ
function showPopup(){
    const popup = document.getElementById("popup");
    const scoreText = document.getElementById("scoreText");
    scoreText.textContent = `Score: ${score} 点`;
    popup.classList.remove("hidden");
}

let openGame = false;

function reset(){
    const parentCanvas = document.getElementById("parentCanvas");
    const oldCanvas = document.getElementById("canvas");
    if (oldCanvas){
        oldCanvas.remove();
    }
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "canvas";
    parentCanvas.appendChild(newCanvas);

    boardSize = document.getElementById("boardSize").valueAsNumber;
    gridSize = document.getElementById("gridSize").valueAsNumber;
    canvasWidth = (gridSize + 20) * boardSize;
    canvasHeight = (gridSize + 20) * boardSize;
    
    newCanvas.width = canvasWidth;
    newCanvas.height = canvasHeight;
    canvas = newCanvas;
    ctx = newCanvas.getContext("2d");
    ctx.lineWidth = 5;
    board =  createBoard(boardSize);
    gameover = false;
    score = 0;
    scoreDisplay.textContent = 0;
    document.getElementById("popup").classList.add("hidden");

}

function closeGame(){
    openGame = false;
    cancelAnimationFrame(gameLoop);
    gameover = false;
    score = 0;
    
    //キャンバスそのものを削除
    document.getElementById("canvas").remove();
    //ポップアップを隠す
    document.getElementById("popup").classList.add("hidden");
}

const StartBtns = document.querySelectorAll(".StartBtns")
StartBtns.forEach(StartBtn => {
    StartBtn.addEventListener("click", main)
})

document.getElementById("reset").addEventListener("click", () => {
    reset();
    main();
})

document.getElementById("close").addEventListener("click", closeGame)
