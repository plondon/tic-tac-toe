$(document).ready(function() {
	var game = new Game();

	$('.modal button').on('click', function(e) {
		game.init(e);
	});

	$('.board li').on('click', function(e) {
		game.humanMove(e);
	});
});

var Game = function() {
	this.$body = $('body');
	this.$modal = $('.modal');
	this.$board = $('.board');
	this.$cells = $('.board li');
	this.winner = undefined;
	this.$modal.show();
	this.first = true;
	this.w = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[6, 4, 2]
	];

	this.init = function(e) {
		var $this = $(e.currentTarget);
		this.$body.removeClass('overlay');
		this.$modal.hide();

		if ( $this.index() === 0 ) {
			this.computer = 'x';
			this.player = 'o';
			this.compMove();
		} else {
			this.player = 'x';
			this.computer = 'o';
		}
	};

	this.humanMove = function(e) {
		if ( this.busy ) { return; }
		var $this = $(e.currentTarget);

		if ( $this.is(':empty') ) {
			$this.text(this.player);
			this.first = false;
			this.compMove();
		} else {
			return false;
		}
	};

	this.compMove = function() {
		var idx;
		var self = this;
		this.busy = true;
		if (this.first) {
			idx = [0, 2, 6, 8][Math.floor(Math.random()*4)];
		} else if (this.fatal()) {
			idx = this.fatal(this.computer);
		} else {
			idx = this.bestMove(this.$cells);
		}

		this.populate(idx, this.computer);
		setTimeout(function() { self.gameOver(); }, 1000);
		this.busy = false;
	};
	this.fatal = function() {
		for ( var i = 0; i < 8; i++ ) {
			var x = [];
			for ( var j = 0; j < 3; j++ ) {
				x.push(this.$cells[this.w[i][j]]);
			}
			var e = x.filter(function(cell) {
				return $(cell).is(':empty');
			});
			var f = x.filter(function(cell) {
				return !$(cell).is(':empty');
			});
			if ( e.length == 1 &&
					 this.computer == $(f).first().text() &&
				   this.computer == $(f).last().text()) {
				this.populate($(e).index(), this.computer);
				return true;
			} else if (e.length == 1 &&
					 this.player == $(f).first().text() &&
				   this.player == $(f).last().text()) {
				this.populate($(e).index(), this.computer);
				return true;
			}
		}
	};

	this.bestMove = function($cells) {
		var self = this;
		var bestMove;

		$cells = $cells.filter(function() {
			return $(this).is(':empty');
		});

		if (this.fork()) {
			$(this.$cells[1]).data('score', 40);
		}

		$cells.sort(function(a,b) {
			return ($(a).data('score')) < ($(b).data('score')) ? 1 : -1;    
		});

		return $cells.first().index();
	};

	this.fork = function() {
		for ( var i = 0; i < 8; i++ ) {
			var x = [];
			for ( var j = 0; j < 3; j++ ) {
				x.push(this.$cells[this.w[i][j]]);
			}
			var f = x.filter(function(cell) {
				return !$(cell).is(':empty');
			}).map(function(cl) {
				return $(cl).text();
			});

			if (f.toString() == ["x", "o", "x"].toString()) {
				return true;
			}
		}
	};

	this.populate = function(idx, player) {
		var self = this;
		setTimeout(function() {
			$(self.$cells[idx]).text(player);
		}, 500);
	};

	this.gameOver = function() {
		for ( var i = 0; i < 8; i++ ) {
			var x = [];
			for ( var j = 0; j < 3; j++ ) {
				x.push(this.$cells[this.w[i][j]]);
			}
			var f = x.filter(function(cell) {
				return !$(cell).is(':empty');
			});
			if ( f.length == 3 &&
					 $(f[0]).text() === this.computer &&
					 $(f[1]).text() === this.computer &&
					 $(f[2]).text() === this.computer) {
				alert('computer wins');
			}
		}
	};
};

