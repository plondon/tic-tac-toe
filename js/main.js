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


var reset = function() {
	this.choices = [];
	arr = [];
};

var minimax = function(board) {
	if ( window.first ) { powerMove(); return; }
	if ( gameOver(board) || gameOver(board) === 0 ) {
		var score = this.winner === window.activePlayer ? gameOver(board) : -gameOver(board);
		return score;
	}

	getPossibleMoves(board).forEach(function(move) {
		var game = getGameState(board, move);
		var result = minimax(game);

		if ( result ) {
			this.choices.push([result, move, window.turn]);
		}
	});

	if ( window.turn === window.activePlayer ) {
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

};

var getPossibleMoves = function(board) {
	for (var a=[],i=board.length;i--;) if (board[i]==="") a.push(i);
	return a.reverse();  
};

var getGameState = function(board, idx) {
	var clone = board.slice(0);

	if ( window.turn === window.activePlayer ) {
		window.turn = window.inactivePlayer;
	} else {
		window.turn = window.activePlayer;
	}

	clone[idx] = window.turn;
	return clone;
};

var getBoard = function($board) {
	return $board.find('li').map(function() { return $(this).text(); }).get();
};

var powerMove = function() {
	var powerMoves = [0,2];

	var random = powerMoves[Math.floor(Math.random()*powerMoves.length)];
	$($('.board').find('li')[random]).text(window.activePlayer);

	window.first = false;
};