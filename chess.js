// Game configuration contstants
var BOARD_WIDTH = 960;
var BOARD_HEIGHT = 640;
var MARGIN = 20;
var SQUARE_SIZE = ~~((BOARD_HEIGHT - (2 * MARGIN)) / 8);
var WHITE_SQUARE_STYLE = "#FFFFFF";
var BLACK_SQUARE_STYLE = "#000000";
var BORDER_STYLE = "#3404A1";
var PIECE_STYLE = "#20A020";
var PIECE_SIZE = 50;

// Unicode piece strings
var PIECES = {
	"white": {
		"king": "\u2654",
		"queen": "\u2655",
		"rook": "\u2656",
		"bishop": "\u2657",
		"knight": "\u2658",
		"pawn": "\u2659"
	},
	"black": {
		"king": "\u265A",
		"queen": "\u265B",
		"rook": "\u265C",
		"bishop": "\u265D",
		"knight": "\u265E",
		"pawn": "\u265F"
	}
};

/**
 * Chess class
 *
 * @param {HTMLCanvasElement} canvasElement
 * @constructor
 */
var Chess = function(canvasElement) {
	this.__canvas = canvasElement;

	// https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D
	this.__context = canvasElement.getContext("2d");
};

/**
 * Class definition
 */
Chess.prototype = {

	/**
	 * Initialize the game before running
	 *
	 * @public
	 */
	initialize: function initialize() {

		this.__fps = 0;
		this.__ticks = 0;
		this.__lastTime = 0;

		this.__createBoard();

	},

	/**
	 * Create the board data structure
	 *
	 * @private
	 */
	__createBoard: function __createBoard() {

		var squares = {};

		for (var y = 0; y < 8; ++y) {

			squares[y] = {};
			for (var x = 0; x < 8; ++x) {

				var piece = "";

				switch (y) {
					case 0:
						switch (x) {
							case 0:
							case 7:
								piece = PIECES.black.rook;
								break;
							case 1:
							case 6:
								piece = PIECES.black.knight;
								break;
							case 2:
							case 5:
								piece = PIECES.black.bishop;
								break;
							case 3:
								piece = PIECES.black.queen;
								break;
							case 4: 
								piece = PIECES.black.king;
								break;
						}
						break;
					case 1:
						piece = PIECES.black.pawn;
						break;
					case 6:
						piece = PIECES.white.pawn;
						break;
					case 7:
						switch (x) {
							case 0:
							case 7:
								piece = PIECES.white.rook;
								break;
							case 1:
							case 6:
								piece = PIECES.white.knight;
								break;
							case 2:
							case 5:
								piece = PIECES.white.bishop;
								break;
							case 3:
								piece = PIECES.white.queen;
								break;
							case 4: 
								piece = PIECES.white.king;
								break;
						}
						break;
				}
				
				squares[y][x] = {
					y: y,
					x: x,
					piece: piece,
					fill: (x + y) % 2 === 0 ? WHITE_SQUARE_STYLE : BLACK_SQUARE_STYLE
				};

			}
		}

		this.__board = squares;

	},

	/**
	 * Start the game
	 *
	 * @public
	 */
	run: function run() {
		this.__startGameLoop();
	},

	/**
	 * Begin a game loop function using requestAnimationFrame
	 *
	 * @private
	 */
	__startGameLoop: function __startGameLoop() {

		if (! window.requestAnimationFrame) {
			alert("Your browser doesn't support request animation frame!");
			throw new Error("Unsupported environment.  RAF not a function");
		}

		var me = this;
		var previousNow = 0;
		function gameLoop() {
			window.requestAnimationFrame(gameLoop);

			var now = Date.now();
			var dt = now - previousNow;
			me.update(now, dt);
			me.draw(now, dt);
			previousNow = now;
		};

		window.requestAnimationFrame(gameLoop);

	},

	/**
	 * Update callback
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	update: function update(now, dt) {

	},

	/**
	 * Draw callback
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	draw: function draw(now, dt) {
		var ctx = this.__context;

		// Clear everything first
		ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);

		this.__updateFPSCounter(now, dt);
		this.__drawFPSCounter(ctx);

		this.__drawBoard(ctx);

	},

	/**
	 * Update the FPS counter with another tick
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	__updateFPSCounter: function __updateFPSCounter(absoluteTime, dt) {

		if (this.__lastTime === 0) {
			this.__lastTime = absoluteTime;
			return;
		}

		// Reset each ~second
		if (absoluteTime - 1000 > this.__lastTime) {
			this.__ticks = 1;
			this.__lastTime = absoluteTime;
		}

		var frameTime = dt;
		var frameTimeSeconds = dt / 1000;
		var hz = 1 / frameTimeSeconds;

		this.__fps = ((this.__fps * this.__ticks) + hz) / (this.__ticks + 1);
		++this.__ticks;

	},

	/**
	 * Draw the FPS counter
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @private
	 */
	__drawFPSCounter: function __drawFPSCounter(ctx) {

		ctx.font = "15px calibri";
		ctx.fillStyle = "#FF0000";
		ctx.fillText("FPS: " + ~~this.__fps, 5, 17);

	},

	/**
	 * Draw the board
	 * 
	 * @param {CanvasRenderingContext2D} ctx
	 * @private
	 */
	__drawBoard: function __drawBoard(ctx) {

		ctx.translate(0.5 * (BOARD_WIDTH - (8 * SQUARE_SIZE)), MARGIN);

		// Draw a border
		ctx.fillStyle = BORDER_STYLE;
		ctx.fillRect(~~(-MARGIN * 0.5), ~~(-MARGIN * 0.5),
					 ~~(SQUARE_SIZE * 8 + MARGIN), ~~(SQUARE_SIZE * 8 + MARGIN));

		var board = this.__board;
		for (var x in board) {
			for (var y in board[x]) {
				var square = board[x][y];

				var dx = (square.x) * SQUARE_SIZE;
				var dy = (square.y) * SQUARE_SIZE;

				ctx.translate(dx, dy);
				ctx.fillStyle = square.fill;
				ctx.fillRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);

				if (square.piece !== "") {
					ctx.fillStyle = PIECE_STYLE;
					ctx.font = PIECE_SIZE + "px calibri";
					var pieceTextMetrics = ctx.measureText(square.piece);
					ctx.translate(~~(0.5 * (SQUARE_SIZE - pieceTextMetrics.width)), ~~(0.5 * (SQUARE_SIZE - PIECE_SIZE)));
					ctx.fillText(square.piece, 0, PIECE_SIZE);
					ctx.translate(~~(-0.5 * (SQUARE_SIZE - pieceTextMetrics.width)), ~~(-0.5 * (SQUARE_SIZE - PIECE_SIZE)));
				}

				ctx.translate(-dx, -dy);
			}
		}

		ctx.translate(-(0.5 * (BOARD_WIDTH - (8 * SQUARE_SIZE))), -MARGIN);

	}

};

/**
 * Notification that the window has loaded and it's not safe to start the game.
 */
function onWindowLoad() {
	var canvas = document.querySelector("#board");
	canvas.width = BOARD_WIDTH;
	canvas.height = BOARD_HEIGHT;

	var chess = new Chess(canvas);
	chess.initialize();
	chess.run();
};

// Register our load callback on the load function
window.onload = onWindowLoad;