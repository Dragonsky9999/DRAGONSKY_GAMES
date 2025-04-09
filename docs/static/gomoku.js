//width: 1080
//Height: 632
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const data = {
    "board": [
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
        ["","","","","","","","","","","","","","",""], 
    ],
    "turn": "X"
}
let board = data.board
let turn = data.turn


//ボードを作る関数
function draw_board() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle =  "rgba(233, 147, 35, 0.8)";
    for (let i=0; i<board.length-1; i++){
        for (let j=0; j<board.length-1; j++){
        ctx.fillRect(20+(j*50),20+(i*50),50,50);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "2";
        ctx.strokeRect(20+(j*50),20+(i*50),50,50);
    }}
    }
//最初一回だけ表示
draw_board();

//⚫️を作る関数
function draw_kuro(row, col){
          ctx.beginPath();
          ctx.fillStyle = "#000000"
          ctx.arc(20+50*col, 20+50*row, 20, 0, Math.PI * 2 )
          ctx.fill()
};

//⚪️を作る関数
function draw_siro(row, col){
          ctx.beginPath();
          ctx.fillStyle = "#ffffff"
          ctx.arc(20+50*col, 20+50*row, 20, 0, Math.PI * 2 )
          ctx.fill()
};

//ボード情報を入手し、⭕️❌をつける関数
function set(){
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board.length; j++){
            if (board[i][j] == "X"){
                draw_batu(i, j);
            }else if (board[i][j] == "O"){
                draw_kuro(i, j);
            }else{
                continue;
            }
        }
    }
}
set()

//リセット
function reset(){
    draw_board()
    board = [
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
          ["","","","","","","","","","","","","","",""], 
    ]
}

document.getElementById("reset").addEventListener("click", () => {
    reset();
})

//gpt
function checkwin(board) {
    let size = board.length;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            // 横（→）のチェック
            if (j <= size - 5) {
                let row = board[i][j] + board[i][j+1] + board[i][j+2] + board[i][j+3] + board[i][j+4];
                if (row === "XXXXX"){ 
                    reset();
                    return window.alert("⚫️の勝利！！！！！！");
                }
                if (row === "OOOOO"){ 
                    reset();
                    return window.alert("⚪️の勝利！！！！！！");
                }
            }

            // 縦（↓）のチェック
            if (i <= size - 5) {
                let col = board[i][j] + board[i+1][j] + board[i+2][j] + board[i+3][j] + board[i+4][j];
                if (col === "XXXXX"){ 
                    reset();
                    return window.alert("⚫️の勝利！！！！！！");
                }
                if (col === "OOOOO"){ 
                    reset();
                    return window.alert("⚪️の勝利！！！！！！");
                }
            }

            // 斜め右下（↘）のチェック
            if (i <= size - 5 && j <= size - 5) {
                let diag1 = board[i][j] + board[i+1][j+1] + board[i+2][j+2] + board[i+3][j+3] + board[i+4][j+4];
                if (diag1 === "XXXXX"){ 
                    reset();
                    return window.alert("⚫️の勝利！！！！！！");
                }
                if (diag1 === "OOOOO"){ 
                    reset();
                    return window.alert("⚪️の勝利！！！！！！");
                }
            }

            // 斜め左下（↙）のチェック
            if (i <= size - 5 && j >= 4) {
                let diag2 = board[i][j] + board[i+1][j-1] + board[i+2][j-2] + board[i+3][j-3] + board[i+4][j-4];
                if (diag2 === "XXXXX"){ 
                    reset();
                    return window.alert("⚫️の勝利！！！！！！");
                }
                if (diag2 === "OOOOO"){ 
                    reset();
                    return window.alert("⚪️の勝利！！！！！！");
                }
            }
        }
    }
}

//クリックしたら、そこが⭕️or❌になる
let row
let col
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;


    for (let i=0; i<board.length; i++){
        if (mouseY>=50*i && mouseY<=40+50*i){
            for (let j=0; j<board.length; j++){
                if (mouseX>=50*j && mouseX<=40+50*j){
                   if (board[i][j]==""){ 
                        if (turn == "X"){
                            draw_kuro(i, j);
                            board[i][j] = "X"
                            turn = "O";
                            document.getElementById("turn").textContent = "現在のプレイヤー: ⚪️";
                            checkwin(board);
                        }else if (turn == "O"){
                            draw_siro(i, j);
                            board[i][j] = "O";
                            turn = "X";
                            document.getElementById("turn").textContent = "現在のプレイヤー: ⚫️";
                            checkwin(board);
                        }
                    }else{
                        window.alert("そこには置けません！！！！！！！！")
                    }
                }                    
            } 
        }
    }
})
