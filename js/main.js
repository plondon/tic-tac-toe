$(document).ready(function() {
	var game = new Game();

	$('.modal button').on('click', function(e) {
		game.init(e);
	});

	$('.board li').on('click', function(e) {
		game.populate(e);
	});
});

var Game = function() {
	this.$body = $('body');
	this.$modal = $('.modal');
	this.$board = $('.board');
	this.$cells = $('.board li');
	this.$modal.show();

	this.init = function(e) {
		var $this = $(e.currentTarget);
		this.$body.removeClass('overlay');
		this.$modal.hide();

		this.rows = [this.$cells.slice(0,3),
								 this.$cells.slice(3,6),
								 this.$cells.slice(6,9)];

		this.cols = [$('.board li:nth-child(3n+1)'),
								 $('.board li:nth-child(3n+2)'),
								 $('.board li:nth-child(3n+3)')];

		this.diags = [$('.board li:nth-child(4n + 1)'),
									$([this.$cells[2], this.$cells[4], this.$cells[6]])];

		if ( $this.index() === 0 ) {
			this.computer = 'x';
			this.player = 'o';
			this.move();
		} else {
			this.player = 'x';
			this.computer = 'o';
		}

		this.first = true;
	};

	this.analyzeBoard = function() {
		var self = this;

		this.rows.forEach(function(row) {
			var string = self.formString(row);
			self.checkWinner(string);
		});
		this.cols.forEach(function(col) {
			var string = self.formString(col);
			self.checkWinner(string);
		});
		this.diags.forEach(function(diag) {
			var string = self.formString(diag);
			self.checkWinner(string);
		});
	};

	this.formString = function(dir) {
		var string = dir.map(function(){ 
			return $(this).text();
		}).get().join();

		return string;
	};

	this.checkWinner = function(string) {
		if ( (string === 'x,x,x' && this.computer == 'x' ) ||
			(string === 'o,o,o' && this.computer == 'o' )) {
			setTimeout(function() {
				alert('Computer Wins');
				var w = window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
			}, 500);
		}
	};

	this.canWin = function() {
		for ( var i = 0; i < 3; i++ ) {
			if (this.rowState[i].length < 3 &&
					this.rowState[i].length >= 2 &&
					this.rowState[i][0] == this.computer &&
					this.rowState[i][0] == this.rowState[i][1]) {
				this.win(this.rows, i);
				return true;
			} else if (this.colState[i].length < 3 &&
					this.colState[i].length >= 2 && 
				  this.colState[i][0] == this.computer &&
				  this.colState[i][0] == this.colState[i][1]) {
				this.win(this.cols, i);
				return true;
			} else if (this.diagState[i] && 
					this.diagState[i].length < 3 &&
					this.diagState[i].length >= 2 && 
				  this.diagState[i][0] == this.computer &&
				  this.diagState[i][0] == this.diagState[i][1]) {
				this.win(this.diags, i);
				return true;
			} else {
				return false;
			}
		}
	};

	this.win = function(dir, i) {
		$(dir[i]).filter(function() {
			return $(this).is(':empty');
		}).text(this.computer);
	};

	this.defense = function() {
		for ( var i = 0; i < 3; i++ ) {
			if (this.rowState[i].length < 3 &&
					this.rowState[i].length >= 2 &&
					this.rowState[i][0] == this.player &&
					this.rowState[i][0] == this.rowState[i][1]) {
				this.defend(this.rows, i);
				return true;
			} else if (this.colState[i].length < 3 &&
					this.colState[i].length >= 2 && 
				  this.colState[i][0] == this.player &&
				  this.colState[i][0] == this.colState[i][1]) {
				this.defend(this.cols, i);
				return true;
			} else if (this.diagState[i] && 
					this.diagState[i].length < 3 &&
					this.diagState[i].length >= 2 && 
				  this.diagState[i][0] == this.player &&
				  this.diagState[i][0] == this.diagState[i][1]) {
				this.defend(this.diags, i);
				return true;
			}
		}
	};

	// same function as win (should change)
	this.defend = function(dir, i) {
		$(dir[i]).filter(function() {
			return $(this).is(':empty');
		}).text(this.computer);
	};

	this.offense = function() {
		var self = this;
		if ( self.first && self.computer === 'o' ) {
			this.$cells.each(function() {
				if ( $(this).data('score') >= 20 && $(this).is(':empty')  ) {
					$(this).text(self.computer);
					return false;
				}
				else {
					if ( $(this).data('score') >= 10 && $(this).is(':empty') ) {
						$(this).text(self.computer);
						return false;
					}
				}
			});
		} else {
			this.$cells.each(function() {
				if ( $(this).data('score') >= 10 && $(this).is(':empty') ) {
					$(this).text(self.computer);
					return false;
				}
			});
		}

		this.first = false;
	};

	this.move = function() {
		this.busy = true;

		this.getStates();

		if (this.canWin() ) {
			this.analyzeBoard();
			return false;
		} else if (this.defense()) { 
		} else {
			this.offense();
		}

		this.analyzeBoard();

		this.busy = false;
	};

	this.getStates = function() {
		this.rowState = [];
		this.colState = [];
		this.diagState = [];
		var self = this;

		this.rows.forEach(function(row) {
			var state = row.map(function() {
				if ( $(this).text().length ) {
					return $(this).text();
				}
			});
			self.rowState.push(state);
		});

		this.cols.forEach(function(col) {
			var state = col.map(function() {
				if ( $(this).text().length ) {
					return $(this).text();
				}
			});
			self.colState.push(state);
		});

		this.diags.forEach(function(diag) {
			var state = diag.map(function() {
				if ( $(this).text().length ) {
					return $(this).text();
				}
			});
			self.diagState.push(state);
		});
	};

	this.populate = function(e) {
		if ( this.busy ) { return; }
		var $this = $(e.currentTarget);

		if ( !$this.is(':empty') ) {
			return false;
		} else {
			$this.text(this.player);
			this.move();
		}
	};
};

