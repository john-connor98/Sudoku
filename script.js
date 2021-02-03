var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]

const sudoku_init = () => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var input = document.getElementsByTagName('input')[i*9 + j];
            input.disabled = true;
            input.value = "";
            arr[i][j] = 0;
        }
    }
};
window.addEventListener('load', e => {
    e.stopImmediatePropagation(); 
    sudoku_init();
});

var board = [[], [], [], [], [], [], [], [], []]

const renderloader = () => {
    let loader = document.querySelector('.loader');
    loader.style.visibility = 'visible';
};

const clearloader = () => {
    let loader = document.querySelector('.loader');
    loader.style.visibility = 'hidden';
};

const sudoku_generator = async () => {
    var xhrRequest = new XMLHttpRequest();
    return new Promise (function() {
        xhrRequest.onload = function () {
            var response = JSON.parse(xhrRequest.response);

            board = response.board;
            clearloader();
            changeBoard(board);
        }

        xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy');
        //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
        xhrRequest.send();
    });
};

const changeBoard = (board) => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var input = document.getElementsByTagName('input')[i*9 + j];
            if (board[i][j] == 0) {
                input.disabled = false;
                input.value = "";
            }
            else {
                input.disabled = true;
                input.value = board[i][j];
            }
        }
    }
};   

let button = document.getElementById('generate-sudoku');
button.addEventListener('click', e = async () => {
    renderloader();
    await sudoku_generator();        
});


const verify = (input) => {
    if (input.value[0] < "1" || input.value[0] > "9") {
        if (input.value != "?" && input.value != "؟") {
            input.value = "";
            alert("Only numbers (1-9) and question mark '?' are allowed!!");
            input.focus()
        }
    }
};

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        var input = document.getElementsByTagName('input')[i*9 + j];
        input.addEventListener('onchange', verify(input));
    }
}

const isPossible = (board, sr, sc, val) => {
    for (var row = 0; row < 9; row++) {
        if (board[row][sc] == val) {
            return false;
        }
    }

    for (var col = 0; col < 9; col++) {
        if (board[sr][col] == val) {
            return false;
        }
    }

    var r = sr - sr % 3;
    var c = sc - sc % 3;

    for (var cr = r; cr < r + 3; cr++) {
        for (var cc = c; cc < c + 3; cc++) {
            if (board[cr][cc] == val) {
                return false;
            }
        }
    }
    return true;
};

const solveSudokuHelper = (board, sr, sc) => {
    if (sr == 9) {
        changeBoard(board);
        return;
    }
    if (sc == 9) {
        solveSudokuHelper(board, sr + 1, 0)
        return;
    }

    if (board[sr][sc] != 0) {
        solveSudokuHelper(board, sr, sc + 1);
        return;
    }

    for (var i = 1; i <= 9; i++) {
        if (isPossible(board, sr, sc, i)) {
            board[sr][sc] = i;
            solveSudokuHelper(board, sr, sc + 1);
            board[sr][sc] = 0;
        }
    }
};

const solveSudoku = (board) => {
    solveSudokuHelper(board, 0, 0)
}

let solve = document.getElementById('solve')
solve.addEventListener('click', e => {
    solveSudoku(board)
});
