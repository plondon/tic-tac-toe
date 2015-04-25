window.activePlayer = 'x';
window.inactivePlayer = 'o';

this.turn = 'x';

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
		}
		results.push(result);
	});

	if ( results.indexOf('xxx') != -1 ) {
		this.winner = 'x';
		return 10;
	} else if ( results.indexOf('ooo') != -1 ) {
		this.winner = 'o';
		return 10;
	} else if (board.join("").length === 9) {
		return 0;
	} else {
		return false;
	}
};

this.choices = [];
this.moves = [];
var choice;
var freq;
var arr;

var minimax = function(board) {
	if ( gameOver(board) || gameOver(board) === 0 ) {
		var score = this.winner === window.activePlayer ? gameOver(board) : -gameOver(board);
		return score;
	}

	if ( this.turn === window.activePlayer ) {
		freq = {};
		this.choices.forEach(function(choice) {
			freq[choice[1]] = freq[choice[1]] === undefined ? 1 :  freq[choice[1]]+=1;
		});

		arr = Object.keys( freq ).map(function ( key ) { return freq[key]; });

		max = Math.max.apply(null, arr);

		for (var i in freq) {
			if ( freq[i] === max) {
				choice = parseInt(i);
			}
		}
	} else {
		freq = {};
		this.choices.forEach(function(choice) {
			freq[choice[1]] = freq[choice[1]] === undefined ? 1 :  freq[choice[1]]+=1;
		});

		arr = Object.keys( freq ).map(function ( key ) { return freq[key]; });

		min = Math.max.apply(null, arr);

		for (var i in freq) {
			if ( freq[i] === min) {
				choice = parseInt(i);
			}
		}
	}

	getPossibleMoves(board).forEach(function(move) {
		var game = getGameState(board, move);
		var result = minimax(game);

		if ( result ) {
			this.choices.push([result, move, this.turn]);
		}
	});

};

var getPossibleMoves = function(board) {
	for (var a=[],i=board.length;i--;) if (board[i]==="") a.push(i);
	return a.reverse();  
};

var getGameState = function(board, idx) {
	var clone = board.slice(0);

	if ( !this.second ) {
		this.turn = window.activePlayer;
	} else {
		if ( this.turn === window.activePlayer ) {
			this.turn = window.inactivePlayer;
		} else {
			this.turn = window.activePlayer;
		}
	}

	this.second = true;

	clone[idx] = this.turn;
	return clone;
};

minimax(twoMoreToWin);
console.log(choice, window.activePlayer);
