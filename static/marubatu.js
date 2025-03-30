//width: 1080
//Height: 632
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const data = {
    "board": [
        ["","",""],  //変えるとこ
        ["","",""],
        ["","",""]
    ],
    "turn": "X"
}
let board = data.board
let turn = data.turn


//ボードを作る関数
function draw_board() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle =  "#ffffff";
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board.length; j++){
        ctx.fillRect(0+(j*160),0+(i*160),150,150);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "2";
        ctx.strokeRect(0+(j*160),0+(i*160),150,150);
    }}
    }
draw_board();

//⭕️を作る関数
function draw_maru(row, col){
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#ff0000"
    ctx.arc(75+160*col, 75+160*row, 60, 0, Math.PI * 2 )
    ctx.stroke()
};

//❌を作る関数
function draw_batu(row, col){
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#0000ff";
    ctx.moveTo(15+160*col, 15+160*row);
    ctx.lineTo(135+160*col, 135+160*row);
    ctx.stroke();
    ctx.moveTo(135+160*col, 15+160*row);
    ctx.lineTo(15+160*col, 135+160*row);
    ctx.stroke();
}

//ボード情報を入手し、⭕️❌をつける関数
function set(){
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board.length; j++){
            if (board[i][j] == "X"){
                draw_batu(i, j);
            }else if (board[i][j] == "O"){
                draw_maru(i, j);
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
        ["","",""],  //変えるとこ
        ["","",""],
        ["","",""],
    ]
}

document.getElementById("reset").addEventListener("click", () => {
    reset();
})

//boardが全部埋まっているか判定
function boardisfull(board){
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board[i].length; j++)
            if (board[i][j] === ""){
                return false;
            }
    }
    return true;
}

//正解判定
function checkwin(board){     //変えるとこ
    let lines = [
        board[0].join(""),board[1].join(""),board[2].join(""),//board[3].join(""),
        board[0][0] + board[1][0] + board[2][0] /*+ board[3][0]*/,
        board[0][1] + board[1][1] + board[2][1] /*+ board[3][1]*/,
        board[0][2] + board[1][2] + board[2][2] /*+ board[3][2]*/,
        //board[0][3] + board[1][3] + board[2][3] /*+ board[3][3]*/,
        board[0][0] + board[1][1] + board[2][2] /*+ board[3][3]*/,
        //board[0][3] board[1][2] + board[2][1] /*+ board[3][0]*/
        board[0][2] + board[1][1] + board[2][0]
    ];
    if (lines.includes("XXX")){
        window.alert("❌の勝利！！！！！");
        reset();
    }else if (lines.includes("OOO")){
        window.alert("⭕️の勝利！！！！！");
        reset();
    }else if(boardisfull(board)){
        alert("ゲーム終了！全てのマスが埋まりました！");
        reset();
    }
    console.log(lines)
}

//クリックしたら、そこが⭕️or❌になる
let row
let col
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;


    for (let i=0; i<board.length; i++){
        if (mouseY>=0+160*i && mouseY<=150+160*i){
            for (let j=0; j<board.length; j++){
                if (mouseX>=0+160*j && mouseX<=150+160*j){
                   if (board[i][j]==""){ 
                        if (turn == "X"){
                            draw_batu(i, j);
                            board[i][j] = "X"
                            turn = "O";
                            document.getElementById("turn").textContent = "現在のプレイヤー: ⭕️";
                            checkwin(board);
                        }else if (turn == "O"){
                            draw_maru(i, j);
                            board[i][j] = "O";
                            turn = "X";
                            checkwin(board);
                            document.getElementById("turn").textContent = "現在のプレイヤー: ❌";
                        }
                    }else{
                        window.alert("そこには置けません！！！！！！！！")
                    }
                }                    
            } 
        }
    }
})
