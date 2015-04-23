var emptyBoard = ["","","",
									"","","",
									"","",""];

var winningBoard = ["x","x","x",
										"o","x","o",
										"x","o","o"];

var drawBoard = ["x","o","x",
                 "o","x","o",
                 "o","x","o"];

var winningCombos = [
 										 //horizontal
                     [0,1,2], 
                     [3,4,5],
                     [6,7,8],
                     // vertical
                     [0,3,6],
                     [1,4,7],
                     [2,5,8],
                     // diagonal
                     [0,4,8],
                     [2,4,6]];

var gameOver = function (board) {
	results = [];
	winningCombos.forEach(function (combo) {
		var result = '';
		for (var i = 0; i < 3; i++) {
			result += board[combo[i]];
		};
		results.push(result);
	});

	if ( results.indexOf('xxx') != -1 || 
		   results.indexOf('ooo') != -1 ) {
		return 10;
	} else if (board.join("").length === 9) {
		return 0;
	}
	else {
		return false;
	}
}

var computerPlayer = 0;
var currentPlayer = 1;

this.currentPlayer = currentPlayer;

var minimax = function(board) {
	if ( gameOver(board) ) {
		var score = this.currentPlayer === 1 ? gameOver(board) : -gameOver(board);
	}
	return score;
}

// tests
console.log(gameOver(emptyBoard) != 10);
console.log(gameOver(winningBoard) === 10);
console.log(gameOver(drawBoard) === 0);

console.log('')
console.log(minimax(winningBoard) === 10)